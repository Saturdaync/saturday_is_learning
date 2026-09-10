const {Logger,LogConfig}=require('./index')
const path=require('node:path')


async function initialize_logger(){
    let logger=Logger.with_config(LogConfig.from_file(path.join(__dirname,'config.json')))
    await logger.init()
    return logger
}

async function main(){
    let logger=await initialize_logger()
    setInterval(()=>{
        logger.critical('this is a critical!')
    },1000)
    logger.error('hello world!')
    console.log('end of the file')

}

main()