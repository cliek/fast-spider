import Comsumer from './lib/core'

const C = new Comsumer();
C.start({
    taskName: "A",
    data: {
        num: 10
    }
});