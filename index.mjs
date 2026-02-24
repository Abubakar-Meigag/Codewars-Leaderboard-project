// This is a placeholder file to show how you can "mock" fetch requests using
// the nock library.
// You can delete the contents of the file once you have understood how it
// works.

// export function makeFetchRequest() {
//   return fetch("https://example.com/test");
// }

import { getData } from "./getData.mjs"

export function getUsername(event) {
  event.preventDefault();

  const usernames = document.getElementById("usernames").value.trim();

  if (usernames === "") {
    alert("You should enter correct username");
    return;
  }

  const cleanArray = usernames
    .split(',')
    .map(n => n.trim())
    .filter(n => n !== "");

  if (cleanArray.length === 0) {
    alert("You should enter at least one valid username");
    return;
  }

  return cleanArray;
}

const form = document.getElementById("search-form")
form.addEventListener("submit",  async function(event) {
  const usernames = getUsername(event)
  if(!usernames) return;

  const results = await fetchData(usernames);
  displayUsers(results);
})

export async function fetchData(usernames) {
  const promises  = usernames.map(username => getData(username));
  return await Promise.all(promises);
}

function displayUsers (results) {
  console.log(results);
}