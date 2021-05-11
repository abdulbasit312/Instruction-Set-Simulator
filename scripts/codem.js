var editor;
var myWorker;
$(document).ready(function(){
	//code here...
	var code = $(".codemirror-textarea")[0];
	editor = CodeMirror.fromTextArea(code, {
		lineNumbers : true,
        theme:"railscasts",
		styleSelectedText: true
	}
	);
});
/*Array for keeping track of I/O port addresses */
var out=new Array(256);
var time=1;
//Program counter
var PC=0;
//0-5 is A-F
var registers=[0,0,0,0,0,0];
//memory
var memory=new Array(1<<2);
//execution log
var executionLog="";
//attach the run code button with the required function
document.getElementById('Run').addEventListener('click',runCode);
document.getElementById('Stop').addEventListener('click',stopCode);
//this send the input code to the worker thread which executes and send result
function runCode()
{
	var codeFromEditor=editor.getValue().toUpperCase();
	codeFromEditor=codeFromEditor.replace(/;(.*)/g,'');		//remove comments
	codeFromEditor=codeFromEditor.replace(/^\s*$(?:\r\n?|\n)/gm, '');	//remove unnecessary new lines
	codeFromEditor=codeFromEditor.split('\n'); //make array of all instructions
	//console.log(codeFromEditor);
	myWorker=new Worker('./scripts/assembler.js');
	myWorker.postMessage({code:codeFromEditor,output:out,register:registers});
	myWorker.onmessage=function (e) {
		out=e.data.output;
		registers=e.data.register;
		memory=e.data.memory;
		PC=e.data.PC;
		executionLog=e.data.executionLog;
		displayRegisters();
		displayExecutionLog();
	}

}

function stopCode()
{
	executionLog="No running program"
	if(myWorker!=undefined)
	{
		myWorker.terminate();
		executionLog="Terminated Program";
	}
	displayExecutionLog();
}
