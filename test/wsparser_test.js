'use strict';

const expect = require('chai').expect;
const sinon = require('sinon');
const wsParser = require('../src/wsParser');
const Configuration = require('../src/configuration');

describe('wsParser tests', () => {

    let sandbox;
    beforeEach(() => {
        sandbox = sinon.createSandbox();

    })
    afterEach(() => {
        sandbox.restore();
    })

    it('should register device online', (done) => {
        let messageStr = JSON.stringify({
            "method": "onlineDevice"
        });
        let stubMsg = [{ "deviceName": "tstMeter", "productKey": "a1CLH9cvgoK" },
        { "deviceName": "virtualMeter", "productKey": "a1CLH9cvgoK" }]
        let resmsg = [{
            version: '1.0',
            method: 'onlineDevice',
            messageId: 1,
            payload: { deviceName: 'tstMeter', productKey: 'a1CLH9cvgoK' }
        },
        {
            version: '1.0',
            method: 'onlineDevice',
            messageId: 1,
            payload: { productKey: 'a1CLH9cvgoK', deviceName: 'virtualMeter' }
        }];
        // 
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        stubConfig.onlineDevice = sandbox.stub().returns(stubMsg);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        wsParser(messageStr, stubConfig, cb);
    });
    it('should register device offline', (done) => {
        let messageStr = JSON.stringify({
            "method": "offlineDevice"
        });
        let stubMsg = [{ "deviceName": "tstMeter", "productKey": "a1CLH9cvgoK" },
        { "deviceName": "virtualMeter", "productKey": "a1CLH9cvgoK" }]
        let resmsg = [{
            version: '1.0',
            method: 'offlineDevice',
            messageId: 2,
            payload: { deviceName: 'tstMeter', productKey: 'a1CLH9cvgoK' }
        },
        {
            version: '1.0',
            method: 'offlineDevice',
            messageId: 2,
            payload: { productKey: 'a1CLH9cvgoK', deviceName: 'virtualMeter' }
        }];
        // const path=require('path');
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        stubConfig.onlineDevice = sandbox.stub().returns(stubMsg);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        wsParser(messageStr, stubConfig, cb);
    });
    it('should report all devices with all properties', (done) => {
        let messageStr = JSON.stringify({
            "method": "reportProperty"
        });
        let stubMsg = [{
            "deviceName": "tstMeter",
            "productKey": "a1CLH9cvgoK",
            "properties": [{ "identifier": "elecPf", "type": "int", "value": 10 },
            { "identifier": "elecFh", "type": "int", "value": 100 },
            { "identifier": "elecFr", "type": "int", "value": 1000 },
            { "identifier": "elecFra", "type": "int", "value": 10000 }]
        },
        {
            "deviceName": "virtualMeter",
            "productKey": "a1CLH9cvgoK",
            "properties": [{ "identifier": "elecPf", "type": "int", "value": 20 },
            { "identifier": "elecFh", "type": "int", "value": 200 },
            { "identifier": "elecFr", "type": "int", "value": 2000 },
            { "identifier": "elecFra", "type": "int", "value": 20000 }]
        }];

        let resmsg = [{
            version: '1.0',
            method: 'reportProperty',
            messageId: 0,
            payload: stubMsg[0]
        },
        {
            version: '1.0',
            method: 'reportProperty',
            messageId: 0,
            payload: stubMsg[1]
        }];
        // const path = require('path');
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        stubConfig.reportProperty = sandbox.stub().returns(stubMsg);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        // wsParser(messageStr, configuration, cb);
        wsParser(messageStr, stubConfig, cb);
    });
    it('should report specific properties when receive getProperty command', (done) => {
        let messageStr = JSON.stringify({
            "version": "1.0",
            "method": "getProperty",
            "messageId": 3,
            "payload": {
                "productKey": "a1CLH9cvgoK",
                "deviceName": "tstMeter",
                "properties": ["elecPf", "elecFh","elecFr","elecFra"]
            }
        });
        let stubMsg = [{"identifier":"elecPf","type":"int","value":0},
        {"identifier":"elecFh","type":"int","value":0},
        {"identifier":"elecFr","type":"int","value":0},
        {"identifier":"elecFra","type":"int","value":0}];

        let resmsg = {
            "code":0,
            "messageId":3,
            "payload":{
                "properties":[{"identifier":"elecPf","type":"int","value":0},
                {"identifier":"elecFh","type":"int","value":0},
                {"identifier":"elecFr","type":"int","value":0},
                {"identifier":"elecFra","type":"int","value":0}]
            }
        };
        // const path = require('path');
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        stubConfig.getProperty = sandbox.stub().returns(stubMsg);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        // wsParser(messageStr, configuration, cb);
        wsParser(messageStr, stubConfig, cb);
    });
    it('should return specific object if it is just Success response', (done) => {
        let messageStr = JSON.stringify({
            "code": 0,
            "messageId": 1,
            "message": "Success",
            "payload": { }
        });

        let resmsg = {
              "code": 100000,
              "message": "Unrecognized method.",
            };
        // const path = require('path');
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        // wsParser(messageStr, configuration, cb);
        wsParser(messageStr, stubConfig, cb);
    });
    it('should return error message if wrong message is received', (done) => {
        let messageStr = JSON.stringify({
            "code": 0,
            "messageId": 2,
            "method": "reportEvent",
            "payload": {}
        });

        let resmsg = { 
            "code":100000,
            "message":"Unrecognized method."
        };
        // const path = require('path');
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        // wsParser(messageStr, configuration, cb);
        wsParser(messageStr, stubConfig, cb);
    });
    it('should return readonly message if setproperty is received', (done) => {
        let messageStr = JSON.stringify({
            "version": '1.0',
            "messageId": 2,
            "method": "setProperty",
            "payload": {}
        });

        let resmsg = { 
            "code":109003,
            "message":"failure, property readonly."
        };
        // const path = require('path');
        // const configFile = path.join(__dirname, 'testconfig.json');
        // const modelFile = path.join(__dirname, 'testmodel.json');
        // const configuration = new Configuration(configFile, modelFile);
        const stubConfig = sandbox.createStubInstance(Configuration);
        let cb = (msg) => {
            expect(msg).to.be.eql(resmsg);
            done();
        }
        // wsParser(messageStr, configuration, cb);
        wsParser(messageStr, stubConfig, cb);
    });
});