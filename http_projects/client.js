const http=require('node:http')
const path=require('node:path')
const zlib=require('node:zlib')
const fs=require('node:fs')
const {pipeline}=require('node:stream/promises')

const opts={
    'hostname':'127.0.0.1',
    'port':8000,
    'method':'POST',
    'path':'/uploadimage',
    'headers':{
        'content-type':'image/png',
        'content-encoding':'br'
    }
}

const client=http.request(opts,(response)=>{
    let data=''
    response.on('data',(c)=>data+=c)
    response.on('end',()=>console.log(JSON.parse(data)))
})
client.on('error',()=>{
    console.log('网络错误！')
})


const photo_path=path.join(__dirname,'./hack.png')
async function upload_photo(src){
    const zs=zlib.createBrotliCompress({params:{[zlib.constants.BROTLI_PARAM_QUALITY]:4}})
    await pipeline(fs.createReadStream(src),zs,client)
    console.log('图片上传完成！')
}
upload_photo(photo_path)