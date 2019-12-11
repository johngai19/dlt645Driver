const expect = require('chai').use(require('chai-as-promised')).expect;
const dltParser = require('../src/DltParserPromise');

describe('Encoder Promise test', () => {
    it('should encode correct from cmd to buf', () => {
        const cmd = {
            sn: '3411001043',
            cmd: '11',
            data: {
                status:true,
                propertyName: 'elecUa',
                value:0
            }
        }
        let encodedData = Buffer.from([0xfe, 0xfe, 0xfe, 0xfe, 0x68, 0x43, 0x10, 0x00, 0x11, 0x34,
            0x00, 0x68, 0x11, 0x04, 0x33, 0x34, 0x34, 0x35, 0x4d, 0x16]);
        return expect(dltParser.cmdToBufPromise(cmd)).to.eventually.eql(encodedData);
    });

    it('should reject if cmd of wrong format', () => {
        const cmd =undefined;
        return expect(dltParser.cmdToBufPromise(cmd)).to.be.rejected;
    });
});

describe('Decoder Promise test', () => {
    it('should decode correct from buf to cmd', () => {
        let cmd = {
            sn: '3411001043',
            cmd: '91',
            data: {
                status:true,
                propertyName: 'elecUa',
                value:2297
            }
        }
        let buf= Buffer.from([0xfe ,0xfe ,0xfe ,0xfe ,0x68 ,0x43 ,0x10 ,0x00 ,0x11 ,0x34 ,0x00 ,
            0x68 ,0x91 ,0x06 ,0x33 ,0x34 ,0x34 ,0x35 ,0xca ,0x55 ,0xee ,0x16]);
        return expect(dltParser.bufToCmdPromise(buf)).to.eventually.eql(cmd);
    });

    it('should reject if buf of wrong format', () => {
        const buf =undefined;
        return expect(dltParser.bufToCmdPromise(buf)).to.be.rejected;
    });
});