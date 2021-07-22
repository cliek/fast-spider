const Task = require('../lib/task/default');

const T = new Task();

T.addTask("A", function(){
    console.log('s')
});

module.exports = T;