const { exit } = require("node:process")

class Router{
    #router_path=new Map()

    addrouter(src,handle,method){
        const src_list=src.split('/').filter(Boolean)
        let current=this.#router_path
        src_list.forEach((path)=>{
            if(!current.has(path)){
                current.set(path,new Map)
            }
            current=current.get(path)
        })
        current.set(method,handle)
    }

router_handle(src, method){
    const src_list = src.split('/').filter(Boolean)
    let current = this.#router_path
    for (const path of src_list) {
        if (!current.has(path)) {
            return this.no_found()   
        }
        current = current.get(path)
    }
    return current.get(method) ?? this.no_found()
}

    no_found(){
        console.log('404 No found')
    }
}

module.exports={
    Router
}