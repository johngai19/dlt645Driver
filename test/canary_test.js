
const chai=require('chai');
const chaiAsPromise=require('chai-as-promised');
const sinon=require('sinon');
const Event=require('events').EventEmitter;
const sinonChai = require('sinon-chai');
const expect=chai.use(chaiAsPromise).use(sinonChai).expect;

describe('Test environment test',()=>{
    it('should pass the chai test',()=>{
        expect(true).to.eql(true);
        expect(false).to.eql(false);
    });

    it('should resolve chai promise test with true',()=>{
        let chaiPromise=((state)=>{
            return new Promise((resolve,reject)=>{
                if(state) return resolve(state);
                return reject(state);
            })
        });
        return expect(chaiPromise(true)).to.eventually.eql(true);
    });

    it('should reject chai promise test with false',()=>{
        let chaiPromise=((state)=>{
            return new Promise((resolve,reject)=>{
                if(state) return resolve(state);
                return reject(state);
            })
        });
        return expect(chaiPromise(false)).to.be.rejectedWith(false);
    });

    it('should use sinon spy to test event emitter',()=>{
        let spy=sinon.spy();
        let event=new Event;
        event.on('foo',spy);
        event.emit('foo','bar');
        event.emit('foo','bar2','bar3');
        
        expect(spy.getCall(0).args[0]).to.be.eql('bar');
        expect(spy.getCall(1).args[0]).to.be.eql('bar2');
        expect(spy.getCall(1).args[1]).to.be.eql('bar3');
        expect(spy.calledTwice).to.be.true;
    })  
    
});