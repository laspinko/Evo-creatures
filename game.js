var width = 500 * 30;
var height = 500 * 30;

var fitnesData = [];
var creatures = [];

const minAngle = Math.PI / 180 * 5;
const minBirthFitness = 100;
var breedRange = width / 10;

var stepsPerCall = 2;
var dataCollectionInterval = 1500;
var lastBabiesStep = 0;

var mutationRate = 0.01;

var foodTarget = width * height / 8000;
var food = [];
var foodSector = [];
var foodInBank = 0;
var sectorSize = 100;

var wheelDelta = 0;
var mouseDown = false;
var mouseDownPos = new Vector(0, 0);
var zoomPos = new Vector(0, 0);

for(var i = 0;i < 100;i ++) {
    creatures[i] = new Creature();
}

function addFood(f) {
	if(f.x < 0) f.x = width - f.x;
	if(f.y < 0) f.y = width - f.y;
	if(f.x > width) f.x = Math.floor(f.x) % width;
	if(f.y > height) f.y = Math.floor(f.y) % height;
    foodSector[Math.floor(f.x / sectorSize)][Math.floor(f.y / sectorSize)].push(f);
}

function dropFood(f, count, dist) {
	while(count > 0 && foodInBank > 0) {
		var vector = new Vector(f.x - Math.random() * dist + dist / 2,
		                        f.y - Math.random() * dist + dist / 2);
		addFood(vector);
		foodInBank --;
		count --;
	}
}

function respawnFood() {
    foodSector = [];
    for(var x = 0;x < width / sectorSize; x++){
        foodSector[x] = [];
        for(var y = 0;y < height / sectorSize; y++){
            foodSector[x][y] = [];
        }
    }
	for(var i = 0;i < foodTarget;i ++) {
		var a = new Vector(Math.random() * width, Math.random() * height);
        addFood(a);
	}
}
respawnFood();

function oa(first,second,third) {
    return (first.x-third.x)*(second.y-third.y)-(second.x-third.x)*(first.y-third.y);
}

function dot_in(d, first, second, third) {
    if(oa(d,first,second)<=0 && oa(d,first,third)>=0 && sub(d,first).dist2()<=sub(first,second).dist2()){
        return true;
    } 
    //console.log(false);
    //if(oa(d, first, second) <=0 && oa(d,second,third)<=0&& oa(d,third,first)<=0) return true;
    //if(oa(d, first, second) > 0 && oa(d,second,third)>0 && oa(d,third,first)>0) return true;
    return false;
}

//stats
var time = 0, maxFitness = 0, currentFitness = 0, maxAvg = 0, currentAvg = 0, generation=0;
var maxCrCount = 0;

function getInputForCreature(creature) {
	var inp = [];
	var foodInView = false, bul = false, crea = false;
	var first = new Vector(creature.pos.x + Math.cos(creature.ang + 2 * creature.vAngle) * creature.vRange
						 , creature.pos.y + Math.sin(creature.ang + 2 * creature.vAngle) * creature. vRange);
	var second = new Vector(creature.pos.x + Math.cos(creature.ang) * creature.vRange
						 , creature.pos.y + Math.sin(creature.ang) * creature.vRange);

	for(var x = Math.floor(((creature.pos.x - creature.vRange < 0)?(0):(creature.pos.x - creature.vRange)) / sectorSize);
		x <= Math.floor(((creature.pos.x + creature.vRange > width-1)?(width-1):(creature.pos.x + creature.vRange)) / sectorSize) && !foodInView;
		x++){
		for(var y = Math.floor(((creature.pos.y - creature.vRange < 0)?(0):(creature.pos.y - creature.vRange)) / sectorSize);
			y <= Math.floor(((creature.pos.y + creature.vRange > height-1)?(height-1):(creature.pos.y + creature.vRange)) / sectorSize) && !foodInView;
			y++){
			for(var k = 0;k <foodSector[x][y].length && !foodInView;k++){
				if(dot_in(foodSector[x][y][k], creature.pos, first, second)) {
					foodInView = true;
					break;
				}
			}
		}
	}
	for(var k = 0;k < creatures.length && !(bul && crea);k ++) {
		if(creatures[k] != creature) {
			crea = crea || dot_in(creatures[k].pos, creature.pos, first, second);
			if(creatures[k].bShot) bul = bul || dot_in(creatures[k].bPos, creature.pos, first, second);
		}
	}
	inp[0] = foodInView ? 1 : 0;
	inp[1] = crea ? 1 : 0;
	inp[2] = bul ? 1 : 0;

	foodInView = false;
	crea = false;
	bul = false;
	first = new Vector(creature.pos.x + Math.cos(creature.ang) * creature.vRange
					, creature.pos.y + Math.sin(creature.ang) * creature.vRange);
	second = new Vector(creature.pos.x + Math.cos(creature.ang - 2 * creature.vAngle) * creature.vRange
					, creature.pos.y + Math.sin(creature.ang - 2 * creature.vAngle) * creature.vRange);

	for(var x = Math.floor(((creature.pos.x - creature.vRange < 0)?(0):(creature.pos.x - creature.vRange)) / sectorSize);
		x <= Math.floor(((creature.pos.x + creature.vRange > width-1)?(width-1):(creature.pos.x + creature.vRange)) / sectorSize) && !foodInView;
		x++){
		for(var y = Math.floor(((creature.pos.y - creature.vRange < 0)?(0):(creature.pos.y - creature.vRange)) / sectorSize);
			y <= Math.floor(((creature.pos.y + creature.vRange > height-1)?(height-1):(creature.pos.y + creature.vRange)) / sectorSize) && !foodInView;
			y++){
			for(var k = 0;k <foodSector[x][y].length && !foodInView;k++){
				if(dot_in(foodSector[x][y][k], creature.pos, first, second)) {
					foodInView = true;
					break;
				}
			}
		}
	}
	for(var k=0;k<creatures.length && !(bul && crea);k++){
		if(creatures[k] != creature){
			crea=crea || dot_in(creatures[k].pos, creature.pos, first, second);
			if(creatures[k].bShot)   bul=bul || dot_in(new Vector(creatures[k].bPos), creature.pos, first, second);
		}
	}
	inp[3] = foodInView?1:0;
	inp[4] = crea?1:0;
	inp[5] = bul?1:0;
	inp[6] = creature.neur.layer[creature.neur.layer.length - 1][4].n;
	inp[7] = 1;
	
	return inp;
}

