const settings = require('./settings')
const redis = require('redis')

module.exports = redis.createClient(settings.redis);