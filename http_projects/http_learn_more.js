const http=require('node:http');
const {URL}=require('node:url')
const zlib=require('node:zlib')

const server=http.createServer((request,response)=>{
    if(request.method==='POST'){
    let request_stream=request
    let input=[];
    if(request.headers['content-encoding']==='br'){
    console.log('开始解压')
    const stream=request.pipe(zlib.createBrotliDecompress())
        request_stream=stream
}
    request_stream.on('data',(chunk)=>{
        input.push(chunk)
    })
    request_stream.on('end',()=>{
        const body=Buffer.concat(input).toString()
        const POST_params=new URLSearchParams(body)
        console.log(Object.fromEntries(POST_params))
        response.end('[POST]:Hello World!')
/* 对于POST而言，参数什么的都放在body里面，所以说要先把body弄到手，用buffer把他变成utf-8之后再用URLSearchParams把这个body变成一个对象
然后后面就用处理对象的方法就可以了has,get,set....
*/

    })
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
