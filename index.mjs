import { getData } from "./getData.mjs"
let storedUsers = [];

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
form.addEventListener("submit", async function (event) {
  const usernames = getUsername(event);
  if (!usernames) return;

  try {
    const { successfulResults, failedUsernames } = await fetchData(usernames);

    if (successfulResults.length === 0) {
      storedUsers = [];
      document.getElementById("leaderboard-body").innerHTML = "";
      alert("All usernames are invalid. Please enter valid usernames.");
      return;
    }

    if (failedUsernames.length > 0) {
      alert("The following usernames are invalid: " + failedUsernames.join(", "));
    }

    if (successfulResults.length > 0) {
      storedUsers = successfulResults;
      createSelectAndSetLanguage(storedUsers);
      event.target.reset();
    }

  } catch (error) {
    alert("Something went wrong: " + error.message);
  }
});


export async function fetchData(usernames) {
  const results = await Promise.allSettled(
    usernames.map(username => getData(username))
  );

  const successfulResults = [];
  const failedUsernames = [];

  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      successfulResults.push(result.value);
    } else {
      failedUsernames.push(usernames[index]);
    }
  })

  return { successfulResults, failedUsernames };
}


export function createSelectAndSetLanguage(results) {
  const select = document.getElementById("ranking-select")
  const languages = new Set();

  results.forEach(user => {
    Object.keys(user.ranks.languages)
      .forEach(lan => languages.add(lan));
  });

  select.innerHTML = "";

  const defaultOption = document.createElement("option");
  defaultOption.textContent = "overall";
  defaultOption.value = "overall";
  select.appendChild(defaultOption);


  languages.forEach(lan => {
    const option = document.createElement("option");
    option.textContent = lan;
    option.value = lan;
    select.appendChild(option);
  });

  displayTable(results, "overall");

  select.onchange = () => {
    displayTable(storedUsers, select.value)
  }

}


export function displayTable(users, selectedLanguage) {
  const tbody = document.getElementById("leaderboard-body")
  tbody.innerHTML = "";

  let filteredUser;

  if (selectedLanguage === "overall") {

    filteredUser = users.map(user => ({
      username: user.username,
      clan: user.clan,
      score: user.ranks.overall.score
    }))

  } else {

    filteredUser = users
      .filter(user => user.ranks.languages?.[selectedLanguage])
      .map(user => ({
        username: user.username,
        clan: user.clan,
        score: user.ranks.languages[selectedLanguage].score
      }))
  }

  filteredUser.sort((a, b) => b.score - a.score);

  filteredUser.forEach((user, index) => {
    const tr = document.createElement("tr");

    if (index === 0) {
      tr.classList.add("top-user")
    }

    const usernameTd = document.createElement("td");
    const clanTd = document.createElement("td");
    const scoreTd = document.createElement("td");

    usernameTd.textContent = user.username;
    clanTd.textContent = user.clan || "";
    scoreTd.textContent = user.score;

    tr.appendChild(usernameTd);
    tr.appendChild(clanTd);
    tr.appendChild(scoreTd);

    tbody.appendChild(tr);
  })

}