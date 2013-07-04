(function()
{
	var Clip3D = function()
	{
		this.initialize();
	}
	var _p = Clip3D.prototype = new createjs.Container();
	
	_p.x3d = 0;
	_p.y3d = 0;
	_p.z3d = 0;
	_p.z;
	_p.initScale = 1;
	
	_p.Container_initialize = _p.initialize;
	_p.initialize = function()
	{
		this.Container_initialize();
	}
	
	_p.destroy = function()
	{
		_p.parent.removeChild(p);
	}
	
	window.Clip3D = Clip3D;
}());

function Simple3DSpcae(parentContainer, focalLength)
{
	var _p = Simple3DSpcae.prototype = this;
	
	this.clipList = [];
	this.container = new createjs.Container();
	
	var _autoId = 0;
	var _posX = 0;
	var _posY = 0;
	var _posZ = 0;
	var _arcX = 0;
	var _arcY = 0;
	var _arcZ = 0;
	var _cosX, _sinX, _cosY, _sinY, _cosZ, _sinZ;
	var _focalLength = 600;
	
	this.ccx = 0;
	
	/*
	Object.defineProperty(Simple3DSpcae.prototype, "posX", {
    get: function() {return this.ccx; },
    set: function(v) { this.ccx = v; }
	});
	*/
	
	Object.defineProperty(Simple3DSpcae.prototype, "posX", {
	    get: function() {return _posX; },
	    set: function(v) { _posX = v; } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "posY", {
	    get: function() {return _posY; },
	    set: function(v) { _posY = v; } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "posZ", {
	    get: function() {return _posZ; },
	    set: function(v) { _posZ = v; } });
		
		
	Object.defineProperty(Simple3DSpcae.prototype, "arcX", {
	    get: function() {return _arcX; },
	    set: function(v) { _arcX = v; } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "arcY", {
	    get: function() {return _arcY; },
	    set: function(v) { _arcY = v; } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "arcZ", {
	    get: function() {return _arcZ; },
	    set: function(v) { _arcZ = v;	 } });
	
	/*
	this.__defineGetter__("posX", function(){ return _posX; });
	this.__defineSetter__("posX", function(v){ _posX = v; });
	this.__defineGetter__("posY", function(){ return _posY; });
	this.__defineSetter__("posY", function(v){ _posY = v });
	this.__defineGetter__("posZ", function(){ return _posZ; });
	this.__defineSetter__("posZ", function(v){ _posZ = v });
	*/
	

	this.addClip = function(clip, id, idToClipName)
	{
		if(id == null) { id = "clip_" + _autoId; _autoId++; }
		if(idToClipName == null) idToClipName = true;
		
		if(this.clipList[id]) console.warn("warning: there is already clip id["+id+"] registed.");
		
		if(idToClipName) clip.name = id;
		this.container.addChild(clip);
		this.clipList[id] = clip;
	}
	
	this.listClips = function()
	{
		for(var key in this.clipList)
		{
			console.log("id["+key+"]  clip[" + this.clipList[key] + "]");
		}
	}
	
	this.setSpace = function(x,y,z,arcXaxis, arcYaxis, arcZaxis)
	{
		if(x != null) _posX = x;
		if(y != null) _posY = y;
		if(z != null) _posZ = z;
		
		if(arcXaxis != null) this.arcX = arcXaxis;
		if(arcYaxis != null) this.arcY = arcYaxis;
		if(arcZaxis != null) this.arcZ = arcZaxis;
		
		
		//this.cameraLookAtCenter();
		
		/*
		_cosX = Math.cos(_arcX);
		_sinX = Math.sin(_arcX);
		
		_cosY = Math.cos(_arcY);
		_sinY = Math.sin(_arcY);
		
		_cosZ = Math.cos(_arcZ);
		_sinZ = Math.sin(_arcZ);
		*/
	}
	
	this.cameraLookAtCenter = function()
	{
		var arcZ = Math.atan2(_posY, _posX);
		var arcY = Math.atan2(-_posZ, _posX);
		var arcX = Math.atan2(_posY, -_posZ);
		
		
		var caz = Math.PI/2;
		
		this.arcX = -arcX;
		this.arcY = arcY - caz;
		//this.arcZ = arcZ;
		
		console.log("(" + _arcX + ", " + _arcY + ", " + _arcZ + ")");
		
		//console.log(Math.atan2(1,0));
	}
	
	this.resetSpace = function()
	{
		this.arcX = 0;
		this.arcY = 0;
		this.arcZ = 0;
		
		this.setSpace(0, 0, -_focalLength);
		/*
		this.posX = 0;
		this.posY = 0;
		this.posZ = -this.focalLength;
		this.cameraLookAtCenter();
		*/
	}
	
	this.update = function(clipCallBack)
	{
		_cosX = Math.cos(_arcX); 
		_sinX = Math.sin(_arcX);
		
		_cosY = Math.cos(_arcY); 
		_sinY = Math.sin(_arcY);
		
		_cosZ = Math.cos(_arcZ); 
		_sinZ = Math.sin(_arcZ);
		
		for(var id in this.clipList)
		{
			var clip = this.clipList[id];
			
			// rotating axis clock wise
			var x = clip.x3d + _posX;
			var y = clip.y3d + _posY;
			var z = clip.z3d + _posZ;
			
			var x0 = x * _cosY + z * _sinY;
			var y0 = y;
			var z0 = -x * _sinY + z * _cosY;
			
			
			var x1 = x0;
			var y1 = y0 * _cosX - z0 * _sinX;
			var z1 = y0 * _sinX - z0 * _cosX;
			
			
			/*
			var x1 = x0;
			var y1 = y0;
			var z1 = z0;
			*/
			
			
			if(_arcZ != 0)
			{
				var x2 = x1*_cosZ - y1*_sinZ;
				var y2 = x1*_sinZ + y1*_cosZ;
				
				x1 = x2;
				y1 = y2;
			}
			
			
			var scaleRatio = _focalLength / (_focalLength + z1);
			
			//if(scaleRatio < 0 || z1 > _focalLength)
			//if(scaleRatio < 0 || z1 < 0)
			if(scaleRatio < 0)
			{
				clip.visible = false;
			}
			else
			{
				clip.visible = true;
				
				clip.scaleX = clip.scaleY = scaleRatio * clip.initScale;
				
				clip.x = x1 * scaleRatio;
				clip.y = y1 * scaleRatio;
				clip.z = z1 * scaleRatio;
				
				if(clipCallBack != null) clipCallBack.apply(null, [clip]);
			}
		}
		
		this.container.sortChildren(sortZ);
	}

	function sortZ(a,b) {
		return (a.z - b.z) * -1;
	}
	
	// init
	parentContainer.addChild(this.container);
	if(focalLength) _focalLength = focalLength;
	//this.setCamera(0,0,0,0,0,0);
	this.resetSpace();
}