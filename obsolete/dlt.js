'use strict'

class Dlt  {
    constructor(sn,driverPort='/dev/ttyS4',updateInterval=3000){
        this._sn=sn;
        this._driverPort=driverPort;
        this._updateInterval=updateInterval;
        this._properties=dltproperties;
    }
    
    get  sn(){
        return this._sn;
    }

    get driverPort(){
        return this._driverPort;
    }

    get updateInterval(){
        return this._updateInterval;
    }

    get properties(){
        return this._properties;
    }

    set properties(items){
        for(let prop in items){
            if(prop in this._properties){
                this._properties[prop]=items[prop];
            }
        }
    }


}

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

module.exports = Dlt;
