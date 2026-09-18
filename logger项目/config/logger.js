const {Log_level}=require('../utils/log_level')
const fs=require('node:fs/promises')
const path=require('node:path')
const {get_caller_info}=require('./helper')


class Logger{

    #file_handle;

    async init(){
        let logs_trace=path.join(__dirname,'../logs')
        this.#file_handle=await fs.open(path.join(logs_trace,new Date().toISOString()),'a+')
        return this
    }

    async logs(log_level,message){
        if(!this.#file_handle.fd){
            return;
        }
        const data_trace=new Date().toISOString()
        const log_level_trace=Log_level.get_level(log_level)
        let error_trace;
        try{
            throw new Error()
        }
        catch{
            error_trace=get_caller_info()
        }
        await this.#file_handle.write(`[${data_trace}][${log_level_trace}][${error_trace}]:${message}\n`)
    }
}

module.exports={
    Logger
}