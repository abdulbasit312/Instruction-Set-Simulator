let InstructionTable=new Map([
    ['MOVAB',{size:1,hex:0xA1}],
    ['MOVAC',{size:1,hex:0xA2}],
    ['MOVAD',{size:1,hex:0xA3}],
    ['MOVAE',{size:1,hex:0xA4}],
    ['MOVAF',{size:1,hex:0xA5}],
    ['MOVBA',{size:1,hex:0xA6}],
    ['MOVBC',{size:1,hex:0xA8}],
    ['MOVBD',{size:1,hex:0xA9}],
    ['MOVBE',{size:1,hex:0xAA}],
    ['MOVBF',{size:1,hex:0xAB}],
    ['MOVCA',{size:1,hex:0xAC}],
    ['MOVCB',{size:1,hex:0xAD}],
    ['MOVCD',{size:1,hex:0xAF}],
    ['MOVCE',{size:1,hex:0xB0}],
    ['MOVCF',{size:1,hex:0xB1}],
    ['MOVDA',{size:1,hex:0xB2}],
    ['MOVDB',{size:1,hex:0xB3}],
    ['MOVDC',{size:1,hex:0xB4}],
    ['MOVDE',{size:1,hex:0xB6}],
    ['MOVDF',{size:1,hex:0xB7}],
    ['MOVEA',{size:1,hex:0xB8}],
    ['MOVEB',{size:1,hex:0xB9}],
    ['MOVEC',{size:1,hex:0xBA}],
    ['MOVED',{size:1,hex:0xBB}],
    ['MOVEF',{size:1,hex:0xBD}],
    ['MOVFA',{size:1,hex:0xBE}],
    ['MOVFB',{size:1,hex:0xBF}],
    ['MOVFC',{size:1,hex:0xC0}],
    ['MOVFD',{size:1,hex:0xC1}],
    ['MOVFE',{size:1,hex:0xC2}],
    ['MVS',{size:1,hex:0x30}],
    ['LVS',{size:1,hex:0x31}],
    ['INX',{size:1,hex:0x32}],
    ['DCX',{size:1,hex:0x33}] ,
    ['ADDA',{size:1,hex:0x34}],
    ['ADDB',{size:1,hex:0x35}],
    ['ADDC',{size:1,hex:0x36}],
    ['ADDD',{size:1,hex:0x37}],
    ['ADDE',{size:1,hex:0x38}],
    ['ADDF',{size:1,hex:0x39}],
    ['SUBA',{size:1,hex:0x40}],
    ['SUBB',{size:1,hex:0x41}],
    ['SUBC',{size:1,hex:0x42}],
    ['SUBD',{size:1,hex:0x43}],
    ['SUBE',{size:1,hex:0x44}],
    ['SUBF',{size:1,hex:0x45}],
//---INCREMENT--
    ['INRA',{size:1,hex:0x50}],
    ['INRB',{size:1,hex:0x51}],
    ['INRC',{size:1,hex:0x52}],
    ['INRD',{size:1,hex:0x53}],
    ['INRE',{size:1,hex:0x54}],
    ['INRF',{size:1,hex:0x55}],
//--DECREMENT--
    ['DCRA',{size:1,hex:0x56}],
    ['DCRB',{size:1,hex:0x57}],
    ['DCRC',{size:1,hex:0x58}],
    ['DCRD',{size:1,hex:0x59}],
    ['DCRE',{size:1,hex:0x5A}],
    ['DCRF',{size:1,hex:0x5B}],
//--AND OR COMAPRE XOR ROTATE COMAPRE---
    ['ANDA',{size:1,hex:0x5C}],
    ['ANDB',{size:1,hex:0x5D}],
    ['ANDC',{size:1,hex:0x5E}],
    ['ANDD',{size:1,hex:0x5F}],
    ['ANDE',{size:1,hex:0x60}],
    ['ANDF',{size:1,hex:0x61}],
    ['ORA',{size:1,hex:0x62}],
    ['ORB',{size:1,hex:0x63}],
    ['ORC',{size:1,hex:0x64}],
    ['ORD',{size:1,hex:0x65}],
    ['ORE',{size:1,hex:0x66}],
    ['ORF',{size:1,hex:0x67}],
    ['XORA',{size:1,hex:0x70}],
    ['XORB',{size:1,hex:0x71}],
    ['XORC',{size:1,hex:0x72}],
    ['XORD',{size:1,hex:0x73}],
    ['XORE',{size:1,hex:0x74}],
    ['XORF',{size:1,hex:0x75}],
    ['RAL',{size:1,hex:0x6B}],//ROTATE ACCUMULATOR LEFT THROUGH CARRY 
    ['RLC',{size:1,hex:0x6C}], //ROTATE ACCMULATOR LEFT 
    ['RRC',{size:1,hex:0x6D}], //ROTATE ACCUMULATOR RIGHT
    ['RAR',{size:1,hex:0x6E}] ,//ROTATE ACCUMULATOR RIGHT THROUGH CARRY
    ['CMPA',{size:1,hex:0x76}],
    ['CMPB',{size:1,hex:0x77}],
    ['CMPC',{size:1,hex:0x78}],
    ['CMPD',{size:1,hex:0x79}],
    ['CMPE',{size:1,hex:0x7A}],
    ['CMPF',{size:1,hex:0x7B}],
    ['CMA',{size:1,hex:0x80}] 	,//COMPLEMENT ACC.
    ['STC',{size:1,hex:0x81}],	//SET CARRY
    ['CMC',{size:1,hex:0x82}],	//COMPLEMENT CARRY
    ['HLT',{size:1,hex:0x83}],
    //----2 BYTE INSTRUCTIONS-,----
    ['MOVI',{size:2,hex:0x84}],
    ['ADDI',{size:2,hex:0x85}],
    ['SUBI',{size:2,hex:0x86}],
    ['ANDI',{size:2,hex:0x87}] ,
    ['ORI',{size:2,hex:0x88}] ,
    ['CMPI',{size:2,hex:0x89}] ,
    ['XORI',{size:2,hex:0x8A}] ,
    ['IN',{size:2,hex:0x0A}],
    ['DC',{size:2,hex:0x0B}],
    //--3 BYTE INSTRCTIONS---,
    ['JMP',{size:3,hex:0x90}],
    ['JNZ',{size:3,hex:0x92}] ,
    ['JZ',{size:3,hex:0x91}]  ,
    ['JC',{size:3,hex:0x93}],
    ['JNC',{size:3,hex:0x94}],
    ['EXI',{size:3,hex:0x95}],
    ['SPI',{size:3,hex:0xD0}],
    ['PUSHA',{size:1,hex:0xD1}],
    ['PUSHB',{size:1,hex:0xD2}],
    ['PUSHC',{size:1,hex:0xD3}],
    ['PUSHD',{size:1,hex:0xD4}],
    ['PUSHE',{size:1,hex:0xD5}],
    ['PUSHF',{size:1,hex:0xD6}],
    ['POPA',{size:1,hex:0xD7}],
    ['POPB',{size:1,hex:0xD8}],
    ['POPC',{size:1,hex:0xD9}],
    ['POPD',{size:1,hex:0xDA}], 
    ['POPE',{size:1,hex:0xDB}],
    ['POPF',{size:1,hex:0xDC}]    
    ]) ;
    
function checkIfPresent(instruction)
{
    return InstructionTable.has(instruction);
}
function getHexcode(instruction)
{
    return InstructionTable.get(instruction).hex;
}
function getSize(instruction)
{
    return InstructionTable.get(instruction).size;
}