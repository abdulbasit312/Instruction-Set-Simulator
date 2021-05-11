onmessage=(e)=>{
    console.log(e.data.name);
    console.log(e.data.arr[1]);
    postMessage([1,2,3,4,5,5,6]);
}