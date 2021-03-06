import Spider from "fast-spider";

const S = new Spider(1, './tasks/index.js').runTask('aa');

S.events.on('next', res => {
    console.log('next:',res)
})

S.events.on('data', res => {
    console.log('data:',res)
})

S.events.on('error', res => {
    console.log('error:',res)
})

S.events.on('exit', () => {
    console.log('exit:')
})
