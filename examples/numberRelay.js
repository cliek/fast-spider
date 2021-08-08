const { Spider } = require('../lib');

// cfg 配置
const spider = new Spider({
    interval: 100,
    // 指定需要执行的任务文件
    taskPath: 'task/pelay',
    // 指定自定义构建的queue队列地址
    queuePath: "modules/redisQueue.js",
});

/* 指定执行第一个任务'A' */
spider.start({
    taskName: "A",
});

