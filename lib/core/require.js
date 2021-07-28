const path = require('path');

const pathString = function(path) {
    if(!path) return 
    if(path.indexOf('./') > -1){
        return path.join(process.cwd(), path)
    }else{
        return path
    }
}

exports.modulesMap = function(moduleArray){
    let ms = {};
    for (let i = 0; i < moduleArray.length; i++) {
        if(typeof moduleArray[i] === 'string'){
            ms[moduleArray[i]] = require(pathString(moduleArray[i]));
        }else{
            ms[moduleArray[i].name] = require(pathString(moduleArray[i].path));
        }
    }
    return ms;
}
