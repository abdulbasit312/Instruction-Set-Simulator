var arr;
/*Array for keeping track of I/O port addresses */
  $(document).ready(function() {arr=new Array(16);
  for(let i=0;i<arr.length;i++)
  {
      arr[i]=new Array(16);
  }});  
  function display()
  {
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
        output+=`<td><input type="text" class="I-O-values" placeholder= "${(arr[i][j]==undefined)?0:arr[i][j]}"></td>\n`;
      }
      output+="</tr>";
    }
    output+="</table>";
    return output;
  }	
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
function exec(){
    $('#out').empty();
    let parent=document.querySelector('#out');
    parent.appendChild(createFragment(display(),"out"));
}
function exec2()
{
    $('#out').empty();
    let parent=document.querySelector('#out');
    parent.appendChild(createFragment("","out"));
}