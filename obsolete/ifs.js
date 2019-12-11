// const cluster=require('cluster');
// const Meter=require('./Meter');

const DltDriver=require('./dltdriver');
// //const dltclient=require('./dltClient');
// //const dltclient2=require('./dltClient2');
// const client1=new Meter('aaaaa',100);
// const client2=new Meter('bbbbb',1000);

DltMeter=require('./dltmeter');

const dltDriver=new DltDriver();
const client1=new DltMeter('12314543');
const client2=new DltMeter('12456789');
const client3=new DltMeter('3411001043');
// setInterval(() => {
//     console.log(client1.meterSn);
//     console.log(client1.dltProperties);
//     console.log(client2.meterSn);
//     console.log(client2.dltProperties);
    
// }, 2000);