importScripts('table.js');
importScripts('dfa.js');
importScripts('arithmetic.js');
onmessage=(e)=>{
    try{
        var SP=[0];
        var executionLog="Sucessfully executed";
        var flagRegister=[0,0,0,0,0,0,0,0];
    var register=e.data.register;
    var lines=e.data.code;
    //perform lexical nanalysis of the input
    lex(lines);
    //generate intermediate code 
    var {intermediateCode,PC}=pass1(lines);
    //generate memory map from intermediate code
    var memory=pass2(intermediateCode);
    //console.log(typeof PC);
    //Run the program and get the final PC value
    PC=CPU(memory,e.data.output,flagRegister,register,parseInt(PC,16),SP);
    // console.log(PC);
   // console.log(memory);
   // console.log(e.data.output);
   // console.log(register);
   // console.log(executionLog);
    }
    catch(err)
        {
            var PC=0;
            executionLog=err;
        }
        ////console.log(executionLog);
        self.postMessage({PC:PC,memory:memory,register:register,output:e.data.output,executionLog:executionLog,SP:SP[0]});
}
/*this is a lexical analyses which insures only those instructions are inputted which are present or valid in language, or else it issues an error 
INPUT: lines of the source program 
OUTPUT: nothing if input conforms to rules,or else throws error*/
function lex(lines) {
    for(let i=0;i<lines.length;i++)
    {
        let out=lines[i];    
        let currentState=0;
        if(out.includes(':'))
            out=out.substring(out.indexOf(':')+1);
        for(let j=0;j<out.length;j++)
        {
            let index=getIndex(out[j]);
            //////console.log('index'+index);
            currentState=nextState(currentState,index);
            //////console.log('state:'+currentState);
            if(currentState==-1)
                throw "There is error at line :"+out;
        }
        if(isFinal(currentState)==false)
            throw "There is error at line :"+out;
        if(out.includes("END"))
            break;
    }
}
/*gives the token output, ie the sentence is converted into tokens
input:program sentence [Label :] Instruction [Operand1] [Operand2]
output: label,instruction,opernd1,operand2*/
function tokenizer(out)
{
    if(out.length>0 && out!=""){
        
    var label="",instruction="",operand1="",operand2="";
    let back=0;let fwd=0;
    if(out.includes(':')) //process label if present
    {
        while(out[fwd]==" "||out[fwd]=='\t') //ignore blanks before laber
        {
            back=++fwd;
        }
        while(out[fwd]!=" " && out[fwd]!=":" && out[fwd]!='\t')  //extract label 
        {
            ++fwd;
        }
        label=out.substring(back,fwd);
    }
    //extract remaining input
        while(out[fwd]==" "||out[fwd]==":"||out[fwd]=='\t') //ignore blanks until instrction
        {
            fwd++;
            back=fwd;
        }
        while((out[fwd]!=" "&& out[fwd]!='\t') && fwd!=out.length) //extract instruction
        {
            fwd++;
        }
        instruction=out.substring(back,fwd);
        back=fwd;
        while(fwd!=out.length && (out[fwd]==" "|| out[fwd]=='\t')) //ignore blanks
        {
            fwd++;
            back=fwd;
        }
        while(fwd!=out.length && (out[fwd]!=" "&&out[fwd]!="\n" && out[fwd]!="," && out[fwd]!='\t'))//extract operand 1, could be the only one also
        {
            fwd++;
        }
        operand1=out.substring(back,fwd);
        back=fwd;
        while(fwd!=out.length && (out[fwd]==" "||out[fwd]==","||out[fwd]=='\t')) //ignore spaces and blanks
        {
            fwd++;
            back=fwd;
        }
        while(fwd!=out.length && (out[fwd]!=" "&&out[fwd]!="\n" && out[fwd]!='\t')) //extract the operand 2
        {
            fwd++;
        }
        operand2=out.substring(back,fwd);
        
        return {
            label,instruction,operand1,operand2
        };
    }
}
var symbolTable=new Map([]);
/*this is used to get intermediate code representation and the generate the symbol table for labels
input: complete raw input
output:intermediate code representation in object form to pass to the 2nd pass*/
function pass1(lines)
{
    var LC=0,PC=0;
    var intermediateCode=[];
    //do input validation using DFA later.------------------------
    for(let i=0;i<lines.length;i++)
    {
        var out=lines[i];
        let size;
        let{label,instruction,operand1,operand2}=tokenizer(out);
        ////console.log(label+"-"+instruction+"-"+operand1+"-"+operand2);
        if(instruction=="ORG")
        {
            LC=parseInt(operand1,16);
            continue
        }
        if(instruction=="DB")
        {
            intermediateCode.push({
                LC:LC,
                instruction:instruction,
                operand1:operand1,
                operand2:operand2
            });    
            LC++;
            continue;
        }
        if(instruction=="END")
        {
            PC=operand1;
            break;
        }
        if(label!="")
        {   let hex=LC.toString(16);  //make lable 16 bits
            while(hex.length<4)
            {
                hex="0"+hex;
            }
            symbolTable.set(label,hex);
        }
        if(instruction[0]=='J')  //handle jump instruction
        {
            size=getSize(instruction);
        }
        else {
            size=getSize(instruction+((operand1.length!=2 && operand1.length!=4)?operand1:"")+((operand2.length!=2)?operand2:""));
        }
        if(LC-1+size>65535)
            throw "PC going out of memory";
        intermediateCode.push({
            LC:LC,
            instruction:instruction,
            operand1:operand1,
            operand2:operand2,
            size:size
        });
        LC+=size;
    }
    ////console.log(intermediateCode);
    return {intermediateCode,PC};
}
/*
This handles references to DB and produces the memory containing the instructions
Input: intermediate code
Output: Memory array containing the hex codes,
The LC is in integer values while the other values are in Hexadecimal format
*/
function pass2(intermediateCode)
{
    var memory=new Array(65536);   //declare memory map
    for(let i=0;i<intermediateCode.length;i++)
    {
        let currentRec=intermediateCode[i];
        //////console.log(currentRec.size);
        if(currentRec.instruction=="DB")   //handle db
        {
            memory[currentRec.LC]=currentRec.operand1;
            continue;
        }
        if(currentRec.size==1)    //1 byte instructions
        {
            memory[currentRec.LC]=getHexcode(currentRec.instruction+currentRec.operand1+currentRec.operand2);
            continue;
        }
        if(currentRec.size==2)    //2 byte instructions
        {
            memory[currentRec.LC]=getHexcode(currentRec.instruction);
            memory[currentRec.LC+1]=currentRec.operand1;
            continue;
        }
        if(currentRec.size==3)     //3 byte nstructions
        {
            let operand;
            if(currentRec.instruction[0]=='J')   //Jump statements
            {   

                if(symbolTable.has(currentRec.operand1)==true)
                    operand=symbolTable.get(currentRec.operand1);
                else
                    throw "No label called :"+currentRec.operand1+" exists";
            }
            else{
                operand=currentRec.operand1;    //for EXI statement
            }
            memory[currentRec.LC]=getHexcode(currentRec.instruction);
            memory[currentRec.LC+1]=operand[2]+operand[3]; //low order bits first
            memory[currentRec.LC+2]=operand[0]+operand[1]; //high order bits 
            continue;
        }
    }
    ////console.log(memory);
    return memory;
}
function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
      currentDate = Date.now();
    } while (currentDate - date < milliseconds);
  }
