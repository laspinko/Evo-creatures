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

	draw(context)
	{
        var x1,y1,x2,y2;
        var m = Math.floor((this.fitness-10)*(255/150));
        ctx.fillStyle='rgb('+m+','+m+','+m+')';


        if(this.bShot){
            arc(this.bPos.x,this.bPos.y,2);
        }

        x1=this.pos.x+Math.cos(this.ang+2*this.vAngle)*this.vRange;
        y1=this.pos.y+Math.sin(this.ang+2*this.vAngle)*this.vRange;
        x2=this.pos.x+Math.cos(this.ang)*this.vRange;
        y2=this.pos.y+Math.sin(this.ang)*this.vRange;

        ctx.beginPath();
        ctx.moveTo(this.pos.x, this.pos.y);
        ctx.lineTo(x1, y1);
        ctx.lineTo(x2, y2);
        ctx.lineTo(this.pos.x, this.pos.y);
        ctx.stroke();
        ctx.closePath();

        x1=this.pos.x+Math.cos(this.ang)*this.vRange;
        y1=this.pos.y+Math.sin(this.ang)*this.vRange;
        x2=this.pos.x+Math.cos(this.ang-2*this.vAngle)*this.vRange;
        y2=this.pos.y+Math.sin(this.ang-2*this.vAngle)*this.vRange;

        ctx.beginPath();
        ctx.moveTo(this.pos.x,this.pos.y);
        ctx.lineTo(x1,y1);
        ctx.lineTo(x2,y2);
        ctx.lineTo(this.pos.x,this.pos.y);
        ctx.stroke();
        ctx.closePath();

        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.size,this.ang,this.ang+2*Math.PI);
        ctx.fill();
        ctx.stroke();
        ctx.closePath();

        ctx.fillStyle = 'rgb('+Math.floor(this.color.r)+','+Math.floor(this.color.g)+','+Math.floor(this.color.b)+')';
        ctx.beginPath();
        ctx.arc(this.pos.x,this.pos.y,this.size*2/3,this.ang,this.ang+2*Math.PI);
        ctx.fill();
        ctx.closePath();
	}
}
