'use strict';

const expect = require('chai').expect;
const path = require('path');
const Configuration = require('../src/configuration');

describe('configuration tests', () => {
    const configFile = path.join(__dirname, 'testconfig.json');
    const modelFile = path.join(__dirname, 'testmodel.json');
    const configuration = new Configuration(configFile, modelFile);
    const driveInfo = JSON.parse(JSON.stringify({
        "portName": "ttyS4",
        "baudRate": 1200,
        "dataBits": 8,
        "parity": "even",
        "stopBits": 1,
        "autoOpen": true,
        "updateInterval": 3000
    }));



    it('should pass this canary test', () => {
        expect(true).to.be.true;
    });

    it('configuration should create initial configuration correctly', () => {

        expect(configuration.reportInterval).to.be.eql(10000);
        expect(JSON.parse(configuration.driverInfo)).to.be.eql(driveInfo);
        expect(configuration.meterList.length).to.be.eql(2);
    });

    it('configuration should build correct device model with meters', () => {

        let meterList = configuration.meterList;
        expect(JSON.parse(meterList[0]).productKey).to.be.eql("a1CLH9cvgoK");
        expect(JSON.parse(meterList[0]).deviceName).to.be.eql("tstMeter");
        expect(JSON.parse(meterList[0]).meterSn).to.be.eql("3411001043");
        expect(JSON.parse(meterList[0]).properties[0].identifier).to.be.eql("elecPf");
        expect(JSON.parse(meterList[0]).properties[0].type).to.be.eql("int");
        expect(JSON.parse(meterList[0]).properties[0].value).to.be.eql(0);
        expect(JSON.parse(meterList[1]).productKey).to.be.eql("a1CLH9cvgoK");
        expect(JSON.parse(meterList[1]).deviceName).to.be.eql("virtualMeter");
        expect(JSON.parse(meterList[1]).meterSn).to.be.eql("0000000000");
        expect(JSON.parse(meterList[0]).properties[1].identifier).to.be.eql("elecFh");
        expect(JSON.parse(meterList[0]).properties[1].type).to.be.eql("int");
        expect(JSON.parse(meterList[0]).properties[1].value).to.be.eql(0);
    });

    it('private method getAllProperties should return all property list', () => {

        let propertis = configuration._getAllProperties();
        let resList = ['elecPf', 'elecFh', 'elecFr', 'elecFra', 'elecFrb','elecFrc','elecPq','elecPqa',
            'elecPqb','elecPqc','elecCa','elecCb','elecCc','elecUa','elecUb','elecUc','elecAe','elecAef',
            'elecAea','elecAeb','elecAec','elecFef','elecFea','elecFeb','elecFec'];
        expect(propertis).to.be.eql(resList);

    });

    it('getProperty should return correct value string and ignore invalid property', () => {

        let msg = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": ["elecPf", "elecFh", "elecUa"]
        });
        let msg2 = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "virtualMeter",
            "properties": ["elecPf", "elecFh", "elecUa", "invalidProperty"]
        });

        let resmsg = [{ "identifier": "elecPf", "type": "int", "value": 0 },
        { "identifier": "elecFh", "type": "int", "value": 0 },
        { "identifier": "elecUa", "type": "int", "value": 0 }];

        let response = configuration.getProperty(msg);
        let response2 = configuration.getProperty(msg2);
        expect(response).to.be.eql(resmsg);
        expect(response2).to.be.eql(resmsg);

    });

    it('setProperty should set correct value string and ignore invalid property', () => {

        let msg = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": [{ "identifier": "elecPf", "type": "int", "value": 10 },
            { "identifier": "elecFh", "type": "int", "value": 100 },
            { "identifier": "elecUa", "type": "int", "value": 1000 },
            { "identifier": "invalidProperty", "type": "int", "value": 10000 }]
        });
        let msg2 = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": ["elecPf", "elecFh", "elecUa", "invalidProperty"]
        });

        let resmsg = [{ "identifier": "elecPf", "type": "int", "value": 10 },
        { "identifier": "elecFh", "type": "int", "value": 100 },
        { "identifier": "elecUa", "type": "int", "value": 1000 }];

        configuration.setProperty(msg);
        let response = configuration.getProperty(msg2);
        expect(response).to.be.eql(resmsg);

    });

    it('updateProperty should set correct value with meterSn property', () => {

        let msg = JSON.stringify({
            "meterSn": "3411001043",
            "properties": [{ "identifier": "elecPf", "type": "int", "value": 20 },
            { "identifier": "elecFh", "type": "int", "value": 200 },
            { "identifier": "elecUa", "type": "int", "value": 2000 },
            { "identifier": "invalidProperty", "type": "int", "value": 20000 }]
        });
        let msg2 = JSON.stringify({
            "productKey": "a1CLH9cvgoK",
            "deviceName": "tstMeter",
            "properties": ["elecPf", "elecFh", "elecUa", "invalidProperty"]
        });

        let resmsg = [{ "identifier": "elecPf", "type": "int", "value": 20 },
        { "identifier": "elecFh", "type": "int", "value": 200 },
        { "identifier": "elecUa", "type": "int", "value": 2000 }];

        configuration.updateProperty(msg);
        let response = configuration.getProperty(msg2);
        expect(response).to.be.eql(resmsg);

    });

    it('onlineDevice should return all device Key and Name', () => {

        let resmsg = [{ "deviceName": "tstMeter", "productKey": "a1CLH9cvgoK" },
        { "deviceName": "virtualMeter", "productKey": "a1CLH9cvgoK" }];
        let response = configuration.onlineDevice();
        expect(response).to.be.eql(resmsg);
    });


});