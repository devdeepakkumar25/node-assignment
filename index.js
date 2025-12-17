/*
Question 1.
1. Fetch document from given url http://norvig.com/big.txt
2. Analyze the document using asynchronous mechanism, fetched in step 1
a. Find occurrences count of word in document
b. Collect details for top 10 words (order by word Occurrences)
3. Show words list in JSON format for top 10 words.
a. Word: text
b. Count of Occurrence in that Particular Document
Solution: -
*/

const { Readable } = require("stream");
const readline = require("readline");

/*
Reads the text document from the url using streaming fetch
Returns the response body as a web Readable Stream
*/
async function fetchResponseBody(url) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`HTTP Error ${response.status}: ${response.statusText}`);
  }
  return response.body;
}

/* 
Convert a web Readble Stream into a line  by line async reader 
without loading into memory
*/
function createLineReader(webStream) {
  return readline.createInterface({
    input: Readable.fromWeb(webStream),
    crlfDelay: Infinity,
  });
}

/* 
Count occurrences of each word in the document 
Words are converted to lowercse and extracted using regex
*/
async function countWordOccurrences(reader) {
  const wordMap = new Map();
  try {
    for await (const line of reader) {
      const words = line.toLowerCase().match(/[a-z']+/g);
      if (!words || words.length === 0) continue;
      for (const word of words) {
        wordMap.set(word, (wordMap.get(word) ?? 0) + 1);
      }
    }
  } catch (error) {
    console.log("Error: ", error);
  }
  return wordMap;
}

/*

Returs the top n(limit) frequent words from the word map
Sorted in descending order of occurrence count
*/

function getTopWords(wordMap, limit = 10) {
  return [...wordMap.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word, count]) => ({ word, count }));
}

/* 
Converts word frequency result into formatted JSON string
*/

function getJSONString(topWords, space = 2) {
  return JSON.stringify(topWords, null, space);
}

/*

Fetches the document ,processes it asynchronously
and prints the top word to the console
*/
async function getResult(url, limit) {
  try {
    const responseBody = await fetchResponseBody(url);
    const reader = createLineReader(responseBody);
    const wordMap = await countWordOccurrences(reader);
    const topWords = getTopWords(wordMap, limit);
    const jsonData = getJSONString(topWords);
    console.log(jsonData);
    console.table(topWords);
  } catch (error) {
    console.log("Error: ", error);
  }
}



const URL = "https://norvig.com/big.txt";
getResult(URL);
