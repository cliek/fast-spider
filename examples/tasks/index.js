const { Task } = require("fast-spider");
const superagent = require("superagent");
const cherrio = require('cheerio');
const tasks = new Task();

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

module.exports = tasks;