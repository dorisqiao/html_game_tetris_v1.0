/*定义格子类型Cell*/
//定义构造函数Cell，只接收2个参数r、c
function Cell(r,c){
	this.r=r;//为当前对象添加r属性，值为变量r
	this.c=c;//为当前对象添加c属性，值为变量c
	this.src="";//为当前对象添加src属性，值为变量""
}

//定义旋转状态类型
//定义构造函数state，接收8个参数r0,c0,r1,c1,r2,c2,r3,c3
function State(r0,c0,r1,c1,r2,c2,r3,c3){
	//为当前对象添加属性rn，cn
	this.r0=r0;
	this.c0=c0;
	this.r1=r1;
	this.c1=c1;
	this.r2=r2;
	this.c2=c2;
	this.r3=r3;
	this.c3=c3;
}

/*抽象出公共父类型Shape*/
//定义父类型构造函数Shape，定义参数src，cells
function Shape(src,cells,orgi,states){
	this.cells=cells;//为当前对象添加cells属性，值为变量cells
	//遍历当前对象的cells中每个cell对象，设置其src属性为当前对象的src属性
	for (var i=0; i<this.cells.length; i++)
	{
		this.cells[i].src=src;
	}
	this.orgi=orgi;//为所有图形添加参照格属性
	this.states=states;
	this.statei=0;
}
//在shape类型的原型对象中，添加一个共有属性IMGS，值为一个对象：{T:"img/T.png",O:"imgs/O.png"...}
Shape.prototype.IMGS={
	T:"img/T.png",
	O:"img/O.png",
	I:"img/I.png",
	J:"img/J.png",
	L:"img/L.png",
	S:"img/S.png",
	Z:"img/Z.png"
}
Shape.prototype.moveDown=function(){
	for (var i=0; i<this.cells.length; i++)
	{
		this.cells[i].r++;
	}
}
Shape.prototype.moveLeft=function(){
	for (var i=0; i<this.cells.length; i++)
	{
		this.cells[i].c--;
	}
}
Shape.prototype.moveRight=function(){
	for (var i=0; i<this.cells.length; i++)
	{
		this.cells[i].c++;
	}
}
Shape.prototype.rotate=function(){
	var state=this.states[this.statei];
	var orgCell=this.cells[this.orgi];
	for (var i=0; i<this.cells.length; i++)
	{
		if (i!=this.orgi)
		{
			var cell=this.cells[i];
			cell.r=orgCell.r+state["r"+i];
			cell.c=orgCell.c+state["c"+i];
		}
	}
}
Shape.prototype.rotateR=function(){
	this.statei++;
	if(this.statei==this.states.length){this.statei=0};
	this.rotate();
}
Shape.prototype.rotateL=function(){
	this.statei--;
	if(this.statei==-1){this.statei=this.states.length-1};
	this.rotate();
}

//定义构造函数T，不需要参数
function T(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[cells(注意cells是个数组)]
	Shape.call(this,this.IMGS.T,[
		new Cell(0,3),//实例化第1个cell对象，传入位置0,3
		new Cell(0,4),//实例化第2个cell对象，传入位置0,4
		new Cell(0,5),//实例化第3个cell对象，传入位置0,5
		new Cell(1,4),//实例化第4个cell对象，传入位置1,4
	],1,[
		new State(0,-1,0,0,0,1,1,0),
		new State(-1,0,0,0,1,0,0,-1),
		new State(0,1,0,0,0,-1,-1,0),
		new State(1,0,0,0,-1,0,0,1)
	]);
}
//让T类型的原型继承Shape类型的原型
Object.setPrototypeOf(T.prototype,Shape.prototype);

