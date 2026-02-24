
export async function getData(username) {
      const url = `https://www.codewars.com/api/v1/users/${username}`;
      try {
            const response = await fetch(url);
            if (!response.ok) {
                  throw new Error(`Response status: ${response.status}`);
            }

            const result = await response.json();
            return result;
      } catch (error) {
            throw new Error(error.message); 
      }
}