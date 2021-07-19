
// import { getTasks } from '../task';

process.on('message', (data)=> {
    switch(data.type){
        case "task":
            console.log(data.data)
            // getTasks()
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
