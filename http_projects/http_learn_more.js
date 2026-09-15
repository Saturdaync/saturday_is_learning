const http=require('node:http');
const { buffer } = require('node:stream/consumers');


const server=http.createServer((request,response)=>{
    let input=[];
    request.on('data',(chunk)=>{
        input.push(chunk)
    })
    request.on('end',()=>{
        console.log(input)
        console.log((Buffer.concat(input)).toString())
        response.end('Hello World!')
    })

})
server.listen(8000)