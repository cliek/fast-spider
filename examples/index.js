
import Spider from 'fast-spider';
import redis from './redis';
import schedule from 'node-schedule';
// import db from './db';

const spider = new Spider(2, './tasks/index.js',{
    isExit: false
});

spider.events.on('next', res => {
    console.log('next:',res)
})

spider.events.on('data', res => {
    // res.result.map((is) => {
    //     db.models.hot_search.create({
    //         title: is.title,
    //         image: is.image,
    //         hotType: is.hotType,
    //         hotSocpe: is.hotNum,
    //         link: is.link,
    //         description: is.description
    //     }).then(res => {
    //         console.log(res);
    //     }).catch(err => {
    //         console.log(err)
    //     })
    // })
    switch(res.taskName){
        case 'getBaidu':
            redis.hSet('spider-hots', 'baidu', JSON.stringify(res.result));
        break;
    }
})

spider.events.on('exit', () => {
    redis.quit();
})

spider.events.on('error', res => {
    console.log('error:',res)
})

// *    *    *    *    *    *
// ┬    ┬    ┬    ┬    ┬    ┬
// │    │    │    │    │    │
// │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
// │    │    │    │    └───── month (1 - 12)
// │    │    │    └────────── day of month (1 - 31)
// │    │    └─────────────── hour (0 - 23)
// │    └──────────────────── minute (0 - 59)
// └───────────────────────── second (0 - 59, OPTIONAL)
const job = schedule.scheduleJob('*/30 * * * * *', function(){
    spider.runTask('getBaidu');
    console.log('spider -> ' + new Date())
});