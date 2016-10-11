var mousePos = new Vector(0, 0);

canvas.addEventListener('mousedown', function (args) {
    mousePos = new Vector(args.pageX, args.pageY);
    
    
	mouseDownPos.x = ((args.pageX));
	mouseDownPos.y = ((args.pageY));

    mousePos.x = ((args.pageX + offset.x) / renderScale);
    mousePos.y = ((args.pageY + offset.y) / renderScale);
	creaturesSelected = -1;
	for(var i in creatures) {
		if(sub(mousePos, creatures[i].pos).dist2() < 10 * 10) {
			creaturesSelected = i;
		}
	}
	mouseDown = true;
}, false);

canvas.addEventListener('mouseup', function (args) {
    mousePos = new Vector(args.pageX, args.pageY);
	mouseDown = false;
}, false);

canvas.addEventListener('mousemove', function (args) {
    mousePos = new Vector(args.pageX, args.pageY);
	if(mouseDown)
	{
		var curr = new Vector(args.pageX, args.pageY);
		offset.add(sub(mouseDownPos, curr));
		mouseDownPos = curr;
	}
}, false);

canvas.addEventListener('wheel', function (args) {
    var oldScale = scaleMultiplier;
	if(args.deltaY > 0) scaleMultiplier *=0.9;
	else scaleMultiplier /= 0.9;

    
    /*
        ccx+=(cmx/width-0.5)*(oldz-cz)*2;
        ccy+=(cmy/height-0.5)*(oldz-cz)*2;*/
	//offset.add(mul(mousePos,(oldScale - scaleMultiplier)));
    console.log(oldScale,mul(mousePos,1/oldScale));
    offset = mul(sub(mul(mousePos,1/oldScale),offset),scaleMultiplier);
    
    //scaleMultiplier = oldScale;
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
