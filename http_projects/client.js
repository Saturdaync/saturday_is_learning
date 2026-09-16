const http=require('node:http')
const fs=require('node:fs')
const path=require('node:path')
const zlib=require('node:zlib')
const { pipeline } = require('node:stream/promises')

function client_request(){
const opts={
    'hostname':'127.0.0.1',
    'port':8000,
    'method':"POST",
    'path':'/',
    'headers':{
    'content-type':'application/x-www-form-urlencoded',
    'content-encoding':'br'
}
}
const body={
    'User':'Saturday',
    'age':'19',
}

const client=http.request(opts,(response)=>{
    let output=[]
    let stream=response
    if(response.headers['content-encoding']==='br'){
        stream=response.pipe(zlib.createBrotliDecompress())
    }
    stream.on('data',(chunk)=>{
        output.push(chunk)
    })
    stream.on('end',()=>{
        console.log(Buffer.concat(output).toString())
        console.log('输出完毕!')
    })
    stream.on('error',()=>{
        console.log('网络出错！')
    })
})
client.on('error',()=>{
    console.log('网络出错！')
})
    const request_body=new URLSearchParams(body).toString()
    const compress_stream=zlib.createBrotliCompress({
    params:{ [zlib.constants.BROTLI_PARAM_QUALITY]:4 }
},client)
    compress_stream.pipe(client)
    compress_stream.write(request_body)
    compress_stream.end()
}



const PHOTO_PATH=path.join(__dirname,'./desktop_photo.png')
async function uploadfile(src){

const opts={
    'hostname':'127.0.0.1',
    'port':8000,
    'method':"POST",
    'path':'/',
    'headers':{
    'content-type':'image/png',
    'content-encoding':'br'
}
}
const client=http.request(opts,(response)=>{
    let output=[]
    let stream=response
    if(response.headers['content-encoding']==='br'){
        stream=response.pipe(zlib.createBrotliDecompress({ params:{ [zlib.constants.BROTLI_PARAM_QUALITY]:4 } }),client)
    }
    stream.on('data',(chunk)=>{
        output.push(chunk)
    })
    stream.on('end',()=>{
        console.log(Buffer.concat(output).toString())
        console.log('输出完毕!')
    })
    stream.on('error',()=>{
        console.log('网络出错！')
    })
})
client.on('error',()=>{
    console.log('网络出错！')
})

    await pipeline(fs.createReadStream(src),zlib.createBrotliCompress({ params:{ [zlib.constants.BROTLI_PARAM_QUALITY]:4 } }),client)
    client.end()
    console.log('图片上传完毕！')
}
uploadfile(PHOTO_PATH)