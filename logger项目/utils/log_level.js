class Log_level{
    static level={
        1:'DEBUG',
        2:'INFO',
        3:'WARN',
        4:'ERROR'
    }
    
    static get_level(log_level){
        return this.level[log_level]
    }

}

module.exports={
    Log_level
}