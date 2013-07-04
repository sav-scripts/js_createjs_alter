// JavaScript Document
function SimplePreloading()
{
	var _p = this;
	this.containerDom = null;
	this.icons = null;
	this.playing = false;
	this.delay = 30;
	this.duration = 1000;
	this.current = 0;
	
	this.popInCenter = function()
	{
		var container = document.getElementsByName("body");
		
		var iconSize = 10;
		var iconGap = 20;
		
		var iconColor0 = "#FF80C0";
		var iconColor1 = "#CEE882";
		var iconColor2 = "#7BBFF2";
		
		var centerX = window.innerWidth/2 - iconGap/2 - iconGap;
		var centerY =  window.innerHeight/2 - iconGap/2;
		var topZ = getTopZIndex() + 1;
		
		var css = "position:absolute;z-index:"+topZ+";left:0px;top:0px;width:100%;height:100%; ";
		css += "";
		
		var coverDiv = "<div style='position:absolute;left:0px;top:0px;width:100%;height:100%;background:#000; opacity:.3; '></div>";
		
		var iconCss, iconDiv, iconColor;
		
		iconColor = "#FF80C0";
		iconCss = "position:absolute; top:"+centerY+"px; left:"+centerX+"px; width:"+iconSize+"px; height:"+iconSize+"px; background:"+iconColor+"; ";
		iconDiv += "<div class='loading_icon' style='"+iconCss+"'></div>";
		
		centerX += iconGap;
		iconColor = "#CEE882";
		iconCss = "position:absolute; top:"+centerY+"px; left:"+centerX+"px; width:"+iconSize+"px; height:"+iconSize+"px; background:"+iconColor+"; ";
		iconDiv += "<div class='loading_icon' style='"+iconCss+"'></div>";
		
		centerX += iconGap;
		iconColor = "#7BBFF2";
		iconCss = "position:absolute; top:"+centerY+"px; left:"+centerX+"px; width:"+iconSize+"px; height:"+iconSize+"px; background:"+iconColor+"; ";
		iconDiv += "<div class='loading_icon' style='"+iconCss+"'></div>";
		
		this.containerDom = document.createElement('div');
		this.containerDom.innerHTML = "<div style='"+css+"'> "+ coverDiv+iconDiv+" </div>";
		
		document.body.appendChild(this.containerDom);
		
		this.icons = document.getElementsByClassName('loading_icon');
		
		this.current = 0;
		this.playing = true;
		update();
	}
	
	this.destroy = function()
	{
		this.playing = false;
		if(this.containerDom)
		{
			document.body.removeChild(this.containerDom);
			this.containerDom = null;
			this.icons = null;
		}
	}
	
	function update()
	{
		if(_p.containerDom && _p.icons)
		{
			_p.current += _p.delay;
			if(_p.current > _p.duration) _p.current -= _p.duration;
			
			var progress = _p.current / _p.duration;
			
			var i=0, n=_p.icons.length;
			for(i=0;i<n;i++)
			{
				var fullAlphaDelta = i/n;
				var zeroAlphaDelta = fullAlphaDelta + .5;
				if(zeroAlphaDelta > 1) zeroAlphaDelta -= 1;
				
				var delta = progress - fullAlphaDelta;
				if(delta < 0) delta *= -1;
				if(delta > .5) delta = 1-delta;
				
				_p.icons[i].style.opacity = delta/.5;
			}
			
			if(_p.playing == true) setTimeout(update, _p.delay);
		}
	}
	
	function getTopZIndex(elem)
	{
		if(elem == null) elem = "*";
		var elems = document.getElementsByTagName(elem);
		var highest = 0;
		for (var i = 0; i < elems.length; i++)
		{
			var zindex=document.defaultView.getComputedStyle(elems[i],null).getPropertyValue("z-index");
			if ((zindex > highest) && (zindex != 'auto')) highest = zindex;
		}
		return highest;
	}
}
