const { resolve } = require('node:dns');
const http=require('node:http');
const HTTP_METHODS={
    GET:'GET',
    POST:'POST',
    PUT:'PUT',
    DELTER:'DELETE',
    PATCH:'PATCH',
    HEAD:'HEAD',
    OPTIONS:'POTIONS',
    CONNECT:'CONNECT',
    TRACE:'TRACE'
};
class Trie{
    #trie_path={
        '/':{}
    }

    insert(root){
        const path=root.split('/').filter(Boolean);
        let last_path=this.#trie_path['/'];
        for(let i of path){
            last_path[i]={}
            last_path=last_path[i]
        }
    }

    trie_path(){
       console.log(this.#trie_path) 
    }
}
const trie=new Trie();
trie.insert('/api/user');
trie.trie_path();

class Router{
    constructor(){
        this.router={}
    }
    handleRequest(request,response){
        const{url,method}=request
        const handler=this.router[`${method} ${url}`]
        if(!handler){
            response.end('404 NOT Found!')
            return console.log('404 Not Found')

        }
        handler(request,response)
    }
    #addRoutes(method,path,handler){
        this.router[`${method} ${path}`]=handler
    }
    get(path,handler){
        this.#addRoutes(HTTP_METHODS.GET,path,handler)
    }
    post(path,handler){
        this.#addRoutes(HTTP_METHODS.POST,path,handler)
    }
    printRouter(){
        console.log(Object.entries(this.router))
    }
}


const router=new Router()
router.get('/',function handle_GET(request,response){
    console.log('处理了一个GET请求')
    response.end('已经处理了您的GET请求')
})
router.post('/',function handle_POST(request,response){
    console.log('处理了一个POST请求')
    response.end('已经处理了您的POST请求')
})
router.printRouter()




const PORT=3000
const server=http.createServer((request,response)=>{router.handleRequest(request,response)})
server.listen(PORT)
