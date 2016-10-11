var requestAnimationFrame = window.requestAnimationFrame
						 || window.mozRequestAnimationFrame
						 || window.webkitRequestAnimationFrame
						 || window.msRequestAnimationFrame;

var canvas = document.getElementById('canvas-id');
var ctx = canvas.getContext('2d');

function resizeCanvas() {
	canvas.width = window.innerWidth;
	canvas.height = window.innerHeight;
}
resizeCanvas();

window.addEventListener('resize', resizeCanvas, false);

var scaleMultiplier = 0.9;
var offset = new Vector(0, 0);
var creaturesSelected = -1;

var toRender = true;

ctx.lineWidth=1;
function arc(x,y,r){
    ctx.beginPath();
    ctx.arc(x,y,r,0,Math.PI*2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
}
function line(x1,y1,x2,y2){
    ctx.beginPath();
    ctx.moveTo(x1,y1);
    ctx.lineTo(x2,y2);
    ctx.stroke();
    ctx.closePath;
}
function draw_net(a){
    ctx.clearRect(canvas.width-300,0,300,300);
    ctx.strokeRect(canvas.width-300,0,300,300);
    var scx=300/a.layer.length,scy=300/Math.max(a.layer[0].length,a.layer[a.layer.length-1].length),rad=Math.min(scx/4,scy/4);
    for(var i=0;i<a.layer.length;i++){
        for(var j=0;j<a.layer[i].length;j++){
            var m=Math.floor(255-a.layer[i][j].n*255);
            ctx.fillStyle='rgb('+m+','+m+','+m+')';
            ctx.lineWidth=1;
            arc(i*scx+canvas.width-300+scx/2,j*scy+scy/2,rad);
            for(var k=0;k<a.layer[i][j].w.length;k++){
                ctx.lineWidth=(a.layer[i][j].w[k]+1)*1;
                line(i*scx+canvas.width-300+scx/2,j*scy+scy/2,(i+1)*scx+canvas.width-300+scx/2,k*scy+scy/2);
            }
        }
    }
    ctx.lineWidth=1;
}
function draw()
{
	if(!toRender) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.strokeStyle='black';
	ctx.save();

	ctx.translate(-offset.x, -offset.y);

	renderScale = canvas.width / width * scaleMultiplier;
	ctx.scale(renderScale, renderScale);

    ctx.fillStyle = 'lightgray';
    
	var sx = Math.floor(offset.x / renderScale / sectorSize) * sectorSize;
	var sy = Math.floor(offset.y / renderScale / sectorSize) * sectorSize;

	for(var x = sx;x < sectorSize + sx + canvas.width / renderScale;x += sectorSize) {
		ctx.fillRect(x, sy, 3, sectorSize + canvas.height / renderScale);
	}
	for(var y = sy;y < sectorSize + sy + canvas.height / renderScale;y += sectorSize) {
		ctx.fillRect(sx, y, sectorSize + canvas.width / renderScale, 3);
	}

    ctx.strokeStyle = 'black';
    for(var i = 0;i < creatures.length;i ++) creatures[i].draw(ctx);

    ctx.fillStyle = 'red';
    ctx.lineWidth = 0.5;

	var div = new Vector(renderScale * sectorSize, renderScale * sectorSize);
	var start = new Vector(Math.floor(offset.x / div.x), Math.floor(offset.y / div.y));

	var end = new Vector(Math.floor(canvas.width / div.x), Math.floor(canvas.height / div.y));
	end.add(start);

    for(var x = Math.max(0, start.x);x <= Math.min(foodSector.length - 1, end.x + 1);x ++)
	{
        for(var y = Math.max(0, start.y);y <= Math.min(foodSector[x].length - 1, end.y + 1);y ++)
		{
            for(var i = 0;i < foodSector[x][y].length;i ++)
			{
				if(renderScale > 1) arc(foodSector[x][y][i].x, foodSector[x][y][i].y, 2);
				else ctx.fillRect(foodSector[x][y][i].x - 2, foodSector[x][y][i].y - 2, 4, 4);
			}
		}
	}

	ctx.restore();

	if(creaturesSelected != -1) draw_net(creatures[creaturesSelected].neur);

    ctx.fillStyle = 'green';
    ctx.clearRect(0, 0, 120, 70);
    ctx.fillText('Max avg: ' + Math.floor(maxAvg*100)/100, 0, 10);
    ctx.fillText('Current fittnes: '+ Math.floor(currentFitness*100)/100, 0, 20);
    ctx.fillText('Current avg: ' + Math.floor(currentAvg*100)/100, 0, 30);
    ctx.fillText('Current creature count: ' + creatures.length, 0, 40);

	/*
	ctx.beginPath();
	ctx.strokeStyle = 'blue';
	ctx.moveTo(0, canvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		ctx.lineTo(i * 300 / fitnesData.length, canvas.height - (fitnesData[i].max / maxFitness * 100));
	}
	ctx.moveTo(300, canvas.height);
	ctx.closePath();
	ctx.stroke();

	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		ctx.lineTo(i * 300 / fitnesData.length, canvas.height - (fitnesData[i].avg / maxFitness * 100));
	}
	ctx.lineTo(300, canvas.height);
	ctx.closePath();

	ctx.globalAlpha = 0.4;
	ctx.fillStyle = 'red';
	ctx.fill();
	*/
    
	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		ctx.lineTo(i * 300 / fitnesData.length, canvas.height - (fitnesData[i].avg / maxAvg * 100));
	}
	ctx.lineTo(300*(fitnesData.length-1)/fitnesData.length, canvas.height);

	ctx.globalAlpha = 0.3;
	ctx.fillStyle = 'blue';
	ctx.fill();
	ctx.closePath();

	ctx.beginPath();
	ctx.moveTo(0, canvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		ctx.lineTo(i * 300 / fitnesData.length, canvas.height - (fitnesData[i].crCount / maxCrCount * 100));
	}
	ctx.lineTo(300*(fitnesData.length-1)/fitnesData.length, canvas.height);

	ctx.globalAlpha = 0.3;
	ctx.fillStyle = 'yellow';
	ctx.fill();
    
	ctx.closePath();
    
	ctx.globalAlpha = 1;

    requestAnimationFrame(draw);
    //setTimeout(draw,1000/20)
}

function startRendering()
{
	stepsPerCall = 2;
	toRender = true;
	draw();
}
function stopRendering()
{
	toRender = false;
	stepsPerCall = 100;
}
startRendering();
