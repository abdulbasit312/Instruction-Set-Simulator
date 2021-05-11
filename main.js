var myWorker;
myWorker=new Worker('webwork.js');
myWorker.postMessage({name:"Abdul Basit",
                    arr:[1,2,3,4]});
myWorker.onmessage=(d)=>{
    console.log(d.data);
};
