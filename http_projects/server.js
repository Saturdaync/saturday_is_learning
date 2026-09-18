const http=require('node:http')
const {Router}=require('./router')
const {URL}=require('node:url')


class Server{
    #PORT=8000
    
    constructor(){
        this.router=new Router
    }

    insert_path(src,handle,method){
        this.router.addrouter(src,handle,method)
    }

    init(){
        const server=http.createServer(async (request,response)=>{
            const method=request.method
            const {pathname,params}=this.#dell_url(request)
            const hanlde_function=this.router.router_handle(pathname,method)
            if(!hanlde_function){
                response.end('没有这个函数！')
                return
            }
            if(method==='GET'){
            const return_fucnction=await hanlde_function(params,response)
            response.end(JSON.stringify(return_fucnction))
        }
            else if(method==='POST'){
            const return_fuction=await hanlde_function(request,response)
            response.end(JSON.stringify(return_fuction))
        }
        })
        this.server=server
        this.server.listen(this.#PORT)
    }

    #dell_url(request){
        const base=`http://${request.headers.host}`
        const urlobj=new URL(request.url,base)
        return {pathname:urlobj.pathname,params:urlobj.searchParams}
    }
}

module.exports={
    Server
}