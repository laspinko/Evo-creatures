var mousePos = new Vector(0, 0);

window.addEventListener('mousedown', function (args) {
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

window.addEventListener('mouseup', function (args) {
	mouseDown = false;
}, false);

window.addEventListener('mousemove', function (args) {
	if(mouseDown)
	{
		var curr = new Vector(args.pageX, args.pageY);
		offset.add(sub(mouseDownPos, curr));
		mouseDownPos = curr;
	}
}, false);

window.addEventListener('wheel', function (args) {
	if(args.deltaY > 0) wheelDelta -= 0.05;
	else wheelDelta += 0.05;

	zoomPos.x = ((args.pageX));
	zoomPos.y = ((args.pageY));
}, false);

function updateInputDevices() {
	if(wheelDelta != 0)
	{
		var newScaleMultiplier = scaleMultiplier + wheelDelta;
		if(newScaleMultiplier < 0.5) newScaleMultiplier = 0.5;

		scaleMultiplier = newScaleMultiplier;

		wheelDelta *= 0.7;
		if(Math.abs(wheelDelta) < 0.001) wheelDelta = 0;
	}
}

setInterval(updateInputDevices, 1000/30);
