MM_snowFall = function(clipList, clipInitScale, s3d, cb)
{
	console.log("snow fall start");
	
	s3d.resetSpaceAndCamera();
	s3d.posZ = 0;
	s3d.arcZ = .1;
	s3d.arcY = .1;
	s3d.arcX = .1;
	
	var array = [];
	for(var key in clipList) array.push(clipList[key]);
	
	array.sort(sortFunc);
	
	var i;
	var tl = new TimelineLite();
	var duration = 10;
	
	var time = 5;
	var timeStack = time;
	
	for(i=0;i<array.length;i++)
	{
		var clip = array[i];
		var distance = Math.sqrt(clip.initX*clip.initX + clip.initY*clip.initY);
		clip.length = distance;
		clip.distance = 0;
		
		var initArc = Math.atan2(clip.initY, clip.initX);
		clip.arc = initArc;
		
		var randomArcRange = 20;
		initArc = initArc - randomArcRange/2 + Math.random()*randomArcRange;
		
		var delay = i * .02;
		
		var tl2 = new TimelineLite();
		tl2.from(clip, time, {ease:Power1.easeOut, delay:delay, initScale:clip.initScale*15, z3d:clip.z3d+3000, distance:distance*4, arc:initArc, onUpdate:circleMotion_update, onUpdateParams:[clip]});
		
		tl.add(tl2, "-=" + tl2.duration);
		
		timeStack += .02;
	}
	
	duration = timeStack - 3;
	
	console.log("duration = " + duration);
	
	function circleMotion_update(clip)
	{
		var cosV = Math.cos(clip.arc);
		var sinV = Math.sin(clip.arc);
		
		clip.x3d = (clip.length + clip.distance * clipRangeScale) * cosV;
		clip.y3d = (clip.length + clip.distance * clipRangeScale) * sinV;
	}
	
	TweenLite.from(s3d, duration, {cameraZ:s3d.cameraZ+2000, arcZ:s3d.arcZ - .4, onComplete:timelineComplete});
	
	function timelineComplete()
	{
		TweenLite.delayedCall(5, cb);
	}
	
	function sortFunc(a, b)
	{
		return a.colorHex - b.colorHex;
	}
}

MM_circle = function(centerX, centerY, clipList, clipInitScale, clipRangeScale)
{	
	var tl = new TimelineLite();
	
	var timeStack = 0;

	for(var clipId in clipList)
	{
		var clip = clipList[clipId];
		var distance = Math.sqrt(clip.initX*clip.initX + clip.initY*clip.initY);
		clip.length = distance;
		clip.distance = 0;
		
		var targetDistance = distance * 1;
		
		var targetZ = clip.initZ - 300;
		var targetScale = 1;
		
		var initArc = Math.atan2(clip.initY, clip.initX);
		clip.arc = initArc;
		
		var time = 1;
		var delay = distance / 200;
		
		var tl2 = new TimelineLite();
		tl2.to(clip, time, {delay:delay, ease:Power1.easeIn, z3d:targetZ, initScale:targetScale, arc:initArc + 10, distance:targetDistance, onUpdate:circleMotion_update, onUpdateParams:[clip]}).
			to(clip, .5, {alpha:0}, "-=.5").
			to(clip, .5, {alpha:1}).
			to(clip, time, {ease:Power1.easeOut, z3d:clip.initZ, initScale:clipInitScale, arc:initArc, distance:0, onUpdate:circleMotion_update, onUpdateParams:[clip]}, "-=.5");
		
		tl.add(tl2, "-=" + tl2.duration);
	}
	
	function circleMotion_update(clip)
	{
		var cosV = Math.cos(clip.arc);
		var sinV = Math.sin(clip.arc);
		
		clip.x3d = (clip.length + clip.distance * clipRangeScale) * cosV;
		clip.y3d = (clip.length + clip.distance * clipRangeScale) * sinV;
	}
}

MM_randomSend = function(clipList)
{
	var tl = new TimelineLite();
	for(var clipId in clipList)
	{
		var clip = clipList[clipId];
		
		var randomRange = 1000;
		var time = 1;
		
		//var tx = -randomRange/2 + clip.x3d + Math.random()* randomRange;
		//var ty = -randomRange/2 + clip.y3d + Math.random()* randomRange;
		var tz = -randomRange/2 + clip.z3d + Math.random()* randomRange;
		
		var tx = clip.x3d*5;
		var ty = clip.y3d*5;
		//var tz = 0;
		
		//tz = 200;
		
		TweenLite.killTweensOf(clip);
		var tl2 = new TimelineLite();
		
		tl2.to(clip, time, {ease:Power3.easeIn, x3d:tx, y3d:ty, z3d:tz}).
			to(clip, .5, {alpha:0}, "-=.5").
			to(clip, .5, {delay:.5, alpha:1}).
			to(clip, time, {ease:Power3.easeOut, x3d:clip.initX, y3d:clip.initY, z3d:clip.initZ, alpha:1}, "-=.5");
		
		tl.add(tl2, "-=" + tl2.duration);
			
		//TweenLite.from(clip, time, {delay:.5, ease:Power3.easeOut, x3d:clip.initX, y3d:clip.initY, z3d:clip.initZ, alpha:1});
	}
}