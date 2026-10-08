import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { test } from "node:test";
import vm from "node:vm";
import ts from "typescript";

const source = readFileSync(new URL("../src/apis/useTenantInvitation.ts", import.meta.url), "utf8");

function loadApi(overrides) {
  const axios = {
    defaults: { headers: { common: {} } },
    isAxiosError: () => false,
    ...overrides,
  };
  const exports = {};
  const code = ts.transpileModule(source, {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  vm.runInNewContext(code, {
    exports,
    require: (name) => {
      if (name === "axios") return { default: axios };
      if (name === "../env") return { env: { API_BASE_URL: "/" } };
      if (name === "@tanstack/react-query") return {};
      if (name === "./useError") return { handleApiError: (error) => { throw error; } };
      throw new Error(`Unexpected import: ${name}`);
    },
  });
  return exports;
}

test("creation unwraps the persisted invitation and preserves pending delivery status", async () => {
  const invitation = { tenantInvitationID: "invite", status: "PENDING", emailDeliveryStatus: "PENDING" };
  const request = { organizationID: "org", listingID: "listing", email: "tenant@example.test" };
  const api = loadApi({
    post: async (url, body) => {
      assert.equal(url, "/api/tenantinvitation/createTenantInvitation");
      assert.equal(body, request);
      return { data: { success: true, message: "Delivery pending", tenantInvitation: invitation } };
    },
  });
  assert.equal(await api.createTenantInvitation(request), invitation);
});

test("invalid creation responses never report success", async () => {
  const api = loadApi({ post: async () => ({ data: { success: true } }) });
  await assert.rejects(api.createTenantInvitation({}), /creation response was invalid/);
});

test("availability conflicts remain actionable instead of being swallowed", async () => {
  const conflict = { response: { status: 409, data: { detail: "Listing unavailable" } } };
  const api = loadApi({
    isAxiosError: () => true,
    post: async () => { throw conflict; },
  });
  await assert.rejects(api.createTenantInvitation({}), (error) => error === conflict);
});

test("email retry uses the existing invitation rather than creating another hold", async () => {
  const invitation = { tenantInvitationID: "invite", emailDeliveryStatus: "PENDING" };
  const api = loadApi({
    post: async (url, body) => {
      assert.equal(url, "/api/tenantinvitation/invite%20id/retry-email");
      assert.equal(body, undefined);
      return { data: invitation };
    },
  });
  assert.equal(await api.retryTenantInvitationEmail("invite id"), invitation);
});

test("organization invitation retrieval requires the actual endpoint list shape", async () => {
  const api = loadApi({ get: async () => ({ data: { success: true } }) });
  await assert.rejects(api.fetchTenantInvitationsByOrganization("org"), /expected format/);
});

test("tenant quote retrieval uses the authenticated endpoint and preserves saved terms", async () => {
  const quote = {
    tenantInvitationID: "invite id",
    price: 2000.25,
    securityDepositAmount: 900.50,
    currency: "CAD",
    startDate: "2027-01-31",
    endDate: "2027-07-31",
    leaseTermMonths: 6,
  };
  const api = loadApi({
    get: async (url) => {
      assert.equal(url, "/api/tenantinvitation/invite%20id/for-me");
      return { data: quote };
    },
  });
  assert.equal(await api.getAcceptedInvitationForMe("invite id"), quote);
});

test("lease conversion preserves actionable legacy quote errors", async () => {
  const api = loadApi({
    isAxiosError: () => true,
    post: async () => {
      throw { response: { data: { detail: "Ask the landlord to send a new invitation." } } };
    },
  });
  await assert.rejects(api.createLeaseFromTenantInvitation({}), /send a new invitation/);
});
