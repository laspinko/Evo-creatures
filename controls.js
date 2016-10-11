var mousePos = new Vector(0, 0);

document.addEventListener('mousedown', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);
    
    
	mouseDownPos.x = ((args.pageX));
	mouseDownPos.y = ((args.pageY));

	mouseDown = true;
}, false);

document.addEventListener('mouseup', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);
	mouseDown = false;
}, false);
document.addEventListener('click', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);
    
	creaturesSelected = -1;
	for(var i in creatures) {
        var screenPos = add(mul(creatures[i].pos,scaleMultiplier),offset);
        var radius = Math.max(4 * creatures[i].size / 10,creatures[i].size * scaleMultiplier);
        //console.log(mul(creatures[i].pos,scaleMultiplier));
		if(sub(mousePos, screenPos).dist2() < radius * radius) {
			creaturesSelected = i;
		}
	}
}, false);

document.addEventListener('mousemove', function (args) {
    mousePos = new Vector(args.pageX-canvas.offsetLeft, args.pageY-canvas.offsetTop);
	if(mouseDown)
	{
		var curr = new Vector(args.pageX, args.pageY);
		offset.sub(sub(mouseDownPos, curr));
		mouseDownPos = curr;
	}
}, false);

canvas.addEventListener('wheel', function (args) {
    var oldScale = scaleMultiplier;
	if(args.deltaY > 0) scaleMultiplier *=0.9;
	else scaleMultiplier /= 0.9;

    //fucking zoom
    var fuck = sub(offset,mousePos);
    fuck.mul(scaleMultiplier/oldScale);
    offset = add(fuck,mousePos);
    
    args.preventDefault();
}, false);

function updateInputDevices() {
	/*if(wheelDelta != 0)
	{
		var newScaleMultiplier = scaleMultiplier + wheelDelta;
		if(newScaleMultiplier < 0.5) newScaleMultiplier = 0.5;

		scaleMultiplier = newScaleMultiplier;

		wheelDelta *= 0.7;
		if(Math.abs(wheelDelta) < 0.001) wheelDelta = 0;
	}*/
}

setInterval(updateInputDevices, 1000/30);
