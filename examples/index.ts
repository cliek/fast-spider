import Pool from "../lib/core";

Pool.execute({a:'test'}).then(res => {
    console.log(res);
})