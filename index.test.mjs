import test from "node:test";
import assert from "node:assert";
import nock from "nock";

import {
  getUsername,
  fetchData,
  createSelectAndSetLanguage,
  displayTable
} from "./index.mjs";

import { getData } from "./getData.mjs";


// Helper function to set up a mock DOM environment for testing
function setupDOM() {
  global.alert = () => { };

  global.document = {
    elements: {},

    getElementById(id) {
      return this.elements[id];
    },

    createElement(tag) {
      return {
        tagName: tag,
        children: [],
        textContent: "",
        value: "",
        classList: {
          add() { }
        },
        appendChild(child) {
          this.children.push(child);
        }
      };
    }
  };


  document.elements["usernames"] = { value: "" };

  document.elements["leaderboard-body"] = {
    innerHTML: "",
    children: [],
    appendChild(child) {
      this.children.push(child);
    }
  };

  document.elements["ranking-select"] = {
    innerHTML: "",
    children: [],
    appendChild(child) {
      this.children.push(child);
    }
  };
}


// test cases for getUsername, fetchData, createSelectAndSetLanguage, and displayTable functions

test("getUsername returns cleaned usernames", () => {
  setupDOM();

  document.elements["usernames"].value = " user1 , user2 ";

  const event = { preventDefault() { } };

  const result = getUsername(event);

  assert.deepStrictEqual(result, ["user1", "user2"]);
});

test("getUsername returns undefined for empty input", () => {
  setupDOM();

  document.elements["usernames"].value = "   ";

  const event = { preventDefault() { } };

  const result = getUsername(event);

  assert.strictEqual(result, undefined);
});

test("getUsername ignores empty usernames between commas", () => {
  setupDOM();

  document.elements["usernames"].value = "user1,  , user2";

  const event = { preventDefault() { } };

  const result = getUsername(event);

  assert.deepStrictEqual(result, ["user1", "user2"]);
});

test("fetchData separates valid and invalid users", async () => {
  const usernames = ["validUser", "invalidUser"];

  nock("https://www.codewars.com")
    .get("/api/v1/users/validUser")
    .reply(200, {
      username: "validUser",
      ranks: { overall: { score: 10 }, languages: {} }
    });

  nock("https://www.codewars.com")
    .get("/api/v1/users/invalidUser")
    .reply(404);

  const result = await fetchData(usernames);

  assert.strictEqual(result.successfulResults.length, 1);
  assert.strictEqual(result.failedUsernames.length, 1);
});

test("fetchData handles all valid users", async () => {
  const usernames = ["user1"];

  nock("https://www.codewars.com")
    .get("/api/v1/users/user1")
    .reply(200, {
      username: "user1",
      ranks: { overall: { score: 5 }, languages: {} }
    });

  const result = await fetchData(usernames);

  assert.strictEqual(result.successfulResults.length, 1);
  assert.strictEqual(result.failedUsernames.length, 0);
});


test("getData returns parsed user data", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/testUser")
    .reply(200, { username: "testUser" });

  const result = await getData("testUser");

  assert.strictEqual(result.username, "testUser");
});

test("getData throws on bad response", async () => {
  nock("https://www.codewars.com")
    .get("/api/v1/users/badUser")
    .reply(404);

  await assert.rejects(() => getData("badUser"));
});


test("createSelectAndSetLanguage adds overall option", () => {
  setupDOM();

  const users = [
    { ranks: { languages: {} } }
  ];

  createSelectAndSetLanguage(users);

  assert.strictEqual(
    document.elements["ranking-select"].children[0].value,
    "overall"
  );
});

test("createSelectAndSetLanguage adds language options", () => {
  setupDOM();

  const users = [
    {
      ranks: {
        languages: {
          javascript: {},
          python: {}
        }
      }
    }
  ];

  createSelectAndSetLanguage(users);

  assert.strictEqual(
    document.elements["ranking-select"].children.length,
    3
  );
});


test("displayTable renders overall sorted rows", () => {
  setupDOM();

  const users = [
    {
      username: "A",
      clan: "",
      ranks: { overall: { score: 10 }, languages: {} }
    },
    {
      username: "B",
      clan: "",
      ranks: { overall: { score: 20 }, languages: {} }
    }
  ];

  displayTable(users, "overall");

  assert.strictEqual(
    document.elements["leaderboard-body"].children.length,
    2
  );
});

test("displayTable filters users without language", () => {
  setupDOM();

  const users = [
    {
      username: "A",
      clan: "",
      ranks: { overall: { score: 0 }, languages: { js: { score: 10 } } }
    },
    {
      username: "B",
      clan: "",
      ranks: { overall: { score: 0 }, languages: {} }
    }
  ];

  displayTable(users, "js");

  assert.strictEqual(
    document.elements["leaderboard-body"].children.length,
    1
  );
});


