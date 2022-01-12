import { Pool } from "../index";

Pool.exec({
    task: (n)=>(n+2),
    param: 2
}).then((res: number) => {
    console.log(res)
})