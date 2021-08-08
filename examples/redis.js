const { add, pop, size } = require('./modules/redisQueue');

for(let i = 0; i < 100; i++){
    add(i, {
        data: i,
        test: true
    })
}


async function run() {
    while(await size()){
        console.log(await pop())
    }
}
run()
// process.exit()