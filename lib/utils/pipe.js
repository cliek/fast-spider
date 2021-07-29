const fs = require('fs');
const path = require('path');
const generateFile = function(data, options){
    const config = Object.assign({
        type: 'json',
        dirPath: 'data'
    },options)

    return new Promise((resolve, reject) => {
        try {
            if(options.type.toLocaleLowerCase() == 'csv') {
                if(data.length){
                    let content = '\ufeff';
                    const _header = Object.keys(data[0]);
                    _header.map((is, i, arr)=>{
                        if((arr.length - 1) == i){
                            content += (is + '\n')
                        }else{
                            content += (is + ',')
                        }
                    })
                    data.forEach(item => {
                        _headerforEach((is, i) => {
                            if((arr.length - 1) == i){
                                content += item[is[i]] + '\n'
                            }else{
                                content += item[is[i]] + ','
                            }
                        })
                    })
                    const _path = path.join(process.cwd(), path.join(config.dirPath, 'data.csv'));
                    fs.writeSync(_path, 'utf-8', 'a', (err, result)=>{
                        
                    })
                }else{
                    reject('pipe data is null')
                }
            } else {
                
            }
        } catch (error) {
            reject(error)
        }
    })
}


module.exports = generateFile