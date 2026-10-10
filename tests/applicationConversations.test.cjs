const fs = require("node:fs");
const path = require("node:path");
const vm = require("node:vm");
const assert = require("node:assert/strict");
const test = require("node:test");
const ts = require("typescript");

const params = {
  applicationID: "application-1",
  applicationCode: "APP-1",
  listingTitle: "Test listing",
  tenantID: "tenant-1",
  organizationMemberID: "member-1",
  capturedBy: "Test",
};

function setup({ conversations = [], participants = [], messages = [], failParticipant = false, incompletePage = false } = {}) {
  const calls = { conversations: 0, participantPayloads: [], messagePayloads: [] };
  const conversation = { conversationID: "conversation-1", conversationType: "RENTAL_APPLICATION", subject: "Application APP-1" };
  const paged = (items) => async ({ pageSize, pageNumber }) => ({
    data: items.slice(pageNumber * pageSize, (pageNumber + 1) * pageSize),
    totalCount: incompletePage ? items.length + 1 : items.length,
  });
  const imports = {
    "../apis/useConversation": {
      fetchConversations: paged(conversations),
      createConversation: async () => { calls.conversations += 1; conversations.push(conversation); return conversation; },
    },
    "../apis/useConversationParticipant": {
      fetchConversationParticipants: paged(participants),
      createConversationParticipant: async (payload) => {
        if (failParticipant) { failParticipant = false; throw new Error("Participant creation rejected"); }
        calls.participantPayloads.push(payload);
        const participant = { ...payload, conversationParticipantID: `p-${calls.participantPayloads.length}` };
        participants.push(participant);
        return participant;
      },
    },
    "../apis/useConversationMessage": {
      fetchConversationMessages: paged(messages),
      createConversationMessage: async (payload) => {
        calls.messagePayloads.push(payload);
        messages.push(payload);
        return payload;
      },
    },
  };
  const file = path.join(__dirname, "..", "src", "hosting", "applicationConversations.ts");
  const code = ts.transpileModule(fs.readFileSync(file, "utf8"), {
    compilerOptions: { module: ts.ModuleKind.CommonJS, target: ts.ScriptTarget.ES2022 },
  }).outputText;
  const moduleOutput = { exports: {} };
  vm.runInNewContext(code, {
    module: moduleOutput,
    exports: moduleOutput.exports,
    require: (name) => {
      assert.ok(name in imports, `Unexpected import: ${name}`);
      return imports[name];
    },
  });
  return { api: moduleOutput.exports, calls, conversation };
}

test("overlapping setup sends the Swagger payload and seeds only once", async () => {
  const { api, calls } = setup();
  await Promise.all([api.ensureApplicationConversation(params), api.ensureApplicationConversation(params)]);
  assert.equal(calls.conversations, 1);
  assert.equal(calls.participantPayloads.length, 2);
  assert.equal(calls.messagePayloads.length, 1);
  for (const payload of calls.participantPayloads) {
    assert.equal(payload.isMuted, false);
    assert.equal(payload.userID, null);
    assert.equal(payload.leftAt, null);
    assert.equal(payload.lastReadAt, null);
    assert.ok(!Number.isNaN(Date.parse(payload.joinedAt)));
  }
  assert.equal(calls.participantPayloads[0].tenantID, params.tenantID);
  assert.equal(calls.participantPayloads[0].organizationMemberID, null);
  assert.equal(calls.participantPayloads[1].tenantID, null);
  assert.equal(calls.participantPayloads[1].organizationMemberID, params.organizationMemberID);
});

test("failed participant setup propagates and retry repairs the application card", async () => {
  const { api, calls } = setup({ failParticipant: true });
  await assert.rejects(api.ensureApplicationConversation(params), /Participant creation rejected/);
  await api.ensureApplicationConversation(params);
  await api.ensureApplicationConversation(params);
  assert.equal(calls.conversations, 1);
  assert.equal(calls.participantPayloads.length, 2);
  assert.equal(calls.messagePayloads.length, 1);
});

test("conversation, identities, read markers and messages beyond page one are found", async () => {
  const conversation = { conversationID: "conversation-1", conversationType: "RENTAL_APPLICATION", subject: "Application APP-1" };
  const conversations = Array.from({ length: 200 }, (_, i) => ({ conversationID: `other-${i}` }));
  conversations.push(conversation);
  const participants = Array.from({ length: 200 }, (_, i) => ({ conversationID: `other-${i}` }));
  participants.push(
    { conversationID: conversation.conversationID, tenantID: params.tenantID },
    { conversationID: conversation.conversationID, organizationMemberID: params.organizationMemberID },
  );
  const messages = Array.from({ length: 200 }, (_, i) => ({ conversationID: `other-${i}` }));
  messages.push({
    conversationID: conversation.conversationID, messageType: "APPLICATION_CARD",
    message: '__ARC_APP_CARD__{"type":"RENTAL_APPLICATION"}', sentAt: "2026-10-09T17:00:00Z",
  });
  const { api, calls } = setup({ conversations, participants, messages });
  assert.equal((await api.findApplicationConversationForOrganization(params.organizationMemberID, params.applicationCode)).conversationID, conversation.conversationID);
  assert.equal((await api.findApplicationConversationForTenant(params.tenantID, params.applicationCode)).conversationID, conversation.conversationID);
  await api.ensureApplicationConversation(params);
  assert.equal(calls.conversations, 0);
  assert.equal(calls.participantPayloads.length, 0);
  assert.equal(calls.messagePayloads.length, 0);
  assert.equal((await api.fetchApplicationConversationParticipants(conversation.conversationID)).length, 2);
  assert.equal((await api.fetchApplicationConversationMessages(conversation.conversationID)).length, 1);
});

test("incomplete pagination fails rather than assuming records do not exist", async () => {
  const { api, calls } = setup({ incompletePage: true });
  await assert.rejects(api.ensureApplicationConversation(params), /list ended before all conversation records/);
  assert.equal(calls.conversations, 0);
});
