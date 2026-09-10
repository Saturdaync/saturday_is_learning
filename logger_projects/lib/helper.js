function get_caller_info(){
    const error={}
    Error.captureStackTrace(error);
    const caller_frame=error.stack.split('\n')[5]
    const meta_data=caller_frame.split('at').pop()
    return meta_data
}
module.exports={
    get_caller_info
}