const chai = require('chai')
const expect = chai.expect
const request = require('request')
const axios = require('axios')

describe('Blog post API tests', () => {
    describe('step 1: ping route tests', () => {
        it('It should return 200 status code for correct route /api/ping', (done) => {
            axios.get('http://localhost:3000/api/ping')
            .then((res) => {
                expect(res.status).to.equal(200)
            })
            .catch((err) => {
                console.log(err)
            })
            done()
        })

        it('It should return correct body content for correct route /api/ping', (done) => {
            axios.get('http://localhost:3000/api/ping')
            .then((res) => {
                expect(res.data).to.deep.equal({ 'success': true })
            })
            .catch((err) => {
                console.log(err)
            })
            done()
        })

        it('It should return 404 status code for wrong route /api/piing', (done) => {
            request('http://localhost:3000/api/piing', (error, res, body) => {
                expect(res.statusCode).to.equal(404)
                done()
            })
        })
    })

    describe('Step 2: get posts route tests', () => {
        it('It should return 200 status code for correct route with only tag parameter', (done) => {
            request('http://localhost:3000/api/posts?tags=tech', (err, res, body) => {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
        
        it('It should return 200 status code for correct route with multiple tags', (done) => {
            request('http://localhost:3000/api/posts?tags=tech,science', (err, res, body) => {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
        
        it('It should return 200 status code for correct route with tag and sortBy parameter', (done) => {
            request('http://localhost:3000/api/posts?tags=tech,science&sortBy=likes', (err, res, body) => {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
        
        it('It should return 200 status code for correct route with all 3 parameters', (done) => {
            request('http://localhost:3000/api/posts?tags=tech,science&sortBy=likes&direction=desc', (err, res, body) => {
                expect(res.statusCode).to.equal(200)
                done()
            })
        })
        
        it('It should return 400 status code if tag parameter is not given', (done) => {
            request('http://localhost:3000/api/posts', (err, res, body) => {
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        
        it('It should return 400 status code for wrong sortBy parameter', (done) => {
            request('http://localhost:3000/api/posts?tags=tech&sortBy=likess', (err, res, body) => {
                expect(res.statusCode).to.equal(400)
                done()
            })
        })
        
        it('It should return 400 status code for wrong direction parameter', (done) => {
            request('http://localhost:3000/api/posts?tags=tech&sortBy=likes&direction=desce', (err, res, body) => {
                expect(res.statusCode).to.equal(400)
                done()
            })
        })

        it('It should return correct body content if tag parameter is not given', (done) => {
            request('http://localhost:3000/api/posts', (err, res, body) => {
                expect(body).to.equal('{"error":"Tags parameter is required"}')
                done()
            })
        })
        
        it('It should return correct body content for wrong sortBy parameter', (done) => {
            request('http://localhost:3000/api/posts?tags=tech&sortBy=likess', (err, res, body) => {
                expect(body).to.equal('{"error":"sortBy parameter is invalid"}')
                done()
            })
        })
        
        it('It should return correct body content for wrong direction parameter', (done) => {
            request('http://localhost:3000/api/posts?tags=tech&sortBy=likes&direction=desce', (err, res, body) => {
                expect(body).to.equal('{"error":"direction parameter is invalid"}')
                done()
            })
        })

        it('It should return posts without duplication for correct route with only tag parameter', (done) => {
            axios.get('http://localhost:3000/api/posts?tags=tech,science,history')
            .then((res) => {

                let posts = res.data['posts']
                let idObj = {}
                let test = true

                for (let i = 0; i < posts.length; i++){
                    if (idObj[posts[i]['id']] == null) {
                        idObj[posts[i]['id']] = 1
                    }else{
                        test = false
                        break
                    }
                }

                expect(test).to.equal(true)
            })
            .catch((err) => {
                console.log(err)
            })
            done()
        })

        it('It should return posts without duplication for correct route with all 3 parameters', (done) => {
            axios.get('http://localhost:3000/api/posts?tags=tech,science,history&sortBy=likes&direction=desc')
            .then((res) => {

                let posts = res.data['posts']
                let idObj = {}
                let test = true

                for (let i = 0; i < posts.length; i++){
                    if (idObj[posts[i]['id']] == null) {
                        idObj[posts[i]['id']] = 1
                    }else{
                        test = false
                        break
                    }
                }

                expect(test).to.equal(true)
            })
            .catch((err) => {
                console.log(err)
            })
            done()
        })

        it('It should return sorted posts for correct route with only tag parameter', (done) => {
            axios.get('http://localhost:3000/api/posts?tags=tech,science,history')
            .then((res) => {

                let posts = res.data['posts']
                let test = true
                let lastID = -1

                if (posts.length > 0){
                    lastID = posts[0]['id']
                }

                for (let i = 0; i < posts.length; i++){
                    if (posts[i]['id'] < lastID) {
                        test = false
                        break
                    }else{
                        lastID = posts[i]['id']
                    }
                }

                expect(test).to.equal(true)
            })
            .catch((err) => {
                console.log(err)
            })
            done()
        })

        it('It should return sorted posts for correct route with all 3 parameters', (done) => {
            axios.get('http://localhost:3000/api/posts?tags=tech,science,history&sortBy=likes&direction=desc')
            .then((res) => {

                let posts = res.data['posts']
                let test = true
                let lastLike = -1

                if (posts.length > 0){
                    lastLike = posts[posts.length-1]['likes']
                }

                for (let i = posts.length-1; i >= 0; i--){
                    if (posts[i]['likes'] < lastLike) {
                        test = false
                        break
                    }else{
                        lastLike = posts[i]['likes']
                    }
                }

                expect(test).to.equal(true)
            })
            .catch((err) => {
                console.log(err)
            })
            done()
        })
    })
})