/*
1.能读json文件，json文件的内容是：
    1.文件的prex
    2.文件的level
    3.文件的更新时间
    4.文件的更新大小
*/
const fs=require('node:fs/promises')
const path=require('node:path')

class Logger{
    #file_handle
    #json_file


    async init(){
        const json=await fs.readFile(path.join(__dirname,'../config.json'))
        this.#json_file=JSON.parse(json);
        const file_header=this.#json_file.log_header
        const file_name=file_header+new Date().toISOString()+'.log'
        const file_path=path.join(__dirname,`./logs/${file_name}`)
        this.#file_handle=await fs.open(file_path,'a+')
    }

    async #log(level,message){
        if(level<=this.#json_file.level)return
        if(!message)return
        if(!this.#file_handle){
            throw new Error('log文件的句柄出错!')
        }

        const file_stat=await this.#file_handle.stat()
        if((new Date().getTime()-file_stat.birthtimeMs)>=this.#json_file.rolling_time*1000||file_stat.size>=this.#json_file.rolling_size){
            await this.#file_handle.close()
            await this.init()
            await this.#file_handle.write(`日志自动分割,当前时间:${new Date().toISOString()}\n`)
        }

        const log_message=`[${new Date().toISOString()}][${level}]:${message}\n`
        await this.#file_handle.write(log_message)
    }

    async error(message){
        await this.#log(5,message)
    }
}

async function test(){
const logger=new Logger()
await logger.init()
setInterval(async ()=>{
    await logger.error('现在出错了！')
},500)
}
test()