//定义构造函数O，不需要参数
function O(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[
	Shape.call(this,this.IMGS.O,[
		new Cell(0,4),//实例化第1个cell对象，传入位置0,3
		new Cell(0,5),//实例化第2个cell对象，传入位置0,4
		new Cell(1,4),//实例化第3个cell对象，传入位置0,5
		new Cell(1,5),//实例化第4个cell对象，传入位置1,4
	],0,[
		new State(0,0,0,1,1,0,1,1),
	]);
}
//让O类型的原型继承Shape类型的原型
Object.setPrototypeOf(O.prototype,Shape.prototype);

//定义构造函数I，不需要参数
function I(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[
	Shape.call(this,this.IMGS.I,[
		new Cell(0,3),//实例化第1个cell对象，传入位置0,3
		new Cell(0,4),//实例化第2个cell对象，传入位置0,4
		new Cell(0,5),//实例化第3个cell对象，传入位置0,5
		new Cell(0,6),//实例化第4个cell对象，传入位置1,4
	],1,[
		new State(0,-1,0,0,0,1,0,2),
		new State(-1,0,0,0,1,0,2,0)
	]);
};
//让I类型的原型继承Shape类型的原型
Object.setPrototypeOf(I.prototype,Shape.prototype);

//定义构造函数I，不需要参数
function J(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[
	Shape.call(this,this.IMGS.J,[
		new Cell(0,4),//实例化第1个cell对象，传入位置0,3
		new Cell(1,4),//实例化第2个cell对象，传入位置0,4
		new Cell(2,4),//实例化第3个cell对象，传入位置0,5
		new Cell(2,3),//实例化第4个cell对象，传入位置1,4
	],1,[
		new State(-1,0,0,0,1,0,1,-1),
		new State(0,1,0,0,0,-1,-1,-1),
		new State(1,0,0,0,-1,0,-1,1),
		new State(0,-1,0,0,0,1,1,1)
	]);
}
//让J类型的原型继承Shape类型的原型
Object.setPrototypeOf(J.prototype,Shape.prototype);

//定义构造函数I，不需要参数
function L(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[
	Shape.call(this,this.IMGS.L,[
		new Cell(0,4),//实例化第1个cell对象，传入位置0,3
		new Cell(1,4),//实例化第2个cell对象，传入位置0,4
		new Cell(2,4),//实例化第3个cell对象，传入位置0,5
		new Cell(2,5),//实例化第4个cell对象，传入位置1,4
	],1,[
		new State(-1,0,0,0,1,0,1,1),
		new State(0,1,0,0,0,-1,1,-1),
		new State(1,0,0,0,-1,0,-1,-1),
		new State(0,-1,0,0,0,1,-1,1)
	]);
}
//让L类型的原型继承Shape类型的原型
Object.setPrototypeOf(L.prototype,Shape.prototype);

//定义构造函数I，不需要参数
function S(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[
	Shape.call(this,this.IMGS.S,[
		new Cell(0,6),//实例化第1个cell对象，传入位置0,3
		new Cell(0,5),//实例化第2个cell对象，传入位置0,4
		new Cell(1,5),//实例化第3个cell对象，传入位置0,5
		new Cell(1,4),//实例化第4个cell对象，传入位置1,4
	],1,[
		new State(0,1,0,0,1,0,1,-1),
		new State(1,0,0,0,0,-1,-1,-1),
		new State(0,-1,0,0,-1,0,-1,1),
		new State(-1,0,0,0,0,1,1,1)
	]);
}
//让S类型的原型继承Shape类型的原型
Object.setPrototypeOf(S.prototype,Shape.prototype);

//定义构造函数I，不需要参数
function Z(){
	//借用构造函数Shape，传入参数：this.IMGS.T,[
	Shape.call(this,this.IMGS.Z,[
		new Cell(0,5),//实例化第1个cell对象，传入位置0,3
		new Cell(0,6),//实例化第2个cell对象，传入位置0,4
		new Cell(1,4),//实例化第3个cell对象，传入位置0,5
		new Cell(1,5),//实例化第4个cell对象，传入位置1,4
	],1,[
		new State(0,-1,0,0,1,0,1,1),
		new State(-1,0,0,0,0,-1,1,-1)
	]);
}
//让Z类型的原型继承Shape类型的原型
Object.setPrototypeOf(Z.prototype,Shape.prototype);