const dltdata = require('./dltdata');

class Meter {
    constructor(meterSn='000000000000', dltData=Object.assign({},dltdata),updateInt = 5000) {
        this._dltdata = dltData;
        this._dltdata.meterSn=meterSn;
        this._updateInt=updateInt;
        
        this.ins=setInterval(() => {
            this._req.send(JSON.stringify( this._dltdata) );
        }, updateInt);   
        process.on('SIGINT',()=>{
            console.log('shutting down...');
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

module.exports=Meter;