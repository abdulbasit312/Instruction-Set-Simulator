/* Set the width of the side navigation to 250px and the left margin of the page content to 250px */
function openNav() {
    document.getElementById("mySidenav").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
  }
  
  /* Set the width of the side navigation to 0 and the left margin of the page content to 0 */
  function closeNav() {
    document.getElementById("mySidenav").style.width = "0";
    document.getElementById("main").style.marginLeft = "0";
  } 
  var c=document.getElementById("select");
  var ctx=c.getContext("2d");
  ctx.fillStyle="#FF0000";

  var func=function (name)
  {
    console.log(`${name}`);
  } 

  func("Abdul Basit");

  var arr=new Array(16);
  for(let i=0;i<arr.length;i++)
  {
      arr[i]=new Array(16);
  }  
  function display()
  {
    var arr=new Array(16);
  for(let i=0;i<arr.length;i++)
  {
      arr[i]=new Array(16);
  }
    var output="<table><th>";
    let time=1;
    for(let i=0;i<16;i++)
    {
      output+=`<td>${i.toString(16).toUpperCase()}</td>\n`;
    }
    output+='</th>';
    for(let i=0;i<arr.length;i++) 
    {
      output+=`\n <tr><td>${i.toString(16).toUpperCase()}</td>`;
      for(let j=0;j<arr[i].length;j++)
      {
        //process.stdout.write(arr[i][j]==undefined?0:arr[i][j]);
        output+=`<td><input type="text" class="I-O-values" placeholder= "${(arr[i][j]==undefined)?0:arr[i][j]}"></td>\n`;
      }
      output+="</tr>";
    }
    output+="</table>";
    return output;
  }/*	
function createFragment(htmlStr) {
    var fragment = document.createDocumentFragment(),
        $elem = document.createElement('div');
    $elem.innerHTML = htmlStr;
    $elem.className="I-O";
    while($elem.firstChild) {
       fragment.appendChild($elem.firstChild);
    }
      return fragment;
}*/
function exec(){
var target=document.getElementById("out");
target.innerHTML=display();
}
function exec2()
{
  var target=document.getElementById("out");
  target.innerHTML="";
}