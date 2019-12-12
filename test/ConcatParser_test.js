/* eslint-disable no-new */

const sinon = require('sinon');
const ConcatParser = require('../lib/ConcatParser');

const sinonChai = require('sinon-chai');
const chai = require('chai');
const expect = chai.expect;
chai.use(sinonChai);


describe('ConcatParser', () => {

    it('should transforms data to strings concated and split with a boundary', () => {
        const parser = new ConcatParser({
            boundary: [0x16],
        });
        const spy = sinon.spy();
        parser.on('data', spy);
        parser.write(Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10]));
        //parser.write(Buffer.from([0x00, 0x11, 0x34, 0x00, 0x68, 0x91, 0x06]));
        parser.write(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        parser.write(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        expect(spy.getCall(0).args[0]).to.be.eql(Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10,
            0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        expect(spy.getCall(1).args[0]).to.be.eql(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        expect(spy.calledTwice).to.be.true;
        // assert.deepEqual(spy.getCall(1).args[0], Buffer.from('Each and Every One'));
        // assert(spy.calledTwice);
    });


    it('should transforms maxBufferSize data if too much data is written', () => {
        const parser = new ConcatParser({
            boundary: [0x16],
            maxBufferSize: 15,
        });
        const spy = sinon.spy();
        parser.on('data', spy);
        parser.write(Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10]));
        parser.write(Buffer.from([0x00, 0x11, 0x34, 0x00, 0x68, 0x91, 0x06]));
        parser.write(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        parser.write(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        expect(spy.getCall(0).args[0]).to.be.eql(Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10,
            0x00, 0x11, 0x34, 0x00, 0x68, 0x91, 0x06, 0x34]));
        expect(spy.getCall(1).args[0]).to.be.eql(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        expect(spy.calledTwice).to.be.true;
    })

    it('should transforms  current data if it takes too much time', () => {
        const parser = new ConcatParser({
            boundary: [0x16],
            interval: 100,
        });
        const spy = sinon.spy();
        parser.on('data', spy);
        parser.write(Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10]));
        parser.write(Buffer.from([0x00, 0x11, 0x34, 0x00, 0x68, 0x91, 0x06]));
        setTimeout(() => {
            parser.write(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
            expect(spy.getCall(0).args[0]).to.be.eql(Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10,
                0x00, 0x11, 0x34, 0x00, 0x68, 0x91, 0x06]));
            expect(spy.getCall(1).args[0]).to.be.eql(Buffer.from([0x34, 0x34, 0x35, 0x49, 0x56, 0x6e, 0x16]));
        }, 200);
    })

})