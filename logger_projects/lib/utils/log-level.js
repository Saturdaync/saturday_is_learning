class LogLevel{
    static Debug=0;
    static Info=1;
    static Warn=2;
    static Error=3;
    static Critical=4;

    static assert(log_level){
        if(
            log_level!=this.Debug&&
            log_level!=this.Info&&
            log_level!=this.Warn&&
            log_level!=this.Error&&
            log_level!=this.Critical
        ){
            throw new Error(
                `log_level is not correct!your input ${JSON.stringify(log_level)}`
            )
        }
    }

    static to_string(log_level) {
        const levelMap = {
            [this.Debug]: "DEBUG",
            [this.Info]: "INFO",
            [this.Warn]: "WARN",
            [this.Error]: "ERROR",
            [this.Critical]: "CRITICAL"
        };

        if (levelMap.hasOwnProperty(log_level)) {
            return levelMap[log_level];
        }

        throw new Error(`Unsupported log level ${log_level}`);
    }
}

module.exports={
    LogLevel
}