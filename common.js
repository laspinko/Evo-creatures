var renderScale;

class Vector {
	constructor(x, y) {
		this.x = x;
		this.y = y;
	}
	add(other) {
		this.x += other.x;
		this.y += other.y;
	}
	sub(other) {
		this.x -= other.x;
		this.y -= other.y;
	}
	mul(num) {
		this.x *= num;
		this.y *= num;
	}
	dist() {
		return Math.sqrt(this.x * this.x + this.y * this.y);
	}
	dist2() {
		return this.x * this.x + this.y * this.y;
	}
	normalized() {
		var d = this.dist();
		return new Vector(this.x / d, this.y / d);
	}
}
function add(v1, v2) {
	return new Vector(v1.x + v2.x, v1.y + v2.y);
}
function sub(v1, v2) {
	return new Vector(v1.x - v2.x, v1.y - v2.y);
}
function mul(v1, num) {
	return new Vector(v1.x * num, v1.y * num);
}
class Color {
	constructor(r = Math.floor(Math.random()*255), g = Math.floor(Math.random()*255), b = Math.floor(Math.random()*255)) {
		this.r = r;
		this.g = g;
		this.b = b;
	}
	add(other) {
        return new Color(this.r + other.r,this.g + other.g,this.b + other.b );
	}
	sub(other) {
        return new Color(this.r - other.r,this.g - other.g,this.b - other.b );
	}
	mul(num) {
        return new Color(this.r * num,this.g * num, this.b * num);
	}
	dist() {
		return Math.sqrt(this.r * this.r + this.g * this.g + this.b * this.b);
	}
	dist2() {
		return this.r * this.r + this.g * this.g + this.b * this.b;
	}
}

class Creature {
	constructor() {
		this.pos = new Vector(Math.random() * width, Math.random() * height);
		this.ang = Math.random() * Math.PI*2;
		this.neur = neu_net(8, 5, 2);
		this.fitness = 10;

		this.vAngle = 0.4 + (Math.random() * 0.5 - 0.25);
		this.baseVRange= 80 + (Math.random() * 50 - 25);
		this.vRange = this.baseVRange;

		this.bPos = new Vector(0, 0);
		this.bAng = 0;
		this.bShot = false;
		this.bSTimer = 1;

		this.size = 10;
        this.color = new Color(Math.floor(Math.random()*255),Math.floor(Math.random()*255),Math.floor(Math.random()*255));

        this.age = 1;
	}
    
    changeFitness(ch){
        this.fitness +=ch;
        
    }
    getSize(){
        var a = Math.sqrt(10 * 10 + this.fitness * 1 * 1);
        return Math.max(a,0);
    }
    getVRange(){
        return this.baseVRange + this.getSize() - 10;
    }

	draw(context)
	{
        var x1,y1,x2,y2;
        var m = Math.floor((this.fitness)*(255/minBirthFitness));
        ctx.fillStyle='rgb('+m+','+m+','+m+')';


        if(this.bShot){
            arc(this.bPos.x,this.bPos.y,2);
        }

        x1=this.pos.x+Math.cos(this.ang+2*this.vAngle)*this.getVRange();
        y1=this.pos.y+Math.sin(this.ang+2*this.vAngle)*this.getVRange();
        x2=this.pos.x+Math.cos(this.ang)*this.getVRange();
        y2=this.pos.y+Math.sin(this.ang)*this.getVRange();

        ctx.beginPath();
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(x1,y1);
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(x2,y2);
        ctx.arc(this.pos.x,this.pos.y,this.getVRange(),this.ang,this.ang+2*this.vAngle);
        ctx.stroke();
        ctx.closePath();

        x1=this.pos.x+Math.cos(this.ang)*this.getVRange();
        y1=this.pos.y+Math.sin(this.ang)*this.getVRange();
        x2=this.pos.x+Math.cos(this.ang-2*this.vAngle)*this.getVRange();
        y2=this.pos.y+Math.sin(this.ang-2*this.vAngle)*this.getVRange();

        ctx.beginPath();
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(x1,y1);
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(x2,y2);
        ctx.arc(this.pos.x,this.pos.y,this.getVRange(),this.ang-2*this.vAngle,this.ang);
        ctx.stroke();
        ctx.closePath();

        var radius = Math.max((4 *this.getSize() / 10) / renderScale,this.getSize());
        
        var c = Math.floor((this.fitness / minBirthFitness) * 255);
        ctx.fillStyle='rgb('+c+','+c+','+c+')';
        
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,radius,this.ang,this.ang+2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = 'rgb('+Math.floor(this.color.r)+','+Math.floor(this.color.g)+','+Math.floor(this.color.b)+')';
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,radius*2/3,this.ang,this.ang+2*Math.PI);
        ctx.fill();
        ctx.closePath();
	}
}
