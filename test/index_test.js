const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.use(chaiAsPromise).use(sinonChai).expect;
const Meter = require('../lib/meter');
const MeterData = require('../lib/meterdata');
const EventEmitter = require('events').EventEmitter;

const index=require('../index');


describe('Index file test', () => {
    it('should return correct callback result', () => {
        let i=1;
        let localHandle=index.handler(undefined,undefined,()=>{return i=i+1})
        expect(i).to.eql(2);
    });

    it('should build connector correct', () => {
        //let Connector=index.Connector;
        let meter=new Meter();
        let Connector=require('../index').Connector;
        let config={
            "productKey": "firstProduct",
            "deviceName": "firstDevice",
            "custom": {
                "meterSn": "firstMeter"
            }}
        let connector=new Connector(config,meter);
        expect(connector).to.be.instanceOf(Connector);
    });
    //TODO finish test of connector, try setproperty function most.
});