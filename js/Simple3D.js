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
	var _cameraX = 0;
	var _cameraY = 0;
	var _cameraZ = 0;
	var _cameraArcX = 0;
	var _cameraArcY = 0;
	var _cameraArcZ = 0;
	var _cosX, _sinX, _cosY, _sinY, _cosZ, _sinZ;
	var _focalLength = 600;
	
	this.ccx = 0;
	
	/*
	Object.defineProperty(Simple3DSpcae.prototype, "cameraX", {
    get: function() {return this.ccx; },
    set: function(v) { this.ccx = v; }
	});
	*/
	
	Object.defineProperty(Simple3DSpcae.prototype, "cameraX", {
	    get: function() {return _cameraX; },
	    set: function(v) { _cameraX = v; } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "cameraY", {
	    get: function() {return _cameraY; },
	    set: function(v) { _cameraY = v; } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "cameraZ", {
	    get: function() {return _cameraZ; },
	    set: function(v) { _cameraZ = v; } });
		
		
	Object.defineProperty(Simple3DSpcae.prototype, "cameraArcX", {
	    get: function() {return _cameraArcX; },
	    set: function(v) { _cameraArcX = v;	_cosX = Math.cos(_cameraArcX); _sinX = Math.sin(_cameraArcX); } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "cameraArcY", {
	    get: function() {return _cameraArcY; },
	    set: function(v) { _cameraArcY = v;	_cosY = Math.cos(_cameraArcY); _sinY = Math.sin(_cameraArcY); } });
		
	Object.defineProperty(Simple3DSpcae.prototype, "cameraArcZ", {
	    get: function() {return _cameraArcZ; },
	    set: function(v) { _cameraArcZ = v;	_cosZ = Math.cos(_cameraArcZ); _sinZ = Math.sin(_cameraArcZ); } });
	
	/*
	this.__defineGetter__("cameraX", function(){ return _cameraX; });
	this.__defineSetter__("cameraX", function(v){ _cameraX = v; });
	this.__defineGetter__("cameraY", function(){ return _cameraY; });
	this.__defineSetter__("cameraY", function(v){ _cameraY = v });
	this.__defineGetter__("cameraZ", function(){ return _cameraZ; });
	this.__defineSetter__("cameraZ", function(v){ _cameraZ = v });
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
	
	this.setCamera = function(x,y,z,arcXaxis, arcYaxis, arcZaxis)
	{
		if(x != null) _cameraX = x;
		if(y != null) _cameraY = y;
		if(z != null) _cameraZ = z;
		
		/*
		if(arcXaxis != null) this.cameraArcX = arcXaxis;
		if(arcYaxis != null) this.cameraArcY = arcYaxis;
		if(arcZaxis != null) this.cameraArcZ = arcZaxis;
		*/
		
		this.cameraLookAtCenter();
		
		/*
		_cosX = Math.cos(_cameraArcX);
		_sinX = Math.sin(_cameraArcX);
		
		_cosY = Math.cos(_cameraArcY);
		_sinY = Math.sin(_cameraArcY);
		
		_cosZ = Math.cos(_cameraArcZ);
		_sinZ = Math.sin(_cameraArcZ);
		*/
	}
	
	this.cameraLookAtCenter = function()
	{
		var arcZ = Math.atan2(_cameraY, _cameraX);
		var arcY = Math.atan2(-_cameraZ, _cameraX);
		var arcX = Math.atan2(_cameraY, -_cameraZ);
		
		var caz = Math.PI/2;
		
		this.cameraArcX = -arcX;
		this.cameraArcY = arcY - caz;
		//this.cameraArcZ = arcZ;
		
		console.log("(" + _cameraArcX + ", " + _cameraArcY + ", " + _cameraArcZ + ")");
		
		//console.log(Math.atan2(1,0));
	}
	
	this.resetCamera = function()
	{
		this.cameraArcX = 0;
		this.cameraArcY = 0;
		this.cameraArcZ = 0;
		
		this.setCamera(0,0,-_focalLength);
		/*
		this.cameraX = 0;
		this.cameraY = 0;
		this.cameraZ = -this.focalLength;
		this.cameraLookAtCenter();
		*/
	}
	
	this.update = function(clipCallBack)
	{
		for(var id in this.clipList)
		{
			var clip = this.clipList[id];
			
			// rotating axis clock wise
			var x = clip.x3d - _cameraX;
			var y = clip.y3d - _cameraY;
			var z = clip.z3d - _cameraZ;
			
			var x0 = x * _cosY + z * _sinY;
			var y0 = y;
			var z0 = x * _sinY - z * _cosY;
			
			var x1 = x0;
			var y1 = y0 * _cosX - z0 * _sinX;
			var z1 = y0 * _sinX + z0 * _cosX;
			
			if(_cameraArcZ != 0)
			{
				var x2 = x1*_cosZ - y1*_sinZ;
				var y2 = x1*_sinZ + y1*_cosZ;
				
				x1 = x2;
				y1 = y2;
			}
			
			var scaleRatio = _focalLength / (_focalLength + z1);
			
			//if(scaleRatio < 0 || z1 > _focalLength)
			if(scaleRatio < 0 || z1 < 0)
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
	this.resetCamera();
}