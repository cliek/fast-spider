export default {
    // spider mode || 'sync' | 'flow'
    mode: 'flow', 
    interval: 1000,
    cluster: 1,
    start: {
        taskName: 'A',
        options: {
            num: 10
        }
    }
}