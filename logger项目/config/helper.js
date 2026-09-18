function get_caller_info(){
    let error={};
    Error.captureStackTrace(error);
    let error_= error.stack.split('\n')[3]
    let error_trace=error_.split('at').pop()
    return error_trace
}

module.exports={
    get_caller_info
}