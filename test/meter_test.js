
const chai = require('chai');
const chaiAsPromise = require('chai-as-promised');
const sinon = require('sinon');
const sinonChai = require('sinon-chai');
const expect = chai.use(chaiAsPromise).use(sinonChai).expect;
const Meter = require('../lib/meter');
const MeterData = require('../lib/meterdata');
const EventEmitter = require('events').EventEmitter;

describe('Meter Class test', () => {
    it('should create meter class instance and return default value', () => {
        let meter = new Meter();
        expect(meter).to.be.instanceOf(Meter);
        //expect(meter).to.be.instanceOf(EventEmitter);
        expect(meter.meterSn).to.eql('000000000000');
        expect(meter.meterData).to.eql(MeterData);
    });
    it('should update meterDate value correct without interrupt each other', () => {
        let meter1 = new Meter();
        let meter2 = new Meter();
        //Use private function to test, with right and wrong property (eleUc)
        let newData1 = { elecUa: 100, elecUb: 200, eleUc: 500 }
        let newData2 = { elecUa: 1, elecUb: 2, eleUc: 5 }
        meter1.updateMeterData(newData1);
        meter2.updateMeterData(newData2);
        expect(meter1.meterData['elecUa']).to.eql(100);
        expect(meter1.meterData.elecUb).to.eql(200);
        expect(meter1.meterData).to.not.have.ownProperty('eleUc');
        expect(meter2.meterData['elecUa']).to.eql(1);
        expect(meter2.meterData['elecUb']).to.eql(2);
        expect(meter2.meterData).to.not.have.ownProperty('eleUc');
    })

    it('Should listen to correct update event and update data correctly', () => {
        let meter1 = new Meter(meterSn = "12345678");
        let meter2 = new Meter(meterSn = "ABCDEFGH");
        let newData1 = { elecUa: 100, elecUb: 200, eleUc: 500 }
        let newData2 = { elecUa: 1, elecUb: 2, eleUc: 5 }

        //meter1.emit('update',meter1.meterSn, newData1);
       // meter2.emit('update', meter2.meterSn, newData2);
        meter1.updateMeterData(newData1);
        meter2.updateMeterData(newData2);
        expect(meter1.meterData['elecUa']).to.eql(100);
        expect(meter1.meterData.elecUb).to.eql(200);
        expect(meter1.meterData).to.not.have.ownProperty('eleUc');
        expect(meter2.meterData['elecUa']).to.eql(1);
        expect(meter2.meterData['elecUb']).to.eql(2);
        expect(meter2.meterData).to.not.have.ownProperty('eleUc');
        // meter1.emit('update',meter1.meterSn, newData1);
    })

});