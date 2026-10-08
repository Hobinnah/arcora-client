import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import vm from 'node:vm';
import ts from 'typescript';

const source = readFileSync(new URL('../src/apis/useLeaseCheckIn.ts', import.meta.url), 'utf8');

function loadApi(axios) {
  class ApiError extends Error {
    constructor(message, statusCode, errorCode) {
      super(message);
      this.statusCode = statusCode;
      this.errorCode = errorCode;
    }
  }
  const exports = {};
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports, FormData,
    require: (name) => {
      if (name === 'axios') return { default: axios };
      if (name === '../env') return { env: { API_BASE_URL: '/' } };
      if (name === './useError') return { ApiError };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return exports;
}

test('GET loads server eligibility and the existing inspection without a local fallback', async () => {
  const expected = { eligibility: { canSubmit: false }, inspection: { status: 'SUBMITTED' } };
  const api = loadApi({
    get: async (url) => {
      assert.equal(url, '/api/leases/lease-id/check-in');
      return { data: expected };
    },
  });
  assert.equal(await api.getLeaseCheckIn('lease-id'), expected);
});

test('draft and submission preserve version, payload, and idempotency key', async () => {
  const calls = [];
  const api = loadApi({
    post: async (...args) => { calls.push(args); return { data: { inspectionID: 'inspection', version: 'v1' } }; },
  });
  const draft = await api.createCheckInDraft('lease');
  assert.equal(draft.version, 'v1');
  const request = { inspectionID: draft.inspectionID, version: draft.version, occupancyReadiness: 'NEEDS_ATTENTION', photos: [] };
  await api.submitLeaseCheckIn('lease', request, 'retry-key');
  await api.submitLeaseCheckIn('lease', request, 'retry-key');
  assert.equal(calls[0][0], '/api/leases/lease/check-in/draft');
  assert.equal(calls[1][0], '/api/leases/lease/check-in/submit');
  assert.equal(calls[1][1], request);
  assert.equal(calls[1][2].headers['Idempotency-Key'], 'retry-key');
  assert.equal(calls[2][2].headers['Idempotency-Key'], 'retry-key');
});

test('photo upload uses private check-in multipart fields and stable client photo ID', async () => {
  const file = new File(['photo'], 'kitchen.png', { type: 'image/png' });
  const api = loadApi({
    post: async (url, form, options) => {
      assert.equal(url, '/api/leases/lease/check-in/photos');
      assert.equal(form.get('InspectionID'), 'inspection');
      assert.equal(form.get('ClientPhotoID'), 'stable-photo-id');
      assert.equal(form.get('Description'), 'Kitchen');
      assert.equal(form.get('File').name, file.name);
      assert.equal(options.headers['Content-Type'], 'multipart/form-data');
      return { data: { attachmentID: 'saved-photo' } };
    },
  });
  assert.equal((await api.uploadCheckInPhoto('lease', 'inspection', file, 'stable-photo-id', 'Kitchen')).attachmentID, 'saved-photo');
});

test('delete targets the lease-scoped attachment endpoint', async () => {
  const api = loadApi({
    delete: async (url) => assert.equal(url, '/api/leases/lease/check-in/photos/photo'),
  });
  await api.deleteCheckInPhoto('lease', 'photo');
});

test('backend errors preserve details, field errors, status and reason code', async () => {
  const api = loadApi({
    isAxiosError: () => true,
    post: async () => {
      throw { message: 'Conflict', response: { status: 409, data: {
        detail: 'The draft has changed.',
        reasonCode: 'CONCURRENCY_CONFLICT',
        errors: { version: ['Refresh and retry.'] },
      } } };
    },
  });
  await assert.rejects(api.createCheckInDraft('lease'), (error) => {
    assert.equal(error.statusCode, 409);
    assert.equal(error.errorCode, 'CONCURRENCY_CONFLICT');
    assert.match(error.message, /The draft has changed/);
    assert.match(error.message, /version: Refresh and retry/);
    return true;
  });
});
