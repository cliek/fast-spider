const fs = require('fs');
const path = require('path');

class Pipe {
    constructor(cfg){
        this.config = Object.assign({
            type: 'json',
            dirPath: 'data',
            fileName: ''
        }, cfg)
        this.fristWrite = true;
        this.fileName = this.config.fileName ? this.config.fileName : new Date().toLocaleDateString().replace(/\//g, '-')
        this.filePath = path.join(process.cwd(), this.config.dirPath, this.fileName + '.' + (this.config.type.toLocaleLowerCase() == 'csv' ? 'csv': 'json'));
    }

    generateHeader(data) {
        return new Promise(async (resolve, reject) => {
            try {
                if(!fs.existsSync(path.join(process.cwd(), this.config.dirPath))) fs.mkdirSync(path.join(process.cwd(), this.config.dirPath))
            } catch (error) {
                console.log(error)
            }
            if(this.config.type.toLocaleLowerCase() == 'csv') {
                if(data){
                    let content = '\ufeff';
                    const _header = Object.keys(data);
                    _header.map((is, i, arr)=>{
                        if((arr.length - 1) == i){
                            content += (is + '\n')
                        }else{
                            content += (is + ',')
                        }
                    })
                    this.fristWrite = false;
                    await this.appendFile(content);
                    resolve(true)
                }else{
                    reject('pipe data is null')
                }
            } else {
                this.fristWrite = false;
                await this.appendFile('[');
                resolve(true)
            }
        })
    }

    async write(_data){
        if(this.fristWrite){
            try {
                await this.generateHeader(_data);
            } catch (error) {
                return console.log(error)
            }
        }
        if(this.config.type.toLocaleLowerCase() == 'csv'){
            const data = '\ufeff' + Object.values(_data).map((item, i , arr) => {
                const endFlag = arr.length - 1 === i ? '\n': ','
                return typeof item === 'object' ? (JSON.stringify(item) + endFlag): (item + endFlag)
            })
            return await this.appendFile(data);
        }else{
            return await this.appendFile(JSON.stringify(_data)+',');
        }
    }

    appendFile(data){
        return new Promise((resolve, reject) => {
            fs.appendFile(this.filePath, data, {
                encoding: 'utf-8'
            }, (err)=>{
                if(err) return reject(err)
                resolve(true)
            })
        })
    }
}

module.exports = Pipe