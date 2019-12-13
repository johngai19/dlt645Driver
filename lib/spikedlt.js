const DltDriver=require('./dltdriver');
const Meter=require('./meter');


const meter1 = new Meter('3411001043');
const meter2 = new Meter('3411001043');
const meter3 = new Meter('123456789012');

const meterList1=[];
meterList1.push(meter1);
meterList1.push(meter2);
meterList1.push(meter3);
console.log(meterList1);
const dltdriver=new DltDriver(portPath='ttyS4',updateInt=2000,meterList=meterList1);
console.log(dltdriver._portName);
setTimeout(()=>{
    console.log(meterList1);
},200000)
