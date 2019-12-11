const  Meter=require('./meter');
const meter1=new Meter('123145');
const meter2=new Meter('sassfdsafs');
console.log(meter1.meterSn);
console.log(meter2.meterSn);
console.log(meter1.dltdata);
console.log(meter2.dltdata);
meter1.dltdata={'elecUa':2200,'elecCa':100,'ece':50};
console.log(meter1.dltdata);