function simulateMovement(creature, outp) {
	if(Math.round(outp[0])==1) {
		creature.pos.x += Math.cos(creature.ang) * 0.5;
		if(creature.pos.x < 0) creature.pos.x += width;
		if(creature.pos.x > width) creature.pos.x -= width;

		creature.pos.y += Math.sin(creature.ang) * 0.5;
		if(creature.pos.y < 0) creature.pos.y += height;
		if(creature.pos.y > height) creature.pos.y -= height;
	}
	// TODO
	if(Math.round(outp[1]) == 1) creature.ang += Math.PI/45;
	if(Math.round(outp[2]) == 1) creature.ang -= Math.PI/45;
	if(Math.round(outp[3]) == 1 && !creature.bShot && creature.bSTimer <= 0) {
		creature.bAng = creature.ang;
		creature.bPos.x = creature.pos.x;
		creature.bPos.y = creature.pos.y;
		creature.bShot = true;
	}
	if(creature.bSTimer > 0) creature.bSTimer --;
	if(creature.bShot) {
		creature.bPos.x += Math.cos(creature.bAng) * 2;
		creature.bPos.y += Math.sin(creature.bAng) * 2;
		if(creature.bPos.x < 0 || creature.bPos.x>width || creature.bPos.y<0 || creature.bPos.y>height) {
			creature.bShot = false;
			creature.bSTimer = 100;
		} else {
			for(var k=0;k<creatures.length;k++) {
					if(i != k && sub(creature.bPos, creatures[k].pos).dist2() < creature.size * creature.size) {
					if(creatures[k].fitness > 0) {
						creatures[k].fitness --;
						creature.fitness ++;
					}
					creature.bShot = false;
					creature.bSTimer = 100;
					break;
				}
			}
		}
	}
}

function checkForFoodColision(creature) {
	for(var x = Math.floor(((creature.pos.x - creature.size < 0)?(0):(creature.pos.x - creature.size)) / sectorSize);
		x <= Math.floor(((creature.pos.x + creature.size > width-1)?(width-1):(creature.pos.x + creature.size)) / sectorSize);
		x++){
		for(var y = Math.floor(((creature.pos.y - creature.size < 0)?(0):(creature.pos.y - creature.size)) / sectorSize);
			y <= Math.floor(((creature.pos.y + creature.size > height-1)?(height-1):(creature.pos.y + creature.size)) / sectorSize);
			y++){
				//console.log(x,y);
			for(var j = 0;j <foodSector[x][y].length;j++){
				if(sub(foodSector[x][y][j], creature.pos).dist2() < creature.size * creature.size) {
					creature.fitness ++;
					var nr = Math.sqrt(creature.size * creature.size + 1 * 1)-creature.size; // PI*r*r
					creature.size += nr;
					creature.vRange += nr;
					foodSector[x][y][j].x = foodSector[x][y][foodSector[x][y].length-1].x;
					foodSector[x][y][j].y = foodSector[x][y][foodSector[x][y].length-1].y;
					foodSector[x][y].pop();
				}
			}
		}
	}
}

