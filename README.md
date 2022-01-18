
[![fpjUqH.png](https://z3.ax1x.com/2021/08/02/fpjUqH.png)](https://imgtu.com/i/fpjUqH)
# fast-Spider
### 一款基于node线程池的爬虫任务分配模型，采用TS编写，相比v1版各种依赖完全解耦，高可定制完成多种任务流转，定时执行等。
### 特点：操作简单，快速集成，提供mysql、redis等使用实例（其他存储同理）

> 温馨提示: 运行需要保证版本 `node > 12`

-----------------

+ 自定义任务，每一个线程既是生产者(Producer)也是消费者(Comsumer)
+ 内置实现`QueueList`链表
+ 基于node线程池实现自动分配任务，防止轮询分配模式阻塞
+ 基于`Events`事件分发，开发只需要监听对应事件自定义处理结果。
+ 高定制化可集成`node-schedule`定时执行

## 快速开始

### 安装

使用npm进行安装
```
npm install fast-spider --save
```
使用yarn进行安装
```
yarn add fast-spider
```

### 目录结构

请手动创建文件夹，如下：
```
|-- task
    |-- index.js
|-- index.js
|-- package.json
```
### 简单示例
#### 快速了解任务数据流转
``` js
// task/index.js
const { Task } = require('fast-spider');
const task = new Task();
task.addTask("A", function(params, next){
    let num = params.num || 1;
    // 触发 events: `next` 事件
    next("B", {
        num
    })
});
task.addTask("B", function(params, next){
    let num = params.num + 1
    next("C", {
        num
    })
});
task.addTask("C", function(params, next){
    let num = params.num + 1
    next("D", {
        num
    })
});
task.addTask("D", function(params, next){
    let num = params.num + 1
    next("E", {
        num
    })
});
task.addTask("E", function(params, next){
    console.log(params.num)
    // 触发 events: `data` 事件
    return {
        num: params.num
    }
});
// 一定要导出,这一步非常重要
module.exports = task;

/* index.js */
const Spider = require('fast-spider');
const spider = new Spider(3, './task/index.js');
/* 指定执行第一个任务'A' */
spider.runTask('A');
spider.events.on('data', function(res)=>{
    console.log(res) 
    // 不传递参数情况下
    // res.num = 4 //  E --> 4
})

/* 指定执行第一个任务'A', 并传递参数num:10 */
spider.runTask('A',{ num: 10 });
spider.events.on('data', function(res)=>{
    console.log(res) 
    // 传参情况下，num默认是从10开始累加传递
    // res.num = 13 //  E --> 13
})
```
#### 通过request获取网页示例
> 使用请求或第三方包请自行安装npm包 如：`superagent`

> 如需解析html请安装`cheerio`
``` js
/* task/index.js */

const { Task } = require("fast-spider");
const superagent = require("superagent");
const cherrio = require('cheerio');
const tasks = new Task();

// 获取百度热搜的示例
tasks.addTask('getBaidu', async()=> {
    try {
        const result = await superagent.get("https://top.baidu.com/board?tab=realtime");
        const $ = cherrio.load(result.text);
        const resultArr = [];
        $(".category-wrap_iQLoo").each((i, el)=>{
            resultArr.push({
                title: $(el).find('.c-single-text-ellipsis').text(),
                image: $(el).find('.img-wrapper_29V76 img').attr('src'),
                description: $(el).find('.large_nSuFU').prop('firstChild').nodeValue,
                hotNum: $(el).find('.hot-index_1Bl1a').text(),
                hotType: $(el).find(".hot-tag_1G080").text(),
                link: $(el).find(".img-wrapper_29V76").attr("href")
            })
        })
        return resultArr;
    } catch (error) {
        throw error;
    }
})

// 导出task这步非常关键
module.exports = task;

/* index.js */
const Spider = require('fast-spider');
const spider = new Spider(1, './tasks/index.js');
/* 指定执行第一个任务 'getBaidu' */
spider.runTask('getBaidu');
spider.events.on('data', function(res)=>{
    console.log(res) // 这里将是热搜数据，可以在此执行一些数据库操作
})
```
## 模块说明
### Task模块-任务模块
#### addTasks(taskName, callBack(params:object | string, next(nextTaskName: string, result: object | string ))): boolean | object
`taskName` : `string `

任务名称,用于命名每个任务名称（不可重复）

`fn` : `Function`

当前任务需要执行的函数逻辑块


函数回调参数属性：

`fn(params: object | string, next?(nextTaskName: string, result: object | string )) : boolean | object`

回调方法可用参数

+ `params` : 初始化或者上个任务传递过来的数据

+ `next(nextTaskName: string, result: object | string )` : 流转任务函数。将需要下个函数只要的数据传递到 `queueLinkList` 中，供主线程分配任务给线程执行

  + `taskName` ：需要执行的下一个任务名

  + `result` ：传递给下一个任务时携带的参数

+ `fn(): object` :  
    + 任务函数 `return` 返回的数据:
    ```js
    {
        threadId: 1, //当前线程的id
        taskName: 'dd',  //当前任务的名称
        type: 'done',  //当前执行的状态 
        result: undefined || object // 任务返回的数据
    }
    ```
    + 返回值(默认`undefined`),可在任务结束时返回处理结果,并触发`events.emit('data')`事件

### Spider模块-入口函数

new Spider(threadNum: number, taskPath: string, opt?: SpiderOptions): Spider

+ `threadNum` : 开启的多线程数量，填写为`0`时，默认根据计算机核心数自动分配多线程数量
+ `taskPath` ：task文件路径。需要交给线程执行的任务函数，路径以当前执行环境`process.cmd()`为初始路径。
+ `opt`: 扩展配置
   
    + `isExit` : `boolean` 当前任务执行完成后是否自动退出，默认是：`true`

new Spider的`methods`:
+ runTask(taskName: string, params?: object| string)

    + `taskName`: 开始执行的第一个任务

    + `params` : 需要传递给第一个任务函数的数据

+ events.`on` 事件

    + `next`: 任务函数执行 `next` 回调函数写入任务队列时触发的事件

    + `data`: 任务函数执行 `return` 之后触发的事件

    + `exit`: 多线程执行完成并全部关闭后触发的事件，所有线程关闭之后只会触发一次，如果初始配置 `opt?.isExit === false`，将不会退出多线程，也不会触发该事件

    + `error`：多线程在处理任务时遇到错误将会触发该事件

## 以下是部分使用示例
### 如何使用数据库存储数据?
> 先确保本机安装了`mysql`服务，请自行根据自己的系统安装（windows / Mac）`mysql` 服务

> 使用 `sequelize` 作为数据库工具(也可以选用自己熟悉的)

> 使用 `mysql2` 作为数据库连接服务(必备)
``` js
// db/index.js
const { Sequelize } = require('sequelize');
const db = new Sequelize('test', 'xxx', 'xxxxx', {
    dialect: 'mysql',    //数据库类型
    host: '127.0.0.1',   //主机地址
    port: "3306",
    pool: {      //连接池设置
        max: 1,  //最大连接数
        idle: 30000,
        acquire: 60000
    },
    dialectOptions:{
        charset:'utf8mb4',  //字符集
        collate:'utf8mb4_unicode_ci'
    },
    define: {   //模型设置
        freezeTableName: true,    //自定义表面，不设置会自动将表名转为复数形式
        timestamps: false    //自动生成更新时间、创建时间字段：updatedAt,createdAt
    }
});
db.define('xxx', {
    id: {
        autoIncrement: true,
        type: Sequelize.INTEGER,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowedNull: false
    },
},{
    freezeTableName: true
})
db.authenticate().then(()=>{
    db.sync({force:true})
    console.log("数据库已连接！")
}).catch(err=>{
    console.log(err)
    console.log("连接失败")
});
module.exports = db;

// task/index.js (省略，请自行编写,这里以百度热搜为例)

// index.js
const Spider = require('fast-spider');
const db = require('./db');

const spider = new Spider(1, './tasks/index.js');
spider.runTask('getBaidu');
// `data` 事件在任务函数中: return 时触发
spider.events.on('data', res => {
    // 以百度热搜数据为例
    switch(res.taskName){
        case 'getBaidu':
            // 插入数据到数据库内
            res.result.map((is) => {
                db.models.xxx.create(is)
            })
        break;
    }
})
spider.events.on('error', res => {
    console.log('error:',res)
})
spider.events.on('exit', () => {
    // ...
})
```
### 如何使用redis存储数据?
> 如果使用`redis`，需要安装以下两点：
> + 需要安装`redis`服务，请自行根据自己的系统安装（windows / Mac）`redis`
> + 需要安装`redis node库`，本示例使用的是[`node-redis`]('https://github.com/noderedis/node-redis/')，但安装的方式是`npm install redis --save` or `yarn add redis`

```js
// redis/index.js
const { createClient } = require("redis");

const client = createClient(6379,'127.0.0.1');
client.connect();
client.on("error", function(error) {
    console.error(error);
});
module.exports = client;

// task/index.js (省略，请自行编写,这里以百度热搜为例)

// index.js
const Spider = require('fast-spider');
const redis = require('./redis');

const spider = new Spider(1, './tasks/index.js');
spider.runTask('getBaidu');
// `data` 事件在任务函数中: return 时触发
spider.events.on('data', res => {
    // 以百度热搜数据为例
    switch(res.taskName){
        case 'getBaidu':
            // 插入数据到redis内
            // redis v4 版本以后没有hmset方法,将采用hset代替
            redis.hSet('spider-hots', 'baidu', JSON.stringify(res.result));
        break;
    }
})
spider.events.on('error', res => {
    console.log('error:',res)
})
spider.events.on('exit', () => {
    // ...
})
```
### 如何定时执行抓取?

> 需要先安装`node-schedule`

```js
const Spider = require('fast-spider');
// 如果需要定时爬取请配置`isExit` 为 `false`,这样在抓取完成之后不会退出,将在下个任务时间内继续执行
const spider = new Spider(1, './tasks/index.js', {
    isExit: false
});

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
// 当前示例表示每30s会自动触发一次任务
const job = schedule.scheduleJob('*/30 * * * * *', function(){
    S.runTask('getBaidu');
    console.log('spider -> ' + new Date())
});

spider.events.on('data', res => {
    // ...
})
spider.events.on('error', res => {
    console.log('error:',res)
})
spider.events.on('exit', () => {
    // ...
})

```

## 所有示例
如上所有示例均已经放在`examples`文件夹中，其中有上面的所演示提到的示例,以及获取真实的百度热搜示例.

## v2版本的重构感想
我特别对爬虫热衷,从v1版本的开发,到现在已经过去了几个月,自己也在使用中也在不停的思考,在使用了`nest.js`之后开始对`ts`产生了兴趣,后来用`ts`重构了一版主要是处理任务队列的多线程工具,利用`node`原生的`events`事件将数据以事件分发的方式传递出来,这样就解耦了各个模块之间的关联,对于自定义有了更好的支持,当然第二版我并没有花太多时间,从构思到完成测试再到写这个文档大概5天左右,其中有很多细节可能没有考虑到,不过我自己也在使用,接下来可以慢慢的修复以及完善.
## 关于后期迭代
- 关于v1版,我想日志模块是不够好的,但是由于v2版本的数据解耦性,这样用户的可扩展性就可随意使用第三方库了。
- 当然我想我有空会写一个日志小插件。
- 暂时只想到这么多，我会在使用过程中，逐渐优化并修复细节。