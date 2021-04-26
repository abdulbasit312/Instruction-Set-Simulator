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