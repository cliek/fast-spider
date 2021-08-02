const path = require('path');

const pathString = function(_path) {
    if(!_path) return 
    if(_path.indexOf('./') > -1){
        return path.join(process.cwd(), _path)
    }else{
        return _path
    }
}

const toUpperCase = function(name) {
    if(name.indexOf('-') > -1){
        const _nameArr = name.split('-');
        return _nameArr.map((is, i)=>{
            return i == 0 ? is: is.charAt().toLocaleUpperCase() + is.slice(1);
        }).join('')
    }else{
        return name
    }
}

exports.modulesMap = function(moduleArray){
    let ms = {};
    for (let i = 0; i < moduleArray.length; i++) {
        if(typeof moduleArray[i] === 'string'){
            ms[toUpperCase(moduleArray[i])] = require(pathString(moduleArray[i]));
        }else{
            ms[toUpperCase(moduleArray[i].name)] = require(pathString(moduleArray[i].path));
        }
    }
    return ms;
}
