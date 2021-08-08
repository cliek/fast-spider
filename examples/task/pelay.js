/* task/index.js */
const { Task } = require('../../lib');
const task = new Task();
// A 任务产生100条数据
// 交给B分类将偶数分给C
// C拿到写入到JSON文件中
task.addTask("A", function({ params }, next){
    new Array(100).fill('x').forEach((item, i, arr) => {
        if(arr.length - 1 !== i){
            next("B", {
                num: i
            })
        }else{
            next(true)
        }
    });
});
task.addTask("B", function({ params }, next){
    if(params.num % 2 == 0){
        next("C", {
            num: params.num
        })
    }else{
        next(true)
    }
});
task.addTask("C", function({ params }, next){
    next(params)
});
// 一定要导出,这一步非常重要
module.exports = task;