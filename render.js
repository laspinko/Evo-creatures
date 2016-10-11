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

var scaleMultiplier = canvas.width / width;// ?
var offset = new Vector(0, 0);
var creaturesSelected = -1;

var toRender = true;
var renderFoodHeatmap = true;

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

var statCanvas = document.createElement('canvas');
statCanvas.width = 300;
statCanvas.height = 300;
var stat_ctx = statCanvas.getContext('2d');


function drawStat(){
    stat_ctx.clearRect(0,0,statCanvas.width,statCanvas.height);
	stat_ctx.beginPath();
	stat_ctx.moveTo(0, statCanvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		stat_ctx.lineTo(i * statCanvas.width / (fitnesData.length-1), statCanvas.height - (fitnesData[i].crCount / maxCrCount * statCanvas.height));
	}
	stat_ctx.lineTo(statCanvas.width * (fitnesData.length ) / fitnesData.length, statCanvas.height);

	stat_ctx.globalAlpha = 0.5;
	stat_ctx.fillStyle = 'yellow';
	stat_ctx.fill();

	stat_ctx.closePath();

	stat_ctx.beginPath();
	stat_ctx.moveTo(0, statCanvas.height);
	for(var i = 1;i < fitnesData.length;++ i)
	{
		stat_ctx.lineTo(i * statCanvas.width / (fitnesData.length-1), statCanvas.height - (fitnesData[i].avg / maxAvg * statCanvas.height));
	}
	stat_ctx.lineTo(statCanvas.width * (fitnesData.length ) / fitnesData.length, statCanvas.height);

	stat_ctx.globalAlpha = 0.5;
	stat_ctx.fillStyle = 'blue';
	stat_ctx.fill();
	stat_ctx.closePath();
}

function draw() {
	if(!toRender) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
	ctx.save();

	ctx.translate(-offset.x, -offset.y);

	renderScale = scaleMultiplier;
	ctx.scale(renderScale, renderScale);

	if(renderFoodHeatmap) {
		ctx.fillStyle = 'lightgray';

		var sx = Math.max(0, Math.floor(offset.x / renderScale / sectorSize) * sectorSize);
		var sy = Math.max(0, Math.floor(offset.y / renderScale / sectorSize) * sectorSize);

		sx /= sectorSize;
		sy /= sectorSize;
        var fullSector = ( sectorSize * sectorSize ) / ( 4 * 4 ) / 20;
		for(var x = sx;x < Math.min(foodSector.length, sx + canvas.width / renderScale);x ++) {
			for(var y = sy;y < Math.min(foodSector[x].length, sy + canvas.height / renderScale);y ++) {
				var l = Math.floor((fullSector- foodSector[x][y].length) / fullSector * 255); // foodSize^2/sectorSize^2
				ctx.fillStyle = 'rgb(' + 255 + ',' + l + ',' + l + ')';
				ctx.fillRect(x * sectorSize, y * sectorSize, sectorSize, sectorSize);
			}
		}
	}
	if(renderScale > 0.1) {
        ctx.fillStyle = 'red';
        ctx.lineWidth = 0.5;

        var div = new Vector(renderScale * sectorSize, renderScale * sectorSize);
        var start = new Vector(Math.floor(offset.x / div.x), Math.floor(offset.y / div.y));

        var end = new Vector(Math.floor(canvas.width / div.x), Math.floor(canvas.height / div.y));
        end.add(start);

        for(var x = Math.max(0, start.x);x <= Math.min(foodSector.length - 1, end.x + 1);x ++) {
            for(var y = Math.max(0, start.y);y <= Math.min(foodSector[x].length - 1, end.y + 1);y ++) {
                for(var i = 0;i < foodSector[x][y].length;i ++) {
                    if(renderScale > 1) arc(foodSector[x][y][i].x, foodSector[x][y][i].y, 2);
                    else ctx.fillRect(foodSector[x][y][i].x - 2, foodSector[x][y][i].y - 2, 4, 4);
                }
            }
        }
	}

	ctx.fillStyle = 'lightgray';
    ctx.strokeStyle = 'black';
    for(var i = 0;i < creatures.length;i ++){
        if(i == creaturesSelected)  ctx.lineWidth = 10;
        else    ctx.lineWidth = 1;
        creatures[i].draw(ctx);
    } 

	ctx.restore();

	if(creaturesSelected != -1) draw_net(creatures[creaturesSelected].neur);

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
