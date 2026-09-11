const http=require('node:http');
const HTTP_METHODS={
    GET:'GET',
    POST:'POST',
    PUT:'PUT',
    DELTER:'DELETE',
    PATCH:'PATCH',
    HEAD:'HEAD',
    OPTIONS:'OPTIONS',
    CONNECT:'CONNECT',
    TRACE:'TRACE'
};
class Trie{
    constructor(){
        this.root=new TrieNode()
    }

    #checkout(path){
        if(path[0]!='/'){
            console.log('请以/开头')
            return true
        }
        if(/\s/.test(path)){
            console.log('URL中不允许空格!')
            return true
        }
        return false
    }


    insert(path,handle,method){
        if(path.length<=0||this.#checkout(path)){return}
        const del_path=path.split("/").filter(seg=>seg)
        this.root.add(del_path,handle,method)
    }

    async output(){
        return await this.root.output(1)
    }

    search(path_api,method){
        if(this.#checkout(path_api)){return}
        path_api=path_api.split('/').filter(seg=>seg)
        if(path_api.length<=0)return;
        let node=this.root
        for(let word of path_api){
            if(word[0]===':'){
                word=':'
            }
            else if(!node.children.get(word)){
                console.log('不存在')
                return
            }
            node=node.children.get(word)
        }
        if(node.isEndWord){
            console.log('存在这个api')
            const fn=node.handle[`${method}`]
            return fn()
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
        this.handle={}
        this.params=[]
    }

    add(path,handle,method){
        let now_node=path[0]
        if(path.length===0){
            this.isEndWord=true
            this.handle[method]=handle
            return
        }
        let newNode
        if(now_node[0]===':'){
            newNode=this.children.get(':');
            this.params.push(now_node.slice(1))
            now_node=':'
        }else{
        newNode=this.children.get(now_node)
        }
        if(!newNode){
        newNode=new TrieNode()
        this.children.set(now_node,newNode)
        }
        newNode.add(path.slice(1),handle,method)
    }

    async output(time){
        for(const[key,value] of this.children){
            const space='-'.repeat(time);
            if(key===':'){console.log(`${space}${this.params}:${value}`)}
            else console.log(`${space}${key}:${value}`)
         await   value.output(time+1)
        }
    }

}
function gethandle(){
    console.log('这里我处理了一个GET请求')
}
function posthandle(){
    console.log('这里我处理了一个POST请求')
}



async function test_trie(){
const trie=new Trie();
trie.insert("/user/api/:userid",gethandle,HTTP_METHODS['GET'])
trie.insert('/user/id/search',posthandle,HTTP_METHODS['POST'])
await trie.output()
trie.search('/user/api/:1211',HTTP_METHODS['GET'])
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

function test_server(){
const PORT=3000
const server=http.createServer((request,response)=>{router.handleRequest(request,response)})
server.listen(PORT)
}

