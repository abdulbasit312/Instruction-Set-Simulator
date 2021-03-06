/*This file contains the functions to run o clicking of the buttons */

/* functio to display the input output matrix*/
function displayIO()
  {
    time++;
    var output="<table id ='IOdisable'><th>";
    for(let i=0;i<16;i++)
    {
      output+=`<td class='top'>${i.toString(16).toUpperCase()}</td>\n`;
    }
    output+='</th>';
    for(let i=0;i<256;i+=16) 
    {
      output+=`\n <tr><td class='top'>${(i/16).toString(16).toUpperCase()}</td>`;
      for(let j=i;j<=i+15;j++)
      {
        output+=`<td><input type="text" class="I-O-values" value= "${(out[j]==undefined)?0:out[j].toUpperCase()}"id ="v${j}"></td>\n`;
      }
      output+="</tr>";
    }
    output+="</table>";
    return output;
  }
function displayConcurrentOut()
{
  for(let i=0;i<256;i++)
  {
    let ele=document.getElementById("v"+i)
    if(ele!=null)
      ele.value=(out[i]==undefined)?0:out[i].toUpperCase();
    //console.log(out[i]);
  }
}
/*function to clear the IO */
function clearIO()
{
  for(let i=0;i<256;i++)
  {
    out[i]="0";
  }
  exec();
}
/*function to read values into the IO matrix */
function readOut()
{
  for(let i=0;i<256;i++)
  {
    out[i]=document.getElementById("v"+i)
    if(out[i]!=null)
      out[i]=out[i].value;
    //console.log(out[i]);
  }
}
/**Function to display the register values */
function displayRegisters() {
  for(let i=0;i<=5;i++)
  {
    document.getElementById(String.fromCharCode('A'.charCodeAt()+i)).value=registers[i].toString(16).toUpperCase();
  }
  document.getElementById('PC').value=PC.toString(16).toUpperCase();
  document.getElementById('SP').value=SP.toString(16).toUpperCase();
}
/**Function to clear the registers */
function clearRegisters() {
  registers=[0,0,0,0,0,0];
  PC=0;
  SP=0;
  displayRegisters();
}
/**Function to Display the memory contents */
function displayMemory()
{
  output="<table class='memory-table'><tr><th class='left'>Memory</th><th class='right'>Content</th></tr>\n";
  if(memory!=undefined){
  for(let i=0;i<memory.length;i++)
  { 
    if(memory[i]!=undefined && memory[i]!=0)
    {
      let val=memory[i];
      if(!(val instanceof String))
        val=val.toString(16).toUpperCase();
      output+=`<tr><td class='left'>${i.toString(16).toUpperCase()}</td><td class='right'>${val}</td></tr>\n`; 
    }
    }}
  output+="</table>";
  return output;
}
/**Displays the execution status */
function displayExecutionLog()
{
  document.getElementById('executionLog').innerHTML=executionLog;
}	
/**Function to create fragrment //working same like html.innetHTML= */
function createFragment(htmlStr,className) {
    var fragment = document.createDocumentFragment(),
        $elem = document.createElement('div');
    $elem.innerHTML = htmlStr;
    $elem.className=className;
    while($elem.firstChild) {
       fragment.appendChild($elem.firstChild);
    }
      return fragment;
}
/**Function to execute on clicking of the IO button */
function exec(){
  //console.log("enter");
    $('#out').empty();
    let parent=document.querySelector('#out');
    parent.appendChild(createFragment(displayIO(),"out"));
}
/**Function to execute on clicking of the Memory button */
function exec2()
{
  if(time!=1)
    readOut();
    $('#out').empty();
    let parent=document.querySelector('#out');
    parent.appendChild(createFragment(displayMemory(),"out"));
}

