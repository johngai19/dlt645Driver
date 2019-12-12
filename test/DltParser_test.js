const expect = require('chai').expect;
const dltParser = require('../lib/DltParser');

describe('Sync Encoder test', () => {
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
        expect(dltParser.cmdToBuf(cmd)).to.eql(encodedData);
    });

    it('should return undefined if cmd of wrong format', () => {
        const cmd =undefined;
        expect(dltParser.cmdToBuf(cmd)).to.eql(undefined);
    });
});

describe('Sync Decoder test', () => {
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
        expect(dltParser.bufToCmd(buf)).to.eql(cmd);
    });

    it('should return error message if buf of wrong format', () => {
        const buf =undefined;
        let cmd={    
                cmd: '',
                data: {
                    status: false,
                    propertyName:'errCode',
                    value: 'TypeError: Cannot read property \'indexOf\' of undefined'
                }
            }
        
        expect(dltParser.bufToCmd(buf)).to.eql(cmd);
    });

    it('should return csCheck error  if cs is incorectt', () => {
        const buf = Buffer.from([0xfe ,0xfe ,0xfe ,0xfe ,0x68 ,0x43 ,0x10 ,0x00 ,0x11 ,0x34 ,0x00 ,
            0x68 ,0xd1 ,0x06 ,0x33 ,0x34 ,0x34 ,0x35 ,0xca ,0x55 ,0xee ,0x16]);
        let cmd={    
                cmd: '',
                data: {
                    status: false,
                    propertyName:'errCode',
                    value: 'csCheck Error'
                }
            }
        
        expect(dltParser.bufToCmd(buf)).to.eql(cmd);
    });

    it('should return d1 error code', () => {
        const buf = Buffer.from([0xfe ,0xfe ,0xfe ,0xfe ,0x68 ,0x43 ,0x10 ,0x00 ,0x11 ,0x34 ,0x00 ,
            0x68 ,0xd1 ,0x01 ,0x31,0x6b ,0x16]);
        let cmd={    
                cmd: 'd1',
                sn: '3411001043',
                data: {
                    status: false,
                    propertyName:'errCode',
                    value: '31'
                }
            }
        
        expect(dltParser.bufToCmd(buf)).to.eql(cmd);
    });
});