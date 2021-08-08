const redis = require("redis");
const client = redis.createClient({
    host: "127.0.0.1",
    port: 6379,
    prefix: "fast-"
});

client.on("error", function(error) {
    console.error(error);
});

exports.add = function(key, val){
    if(val instanceof Object) val = JSON.stringify({
        data: val
    });
    return new Promise(function(resolve, reject){
        client.lpush('spider', val, function(err, reply) {
            if(err) reject(err)
            resolve(reply);
        })
    });
}

exports.pop = function(){
    return new Promise(function(resolve, reject){
        client.rpop('spider', function(err, reply) {
            if(err) reject(err)
            resolve(JSON.parse(reply));
        })
    });
}

exports.size = function(){
    return new Promise(function(resolve, reject){
        client.llen('spider', function(err, reply) {
            if(err) reject(err)
            resolve(reply);
        })
    });
}
