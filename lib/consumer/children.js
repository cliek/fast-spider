
import { getTasks } from '../task';

const Tasks = getTasks();

process.on('message', (data)=> {
    switch(data.type){
        case "task":
            console.log(data.data)
            const { taskName, ...arg } = data.data
            Tasks[taskName]((_taskName, _arg)=>{
                process.send({
                    type: "add",
                    data: {
                        taskName: _taskName,
                        ..._arg
                    }
                })
            }, afg)
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
