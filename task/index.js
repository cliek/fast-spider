const Task = require('../lib/task/default');

const T = new Task();

T.addTask("A", function(params, next){
    next("B", {
        num: params.num+1
    })
});

T.addTask("B", function(params, next){
    next("C", {
        num: params.num+1
    })
});

T.addTask("C", function(params, next){
    next("D", {
        num: params.num+1
    })
});

T.addTask("D", function(params){
    console.log(params)
});

module.exports = T;