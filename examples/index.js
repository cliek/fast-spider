import Spider from "../dist";

const S = new Spider(1, './tasks/index.js').runTask('aa');

S._events.on('next', res => {
    console.log(res)
})

S._events.on('data', res => {
    console.log(res)
})
