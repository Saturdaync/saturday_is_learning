const fs=require('node:fs')
const path=require('node:path')

const clean_path=path.join(__dirname,'./image')

function clean(src){
    const file_list=fs.readdirSync(src,{withFileTypes:true})
    file_list.forEach((file)=>{
        if(file.isFile()){
            fs.rmSync(path.join(src,file.name))
        }
    })
    console.log('删除完毕！')
}
clean(clean_path)