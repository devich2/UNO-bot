const settings = require('./settings')
const redis = require('redis')

module.exports = redis.createClient(process.env.REDIS_URL);  //process.env.REDIS_URL