function getBit(number, bitPosition) {
    return (number & (1 << bitPosition)) === 0 ? 0 : 1;
}
//add register[0]=register[0]+val
function bitAdd(register,val,index){
    let carry=0;
    for(let i=0;i<=7;i++)
    {
        let bit1=getBit(register[index],i);
        //console.log(bit1);
        let bit2=getBit(val,i);
        //console.log(bit2);
        let sum=bit1^bit2^carry;
        carry=(bit1&bit2)|(bit1^bit2)&carry;
        if(sum==1)
            register[index]=register[index]|(1<<i);
        else{
            register[index]=register[index]&~(1<<i);
            }
    }
    return carry;
}
function setBit(num,pos)
{
    num=num|(1<<pos);
    return num;
}
function clearBit(num,pos)
{
    num=num&~(1<<pos);
    return num;  
}