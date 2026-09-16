const http=require('node:http');
const {URL}=require('node:url')
const zlib=require('node:zlib')
const path=require('node:path')
const fs=require('node:fs');
const {pipeline}=require('node:stream/promises')

const server=http.createServer((request,response)=>{
    if(request.method==='POST'){
    let input=[];
    let request_stream;
    if(request.headers['content-encoding']==='br'){
    console.log('开始解压')
    request_stream=zlib.createBrotliDecompress({
    params:{ [zlib.constants.BROTLI_PARAM_QUALITY]:5 }
})
}
    if(request.headers['content-type']==='image/png'){
const PHOTO_NAME=new Date().toISOString()+'.png'
const PHOTO_PATH=path.join(__dirname,`./image/${PHOTO_NAME}`)
const file_created_time=new Date().getTime()
const rs=fs.createWriteStream(PHOTO_PATH)
        pipeline(request,request_stream,rs).then(()=>{
            console.log('图片上传完毕!')
            console.log(`耗时：${(new Date().getTime()-file_created_time)/1000}秒`)
            response.end(`[POST]:图片上传完毕![${PHOTO_PATH}]`)
        })
        return
    }
    else{
    request.on('data',(chunk)=>{
        input.push(chunk)
    })
    request.on('end',()=>{
        const body=Buffer.concat(input).toString()
        const POST_params=new URLSearchParams(body)
        console.log(Object.fromEntries(POST_params))
        response.end('[POST]:Hello World!')
/* 对于POST而言，参数什么的都放在body里面，所以说要先把body弄到手，用buffer把他变成utf-8之后再用URLSearchParams把这个body变成一个对象
然后后面就用处理对象的方法就可以了has,get,set....
*/
        return
    })
}
}
    if(request.method==='GET'){
    const base=`http://${request.headers.host}`
    const urlobj=new URL(request.url,base)
    const all_params=urlobj.searchParams
    console.log(Object.fromEntries(all_params))
    response.end('[GET]:Hello World!')
    }
})
server.listen(8000)

//对于GET请求的话，可以用URL把他变成一个url对象，用searchparams获得他的参数对象,这个时候其实就已经变成一个普通的对象了，然后调用对象的
//方法就可以了，比如说get,has,set, fromEntries就是把这个对象的内容全部打印出来...