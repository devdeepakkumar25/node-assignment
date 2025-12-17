# node-assignment
Node Assignment 

Exercise:
Note - This exercise needs to be taken using Node/Javascript only.
1. Fetch document from given url http://norvig.com/big.txt
2. Analyze the document using asynchronous mechanism, fetched in step 1
a. Find occurrences count of word in document
b. Collect details for top 10 words (order by word Occurrences)
3. Show words list in JSON format for top 10 words.
a. Word: text
b. Count of Occurrence in that Particular Document

Solution: -
I have solved the above exercise in index.js.
The solution is implemented using asynchronous processing.
The document is processed efficiently using streaming, without loading the entire file into memory.
Each logical task is implemented as a separate reusable function.
The final output shows the top 10 most frequent words in JSON format.
Run the following command in the terminal:
node index.js
Once executed, the result will be printed in the console.



Exercise:
Note - This exercise needs to be taken using Node/Javascript only.
This api will provide a random users data https://randomuser.me/api/
1. Write a function to use the above endpoint to get the data of 10 random users in the
most time-efficient way.
2. create a response object with data of all 10 users data collected in below format
a. Name : title + firstname + lastname
b. DOB : date of birth in YYYY-MM-DD format
c. email : email
3. Create an API to run this function and to return the response generated in point 2.

Solution:-
I have solved this exercise in app.js.
The solution fetches user data in parallel to ensure time efficiency.
It guarantees that exactly 10 valid users are always returned.
A simple HTTP server is created using Node.js to expose the API endpoint.
The response is formatted exactly as required.

Start the server using the following command:
Once the server is running, open a browser and visit:
http://127.0.0.1:3000/users
This endpoint will return the details of 10 random users in the required format.