const { Task } = require('../../lib');
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
            next();
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
            next();
        }
    })
});

// 导出task这步非常关键
module.exports = task;