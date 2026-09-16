const http=require('node:http')
const fs=require('node:fs')
const { buffer } = require('node:stream/consumers')
const zlib=require('node:zlib')
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

function client_request(){
    const request_body=new URLSearchParams(body).toString()
    const compress_stream=zlib.createBrotliCompress()
    compress_stream.pipe(client)
    compress_stream.write(request_body)
    compress_stream.end()
}
client_request()