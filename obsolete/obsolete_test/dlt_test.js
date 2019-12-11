'use strict'

const expect=require('chai').expect;

describe('Dlt class test',()=>{

    let Dlt=require('../src/dlt');
    let dlt=new Dlt('01020304','/dev/ttyS4',3000);
    
    it('should build a Dlt object',()=>{
        // Dlt.properties.eleFr=50;
        expect(dlt).to.be.instanceOf(Dlt);
        expect(dlt._sn).to.be.eql('01020304');
        expect(dlt.driverPort).to.be.eql('/dev/ttyS4');
        expect(dlt.updateInterval).to.be.eql(3000);
    });

    it('should get default dltpropeties from dlt',()=>{
        let properties=dlt.properties;
        expect(properties).to.be.eql(dltproperties);
    });

    it('should set and get dlt property right',()=>{
        let writePropeties={
            elecFh: 1,
            elecFr: 2,
            elecFra: 3,
            elecFrb: 4,
            elecFrc: 5,
        }
        dlt.properties=writePropeties;
        expect(dlt.properties.elecFh).to.be.eql(1);
        expect(dlt.properties.elecFrb).to.be.eql(4);
        expect(dlt.properties.elecCa).to.be.eql(0);
    });

    
});

let dltproperties= {
    elecFh: 0,
    elecFr: 0,
    elecFra: 0,
    elecFrb: 0,
    elecFrc: 0,
    elecPf: 0,
    elecPq: 0,
    elecPqa: 0,
    elecPqb: 0,
    elecPqc: 0,
    elecCa: 0,
    elecCb: 0,
    elecCc: 0,
    elecUa: 0,
    elecUb: 0,
    elecUc: 0,
    elecAe: 0,
    elecAef: 0,
    elecAea: 0,
    elecAeb: 0,
    elecAec: 0,
    elecFef: 0,
    elecFea: 0,
    elecFeb: 0,
    elecFec: 0,
}