
[![fpjUqH.png](https://z3.ax1x.com/2021/08/02/fpjUqH.png)](https://imgtu.com/i/fpjUqH)
# fast-Spider
### 一款基于node的多线程爬虫工具，只需要简单配置即可使用，内置集成了superagent，cheerio以及可自定义注入module模块，结果数据可生成csv、json等文件。
-----------------

+ 自定义任务模型，即使生产者(Producer)也是消费者(Comsumer)
+ 基于node多线程实现自动分配任务，防止轮询分配模式阻塞
+ 内置superagent、cheerio，抓取网页更快，还可自定义集成或替换内置工具
+ 内置实现QueueList链表，也可以自定义集成redis、mongodb等工具
+ 集成node-schedule定时执行
+ 集成Signale日志系统
+ 可输出csv、json文件
+ 子线程守护

[![feS9tx.md.png](https://z3.ax1x.com/2021/08/05/feS9tx.md.png)](https://imgtu.com/i/feS9tx)

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
|-- modules (可选)
|-- plugin (可选)
|-- config.js (可选)
```
### 简单示例
#### 数字接力 (快速了解任务数据传递)
```
/* task/index.js */
const { Task } = require('fast-spider');
const task = new Task();
task.addTask("A", function({ params }, next){
    let num = params.num || 1;
    next("B", {
        num
    })
});
task.addTask("B", function({ params }, next){
    let num = params.num + 1
    next("C", {
        num
    })
});
task.addTask("C", function({ params }, next){
    let num = params.num + 1
    next("D", {
        num
    })
});
task.addTask("D", function({ params }, next){
    let num = params.num + 1
    next("E", {
        num
    })
});
task.addTask("E", function({ params }, next){
    console.log(params.num)
});
// 一定要导出,这一步非常重要
module.exports = task;

/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider();
/* 指定执行第一个任务'A' */
spider.start({
    taskName: "A"
});
// 不传递参数情况下，任务'E'中输入
// result E --> 4
/* 指定执行第一个任务'A', 并传递参数num:10 */
spider.start({
    taskName: "A",
    num: 10
});
// 传参情况下，num默认是从10开始累加传递
// result E --> 13

```
#### 通过request获取网页示例
```
/* task/index.js */
const { Task } = require('fast-spider');
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
});·

task.addTask("B", function({ params }, next){
    console.log(params.title);
});
// 导出task这步非常关键
module.exports = task;

/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider();
/* 指定执行第一个任务 'A' */
spider.start({
    taskName: "A"
});
// result --> 百度一下，你就知道！
```
### 注意事项
虽然示例很简单，但爬虫在实战中还是不免存在问题，比如第一个线程一直用于翻页获取地址，第二或第n个线程用于处理第一个线程所拿到的页码地址，就会造成第一个进程一直不断工作，在node多线程中，开始我采用的是轮询分配，很显然第一个线程在不停制造新数据的同时，仍旧会被分配新任务，后来我修改了分配方案。

旧的方案：

[![fZjL1e.png](https://z3.ax1x.com/2021/08/05/fZjL1e.png)](https://imgtu.com/i/fZjL1e)

新的方案：

[![fZjO6H.png](https://z3.ax1x.com/2021/08/05/fZjO6H.png)](https://imgtu.com/i/fZjO6H)

新的方案采用了一个数组存储当前可用的子进程ID，在`next`回调函数中，新增了一个参数`isDone`。默认情况下，执行了`next(...)`函数之后，该任务就结束了，子进程ID就自动进入可用状态，等待主线程再次送达任务。但是就如上实例中，因为需要翻页就会执行多次`next`函数，为了让当前进程不再接收新任务，需要再第四个参数上设置为`false`，表示不释放当前子进程，因为还需要继续执行。

#### 获取豆瓣最热50条数据
！！！next函数将参数传递到下个任务的同时，还保持着运行，直到最后一个数据发送给主线程后，执行关闭并释放该子线程。
```
const { Task } = require('fast-spider');
const task = new Task();
/* task/index.js */
task.addTask("doubanTop50", function({ request }, next){
    request.get('https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0').end((err, res)=>{
        if (res.ok) {
            res.body.subjects.map((is, i, arr) => {
                // 这里运用了三元取arr最后一条为 true，表示当前函数执行完毕，可以释放该子进程
                // 参数说明：next('下个任务名称', '传递的数据', '是否将数据写入到文件', '任务是否完成' )
                next("doubanDesc",is, false, i === arr.length-1 ?true: false);
            })
        } else {
            console.log('Oh no! error ' + err || res.text);
        }
    })
});

task.addTask("doubanDesc", function({params, request, cheerio }, next){
    // 任务doubanTop50传递过来的数据存储在params中，在此任务中继续合成一个更详细的数据并导出成JSON文件
    request.get(`https://movie.douban.com/subject/${params.id}`).end((err, res) => {
        if(!err && res.ok){
            // 用cheerio解析html
            const $ = cheerio.load(res.text);
            // 合并参数
            const desc = Object.assign({
                director: $(".attrs").eq(0).text(),
                writer: $(".attrs").eq(1).text(),
                actor: $(".attrs").eq(2).find('span').text().replace(/\//g,','),
                type: $("span[property='v:genre']").text()
            }, params);
            // 导出成文件
            // 参数说明：next('传递的数据') 如果只传递一个数据时，默认为保存数据，此项必须开启在config.js配置好pipe参数才会输出文件
            next(desc);
        }else{
            console.log('Oh no! error ' + err || res.text);
        }
    })
});

// 导出task这步非常关键
module.exports = task;

/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider();
/* 指定执行第一个任务 'doubanTop50' */
spider.start({
    taskName: "doubanTop50"
});
// result --> 文件默认将输出到项目根目录data文件夹下的json文件中
```

## 模块说明
### Task模块-新建任务  
#### addTasks(taskName, callBack)
` taskName: String `

任务名称,用于命名每个任务名称（如示例中用"A","B","C"）

`callBack: Function`

回调函数，用于当前任务需要执行的逻辑块

`callBack(modules, next) `

回调方法可用参数（这里是重点!!!）

+ `modules: Function || Object`

  + `params`: 上个任务传递过来的参数
  + `modules`: 第三方模块
    + （内置）`superagent`: 一个轻量的Ajax API，服务器端（Node.js）客户端（浏览器端）均可使用，SuperAgent具有学习曲线低、使用简单、可读性好的特点。
     
        >重要说明：内置集成时仅仅名称修改为 `request` 便于使用者的可读性，并不是使用的node自带模块`request`模块，使用方法与`superagent`API一致。

    + （内置）`cheerio`： 为服务器特别定制的，快速、灵活、实施的jQuery核心实现获取html节点工具
> next的第一种参数模式
+ `next(taskName: String, params?: Object, isWrite?: Boolean, isDone?: Boolean)`
  + `taskName` ：需要执行的下一个任务名
  + `params` ：传递给下一个任务时携带的参数
  + `isWrite` ：当前数据是否需要写入到文件，默认是`false`。如果为 `true`, 则需要保证`params`值有效，传递给下一个任务作为参数的同时，并写入到文件中。
  + `isDone` ：表示当前子进程是否完成，默认执行`next()`函数，程序就表示该任务已经完成，子进程将成为可用状态，默认为`undefined`,只有设置为`false`才不会释放详情见[注意事项](#注意事项)。
> next的第二种参数模式
+ next(params: Object)
> 如果只传递一个Object类型时，默认将当前数据是写入到文件。一般来说，使用这种传参方式都是最后一个任务需要将结果写入到文件时才执行的方法，这个方法是内置的，你也可不写入到文件，直接写入到数据库也是可以的，只需要参照[点击这里](#自定义module模块)查看示例，便可以在modules中注入方法，存储到指定位置。

#### 关于modules
当前可通过config导入自定义模块，比如用户需要使用到readis、mysql、MongoDB等工具均可扩展，且极其简单，具体自定义模块可[点击这里](#自定义module模块)查看示例

### Spider
#### new Spider(cfg)

`cfg`: Object

config 配置文件，当前配置文件可分为两种，一种是在项目根目录新建一个`config.js`文件，而另一种就是使用传参的方式，从Spider函数中传递，请注意，当项目中有`cfg`传参,又有`config.js`文件时，将采用`cfg`传参，`config.js`文件配置将不会生效。例如：
```
/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider({
    ...config
});

/* config.js */
module.exports = {
    ...config
}

/* 这里的config.js文件配置将不会生效 */
```
如果使其config文件生效，直接将函数传参删除即可。例如：

```
/* index.js */
const { Spider } = require('fast-spider');
const spider = new Spider();

/* config.js */
module.exports = {
    ...config
}

/* 这里的config.js文件配置将会生效 */
```

> 配置加载的顺序是 `cfg > config`

> 如果既没有函数传参，也没有config文件，将自动使用 [默认配置](#默认配置)

#### Spider.start(taskObject)

`taskObject`: Object 

```
{
    // 当前第一个需要执行的任务名
    taskName: String,    
    // 传递给第一个任务的参数
    params?: Object
}
```

### 默认配置
#### config.js文件示例
这里给出了一个默认配置清单说明：
```
module.exports = {
    // spider mode || 'async' | 'flow'
    mode: 'async', 
    // 当前分发给子线程任务的频率
    interval: 1000,
    // 自定义task文件路径，默认是项目根目录下task目录
    // taskPath: 'task/index',
    // 自定义链表路径，如果需要自己实现链表，请指定该路径，否则请忽略
    // queuePath: '',
    // 使用子线程个数，不指定或者false默认1个线程，如果为true则根据当前计算机自动计算
    ThreadsNum: 3,
    // 定时执行，如果为false或不指定将立即执行，如果需要定时执行请参考 https://github.com/node-schedule/node-schedule 中配置即可
    // schedule: false,
    // 公共函数注入，在回调函数中modules.plugins.XXX 使用
    plugins: [],
    // 第三方或自定义模块注入，在回调函数中modules.XXX 使用
    modules: [],
    // 文件写入配置，enabled为false为关闭，true为开启，可配置当前文件生成目录、文件名、文件类型（csv|json）等
    pipe: {
        // 开关
        enabled: true,
        // 输出文件类型（csv | json）
        type: 'json',
        // 输出文件目录
        dirPath: 'data',
        // 输出文件名 为空则为yyyy-MM-dd文件命名方式
        fileName: ''
    }
}
```

### 如何自建LinkQueue?

> 当前采集队列采用的无序链表`LinkQueue`，`LinkQueue`的底层采用的是`new Map()`来存储数据列表，其中`Map`中自带`size（）`方法可获取当前数据长度，同时在大量随机读写时，效率将会比`Object`更高。

函数中导出的`add`、`pop`、`size` 三个函数接口供`master`主线程调用与分配任务，如果需要更改，则只需要封装一个函数，导出这三个方法即可实现修改存储介质。

例如使用`node-redis`作为`LinkQueue`的示例：

```

```

### 自定义module模块
> 当前内置`superagent`、`cheerio`，可以传递一个 `object`类型数据，也可以直接传递一个`string`类型的包名来引入`node_modules`中的第三方包。像这样：
比如我们需要使用一个第三方的`md5`模块
```
/* config.js */
mudule.export = {
    modules: [
        {
           引入第三方模块名称
            name: 'md5',
            // 这里只需要写第三方库的名称即可
            path: 'md5-node'
        },
        {
           引入自定义模块
            name: 'md5',
            // 这里的路径是当前项目目录中`modules/md5/index.js`
            path: './mudules/md5'
        },
        /*  
            等同于如下语法：
            const md5 = require('md5-node');
        */
        'md5-node',
        /*  
            也可以直接传递一个字符串，但是变量中带有-的名称会变成驼峰命名：
            const md5Node = require('md5-node');
        */
    ]
    // ...
}

/* task.js */
const { Task } = require('fast-spider');
const task = new Task();
task.addTask('index',function(modules, next){
    // 这样就可以使用md5的模块了
    const { md5 } = modules;
});
```

以下是错误示范！  以下是错误示范！  以下是错误示范！

```
/* task.js */
const { Task } = require('fast-spider');
const md5 = require('md5-node');
const task = new Task();
task.addTask('index',function(modules, next){
    // 这样在代码交给子线程运行时，无法获取到md5的方法，程序将会异常。
    const _md5 = md5('ABCDE');
});
```
#### 如果不想使用内置`superagent`或者`cherrio`？
可以通过相同的键值来覆盖内置的第三方包

> 上述的模块配置通过`require`函数引入并统一注入到`task`回调函数`modules`中，切记不可以在`task`文件中引入第三方包使用，这样是错误的，如上面的错误示范。

> 同时可以通过自定义模块的方式将`redis`、`mysql`等数据库模块注入进来，在`task`运行的过程中，可以随时与外部存储交互。

> 虽然子线程在运行过程中共享内存，但是`postMessage`并不能传递`function`,也无法共享数据实例（主线程引入了一个包，子线程并不能使用），但好在node的`require`默认是缓存在内存中的，因此第一次加载modules后，所有子线程均从缓存中读取自定义包或第三方包，这样执行的效率并不会太慢。具体我并没有测试过太多性能方面的问题，所以第三方包除非必要，尽量还是少引入，这样多线程的执行效率将会更高。

以上将是fast-spider使用说明，个人编写，断断续续写了写么多，文档中出现了错误，欢迎提到issue，如果你有更好的意见，也可以在issue中询问，以便于我会在后期逐渐更加细致的完善它。

## 关于后期迭代计划
- Ts版本（因为前期的实验型方案从多进程再到多线程上花了较多的时间尝试）
- 其实此版本含有两个模式，即`flow`、`async`模式，其中`flow`为同步模式不与`linkQueue`发生通信，所以不支持多线程，并不适合现有的爬虫模式，不过仍然也有用得到它的地方，后期将会实现。
- 集成`redis`和`mongodb`、`mysql`等第三方数据库，当然前面也有示例如何集成`redis`案例，但是如果有必要，我还是会集成的吧！
- 暂时只想到这么多，我会在使用过程中，逐渐优化并修复细节。