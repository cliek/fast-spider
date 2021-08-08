const { Spider } = require('../lib');
const spider = new Spider({
    ThreadsNum: 1,
    interval: 3000,
    // 指定需要执行的任务文件
    taskPath: 'task/douban',
    // 指定自定义构建的queue队列地址 (这里是我自己配置的redisList作为Queue，如果你电脑没有安装redis，可以注释掉这一行)
    queuePath: "modules/redisQueue",
});

/* 指定执行第一个任务 'doubanTop50' */
spider.start({
    taskName: "doubanTop50"
});
// result --> 文件默认将输出到项目根目录data文件夹下的json文件中