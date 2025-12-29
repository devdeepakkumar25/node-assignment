/*
This api will provide a random users data https://randomuser.me/api/
1. Write a function to use the above endpoint to get the data of 10 random users in the
most time-efficient way.
2. create a response object with data of all 10 users data collected in below format
a. Name : title + firstname + lastname
b. DOB : date of birth in YYYY-MM-DD format
c. email : email
3. Create an API to run this function and to return the response generated in point 2.

*/


const http = require("http");

const URL = "https://randomuser.me/api/";
const PORT = process.env.PORT || 3000;
const HOST = "127.0.0.1";
const USERLIMIT = 10;

/*

Call RandomUser api in parrallel
Returns settled promise results
*/

async function getUsersFromApi(limit, url) {
  const requests = Array.from({ length: limit }, () => url);
  const results = await Promise.allSettled(
    requests.map(async (endpoint) => {
      const response = await fetch(endpoint);
      if (!response.ok) {
        throw new Error(`HTTP Error ${response.status}`);
      }
      return response.json();
    })
  );
  return results;
}

/*
Extracts and formats user details 
*/

function getUserDetail(response) {
  if (!response?.results?.[0]) return undefined;

  const user = response.results[0];
  const title = user.name?.title ?? "";
  const first = user.name?.first ?? "";
  const last = user.name?.last ?? "";
  const dobDate = user.dob?.date ?? "";
  const email = user.email ?? "";

  return {
    name: `${title} ${first} ${last}`,
    dob: dobDate ? new Date(dobDate).toISOString().slice(0, 10) : "",
    email,
  };
}

/*
collect exactly n(limit) valid users 
*/
async function getRandomUsers(limit) {
  const users = [];

  while (users.length < limit) {
    const remaining = limit - users.length;

    const settledRes = await getUsersFromApi(remaining, URL);
    const validUsers = settledRes
      .filter((res) => res.status === "fulfilled")
      .map((res) => getUserDetail(res.value))
      .filter(Boolean);
    users.push(...validUsers);
  }

  return users;
}

const server = http.createServer(async (req, res) => {
  try {
    if (req.url === "/" && req.method === "GET") {
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(
        JSON.stringify({
          message: "To see the users, go to the given URL",
          url: `http://${HOST}:${PORT}/users`,
        })
      );
    }

    if (req.url === "/users" && req.method === "GET") {
      const users = await getRandomUsers(USERLIMIT);
      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify(users, null, 2));
    }
    res.writeHead(404, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ message: "Route not found" }));
  } catch (error) {
    res.writeHead(500, { "Content-Type": "application/json" });
    return res.end(JSON.stringify({ error: error.message }));
  }
});

server.listen(PORT, HOST, () => {
  console.log(`Server is listening at http://${HOST}:${PORT}`);
});
