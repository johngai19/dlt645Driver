EventEmitter = require('events').EventEmitter;
const MeterData = require('./meterdata');

class Meter extends EventEmitter {
    constructor(meterSn = "000000000000", meterData = MeterData) {
        super();
        this._meterSn = meterSn;
        this._meterData = Object.assign({}, meterData);
        this.updateMeterData.bind(this);
        this.on('update',(sn,newData)=>{
            if(sn===this._meterSn){
                this.updateMeterData(newData);
            }
        });
    }

    get meterSn() {
        return this._meterSn;
    }

    get meterData() {
        return Object.assign({}, this._meterData);
    }

    updateMeterData(newData) {
        for (let key in newData) {
            if (this._meterData.hasOwnProperty(key)) {
                this._meterData[key] = newData[key];
            }
        }
    }

}

module.exports = Meter;