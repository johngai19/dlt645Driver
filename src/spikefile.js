const repProp={};
console.log(typeof repProp);
const dltData=require('./dltdata');
keys=['elecaUa','elecCaa','elecUab'];
for(i=0;i<keys.length;i++){
    if(dltData.hasOwnProperty(keys[i])){
        repProp[keys[i]]=dltData[keys[i]];
      }
}
console.log(repProp);