(function()
{
	var Clip3D = function(picturePath, offsetX, offsetY)
	{
		this.initialize(picturePath, offsetX, offsetY);
	}
	var _p = Clip3D.prototype = new createjs.Container();
	
	_p.x3d = 0;
	_p.y3d = 0;
	_p.z3d = 0;
	_p.z;
	_p.initScale = 1;
	_p.floatEffect = true;
	_p.minAlpha = 0;
	_p.bitmap;
	_p.type;
	
	_p.Container_initialize = _p.initialize;
	_p.initialize = function(picturePath, offsetX, offsetY)
	{
		this.Container_initialize();
		
		var bitmap = new createjs.Bitmap(picturePath);
		
		if(offsetX != null) bitmap.x += offsetX;
		if(offsetY != null) bitmap.y += offsetY;
		
		this.addChild(bitmap);
		this.bitmap = bitmap;
	}
	
	_p.update3D = function(pFocalLength, cosY, sinY, cosX, sinX) 
	{	
		var tx = this.x3d * cosY + this.z3d * sinY;
		var ty = this.y3d;
		var tz = this.z3d * cosY - this.x3d * sinY;
		
		
		if(cosX != null && sinX != null)
		{
			var tx0 = tx;
			var ty0 = ty;
			var tz0 = tz;
			
			tx = tx0;
			ty = ty0 * cosX - tz0 * sinX;
			tz = ty0 * sinX - tz0 * cosX;
		}
		
		var scaleRatio = pFocalLength / (pFocalLength + tz);
		
		tx = tx * scaleRatio;
		ty = ty * scaleRatio;
		
		this.scaleX = this.scaleY = scaleRatio * this.initScale;
		
		
		this.x = tx;
		this.y = ty;
		this.z = tz;
	}
	
	_p.destroy = function()
	{
		_p.parent.removeChild(p);
	}
	
	window.Clip3D = Clip3D;
}());