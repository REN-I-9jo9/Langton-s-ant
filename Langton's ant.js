var canvas=document.getElementsByTagName("canvas")[0];
var div=document.getElementsByTagName("div")[2];

var context=canvas.getContext('2d');


function colorchange(col){
	if(!running){
		col.style['background-color']=
		"rgb("+Math.floor((Math.random() * 256))+
		","+Math.floor((Math.random() * 256))+
		","+Math.floor((Math.random() * 256))+")";
	}
}
function arrowchange(par){
	if(!running){
		par.children[1].innerHTML=(parseInt(par.children[1].innerHTML)+2)%4;
		par.children[2].innerHTML=(par.children[1].innerHTML==1)?"&#8631;":"&#8630";
	}
}
function delrule(par){
	if(!running){
		par.parentElement.children[0].children[3].innerHTML=par.parentElement.children.length-2;
		par.parentElement.removeChild(par);
		
	}
}
function addrule(par){
	if(!running){
		var newrule=document.createElement("div");
		newrule.innerHTML=
		'<div class=block style="background-color:rgb(0,0,0);" onclick=colorchange(this)></div>'+
		'<div style="display:none;">1</div>'+
		'<div class=block onclick=arrowchange(this.parentElement)>&#8631;</div>'+
		'<div class=block style="float:right; margin-right:0px;" onclick=delrule(this.parentElement)>-</div>';
		var newid=parseInt(par.children[par.children.length-1].id.substring(1))+1;
		newrule.id='_'+newid.toString();
		newrule.classList.add("colors");
		par.appendChild(newrule);
		par.children[0].children[3].innerHTML=par.children.length-1;
	}
}
function changedir(par){
	if(!running){
		var headnow=(parseInt(par.children[2].innerHTML)+1)%4;
		par.children[1].innerHTML=
		(headnow==0)?"&#8593;":
		(headnow==1)?"&#8594;":
		(headnow==2)?"&#8595;":
		(headnow==3)?"&#8592;":0;
		par.children[2].innerHTML=headnow;
	}
}
var ant,i,white,black,changed,running=false;
var color={},colordata={};
function init(){
	ant={
		x:400,
		y:400,
		head:{
			north:0,
			east:1,
			south:2,
			west:3,
			now:0,
		}
	};
	ant.head.now=parseInt(document.getElementById('rules').children[0].children[2].innerHTML);
	
	for(var j=1;j<document.getElementById('rules').children.length;j++){
		var c=document.getElementById('rules').children[j];
		
		color[c.id]=c.children[0].style['background-color'];
		
		context.fillStyle = color[c.id];
		context.fillRect(0, 0, 1,1);
		colordata[c.id]=context.getImageData(0, 0, 1, 1);
	}
	
	canvas.height=parseInt(getComputedStyle(document.body).getPropertyValue('--canvas'));
	canvas.width=parseInt(getComputedStyle(document.body).getPropertyValue('--canvas'));
	context.fillStyle = color[document.getElementById('rules').children[1].id];
	context.fillRect(0, 0, canvas.height,canvas.width);
	
	i=0;
	changed="zero";
	running=true;
}

function update(){
	document.getElementById(changed).style["background-color"]="white";
	var dot=context.getImageData(ant.y, ant.x, 1, 1).data;
	var l=document.getElementById('rules').children.length;
	for(var j=1;j<l;j++){
		var c=document.getElementById('rules').children[j];
		var n=((j+1)%l!==0)?((j+1)%l):((j+1)%l+1);
		var cn=document.getElementById('rules').children[n];
		
		if(	dot[0]==colordata[c.id].data[0]&&
			dot[1]==colordata[c.id].data[1]&&
			dot[2]==colordata[c.id].data[2]&&
			dot[3]==colordata[c.id].data[3]){
			var rot=parseInt(c.children[1].innerHTML);
			ant.head.now=(ant.head.now+rot)%4;
			context.putImageData(colordata[cn.id],ant.y, ant.x);
			changed=c.id;
			break;
		}
	}
	document.getElementById(changed).style["background-color"]="#EEEEEE";
	document.getElementById('rules').children[0].children[1].innerHTML=
	(ant.head.now==0)?"&#8593;":
	(ant.head.now==1)?"&#8594;":
	(ant.head.now==2)?"&#8595;":
	(ant.head.now==3)?"&#8592;":0;
	document.getElementById('rules').children[0].children[2].innerHTML=ant.head.now;
	
	if(ant.head.now==ant.head.north){
		ant.y=(ant.y+canvas.height-1)%canvas.height;
	}
	else if(ant.head.now==ant.head.east){
		ant.x=(ant.x+1)%canvas.width;
	}
	else if(ant.head.now==ant.head.south){
		ant.y=(ant.y+1)%canvas.height;
	}
	else if(ant.head.now==ant.head.west){
		ant.x=(ant.x+canvas.width-1)%canvas.width;
	}
}

var interval;
div.onclick=function(){
	init();
	interval=setInterval(function(){
		update();
		i++;
		div.innerHTML=("00000000"+(i).toString()).substring(("00000000"+(i).toString()).length-8);
		div.onclick=function(){};
	},1);
};