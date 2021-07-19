export default {
    // spider mode || 'sync' | 'flow'
    mode: 'sync', 
    interval: 3000,
    clusterNum: 2,
    startTask: {
        taskName: 'A',
        options: {
            num: 10
        }
    }
}