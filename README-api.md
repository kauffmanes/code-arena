# Getting Started
Codearena is a tool to aid in accessibility in the classroom.

Download the project from courseweb. It is a zip file consisting of two folders: **codearena-api** and **codearena-client**. Codearena-api is the Erlang server and codearena-client is the web interface.

## Database Setup
This application uses CouchDB to store the code arenas. To set this up, create a database called *arenas*.

### **Dependencies:**
- couchdb (installed and running)
- web browser

1. Go to http://localhost:5984/_utils, or wherever couchdb is running on your machine.
2. Create a new database called *arenas*.

This completes the set up for the database. The UI and API will work in conjunction to add/delete/update documents in this database, and the state of these records can be viewed here at any time.

## TCP Server (REST API)
This is a REST API that I set up using *gen_tcp*. It receives requests from a browser or other HTTP client, such as postman. It serves as a proxy to the database, querying and then returning responses back to the HTTP client.

1. Open the codearena-api folder (from the project .zip) in Eclipse. This is where you’ll start the API.
2. Right-click on *api.erl* and then Run As > Erlang application. This should open the console in Eclipse where you can enter the commands.
3. Start the server by typing `api:start(4000).`. You could really start it on any port, but if you want to use the web interface, use `4000`.

This concludes the API set up. I do have the API set up to log many of the requests to the console to see what the data looks like, so check back here to see what’s going on at any time.

## User Interface Setup
This step involves setting up a web interface that allows you to interact with the API in a usable way. It does involve a few dependencies that you might need to install, depending on your existing environment. If that’s not something you want to do, then the API is available to interact with via an HTTP client such as Postman, or an HTTP browser extension of your choice. If that’s what you want to do, skip to the next section labeled Interacting with the API through an HTTP Client below.

The following need to be present on your system:
### **Dependencies**
- [nodejs](https://nodejs.org/en/download/)
- [yarn](https://yarnpkg.com/lang/en/docs/install)
- web browser

### Get app running in browser
1. Open a terminal and go to the codearena-client folder inside the extracted project folder
2. Run `yarn`. This will pull in all of the dependencies for the UI project to run.
3. Yarn also contains a local http server that we'll use. To start this, run `yarn dev`. This will do a bunch of stuff and then print `webpack: Compiled successfully.`. Once this is displayed, open a browser and go to `localhost:8080`. You should see the site displayed.

### Broadcast code
1. Click the "Stream" button. This means that as you type, the site will periodically push your code contents to the server, which inserts it into the database.
2. Open another browser window and navigate to the same URL where you're broadcasting. This is a student node. On initial page load, it will get the most up-to-date code by the arenaId (the URL param).
3. On the professor page, begin typing again. In the student page, you'll see it's not updating. In order to see the live-coding, click the "Watch" button. Now your browser will poll for updates.
4. As a professor, to stop streaming, click the "Stop Streaming" button. Now the students will no longer receive the code you're typing.
5. As a student, you can stop watching by clicking the "Stop Watching" button. You will no longer receive live updates.

### To save a codearena
At any point, you can save your progress by clicking the "Save" button.
1. Type some stuff.
2. Click "Save".

### To Delete a codearena
1. Click "Delete" button.

## Interacting with the API through an HTTP Client
If you’ve decided to skip the UI set up (which you shouldn’t, because I worked hard on that!), then here are some end points that you can hit to see that my API does work.

### **Dependencies**:
- HTTP client (ex. Postman, browser extensions that do HTTP requests, cURL, etc)
- TCP Server from earlier step is running on Port 4000.
- Couchdb is up and running and you've made the *arenas* database.

### 1. Fetch information about the *arenas* database
`GET /api/arena`

### 2. Fetches the information for a specific arena
`GET /api/arena/{arenaId}`

#### **URL Params**:
- *arenaId*: maps to couchdb’s “_id” field. An arena with this _id must already exist in the database.

#### **Response body**:
````json
{
    "codeString": "some string",
    "_id": "123",
    "_rev": "456"
}
````

### 3. Creates a new arena
`PUT /api/arena/{arenaId}`

#### **URL Params**:
- *arenaId*: maps to couchdb’s “_id” field. This can be whatever you want it to be but must be unique in the database.

#### **Request body**:
````json
{
    "codeString": "some string here"
}
````

#### **Response body**:
````json
{
    "ok": true,
    "id": 123,
    "rev": 456
}
````

### 4. Update an existing arena
`PUT /api/arena/{arenaId}`

#### **URL Params:**
- *arenaId*: maps to couchdb’s “_id” field. An arena with this _id must already exist in the database.

#### **Request body**:
You must know the latest revision ID of the document in order to update it. This prevents conflicts.

````json
{
    "_rev": "456",
    "codeString": "an updated string"
}
````

#### **Response body**:
The revision ID will update to show it has been changed.

````json
{
    "ok": true,
    "id": 123,
    "rev": 789
}
````

### 5. Delete an existing arena.
`DELETE /api/arena/{arenaId}?rev={revisionId}`

#### **URL Params:**
- *arenaId*: maps to couchdb’s “_id” field. An arena with this _id must already exist in the database.
- *revisionId*: maps to couchdb's "_rev" field. An arena with this _rev must already exist in the database.

#### **Response body**:
The revision ID will update to show it has been changed, even though we made a `DELETE` request. Couchdb documents aren't ever completely deleted - if you try to query for a deleted document, it will tell you it's been deleted.

````json
{
    "ok": true,
    "id": 123,
    "rev": 910
}
````