function count(i,line){
	var countArr = []; //存放雷及周围的数字
	// countArr = [ i-1-10左上,  i-10上,  i+1-10右上,  i-1左,  i,   i+1右,  i-1+10左下,  i+10下,  i+1+10右下 ]
	if( i%line==0 && i!=0 && i!=line*(line-1) ){
		countArr = [ i-line,i+1-line,i+1,i+line,i+1+line]   //左侧除两角
	}else if( i%line==line-1 && i!=line-1 && i!=line*line-1 ){
		countArr = [ i-1-line,i-line,i-1,i-1+line,i+line]   //右侧除两角
	}else if( Math.floor(i/line)==0 && i!=0 && i!=line-1){
		countArr = [ i-1,i+1,i-1+line,i+line,i+1+line]    //上部除两角
	}else if( Math.floor(i/line)==line-1 && i!=line*(line-1) && i!=line*line-1){
		countArr = [i-1-line,i-line,i+1-line,i-1,i+1]    //下部除两角
	}else if( i == 0){
		countArr = [1,line,line+1]//左上角
	}else if( i == line-1 ){
		countArr = [line-2,line+line-2,line-1+line]//右上角
	}else if( i == line*(line-1) ){
		countArr = [line*(line-1)-line,line*(line-1)-line+1,line*(line-1)+1]//左下角
	}else if( i == line*line-1 ){
		countArr = [line*line-2,(line*line-2)-line,(line*line-2)-line+1]//右下角
	}else{
		countArr = [i-1-line,  i-line , i+1-line,i-1,i+1,i-1+line, i+line ,i+1+line]
	}
	return countArr;
}
window.onload = function(){
	var oGbox = $( "#gameBox"),
		oTimespan = $( "#timespan"),
		oBombnum = $( "#bombnum"),
		level = $( "#level"),
		aInput = $( "input",level),
		over = $( "#over"),
		overP = $( "p",over)[0],
		overSpan = $( "span",over)[0],
		overInput = $( "input",over),
		oChoose = $('#choose'),
		aDiv = $( "div",oGbox );
	var onOff = true;   //判断 计时 开始
	var timernum = 0;  //记录时间的
	var gameTimer = null; //定时器 记录游戏时间
	var oLineNum = 10;
	var oChooseOnoff = true;
	oChoose.style.display = 'block';
	level.style.display = 'block';

	

	for (var i = 0; i < 3 ; i++){
		aInput[i].index = i;
		aInput[i].onclick = function(){

			oLineNum = (this.index+1)*10;
			console.log(oLineNum)
		}
	};
	aInput[3].onclick = function(){
		fun(oLineNum);
		oChoose.style.display = 'none';
		level.style.display = 'none';
		oChooseOnoff = false;
	}
	overInput[0].onclick = function(){
		oChoose.style.display = 'block';
		level.style.display = 'block';
		over.style.display = 'none';
		fun(oLineNum);
	}
	overInput[1].onclick = function(){
		oChoose.style.display = 'none';
		over.style.display = 'none';
		fun(oLineNum);
		oChooseOnoff = false;
	}


	function fun(lineNum){

		oTimespan.innerHTML = 0;
		timernum = 0;
		gameTimer = null;
		onOff = true;
		var divStr = '';  //生成div 的字符串
		var arr = [];   //存放雷
		var bombnumber = lineNum*lineNum/10;//雷数
		var aDivWidth = oGbox.clientWidth/lineNum;
		//var aDivWidth = 
		for (var i = 0; i < lineNum*lineNum ; i++){
			arr.push(i)
			l = ( i % lineNum)*aDivWidth;
			t = Math.floor( i /lineNum)*aDivWidth;
			divStr += '<div style="left:' + l + 'px;top:' + t + 'px;line-height:' +  (aDivWidth-2)  + 'px;width:' + (aDivWidth-2) + 'px;height:' + (aDivWidth-2) + 'px;"></div>'
		};
		oGbox.innerHTML = divStr;
		//随机打乱数组
		arr.sort(function (){
			return Math.random() - 0.5;		
		})
		arr.length = bombnumber;
		oBombnum.innerHTML = bombnumber;
		oTimespan.innerHTML = timernum;
		//填充周围地雷的个数
		for( var i = 0; i < aDiv.length; i++){
			var n = 0;                         
			for( var j = 0; j < count(i,lineNum).length  ; j++){
				for( var k = 0; k <  arr.length ; k++){
					if( i == arr[k] ){                                          
						continue;
					}else{
						aDiv[i].innerHTML =  n; 
						
					}
					if( count(i,lineNum)[j] === arr[k] ){
						n++;
					}                                                         
				}    
			};  
			if( aDiv[i].innerHTML ==  0 ){
				aDiv[i].notbomb = true;
				aDiv[i].innerHTML = ''
			}  
		};
		for (var i = 0; i < arr.length ; i++){ //找到雷 并改变其样式
			//aDiv[arr[i]].className = 'isbomb';
			aDiv[arr[i]].innerHTML = '雷';
			aDiv[arr[i]].isbomb = true;
		};
		function bian(num,lines){  //点击 开div
			var newArr = count(num,lines);
			for (var j = 0; j < newArr.length ; j++){
				if( aDiv[newArr[j]].className == 'open' ) continue;
				if( !aDiv[newArr[j]].isbomb && aDiv[newArr[j]].className == ''){
					aDiv[newArr[j]].className = 'open';
				}
				if( !!aDiv[newArr[j]].notbomb && !aDiv[newArr[j]].clickonOff  ){
					var abc= lines;
					console.log(abc)
					bian(newArr[j],abc)
				}
			};
		}
		for (var i = 0; i < aDiv.length ; i++){
			aDiv[i].index = i;
			aDiv[i].onclick = function(){

				if( this.clickonOff || oChooseOnoff) return;//判断是否标记，未标记可点，否则不能点

				if( onOff ){
					onOff = false;
					gameTimer = setInterval(function(){
						oTimespan.innerHTML = ++timernum;
						if( timernum === 999 ){
							clearInterval( gameTimer );
							oChoose.style.display = 'block';
							over.style.display = 'block';
							overP.innerHTML = '时间到!<br/>很遗憾未能得到松果!';
							overSpan.innerHTML = timernum + 's' ;
							oChooseOnoff = true;
						}
					},1000)
				};
				var isok = true;   //判断你是否 通关
				for (var j = 0; j < arr.length ; j++){
					if( this.index === arr[j] ){  //判断点击元素是不是雷
						oChooseOnoff = true;
						setTimeout(function(){
							clearInterval( gameTimer );
							oChoose.style.display = 'block';
							over.style.display = 'block';
							overP.innerHTML = 'Game Over!<br/>很遗憾未能得到松果!';
							overSpan.innerHTML = timernum + 's' ;
						},2000) //失败弹出窗
						
						for (var j = 0; j < arr.length ; j++){
							aDiv[arr[j]].className = 'bombbj';	
						};
						break;
					}else{
						if(!!this.notbomb){  //判断该点击元素周围是否有雷
							//console.log()
							bian(this.index,lineNum)
						}
						this.className = 'open';
					}
				}
				for (var i = 0; i < aDiv.length ; i++){
					if( !aDiv[i].isbomb && aDiv[i].className !== 'open' ){ //判断 素有不是雷的元素 有没有打开 若果有一个没有打开那么 就不通关
						isok = false;
						break;
					}
				};
				if( isok ){
					clearInterval( gameTimer );
					oChoose.style.display = 'block';
					over.style.display = 'block';
					overP.innerHTML = 'You Win!<br/>恭喜您得到一枚松果!';
					overSpan.innerHTML = timernum + 's' ;
					
					oChooseOnoff = true;

					//fun(lineNum);
				}
			};
			aDiv[i].oncontextmenu = function(){
				if(oChooseOnoff) return;
				if( this.className == '' ){
					this.className = 'hongqi';
					bombnumber--;
					oBombnum.innerHTML = bombnumber;
					this.clickonOff = true;
				}else if( this.className == 'hongqi' ){
					this.className = 'wenhao';
					bombnumber++;
					oBombnum.innerHTML = bombnumber;
					this.clickonOff = true;
				}else if( this.className == 'wenhao' ){
					this.className = '';
					this.clickonOff = false;
				}
				return false;
			}
		};
	}
	
}