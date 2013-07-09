/*
	camera arc is not applyed yet

*/


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
	
	var _cameraX = 0;
	var _cameraY = 0;
	var _cameraZ = 0;
	var _cameraArcX = 0;
	var _cameraArcY = 0;
	var _cameraArcZ = 0;
	
	var _cCosX, _cSinX, _cCosY, _cSinY, _cCosZ, _cSinZ;
	
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
		
		
	Object.defineProperty(Simple3DSpcae.prototype, "cameraX", {
	    get: function() {return _cameraX; },
	    set: function(v) { _cameraX = v;	 } });
	Object.defineProperty(Simple3DSpcae.prototype, "cameraY", {
	    get: function() {return _cameraY; },
	    set: function(v) { _cameraY = v;	 } });
	Object.defineProperty(Simple3DSpcae.prototype, "cameraZ", {
	    get: function() {return _cameraZ; },
	    set: function(v) { _cameraZ = v;	 } });
	Object.defineProperty(Simple3DSpcae.prototype, "cameraArcX", {
	    get: function() {return _cameraArcX; },
	    set: function(v) { _cameraArcX = v;	 } });
	Object.defineProperty(Simple3DSpcae.prototype, "cameraArcY", {
	    get: function() {return _cameraArcY; },
	    set: function(v) { _cameraArcY = v;	 } });
	Object.defineProperty(Simple3DSpcae.prototype, "cameraArcZ", {
	    get: function() {return _cameraArcZ; },
	    set: function(v) { _cameraArcZ = v;	 } });
	
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
	
	this.clear = function()
	{
		for(var id in this.clipList)
		{
			var clip = this.clipList[id];
			clip.parent.removeChild(clip);
		}
		
		this.clipList = [];
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
	}
	
	this.setCamera = function(x,y,z,arcX,arcY,arcZ)
	{
		if(x != null) this.cameraX = x;
		if(y != null) this.cameraY = y;
		if(z != null) this.cameraZ = z;
		
		if(arcX != null) this.cameraArcX = arcX;
		if(arcY != null) this.cameraArcY = arcY;
		if(arcZ != null) this.cameraArcZ = arcZ;
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
	
	this.resetSpaceAndCamera = function()
	{
		this.setSpace(0, 0, 0, 0, 0, 0);
		this.setCamera(0, 0, 0, 0, 0, 0);
	}
	
	this.update = function(clipCallBack)
	{
		_cosX = Math.cos(_arcX); 
		_sinX = Math.sin(_arcX);
		
		_cosY = Math.cos(_arcY); 
		_sinY = Math.sin(_arcY);
		
		_cosZ = Math.cos(_arcZ); 
		_sinZ = Math.sin(_arcZ);
		
		_cCosX = Math.cos(_cameraArcX); 
		_cSinX = Math.sin(_cameraArcX);
		
		_cCosY = Math.cos(_cameraArcY); 
		_cSinY = Math.sin(_cameraArcY);
		
		_cCosZ = Math.cos(_cameraArcZ); 
		_cSinZ = Math.sin(_cameraArcZ);
		
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
			var y1 = y0 * _cosX + z0 * _sinX;
			var z1 = y0 * _sinX - z0 * _cosX;	
		
			var x2 = x1*_cosZ - y1*_sinZ;
			var y2 = x1*_sinZ + y1*_cosZ;
			var z2 = z1;
		
			var tx = x1 - _cameraX;
			var ty = y1 - _cameraY;
			var tz = z1 + _cameraZ;
				
			/*
			var x4 = x3 * _cCosY + z3* _cSinY;
			var y4 = y3;
			var z4 = -x3 * _cSinY + z3 * _cCosY;
			
			var x5 = x4;
			var y5 = y4 * _cCosX + z4 * _cSinX;
			var z5 = y4 * _cSinX - z4 * _cCosX;	
		
			var x6 = x5*_cCosZ - y5*_cSinZ;
			var y6 = x5*_cSinZ + y5*_cCosZ;
			var z6 = z5;
			
			tx = x6;
			ty = y6;
			tz = z6;
			*/
			
			/*
			var x1 = clip.x3d;
			var y1 = clip.y3d;
			var z1 = clip.z3d;
			*/
			
			var scaleRatio = _focalLength / (_focalLength + tz);
			
			//if(scaleRatio < 0 || tz > _focalLength)
			//if(scaleRatio < 0 || tz < 0)
			if(scaleRatio < 0)
			{
				clip.visible = false;
			}
			else
			{
				clip.visible = true;
				
				clip.scaleX = clip.scaleY = scaleRatio * clip.initScale;
				
				clip.x = tx * scaleRatio;
				clip.y = -ty * scaleRatio;
				clip.z = tz * scaleRatio;
				
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
	this.resetSpaceAndCamera();
}