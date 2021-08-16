Used port: 3000
Routes:
	/api/ping
	/api/posts

to start server command "npm run server" or "node src/app.js"
for tests command "npm run test"

index file is ./src/app.js
to retrieve posts getPosts function is implemented in ./src/helper/getPosts.js
test are in ./src/test/test.js

node version: v12.18.3

packages used

"apicache": "^1.6.2"
"axios": "^0.21.1",
"chai": "^4.3.4",
"express": "^4.17.1",
"mocha": "^9.0.1",
"request": "^2.88.2"