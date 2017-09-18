var tetris={
	OFFSET:15,//保存容器的内边距
	CSIZE:26,//格子的宽高
	shape:null,//保存正在下落的主角图形
	interval:500,//保存图形下落的速度
	timer:null,
	wall:null,//保存所有已经停止的下落的方块的二维数组
	RN:20,//wall的总行数
	CN:10,//wall的总列数
	lines:0,//保存消除的总行数
	score:0,//保存当前得分

	state:1,//保存当前游戏状态
	RUNNING:1,
	PAUSE:2,
	GAMEOVER:0,

	LN:10,//每10行一级，控制难度等级
	LNINTERVAL:100,//每升一级，interval减少100毫秒
	MIN:100,
	level:1,

	nextShape:null,//备胎
	SCORES:[0,10,50,120,200],
		  //0  1  2  3   4
	start:function(){//游戏启动的方法
		this.interval=1000;
		this.level=1;
		this.state=this.RUNNING;
		this.lines=0;
		this.score=0;
		//将wall初始化为空数组
		this.wall=[];
		//r从0开始，到<RN结束，每次增1
		for(var r=0;r<this.RN;r++){
			//设置wall中r位置的行为CN个元素的空数组
			this.wall[r]=new Array(this.CN);
		}
		//随机生成主角图形，保存在shape中
		this.shape=this.randomShape();
		//随机生成备胎
		this.nextShape=this.randomShape();
		this.paint();//调用paintShape绘制主角图形
		//启动周期性定时器,设置任务函数为moveDown，提前绑定this,时间间隔为interval
		this.timer=setInterval(this.moveDown.bind(this),this.interval);
		var me=this;
		document.onkeydown=function(e){//this->document
			//e保存了事件发生时的信息
			switch(e.keyCode){//获得按键号
				case 37: if(me.state==me.RUNNING){me.moveLeft()}; break;	//左箭头
				case 38: if(me.state==me.RUNNING){me.rotateR()}; break;	//上箭头
				case 39: if(me.state==me.RUNNING){me.moveRight()}; break;	//右箭头
				case 40: if(me.state==me.RUNNING){me.moveDown()}; break;	//下箭头
				case 90: if(me.state==me.RUNNING){me.rotateL()}; break;	//Z键
				case 83: if(me.state==me.GAMEOVER){me.start()}; break;

				case 80: if(me.state==me.RUNNING){me.pause()};break;//暂停
				case 67: if(me.state==me.PAUSE){me.myContinue()};break;//继续游戏
				case 81: if(me.state!=me.GAMEOVER){me.quit()};break;//退出
				case 32: if(me.state==me.RUNNING){me.hardDrop()};break;//一落到底
			}
		};
	},
	hardDrop:function(){//一落到底
		while(this.canDown()){
		  this.shape.moveDown();
		}
		this.paint();
	},
	quit:function(){
		this.state=this.GAMEOVER;//修改游戏状态为GAMEOVER
		clearInterval(this.timer);this.timer=null;//停止定时器
		this.paint();
	},
	myContinue:function(){
		this.state=this.RUNNING;
		this.paint();
	},
	pause:function(){
		this.state=this.PAUSE;
		this.paint();
	},
	rotateR:function(){//专门负责右转一次
		this.shape.rotateR();
		!this.canRotate()?this.shape.rotateL():this.paint();
	},
	canRotate:function(){//专门检测能否旋转
		for (var i=0; i<this.shape.cells.length; i++)
		{
			var cell=this.shape.cells[i];
			if(cell.r>19||cell.r<0||cell.c<0||cell.c>9||
				this.wall[cell.r][cell.c]!==undefined){
				return false;
			}
		}
		return true;
	},
	rotateL:function(){//专门负责左转一次
		this.shape.rotateL();
		!this.canRotate()?this.shape.rotateR():this.paint();
	},
	moveLeft:function(){
		//如果可以左移
		if(this.canLeft()){this.shape.moveLeft();this.paint();};//调用shape的moveLeft方法
	},
	canLeft:function(){
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
		  //将当前cell临时存储在变量cell中
		  var cell=this.shape.cells[i];
		  //如果cell的c已经等于0或wall中cell的左方位置不等于undefined
		  if(cell.c==0||this.wall[cell.r][cell.c-1]!==undefined){
			return false;//返回false
		  }
		}//(遍历结束)
		return true;//返回true
	},
	moveRight:function(){
		//如果可以右移
		if(this.canRight()){this.shape.moveRight();this.paint();};//调用shape的moveRight方法
	},
	canRight:function(){
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
		  //将当前cell临时存储在变量cell中
		  var cell=this.shape.cells[i];
		  //如果cell的c已经等于CN-1或wall中cell的右方位置不等于undefined
		  if(cell.c==this.CN-1||this.wall[cell.r][cell.c+1]!==undefined){
			return false;//返回false
		  }
		}//(遍历结束)
		return true;//返回true
	},
	canDown:function(){//专门用于检测能否下落
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
		  //将当前cell临时存储在变量cell中
		  var cell=this.shape.cells[i];
		  //如果cell的r已经等于19或wall中cell的下方位置不等于undefined
		  if(cell.r==this.RN-1||this.wall[cell.r+1][cell.c]!==undefined){
			return false;//返回false
		  }
		}//(遍历结束)
		return true;//返回true
	},
	moveDown:function(){//负责将图形下落一次
	  if(this.state==this.RUNNING){//如果游戏正在进行中	
		//如果可以下落
		if(this.canDown()){
		  this.shape.moveDown();//调用shape的moveDown方法
		}else{//否则,不能下落
		  this.landIntoWall();//调用landIntoWall，将shape放入墙中
		  var ln=this.deleteRows();//调用deleteRows，删除满行
		  this.lines+=ln;//将ln累加到lines中
		  this.score+=this.SCORES[ln];//计算分数
		  //如果lines>level*LN
          if(this.lines>this.level*this.LN){
            this.level++;//level+1
            if(this.interval>this.MIN){//如果interval>MIN
              //将interval-LNINTERVAL
              this.interval-=this.LNINTERVAL;
              clearInterval(this.timer);//停止定时器
              this.timer=setInterval(//重新启动定时器
                this.moveDown.bind(this),this.interval);
            }
          }
		  if(this.isGameOver()){
			  this.quit();
		  }else{
			  this.shape=this.nextShape;//备胎转正
			  this.nextShape=this.randomShape();//生成新备胎
		  }
		}
		this.paint();//调用paintShape，绘制主角图形
	  }
	},
	paintState:function (){//专门根据游戏状态显示图片
		if (this.state==this.PAUSE)
		{
			var img=new Image();
			img.src="img/pause.png";
			pg.appendChild(img);
		}else if(this.state==this.GAMEOVER){
			var img=new Image();
			img.src="img/game-over.png";
			pg.appendChild(img);
		}
	},
	isGameOver:function(){
		for (var i=0; i<this.nextShape.cells.length; i++)
		{
			var cell=this.nextShape.cells[i];
			if(this.wall[cell.r][cell.c]!==undefined){return true;}
		}
		return false;
	},
	deleteRows:function(){//检测wall中当前行要不要删除（是不是满的）
		//自底向上遍历wall中每一行，同时声明变量ln=0,如果当前行是空行，直接退出循环
		for(var ln=0,r=this.RN-1;r>=0&&this.wall[r].join("")!="";r--){
			//如果当前行是满格
			if(this.isFull(r)){
				//调用deleteRow，删除当前行；r留在原地；ln+1；
				this.deleteRow(r);r++;ln++;
				//如果ln=4了，就退出循环
				if(ln==4){break;}
			}
		}
		return ln;
	},
	paintScore:function(){
		//设置id为lines的元素的内容为lines属性
		lines.innerHTML=this.lines;
		//设置id为score的元素的内容为score属性
		score.innerHTML=this.score;
		//设置id为level的元素的内容为level属性
		level.innerHTML=this.level;
	},
	deleteRow:function(delr){//删除wall中的一行
		for (var r=delr; r>0; r--)
		{
			this.wall[r]=this.wall[r-1];
			this.wall[r-1]=new Array(this.CN);
			for (var i=0; i<this.CN; i++)
			{
				var cell=this.wall[r][i];
				cell!==undefined&&cell.r++;
			}
			if(this.wall[r-2].join("")==""){break;}
		}
	},
	isFull:function(r){//判断wall中第r行是否是满行
		var reg=/^,|,,|,$/;
		return String(this.wall[r]).search(reg)==-1
	},
	randomShape:function(){//专门随机创建一个图形
		//在0~6之间生成随机数，保存在变量r中
		var r=parseInt(Math.random()*7);
		//判断r
		switch(r){//switch case进行的是全等比较，本例中case的值不能加引号
		  case 0:return new I();//如果是0：返回一个新的O类型的图形对象
		  case 1:return new T();//如果是1：返回一个新的I类型的图形对象
		  case 2:return new J();//如果是2：返回一个新的T类型的图形对象
		  case 3:return new L();
		  case 4:return new Z();
		  case 5:return new S();
		  case 6:return new O();
		}
	},
	landIntoWall:function(){//专门负责将主角放入wall中
		//遍历shape中每个cell
		for(var i=0;i<this.shape.cells.length;i++){
		  var cell=this.shape.cells[i];//将当前cell临时存储在变量cell中
		  this.wall[cell.r][cell.c]=cell;//将当前cell赋值给wall中相同位置
		}
	},
	paintWall:function(){//专门绘制墙中所有方块
		//创建文档片段frag
		var frag=document.createDocumentFragment();
		//自底向上遍历wall中每行的每个cell
		for(var i=this.RN-1;i>=0&&(this.wall[i].join("")!="");i--){
			 for(var j=this.CN-1;j>=0;j--){
				var cell=this.wall[i][j];//将当前格子，保存在变量cell中
				if(cell!=null){
				  //创建一个新Image对象，保存在变量img中
				  var img=new Image();
				  img.src=cell.src;//设置img的src为cell的src
				  //设置img的top为OFFSET+cell的r*CSIZE
				  img.style.top=this.OFFSET+cell.r*this.CSIZE+"px";
				  //设置img的left为OFFSET+cell的c*CSIZE
				  img.style.left=this.OFFSET+cell.c*this.CSIZE+"px";
				  frag.appendChild(img);//将img追加到frag中
				}
			}
		}//(遍历结束)
		//将frag追加到pg中
		pg.appendChild(frag);
	},
	paintNext:function(){
		//创建一个文档片段，保存在frag中
		var frag=document.createDocumentFragment();
		for (var i=0;i<this.nextShape.cells.length;i++)
		{
			var cell=this.nextShape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+(cell.r+1)*this.CSIZE+"px";
			img.style.left=this.OFFSET+(cell.c+10)*this.CSIZE+"px";
			frag.appendChild(img);
		}
		pg.appendChild(frag);
	},
	paint:function(){//重绘一切
		var reg=/<img[^>]*>/g;
		//用reg删除pg的内容中的所有img,结果再保存回pg的内容中
		pg.innerHTML=pg.innerHTML.replace(reg,"");
		this.paintShape();//绘制主角
		this.paintWall();//绘制墙
		this.paintScore();//绘制分数
		this.paintNext();//绘制备胎
		this.paintState();//绘制状态图片
	},
	paintShape:function(){//专门绘制主角图形
		//创建一个文档片段，保存在frag中
		var frag=document.createDocumentFragment();
		for (var i=0;i<this.shape.cells.length;i++)
		{
			var cell=this.shape.cells[i];
			var img=new Image();
			img.src=cell.src;
			img.style.top=this.OFFSET+(cell.r)*this.CSIZE+"px";
			img.style.left=this.OFFSET+(cell.c)*this.CSIZE+"px";
			frag.appendChild(img);
		}
		pg.appendChild(frag);
	}

};
window.onload=function(){
	tetris.start();
};