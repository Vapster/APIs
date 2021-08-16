const express = require('express')
const getPosts = require('./helper/getPosts')
const apicache = require('apicache')

const port = process.env.PORT || 3000
const app = express()
const cacheMiddleware = apicache.middleware

// implementing ping route with get method
// not using cache beacuse it will defeat the purpose ping route
app.get('/api/ping', async (req, res) => {
    return res.status(200).json({"success": true})
})

// get route to get blog posts
// usign cache middleware to cache for 1 hour
app.get('/api/posts', cacheMiddleware('1 hour'), getPosts)

app.listen(port, ()=>{
    console.log("server is up! on port ", port);
});