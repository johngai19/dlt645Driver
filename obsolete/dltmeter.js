const dltdata = require('./dltdata');
const zmq = require('zeromq');

class DltMeter {
    constructor(meterSn='000000000000', dltData=Object.assign({},dltdata),serverSocket='ipc://dltdriver.ipc',updateInt = 5000) {
        this._dltdata = dltData;
        this._dltdata.meterSn=meterSn;
        this._req = zmq.socket('req');
        this._updateInt=updateInt;
        this._req.connect(serverSocket);
        this._req.on('message', data => {
            const content = JSON.parse(data);
            if(content.meterSn===this._dltdata.meterSn){
                Object.assign(this._dltdata,content);
                console.log('Meter value is updated', JSON.stringify(this._dltdata));
            }
           
        })
        this.ins=setInterval(() => {
            this._req.send(JSON.stringify( this._dltdata) );
        }, updateInt);   
        process.on('SIGINT',()=>{
            console.log('shutting down...');
            this._req.close();
            clearInterval(this.ins);
            //this.req.disconnect('ipc://dltdriver.ipc');
           });
    }

    get meterSn(){
        return this._dltdata.meterSn;
    }

    get dltdata(){
        return this._dltdata;
    }

    set dltdata(propObj){
        for(let key in propObj){
            if(this._dltdata.hasOwnProperty(key)){
                this._dltdata[key]=propObj[key];
            }
        }
    }

}

module.exports=DltMeter;