const { Task } = require('../../lib/index');
const task = new Task();
task.addTask("A", function({ request, cheerio }, next){
    request.get('http://www.baidu.com').end((err, res)=>{
        if (res.ok) {
            let $ = cheerio.load(res.text)
            next("B", {
                title: $('title').text()
            })
        } else {
            console.log('Oh no! error ' + res.text);
        }
    })
});

task.addTask("B", function({ params }, next){
    console.log(params.title);
    // 每个子进程执行完毕后必须调用next函数，该子进程才会被释放出来
    next(true);
});

// 一定要导出,这一步非常重要
module.exports = task;