/*This mimimcs the CPU operation of a computer 
Input:Memory array
Output:Memeory array with the changes along with registers and output
*/

function CPU(memory,output,flagRegister,register,PC,SP)
{
    let i=0;
    while(i<10000000)
    {
        let instructionRegister=memory[PC];
        i++;
        let registerIndex;
        
        postMessage({PC:PC,memory:memory,register:register,output:output,executionLog:"Executing",SP:SP[0]}) 
        sleep(300);
        ////console.log(PC);
        if(instructionRegister>=0xA1 && instructionRegister<=0xA5)    //MOV A
        {
            registerIndex=instructionRegister-0xA0;
            register[0]=register[registerIndex];   //Move into A contents of register A,B,C,D,E,F
            PC++;
            continue;  
        } 
        if(instructionRegister>=0xA6 && instructionRegister<=0xAB)    //MOV B
        {
            registerIndex=instructionRegister-0xA6;
            register[1]=register[registerIndex];   //Move into B contents of register A,B,C,D,E,F
            PC++;
            continue;  
        }
        if(instructionRegister>=0xAC && instructionRegister<=0xB1)     //MOV C
        {
            registerIndex=instructionRegister-0xAC;
            register[2]=register[registerIndex];   //Move into C contents of register A,B,C,D,E,F
            PC++;
            continue;  
        }
        if(instructionRegister>=0xB2 && instructionRegister<=0xB7)     //MOV D
        {
            registerIndex=instructionRegister-0xB2;
            register[3]=register[registerIndex];   //Move into D contents of register A,B,C,D,E,F
            PC++;
            continue;  
        }
        if(instructionRegister>=0xB8 && instructionRegister<=0xBD)     //MOV E
        {
            registerIndex=instructionRegister-0xB8;
            register[4]=register[registerIndex];   //Move into E contents of register A,B,C,D,E,F
            PC++;
            continue;  
        }
        if(instructionRegister>=0xBE && instructionRegister<=0xC2)     //MOV F
        {
            registerIndex=instructionRegister-0xBE;
            register[5]=register[registerIndex];   //Move into F contents of register A,B,C,D,E,F
            PC++;
            continue;  
        }
        if(instructionRegister>=0x34 && instructionRegister<=0x39)     //ADD A/B/C/D/E/F
        {
            let registerIndex=instructionRegister-0x34;
            let carry=bitAdd(register,register[registerIndex],0);
            if(carry==1)  //carry flag
            {
                flagRegister[7]=1;
            }
            else{
                flagRegister[7]=0;
            }
            if(register[0]==0)  //zero flag
            {
                flagRegister[0]=1;
            }
            else{
                flagRegister[0]=0;
            }
            PC++;
            continue;  
        }
        if(instructionRegister>=0x40 && instructionRegister<=0x45)  //SUB
        {
            let registerIndex=instructionRegister-0x40;
            let carry=bitAdd(register,(~register[registerIndex]&255)+1,0);
            if(carry==1)  //carry flag
            {
                flagRegister[7]=0;
            }
            else{
                flagRegister[7]=1;
            }
            if(register[0]==0)  //zero flag
            {
                flagRegister[0]=1;
            }
            else{
                flagRegister[0]=0;
            }

            PC++;
            continue;
        }
        if(instructionRegister>=0x50 && instructionRegister<=0x55)  //INR
        {
            let registerIndex=instructionRegister-0x50;
            let carry=bitAdd(register,1,registerIndex);
            if(carry==1)  //carry flag
            {
                flagRegister[7]=1;
            }
            else{
                flagRegister[7]=0;
            }
            if(register[registerIndex]==0)  //zero flag
            {
                flagRegister[0]=1;
            }
            else{
                flagRegister[0]=0;
            }
            if(register[registerIndex]==0)
                register[registerIndex]=65535;
            PC++;
            continue;           
        }
        if(instructionRegister>=0x56 && instructionRegister<=0x5B)  //DCR
        {
            let registerIndex=instructionRegister-0x56;
            let carry=bitAdd(register,(~1&255)+1,registerIndex);       //Subtract wth 1;
            if(carry==1)  //carry flag
            {
                flagRegister[7]=0;
            }
            else{
                flagRegister[7]=1;
            }
            if(register[registerIndex]==0)  //zero flag
            {
                flagRegister[0]=1;
            }
            else{
                flagRegister[0]=0;
            }
            if(register[registerIndex]==65535)
                register[registerIndex]=0;
            PC++;
            continue;           
        }
        if(instructionRegister>=0x5C && instructionRegister<=0x61)  //AND 
        {
            let registerIndex=instructionRegister-0x5C;
            register[0]=register[0]&register[registerIndex];
            flagRegister[7]=0;//carry
            if(register[0]==0)
            {
                flagRegister[0]=0
            }
            else{
                flagRegister[0]=1;
            }
            PC++;
            continue;
        }
        if(instructionRegister>=0x62 && instructionRegister<=0x67)  //OR
        {
            let registerIndex=instructionRegister-0x62;
            register[0]=register[0]|register[registerIndex];
            flagRegister[7]=0;//carry
            if(register[0]==0)
            {
                flagRegister[0]=0
            }
            else{
                flagRegister[0]=1;
            }
            PC++;
            continue;
        }
        if(instructionRegister>=0x70 && instructionRegister<=0x75)  //XOR
        {
            let registerIndex=instructionRegister-0x70;
            register[0]=register[0]^register[registerIndex];
            flagRegister[7]=0;//carry
            if(register[0]==0)
            {
                flagRegister[0]=0
            }
            else{
                flagRegister[0]=1;
            }
            PC++;
            continue;
        }
        if(instructionRegister>=0x76 && instructionRegister<=0x7B)  //CMP
        {
            let registerIndex=instructionRegister-0x76;
            let temp=[register[0]]
            let carry=bitAdd(temp,(~register[registerIndex]&255)+1,0);
            if(carry==1)  //carry flag
            {
                flagRegister[7]=0;
            }
            else{
                flagRegister[7]=1;
            }
            if(register[0]==0)  //zero flag
            {
                flagRegister[0]=1;
            }
            else{
                flagRegister[0]=0;
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x32)   //INX
        {
            let carry=bitAdd(register,1,5); //change f low bits
            carry=bitAdd(register,carry,4); //change e high bits
            PC++;  
            continue;
               
        }
        if(instructionRegister==0x33)   //DCX
        {
            let carry=bitAdd(register,0xff,5);
            carry=bitAdd(register,0xff+carry,4);
            PC++;
            continue;
        }
        if(instructionRegister==0x30)   //MVS
        {
            let lb=register[5].toString(16);
            let ub=register[4].toString(16);
            while(lb.length!=2)
            {
                lb="0"+lb;
            }
            while(ub.length!=2)
            {
                ub="0"+ub;
            }
            let location=parseInt(ub+lb,16);
            let val=register[0].toString(16);
            while(val.length!=2)
            {
                val="0"+val;
            }
            memory[location]=val;
            PC++;
            continue;
        }
        if(instructionRegister==0x31)   //LVS
        {
            let lb=register[5].toString(16);
            let ub=register[4].toString(16);
            while(lb.length!=2)
            {
                lb="0"+lb;
            }
            while(ub.length!=2)
            {
                ub="0"+ub;
            }
            let location=parseInt(ub+lb,16);
            register[0]=parseInt(memory[location],16);
            if(Number.isFinite(register[0])==false)
            {
                register[0]=0;
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x6B)   //RAL
        {
            let carry=flagRegister[7];
            register[0]=register[0]<<1;
            if(carry==1)
                register[0]=setBit(register[0],0);
            else{
                register[0]=clearBit(register[0],0);
            }
            carry=(register[0]&256)==0?0:1;
            register[0]&=255;
            flagRegister[7]=carry;
            if(register[0]==0)
                flagRegister[0]=1;
            else{
                flagRegister[0]=0;
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x6C)   //RLC
        {
            let carry=flagRegister[7];
            register[0]=register[0]<<1;
            if((register[0]&256)!=0)
                register[0]=setBit(register[0],0);
            else{
                register[0]=clearBit(register[0],0);
            }
            carry=(register[0]&256)==0?0:1;
            register[0]&=255;
            flagRegister[7]=carry;
            if(register[0]==0)
                flagRegister[0]=1;
            else{
                flagRegister[0]=0;
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x6D)   //RRC
        {
            let carry;
            let lastNum=register[0]&1;
            register[0]=register[0]>>1;
            if(lastNum!=0)
                register[0]=setBit(register[0],7);
            else{
                register[0]=clearBit(register[0],7);
            }
            carry=lastNum==0?0:1;
            register[0]&=255;
            flagRegister[7]=carry;
            if(register[0]==0)
                flagRegister[0]=1;
            else{
                flagRegister[0]=0;
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x6E)   //RAR
        {
            let carry=flagRegister[7];
            let lastNum=register[0]&1;
            register[0]=register[0]>>1;
            if(carry!=0)
                register[0]=setBit(register[0],7);
            else{
                register[0]=clearBit(register[0],7);
            }
            carry=lastNum==0?0:1;
            register[0]&=255;
            flagRegister[7]=carry;
            if(register[0]==0)
                flagRegister[0]=1;
            else{
                flagRegister[0]=0;
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x80) //CMA
        {
            register[0]=(~register[0])&255;
            PC++;
            continue;
        }
        if(instructionRegister==0x81)   //STC
        {
            flagRegister[7]=1;
            PC++;
            continue;
        }
        if(instructionRegister==0x82)   //CMC
        {
            flagRegister[7]=0;
            PC++;
            continue;
        }
        if(instructionRegister==0x83)   //HLT
        {

            break;
        }
        //2 BYTE Instructions
        if(instructionRegister==0x84) //MOVI
        {
            ++PC;
            register[0]=parseInt(memory[PC],16);
            PC++;
            continue;
        }
        if(instructionRegister==0x85) //ADDI
        {
            ++PC;
            flagRegister[7]=bitAdd(register,parseInt(memory[PC],16),0);
            if(register[0]==0)
            {
                flagRegister[0]=1;
            }
            else
                flagRegister[0]=0;
            PC++;
            continue;
        }
        if(instructionRegister==0x86) //SUB!
        {
            ++PC;
            let num=parseInt(memory[PC],16);
            flagRegister[7]=bitAdd(register,(~num+1)&255,0);
            flagRegister[7]=(~flagRegister[7])&1;
            PC++;
            continue;
        }
        if(instructionRegister==0x87)   //ANDI
        {
            ++PC;
            register[0]=register[0]&parseInt(memory[PC],16);
            flagRegister[7]=0;
            flagRegister[0]=(register[0]==0)?1:0;
            PC++;
            continue;
        }
        if(instructionRegister==0x88)   //ORI
        {
            ++PC;
            register[0]=register[0]|parseInt(memory[PC],16);
            flagRegister[7]=0;
            flagRegister[0]=(register[0]==0)?1:0;
            PC++;
            continue;
        }
        if(instructionRegister==0x8A)   //XORI
        {
            ++PC;
            register[0]=register[0]^parseInt(memory[PC],16);
            flagRegister[7]=0;
            flagRegister[0]=(register[0]==0)?1:0;
            PC++;
            continue;
        }
        if(instructionRegister==0x89)   //CMPI
        {
            ++PC;
            var temp=[register[0]];
            let num=parseInt(memory[PC],16);
            flagRegister[7]=bitAdd(temp,(~num&255)+1,0);
            flagRegister[7]=~flagRegister[7]&1;
            flagRegister[0]=(temp[0]==0)?1:0;
            PC++;
            continue;
        }
        //3 byte intructions
        if(instructionRegister==0x90)   //JMP
        {
            let lb=memory[++PC];
            let ub=memory[++PC];
            PC=parseInt(ub+lb,16);
            continue;
        }
        if(instructionRegister==0x91||instructionRegister==0x92)   //JNZ/JZ
        {
            if(flagRegister[0]!=instructionRegister-0x91)
            {
                let lb=memory[++PC];
                let ub=memory[++PC];
                PC=parseInt(ub+lb,16);
            }
            else{
                PC=PC+3;
            }
            continue;
        }
        if(instructionRegister==0x93||instructionRegister==0x94)   //JC/JNC
        {
            if(flagRegister[7]!=instructionRegister-0x93)
            {
                let lb=memory[++PC];
                let ub=memory[++PC];
                PC=parseInt(ub+lb,16);
            }
            else{
                PC+=3;
            }
            continue;
        }
        //EXI
        if(instructionRegister==0x95)
        {
            register[5]=parseInt(memory[++PC],16);  //F lower byte
            register[4]=parseInt(memory[++PC],16);  //E upper byte
            ++PC;
            continue;
        }
        if(instructionRegister==0x0A)   //IN
        {
            let loc =memory[++PC];
            let num=output[parseInt(loc,16)];
            num=parseInt(num,16);
            if(num>=0 && num<=255)
            {
                register[0]=num;
            }
            else{
                throw "the input address at "+memory[PC]+" is not valid";
            }
            PC++;
            continue;
        }
        if(instructionRegister==0x0B)   //DC
        {
            let loc =memory[++PC];
            let num=register[0].toString(16);
            while(num.length!=2)
            {
                num="0"+num;
            }
            output[parseInt(loc,16)]=num;
            PC++;
            continue;
        }
        if(instructionRegister==0xD0)   //SPI
        {
            let lb=memory[++PC];
            let ub=memory[++PC];
            SP[0]=parseInt(ub+lb,16);
         
            ++PC;
            continue;
        }
        if(instructionRegister>=0xD1 && instructionRegister<=0xD6)      //PUSH
        {
            if(SP[0]<=0)
                throw "Stack addressing negative memory address";
            if(SP[0]>=65536)
                throw "Stack address out of 2^16";
            let index=instructionRegister-0xD1;
            let data=register[index].toString(16);
            while(data.length!=2)
            {
                data="0"+data;
            }    
            memory[--SP[0]]=data;
            PC++;
            continue;
        }
        if(instructionRegister>=0xD7 && instructionRegister<=0xDC)      //POP
        {
            if(SP[0]<0)
                throw "Stack addressing negative memory address";
            if(SP[0]>=65535)
                throw "Stack address out of 2^16";
            let registerIndex=instructionRegister-0xD7;
            register[registerIndex]=(memory[SP[0]]==undefined)?0:parseInt(memory[SP[0]],16);
            memory[SP[0]]=undefined;
            ++SP[0];
            PC++;
            continue;
        }
        throw "Invalid program counter value :"+PC;
    }
    if(i==10000000)
        throw "Infinte loop detected";
    return PC;
}