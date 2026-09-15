const fs =require('node:fs')
const path=require('node:path')
const { buffer } = require('node:stream/consumers')
const INDEX_PATH=path.join(__dirname,'../http_projects/index.js')
const COPY_PATH=path.join(__dirname,'./index.js')
//readfilesync,writefilesync,open,read,write,colse

//用pipe直接导引流
function copy(src,dst){
        fs.createReadStream(src).pipe(fs.createWriteStream(dst))
}

//用流的方式读写
async function steam_cpoy(src){
    const file_path=path.join(__dirname,`./${new Date().toISOString()}.log`);
    const rs=fs.createReadStream(src);
    const ws=fs.createWriteStream(file_path);
    rs.on('data',(chunk)=>{
        if(ws.write(chunk)===false){
            rs.pause()
        }
    });
    rs.on('end',()=>{
        ws.end()
    })
    ws.on('drain',()=>{
        rs.resume()
    })
}


//读入buffer，然后再写入
let buffer_docker=[];
function buffer_copy(src){
    const rs=fs.createReadStream(src)
    rs.on('data',(chunk)=>{
        buffer_docker.push(chunk)
    })
    rs.on('end',()=>{
    console.log((buffer_docker.concat()).toString())
})
}

//path: normalise 标准化处理输入的路径,extname 获得文件后缀名


//用fsp来遍历文件夹
const fsp=require('node:fs/promises')
const begin='/Users/Zhuanz/nodejs_learn'
let file_docker=[];
async function DFS(src){
    const entries=await fsp.readdir(src,{withFileTypes:true});
    for(const file of entries){
        const file_path=path.join(src,file.name)
        if(file.isDirectory()){
            if(file.name!='.git'){
            await DFS(file_path)
            }
        }
        else{
            file_docker.push(file_path)
        }
    }
}

async function _(){
await DFS(begin)
console.log(file_docker)
}
_()