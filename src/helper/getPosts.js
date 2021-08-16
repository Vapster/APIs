const axios = require('axios')
const baseURL = 'https://api.hatchways.io/assessment/blog/posts'

const getPosts = async (req, res) => {

    // assigning initial values of variables to default values sortBy -> 'id', direction -> 'asc'
    let tags = []
    let sortBy = 'id'
    let direction = 'asc'

    // stored valid set of values for sortBy and direction parameter
    const possibleSortValues = ['id', 'reads', 'likes', 'popularity']
    const possibleDirectionValues = ['asc', 'desc']

    // throws an error if value of tags parameter is not assigned or if its empty string
    if(req.query.tags == null || req.query.tags == ""){
        return res.status(400).json({ error: "Tags parameter is required" })
    }
    tags = req.query.tags.split(',')

    // throws an error if value of sortBy parameter is not valid. if sortBy parameter is not assigned our variable has default value of 'id'
    if(req.query.sortBy != null){
        
        if(!possibleSortValues.includes(req.query.sortBy)){
            return res.status(400).json({ error: "sortBy parameter is invalid" })
        }

        sortBy = req.query.sortBy
    }

    // throws an error if value of direction parameter is not valid. if direction parameter is not assigned our variable has default value of 'asc'
    if(req.query.direction != null){
        
        if(!possibleDirectionValues.includes(req.query.direction)){
            return res.status(400).json({ error: "direction parameter is invalid" }) 
        }

        direction = req.query.direction
        
    }

    // created axios get promise for each value of tags parameter
    let requests = tags.map( tag => {
        return axios.get(baseURL, { params: { tag } })
    } )

    Promise.all(requests)
        .then( result => {

            let merged = []

            // result variable consists an array; each element of that array is response for corresponding tag value
            // merging all elements of an array in to one variable
            result.map(post => {
                merged = merged.concat(post['data']['posts'])
            })

            let idObj = {}
            let duplicateRemoved = []

            // removing duplicate value caused by merging all responses
            // created idObj object to store all unique ids of each post (it utilizes hashmap)
            for(let i = 0; i<merged.length; i++){
                if(idObj[merged[i]['id']]){
                    continue
                }
                idObj[merged[i]['id']] = 1
                duplicateRemoved.push(merged[i])
            }

            // sorting results based on sortBy and direction parameter
            // if two posts has same value (e.g. a['likes'] == b['likes']), we further sort both of them bases of 'id' field (ascending)
            if (direction == 'asc'){
                duplicateRemoved.sort((a, b) => {
                    if(a[sortBy] < b[sortBy]){
                        return -1
                    }else if(a[sortBy] > b[sortBy]){
                        return 1
                    }else{
                        if(a['id'] < b['id']){
                            return -1
                        }else{
                            return 1
                        }
                    }
                })
            }else{
                duplicateRemoved.sort((a, b) => {
                    if(a[sortBy] > b[sortBy]){
                        return -1
                    }else if(a[sortBy] < b[sortBy]){
                        return 1
                    }else{
                        if(a['id'] < b['id']){
                            return -1
                        }else{
                            return 1
                        }
                    }
                })
            }

            return res.status(200).json({ 'posts' :duplicateRemoved})
        })
        .catch( error => res.status(500).send(error) )

}

module.exports = getPosts;