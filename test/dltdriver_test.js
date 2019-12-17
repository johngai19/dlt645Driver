'use strict';

const path = require('path');
const expect = require('chai').expect;
//const SerialPort = require('serialport');
const sinon = require('sinon');
const DltDriver = require('../src/dltdriver');
const Configuration = require('../src/configuration');

describe('dltdriver tests', () => {

    let sandbox;
    const configFile = path.join(__dirname, 'testconfig.json');
    const modelFile = path.join(__dirname, 'testmodel.json');
    const configuration = new Configuration(configFile, modelFile);
    const dltDriver = new DltDriver(configuration);
    // stubConfig.onlineDevice = sandbox.stub().returns(stubMsg);
    beforeEach(() => {
        sandbox = sinon.createSandbox();


    })
    afterEach(() => {
        sandbox.restore();
    })

    it('dltdriver should create dltdriver object successful', () => {
        const portSet = {
            baudRate: 1200,
            dataBits: 8,
            parity: "even",
            stopBits: 1,
            autoOpen: true
        };
        expect(dltDriver._portName).to.be.eql('/dev/ttyS4');
        expect(dltDriver._portSet).to.be.eql(portSet);
        expect(dltDriver._updateInterval).to.be.eql(3000);
    });

    it('dltdriver _updateValue should update configuration value successful', () => {
        const cmd = {
            sn: '3411001043',
            cmd: '11',
            data: {
                status: true,
                propertyName: 'elecUa',
                value: 125
            }
        };
        let reqMsg = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": ["elecUa"]
        });
        let resmsg = [{ "identifier": "elecUa", "type": "int", "value": 125 }];
        dltDriver._updateValue(cmd, configuration);
        let msg = configuration.getProperty(reqMsg);
        expect(msg).to.be.eql(resmsg);

    });

    it('dltdriver *_fetchValue should yield value successful', () => {
        let reqMsg = Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10, 0x00, 0x11,
            0x34, 0x00, 0x68, 0x11, 0x04, 0x33, 0x33, 0x39, 0x35, 0x51, 0x16]);
        let reqMsg2 = Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10, 0x00, 0x11,
            0x34, 0x00, 0x68, 0x11, 0x04, 0x35, 0x33, 0xb3, 0x35, 0xcd, 0x16]);
        let yld = dltDriver._fetchValue();
        expect(yld.next().value).to.be.eql(reqMsg);
        expect(yld.next().value).to.be.eql(reqMsg2);

    });

});
