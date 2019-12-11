const expect=require('chai').expect;

describe('Project environment test',()=>{
    it('should pass this canary test',()=>{
        expect(true).to.eql(true);
        expect(false).to.eql(false);
    });
});