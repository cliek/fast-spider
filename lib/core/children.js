
const { getTasks } = require('../task');

const Tasks = getTasks();

process.on('message', (data)=> {
    switch(data.type){
        case "task":
            const { taskName, ...arg } = data.data
            Tasks[taskName]((_taskName, _arg)=>{
                process.send({
                    type: "add",
                    data: {
                        taskName: _taskName,
                        ..._arg
                    }
                })
            }, arg)
            break;
        case "exit":
            process.exit(0);
            break;
        default:
            console.log(data)
            break;  
    }
})

process.on('error', (msg) => {
    console.log(msg);
});
