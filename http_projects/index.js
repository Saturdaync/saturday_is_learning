const { resolve } = require('node:dns');
const http=require('node:http');
const path = require('node:path');
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
    constructor(){
        this.root=new TrieNode()
    }

    insert(path,handle){
        if(path.length<=0){return}
        const del_path=path.split("")
        this.root.add(del_path,handle)
    }

    output(){
        this.root.output()
    }

    search(path_api){
        path_api=path_api.split('')
        if(path_api.length<=0)return;
        let node=this.root
        for(let word of path_api){
            if(!node.children.get(word)){
                console.log('不存在')
                return
            }
            node=node.children.get(word)
        }
        if(node.isEndWord){
            console.log('存在这个api')
        }
        else{
            console.log('不存在')
        }
    }
}


class TrieNode{
    constructor(){
        this.children=new Map()
        this.isEndWord=false
        this.handle=()=>{console.log('没有设置处理方法')}
    }

    add(path,handle){
        const now_node=path[0]
        if(!now_node){
            this.isEndWord=true
            this.handle=handle
            return
        }
        let newNode=this.children[`${now_node}`]
        if(!newNode){
        newNode=new TrieNode()
        this.children.set(now_node,newNode)
        }
        newNode.add(path.slice(1),handle)
    }

    output(){
        for(const[key,value] of this.children){
            console.log(`${key}:${value}`)
            value.output()
        }
    }

}
function test_trie(){
const trie=new Trie();
trie.insert("userapi",()=>{console.log(`这是我处理GET请求的一个方法`)})
trie.output()
trie.search('666')
trie.search('userapi')
}
test_trie()
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

function test_server(){
const PORT=3000
const server=http.createServer((request,response)=>{router.handleRequest(request,response)})
server.listen(PORT)
}
