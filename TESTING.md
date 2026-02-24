# Rubric Points and how we tested them

---

## The website must contain an input to accept a comma-separated list of users

- Tested `getUsername` in `index.test.mjs`
- Verified trimming removes extra spaces
- Verified empty usernames between commas are ignored
- Verified empty input returns `undefined`

**Result:** Passed

---

## Submitting the list fetches data from the Codewars API

- Tested `fetchData` using `nock` to mock API responses
- Verified valid users are returned in `successfulResults`
- Verified invalid users are returned in `failedUsernames`
- Tested case where all users are valid
- Tested case where some users fail

**Result:** Passed

---

## Drop-down shows all possible language rankings plus overall

- Tested `createSelectAndSetLanguage` in `index.test.mjs`
- Verified first option is `"overall"`
- Verified language options are added dynamically
- Verified total option count equals overall + languages

**Result:** Passed

---

## Table shows username, clan and score

- Tested `displayTable` in `index.test.mjs`
- Verified rows are created in `leaderboard-body`
- Confirmed rows are generated for each user

**Result:** Passed

---

## Table sorted highest to lowest score

- Tested `displayTable` sorting logic
- Verified users are sorted by score descending
- Confirmed highest score appears first in rendered rows

**Result:** Passed

---

## Users without ranking in selected language are not shown

- Tested `displayTable` with mixed language data
- Verified users without selected language are filtered out
- Confirmed only users with the selected language are rendered

**Result:** Passed

---

## API error handling

- Tested `getData` with mocked 404 response using `nock`
- Verified function throws error when user not found

**Result:** Passed

---

## Unit Tests

Unit tests located in `index.test.mjs`.

**Tested functions:**

- `getUsername`
- `fetchData`
- `getData`
- `createSelectAndSetLanguage`
- `displayTable`

Tests include:

- Input cleaning
- API success and failure cases
- Language option generation
- Table filtering
- Table sorting

**Run tests with:**

```bash
npm install
npm test
```

---

## Accessibility

- Lighthouse Accessibility score: 100%
- Verified using Chrome DevTools Lighthouse

**Result:** Passed