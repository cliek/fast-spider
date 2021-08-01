const Task = require('../../lib/task');

const T = new Task();

T.addTask("A", function({request, cheerio }, next){
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

T.addTask("B", function({params}, next){
    next(params)
});

// T.addTask("C", function({params}, next){
//     next("D", {
//         num: params.num
//     })
// });

// T.addTask("D", function({params, request , cheerio }){
//     console.log(params, request, cheerio)
// });

module.exports = T;