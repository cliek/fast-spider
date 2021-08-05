const { Task } = require('../../lib');

const T = new Task();

T.addTask("doubanTop50", function({ request }, next){
    request.get('https://movie.douban.com/j/search_subjects?type=movie&tag=%E7%83%AD%E9%97%A8&page_limit=50&page_start=0').end((err, res)=>{
        if (res.ok) {
            res.body.subjects.map((is, i, arr) => {
                next("doubanDesc",is, false, i === arr.length-1 ?true: false);
            })
        } else {
            console.log('Oh no! error ' + err || res.text);
        }
    })
});

T.addTask("doubanDesc", function({params, request, cheerio }, next){
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
            next(desc);
        }else{
            console.log('Oh no! error ' + err || res.text);
        }
    })
});

module.exports = T;