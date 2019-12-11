

class test1{
    constructor(str1,obj1){
        this._str=str1.slice();
        this._obj=obj1;
    }

    get str(){
        return this._str;
    }
    set str(strs){
        this._str=strs;
    }

    get obj(){
        return this._obj;
    }

    set obj(obj){
        this._obj=obj;
    }
}
let ob1={'a':1,'e':{'b':2,'c':'3'},'d':4};
let ob2={'a':10,'e':{'b':20,'c':'30'}};
let ob3={'a':100,'e':{'b':200,'c':'300'}};
let ob4={'a':1000,'e':{'b':2000,'c':'3000'}};
let ob5={'a':'10','e':{'b':20,'c':30}};

let mys=new test1('aaa',ob1);
let mys2=new test1('bbb',ob2);

console.log('mys:',mys);
console.log('mys.str:',mys.str);
console.log('mys2:',mys2);
console.log('mys2.str:',mys2.str);

mys.str='1111111111';
mys2.str='aasdfadsgf';
mys.obj=Object.assign({},ob3);
mys2.obj=ob3;
console.log('mys:',mys);
console.log('mys2:',mys2);
console.log('mys.str:',mys.str);
console.log('mys2.str:',mys2.str);
ob3=ob4;
console.log('ob3:',ob3);
console.log('ob4:',ob4);
ob4.e.b=1000;
ob4.e.c=1000;
ob4.a=555;
console.log('ob3:',ob3);

console.log('mys:',mys);
console.log('mys2:',mys2);
ob3=Object.assign({},ob5);
console.log('ob3:',ob3);
console.log('ob5:',ob5);
ob5.e.b=1000;
ob5.e.c=1000;
ob5.a='555';


console.log('ob3:',ob3);
console.log('ob5:',ob5);
ob5={};
console.log('ob3:',ob3);
console.log('ob5:',ob5);


console.log('mys:',mys);
console.log('mys2:',mys2);

const myss1='111';
let myss2=myss1;
console.log(myss2);
const myss3='222';
myss2=myss3;
console.log(myss2);
console.log(myss3.replace('2','a'));
console.log(myss3);
console.log(myss2);


