const zmq = require('zeromq');
const SerialPort = require('serialport');
const dltData = require('./dltdata');
const bufToCmd = require('./DltParser').bufToCmd;
const cmdToBuf = require('./DltParser').cmdToBuf;
const ConcatParser = require('./ConcatParser');

const defaultSet =
{
    baudRate: 1200,
    dataBits: 8,
    parity: "even",
    stopBits: 1,
    autoOpen: true
}


class DltDriver {
    constructor(portPath = '/dev/ttyS4', portSet = Object.assign({}, defaultSet),
        updateInt = 2000, serverSocket = 'ipc://dltdriver.ipc') {
        this._meterList = [];
        this._port = new SerialPort(portPath, portSet, false);
        this._concat = new ConcatParser({ boundary: [0x16] });
        this._parser = this._port.pipe(this._concat);
        this._rep = zmq.socket('rep');
        this._rep.bind(serverSocket, (err) => { if (err) console.log(err); });
        this._rep.on('message', data => {
            const request = JSON.parse(data);
            //console.log(request);
            if (request && (request.meterSn)) {
                let repData = this._updateMeterList(request.meterSn);
                // console.log(repData);
                if (repData) {
                    this._rep.send(JSON.stringify(repData));
                }
            }
        })
        this._yld = this._fetchValue();
        this._fetchInterval = setInterval(() => {
            if (this._meterList.length > 0) {
                let buf = this._yld.next().value;

                this._port.write(buf, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                });
            }
        }, updateInt);
        this._parser.on('data', (data) => {
            //console.log('receved:'+data.toString('hex'));
            let cmd = bufToCmd(data);
            if (cmd) {
                //console.log(cmd);
                this._updateValue(cmd);
            }

        })

        this._updateMeterList.bind(this);
        this._fetchValue.bind(this);
        this._updateValue.bind(this);

    }

    _updateMeterList(meterSn) {
        for (let i = 0; i < this._meterList.length; i++) {
            if ((this._meterList[i]) && (this._meterList[i].hasOwnProperty('meterSn'))) {
                if (this._meterList[i].meterSn === meterSn) {
                    //this._meterList[i].dltProperties['elecFh']+=10;
                    return this._meterList[i];
                }
            }
        }
        let newMeter = Object.assign({}, dltData);
        newMeter.meterSn = meterSn;
        this._meterList.push(newMeter);
        return this._meterList[this._meterList.length - 1];
    }

/*
*@param
    cmd = {
        cmd: '91',
        data: { status: true, propertyName: 'elecFra', value: 0 },
        sn: '3411001043'
    }
*/
    _updateValue(cmd) {

        if(cmd.sn){
            for(let i=0;i<this._meterList.length;i++){
                if(cmd.sn===this._meterList[i].meterSn){
                    this._meterList[i][cmd.data.propertyName]=cmd.data.value;
                }
            }
        }

    }

    *_fetchValue() {
        const cmd = {
            sn: '0000000000',
            cmd: '11',
            data: {
                status: true,
                propertyName: 'elecUa',
                value: 0
            }
        }
        let index = 0;
        while (true) {
            for (let key in this._meterList[index]) {
                if ((key !== 'meterSn') && (key != 'errCode')) {
                    cmd.sn = this._meterList[index]['meterSn'];
                    cmd.cmd = '11';
                    cmd.data.propertyName = key;
                    cmd.data.value = 0;
                    cmd.data.status = true;
                    yield cmdToBuf(cmd);
                }
            }
            index++;
            if (index >= this._meterList.length) index = 0;
        }

    }

}


module.exports = DltDriver;