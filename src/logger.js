'use strict';
/**
*@function getLogger - function to build a log4js module so as to make logging easier
*@param {string} name - string format of log file
*@example
        const logger  = require("./logger");
        infoLogger  = log4js.getLogger("info");
        traceLogger  = log4js.getLogger("trace");
        debugLogger  = log4js.getLogger("debug");

        infoLogger.info("现在时间：",new Date().toLocaleString());
        traceLogger.trace("现在时间：",new Date().toLocaleString());
        debugLogger.debug("现在时间：",new Date().toLocaleString());
*@auther weizy@126.com
*@version 1.0.0
*/
const log4js = require('log4js');

log4js.configure({
    'replaceConsole':false,
    'appenders':{
        'stdout':{
            'type':'console'
        },
        'trace':{
            'type':'dateFile',
            'filename':'log/log/',
            'pattern':'trace-yyyy-MM-dd.log',
            'alwaysIncludePattern':true
        },
        'debug':{
            'type':'dateFile',
            'filename':'log/log/',
            'pattern':'debug-yyyy-MM-dd.log',
            'alwaysIncludePattern':true
        },
        'info':{
            'type':'dateFile',
            'filename':'log/log/',
            'pattern':'info-yyyy-MM-dd.log',
            'alwaysIncludePattern':true
        },
        'warn':{
            'type':'dateFile',
            'filename':'log/log/',
            'pattern':'warn-yyyy-MM-dd.log',
            'alwaysIncludePattern':true
        },
        'error':{
            'type':'dateFile',
            'filename':'log/log/',
            'pattern':'err-yyyy-MM-dd.log',
            'alwaysIncludePattern':true
        },
        'fatal':{
            'type':'dateFile',
            'filename':'log/log/',
            'pattern':'fatal-yyyy-MM-dd.log',
            'alwaysIncludePattern':true
        }
    },
    'categories':{
        'default':{'appenders':['stdout','info'],'level':'info'},
        'trace':{'appenders':['stdout','trace'],'level':'trace'},
        'debug':{'appenders':['stdout','debug'],'level':'debug'},
        'warn':{'appenders':['stdout','warn'],'level':'warn'},
        'error':{'appenders':['stdout','error'],'level':'error'},
        'fatal':{'appenders':['stdout','fatal'],'level':'fatal'}
    }
});

exports.getLogger=function(name){
    return log4js.getLogger(name||'info');
};

/**
*@function useLogger - logger for express project
*@param {expressapp} app - Express format app
*@param {log4js} logger - log4js
*@auther weizy@126.com
*@version 1.0.0
*/
exports.useLogger=function(app,logger){
    app.use(log4js.connectLogger(logger||log4js.getLogger('info'),{
        'format': '[:remote-addr :method :url :status :response-timems][:referrer HTTP/:http-version :user-agent]'
    }));
};