const {Logger}=require('./config/logger')

async function main(){
    const logger=new Logger()
    const log_file=await logger.init()

    const log_level=2
    const message='成功了兄弟们！'
    await log_file.logs(log_level,message);
    console.log('end...')
}
main()