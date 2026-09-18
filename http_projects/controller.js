const {Server}=require('./server.js')
const zlib=require('node:zlib')
const {pipeline}=require('node:stream/promises')
const fs=require('node:fs/promises')
const path=require('node:path')
const {createWriteStream,createReadStream}=require('node:fs')


const server=new Server()


async function view_photo(params,response){
    const photo_name=params.get('photo')
    if(!photo_name){
        return {'code':404,'message':'请保证参数正确！'}
    }
    const photo_path=path.join(__dirname,`./upload_photo/${photo_name}`)
    await pipeline(createReadStream(photo_path),response).catch(()=>{
        return {'code':505,'message':'图片返回错误！'}
    })
    return {'code':200}
}

async function download_photo(request,response){
    const PHOTO_PLACE=path.join(__dirname,'./upload_photo/')
    await fs.mkdir(PHOTO_PLACE,{recursive:true})
    const photo_name=`${new Date().toISOString()}.png`
    if(request.headers['content-encoding']==='br'){
        const zs=zlib.createBrotliDecompress({params:{[zlib.constants.BROTLI_PARAM_QUALITY]:4}})
        await pipeline(request,zs,createWriteStream(path.join(PHOTO_PLACE,photo_name)))
        return {'code':200,'message':'图片上传完成！','photo_name':photo_name}
    }
}


server.insert_path('/viewphoto',view_photo,'GET')
server.insert_path('/uploadimage',download_photo,'POST')
server.insert_path('/',()=>{return {'code':200,'message':'Hello World!'}},'GET')
server.init()
