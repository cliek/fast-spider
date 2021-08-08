const { Spider } = require('../lib');

// cfg 配置
const spider = new Spider({
    // 指定只要执行的任务文件
    taskPath: 'task/pelay'
});

/* 指定执行第一个任务'A' */
spider.start({
    taskName: "A",
});
// 不传递参数情况下，任务'E'中输入
// result E --> 4

/* 指定执行第一个任务'A', 并传递参数num:10 */
// spider.start({
//     taskName: "A",
//     num: 10
// });
// 传参情况下，num默认是从10开始累加传递
// result E --> 13