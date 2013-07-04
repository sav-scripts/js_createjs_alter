// jQuery API is needed
(function()
{
	function KeyHandlerInstance()
	{
		var _p = this;
		var _pressDic = {};
		var _keydownDic = {};
		var _keyupDic = {};
		var _keyPressing = {};
		
		this.bindListener = function(listenerLabel)
		{
			$(listenerLabel).keydown(function(evt)
			{
				//console.log(evt.keyCode);
				if(_keyPressing[evt.keyCode] == undefined || _keyPressing[evt.keyCode] == false)
				{				
					//console.log("key["+evt.keyCode+"] down");
					_keyPressing[evt.keyCode] = true;
					var array = _keydownDic[evt.keyCode];
					if(array)
					{
						for(var i=0;i<array.length;i++)
						{
							array[i].func.apply(null);
						}
					}
					
					array = _pressDic[evt.keyCode];
					if(array)
					{
						for(var i=0;i<array.length;i++)
						{
							var keyObj = array[i];
							pressingCaller(keyObj);
						}
					}
				}
			});
			
			$(listenerLabel).keyup(function(evt)
			{
				_keyPressing[evt.keyCode] = false;
				var array = _keyupDic[evt.keyCode];
				if(array)
				{
					for(var i=0;i<array.length;i++)
					{
						array[i].func.apply(null);
					}
				}
			});
		}
		
		function pressingCaller(keyObj)
		{
			keyObj.func.apply(null);
			
			if(_keyPressing[keyObj.keyCode]) setTimeout(function()
			{
				pressingCaller(keyObj);
			}, keyObj.interval*1000);
		}
		
		/*
			
			type		keydown, keyup, press
			keycode		keyCode of keyboard event
			func		callback func
			interval	sec
		*/
		this.registKey = function(type, keyCode, func, interval)
		{
			if(interval == null) interval = .1;
			var dic = getDic(type);
			var keyObj = getKeyObj(dic, keyCode, func);
			
			if(keyObj)
			{
				keyObj.func = func;
				keyObj.interval = interval;
				return;
			}
			
			obj = new KeyObj(type, keyCode, func, interval);
			
			var array = dic[keyCode];
			if(!array) { dic[keyCode] = array = []; }
			
			array.push(obj);
		}
		
		function getDic(type)
		{
			var dic;
			if(type == "press")
				dic = _pressDic;
			else if(type == "keydown")
				dic = _keydownDic;
			else if(type == "keyup")
				dic = _keyupDic;
			
			if(!dic) { console.error("illegal key interactive type: " + type); return null; }
			return dic;
		}
		
		function getKeyObj(dic, keyCode, func)
		{
			var array = dic[keyCode];
			if(array)
			{
				var i, n = array.length;
				for(i=0;i<n;i++)
				{
					var keyObj = array[i];
					if(keyObj.func == func) return keyObj;
				}
			}
			return null;
		}
		
		this.unregistKey = function(type, keyCode, funcOrAll)
		{
			var dic = getDic(type);
			if(funcOrAll === "all")
			{
				 delete dic[keyCode];
			}
			else
			{
				var array = dic[keyCode];
				if(array)
				{
					var index = -1;
					var i, n = array.length;
					for(i=0;i<n;i++)
					{
						var keyObj = array[i];
						if(keyObj.func == funcOrAll) { index = i; continue; }
					}
					
					if(index != -1) array.splice(index, 1);
					if(array.length == 0) delete dic[keyCode];
				}
			}
		}
	}
	
	function KeyObj(type, keyCode, func, interval)
	{
		this.type = type;
		this.keyCode = keyCode;
		this.func = func;
		this.interval = interval;
	}
	
	var instance = new KeyHandlerInstance();
	window.KeyHandler = instance;
	
}());

