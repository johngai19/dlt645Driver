//const zmq = require('zeromq');
const SerialPort = require('serialport');
const dltData = require('./meterdata');
const bufToCmd = require('./DltParser').bufToCmd;
const cmdToBuf = require('./DltParser').cmdToBuf;
const ConcatParser = require('./ConcatParser');




class DltDriver {
    constructor(portPath, updateInt, meterList = [], portSet) {
        const defaultSet =
        {
            baudRate: 1200,
            dataBits: 8,
            parity: "even",
            stopBits: 1,
            autoOpen: true
        }
        //meterList =meterListOr;
        //console.log(meterList);
        //console.log(updateInt);
        this._portPath = (portPath === undefined) ? 'ttyS4' : portPath;
        this._portName = this._portPath.replace('tty', '/dev/tty');
        this._portSet = (portSet === undefined) ? defaultSet : portSet;
        this._port = new SerialPort(this._portName, this._portSet, (() => console.log));
        //this._port = new SerialPort(this._portPath, portSet, (()=>console.log));
        this._concat = new ConcatParser({ boundary: [0x16] });
        this._parser = this._port.pipe(this._concat);

        //this._rep = zmq.socket('rep');
        //this._rep.bind(serverSocket, (err) => { if (err) console.log(err); });
        /*
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
        */
        this._yld = this._fetchValue();

        this._fetchInterval = setInterval(() => {
            //console.log(meterList.length);
            if (meterList.length > 0) {
                let buf = this._yld.next().value;
                //console.log(buf);
                this._port.write(buf, (err, result) => {
                    if (err) {
                        console.log(err);
                    }
                    //console.log(result);
                });
            }
        }, updateInt);


        this._parser.on('data', (data) => {
            //console.log('receved:'+data.toString('hex'));
            let cmd = bufToCmd(data);
            if (cmd && (cmd.cmd !== '') && (cmd.cmd !== 'd1')) {
                //console.log(cmd);
                this._updateValue(cmd);
            }

        })


        //this._updateMeterList.bind(this);
        this._fetchValue.bind(this);
        this._updateValue.bind(this);

        

    }
    /*
        _updateMeterList(meterSn) {
            for (let i = 0; i < meterList.length; i++) {
                if ((meterList[i]) && (meterList[i].hasOwnProperty('meterSn'))) {
                    if (meterList[i].meterSn === meterSn) {
                        //meterList[i].dltProperties['elecFh']+=10;
                        return meterList[i];
                    }
                }
            }
            let newMeter = Object.assign({}, dltData);
            newMeter.meterSn = meterSn;
            meterList.push(newMeter);
            return meterList[meterList.length - 1];
        }
        */

    /*
    *@param
        cmd = {
            cmd: '91',
            data: { status: true, propertyName: 'elecFra', value: 0 },
            sn: '3411001043'
        }
    */
    _updateValue(cmd) {

        if (cmd.sn && (cmd.cmd !== '') && (cmd.cmd !== 'd1')) {
            for (let i = 0; i < meterList.length; i++) {

                if (cmd.sn === meterList[i].meterSn) {
                    let propName = cmd.data.propertyName;
                    //console.log(cmd.data.propertyName);
                    if (propName && (propName !== 'errCode')) {
                        let propValue = cmd.data.value;
                        let newProp = { [propName]: propValue };
                        //console.log(newProp);
                        meterList[i].updateMeterData(newProp);

                    }
                    //console.log(propName);
                    //console.log(meterList[i]);
                    //console.log(cmd);
                    //     //meterList[i][cmd.data.propertyName]=cmd.data.value;
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
            for (let key in meterList[index].meterData) {
                if ((key !== 'meterSn') && (key != 'errCode')) {
                    cmd.sn = meterList[index].meterSn;
                    cmd.cmd = '11';
                    cmd.data.propertyName = key;
                    cmd.data.value = 0;
                    cmd.data.status = true;
                    yield cmdToBuf(cmd);
                }
            }
            index++;
            if (index >= meterList.length) index = 0;
        }

    }


}


module.exports = DltDriver;