function offspring(a, b){
    var result = new Creature();
    var fromA = 0,fromB = 0,fromMut = 0;
	var neurResult = mutate(a.neur, b.neur, mutationRate);
    result.neur = neurResult[0];

	if(Math.random() < 0.5) result.vAngle = a.vAngle;
	else result.vAngle = b.vAngle;

	if(Math.random() < 0.15) result.vAngle += Math.random()*0.50-0.25;
	if(result.vAngle > Math.PI*5/6) result.vAngle = Math.PI*5/6;

	if(result.vAngle < minAngle) result.vAngle = minAngle;

	if(Math.random() < 0.5) result.baseVRange = a.baseVRange;
	else result.baseVRange = b.baseVRange;

	if(Math.random() < 0.15) result.baseVRange += Math.random()*100-50;
	if(result.baseVRange > 300) result.baseVRange = 300;

	result.vRange = result.baseVRange;

    var randColor = new Color();
    var black = new Color(0,0,0);
    result.color = black.add(a.color.mul(neurResult[1].fromA))
                        .add(b.color.mul(neurResult[1].fromB))
                        .add(randColor.mul(neurResult[1].fromMut));

    return result;
}

function checkForBirthAbility(creature) {
	if(creature.fitness > minBirthFitness) {

		var list = [];
		for(var j in creatures) {
			if(creatures[j] != creature && creatures[j].fitness > creature.fitness / 1.5) {
				var dist = sub(creature.pos, creatures[j].pos).dist2();
				if(dist < breedRange * breedRange) list.push({dist: dist, idx: j});
			}
		}
		list.sort(function(c1, c2) { return creatures[c1.idx].fitness - creatures[c2.idx].fitness;});

		//console.log("Babies!", list);

        if(list.length > 3) {
            lastBabiesStep = time;
            while(creature.fitness > 30) {
                //var chosen = creature;
                chosen = creatures[list[Math.floor(Math.random() * list.length)].idx];
                if(Math.random() > chosen.color.sub(creature.color).dist2() / 195075){ //3 * 255^2
                    
                }else{
                    chosen = creature;
                }
                var kid = offspring(creature, chosen);
                kid.pos.x = creature.pos.x;
                kid.pos.y = creature.pos.y;
                creatures.push(kid);
                creature.fitness -= 10;
            }
            
        }
	}
}

function sortCreatures() {
		creatures.sort(function (cr1, cr2) {return cr2.fitness - cr1.fitness;});
}

function step()
{
	for(var i in creatures) {
		var outp = compute(creatures[i].neur, getInputForCreature(creatures[i]));
		simulateMovement(creatures[i], outp);
		checkForFoodColision(creatures[i]);
        creatures[i].age ++;
        if(time % 1000 == 0) {
            creatures[i].fitness --;
			if(creatures[i].fitness >= 0) {
				foodInBank ++;
			} else {
				dropFood(creatures[i].pos, 20, 100);
				creatures.splice(i, 1);
			}
        }
	}

	currentAvg = 0;
	currentFitness = 0;
    var matureCreatures = 0;
	for(var i in creatures) {
        if(creatures[i].age>10000){ // survived the first test + to collect accurate info
            matureCreatures ++;
            currentAvg += creatures[i].fitness / creatures[i].age ;
            if(currentFitness < creatures[i].fitness / creatures[i].age ) {
				currentFitness = creatures[i].fitness / creatures[i].age;
			}
        }
	}
	currentAvg /= (matureCreatures == 0 ? 1 : matureCreatures);


	if(time % 100 == 0) { // don't check every frame
        for(var i in creatures) {
			checkForBirthAbility(creatures[i]);
		}
	}

	// If no natural birth has accured in a long time, use the unholy one
	if(time - lastBabiesStep > 50000) {
		console.log('Ugly babies!');

		lastBabiesStep = time;

		sortCreatures();

		for(var i = 0;i < 30;++ i) {
			var a = Math.floor(Math.random() * (creatures.length / 10));
			var b = Math.floor(Math.random() * (creatures.length / 10));
			var kid = offspring(creatures[a], creatures[b]);
			kid.fitness = Math.min(creatures[a].fitness, creatures[b].fitness);
			foodInBank -= kid.fitness;
			creatures.push(kid);
		}
	}

	if(time % dataCollectionInterval == 0) {
        if(time > 0) {
            if(currentFitness > maxFitness) maxFitness = currentFitness;
            if(currentAvg > maxAvg) maxAvg = currentAvg;
        }
        if(creatures.length > maxCrCount) maxCrCount = creatures.length;
		fitnesData.push({avg: currentAvg, max: currentFitness, crCount: creatures.length});
		//console.log(currentAvg, creatures.length);
	}

	if(foodInBank > foodTarget / 100 * 5) { // lots of food undestributed
		var dose = foodInBank / 100;
		for(var i = 0;i < 100 && foodInBank > 0;++ i) {
			dropFood(new Vector(Math.random() * width, Math.random() * height), dose, 100);
		}
	}

	time ++;
}

function update() {
	var interval = 50;

	var startTime = new Date();
	for(var i = 0;i < stepsPerCall;++ i) step();
	var endTime = new Date();

	var diff = endTime - startTime;
	if(diff > interval) {
		console.log('Can\'t keep up! Please lower stepsPerCall');
	}
    setTimeout(update, 50);
}

update();
