var stats;

var ss3d;
var sampleImage;

var toolsHiding = false;

var lockCameraRotation = false;
var lockSpaceMove = false;
var lockMotion = false;

var rotateXLock = false;
var rotateYLock = false;

var numCols, numRows;
var focalLength = 500;
var blockWidth = 9, blockHeight = 9;
var blockSize = Math.floor(blockWidth/2);
var clipRangeScale = 1.3;
var initZ = 0;

var randomRotations = true;

var useImageClip = true;
var imageColorMultiply = -.3;
var clipInitScale = .5;

var useCache = false;
//var imagePath = "images/lenna-300x300_alpha.png";
//var imagePath = "images/lenna-300x300.png";
//var imagePath = "images/flower.png";
var imagePath = "images/rabbit.jpg";
//var imagePath = "images/bird.png";
//var particleImagePath = "images/ClipImg5.png";
var particleImagePathList = [
	"images/ClipImg3.png",
	"images/ClipImg5.png"];

var loadingIcon;

function init()
{
	stats = new Stats();
	stats.setMode(0);
	
	$("#tool_block").append(stats.domElement);
	
	loadingIcon = new SimplePreloading();
	loadingIcon.popInCenter();
	
	prepareResources();
}

function prepareResources()
{
	var queue = new createjs.LoadQueue(false);
	queue.addEventListener("complete", loadImagesComplete);
	
	queue.loadManifest(particleImagePathList);
	
	function loadImagesComplete()
	{
		console.log("resources load complete");
		queue.removeEventListener("complete", loadImagesComplete);
		
		initStage();
		buildTools();
		buildInteractive();
		createWith(imagePath);
	}
}

function createWith(targetImagePath)
{
	imagePath = targetImagePath;
	
	var queue = new createjs.LoadQueue(false);
	queue.addEventListener("complete", function()
	{
		console.log("image loaded");
		
		
		build();
	});
	queue.loadFile(imagePath);
}

function destroy()
{
	s3d.clear();
}
	
function build()
{
	updateThumb();
	processBitmapData(bitmapDataProcessed);
}

function bitmapDataProcessed()
{
	loadingIcon.destroy();
	createjs.Ticker.setPaused(false);
	
	TweenLite.from("#test_canvas", .5, {alpha:0});
}


	/*** methods and parms which not concern with setting ***/
	
	var mouseX, mouseY;
	var angleX = 0, angleY = 0;
	
	var centerX, centerY;
	var canvas, stage, clipContainer;
	
	var col, row;
	
		
	function initStage()
	{	
		canvas = document.getElementById('test_canvas');
		canvas.width = $(window).width();
		canvas.height = $(window).height();	
		
		centerX = mouseX = canvas.width / 2;
		centerY = mouseY = canvas.height / 2;
	
		stage = new createjs.Stage(canvas);
		
		s3d = new Simple3DSpcae(stage, focalLength);
		s3d.container.x = canvas.width/2;
		s3d.container.y = canvas.height/2;
		
		resetCamera();
		
		createjs.Ticker.setPaused(true);
		
		createjs.Ticker.addEventListener("tick", updateStage);	
	}
	
	var tav = {x:0, y:0, z:0};
	
	function updateStage(evt)
	{	
	
		stats.begin();
		
		if(!createjs.Ticker.getPaused())
		{
			
			if(lockCameraRotation == false)
			{
				angleY = (rotateYLock) ? 0 : (mouseX - centerX) * 0.005;
				angleX = (rotateXLock) ? 0 : -(mouseY - centerY) * 0.005;
				
				TweenLite.to(tav, .6, {ease:Power1.easeOut, x:angleX, y:angleY});	
				s3d.setSpace(null, null, null, tav.x, tav.y, null);
			}
			
			//console.log("update");
			/*
			angleZ = -(mouseX - centerX) * 0.005;
			if(lockCameraRotation == false) s3d.setCamera(null, null, null, null, null, angleZ);
			*/
			
			s3d.update();
			
			stage.update();
			
			$("#item_position").text("(" + Math.floor(s3d.posX) + ", "+Math.floor(s3d.posY)+", "+Math.floor(s3d.posZ)+")");
			$("#item_arc").text("(" + arcToDegree(s3d.arcX) + ", "+arcToDegree(s3d.arcY)+", "+arcToDegree(s3d.arcZ)+")");
			
			$("#camera_position").text("(" + Math.floor(s3d.cameraX) + ", "+Math.floor(s3d.cameraY)+", "+Math.floor(s3d.cameraZ)+")");
			//$("#camera_arc").text("(" + arcToDegree(s3d.cameraArcX) + ", "+arcToDegree(s3d.cameraArcY)+", "+arcToDegree(s3d.cameraArcZ)+")");
		}
		stats.end();
	}
	
	function arcToDegree(arc)
	{
		return Math.floor(arc/Math.PI*180);
	}
	
	function resetCamera()
	{
		TweenLite.killTweensOf(s3d);
		
		s3d.resetSpaceAndCamera();
		
		s3d.tPosX = s3d.posX;
		s3d.tPosY = s3d.posY;
		s3d.tPosZ = s3d.posZ;
		s3d.tArcX = 0;
		s3d.tArcY = 0;
		s3d.tArcZ = 0;
		
		s3d.tCameraX = s3d.cameraX;
		s3d.tCameraY = s3d.cameraY;
		s3d.tCameraZ = s3d.cameraZ;
		
		s3d.tCameraArcX = 0;
		s3d.tCameraArcY = 0;
		s3d.tCameraArcZ = 0;
	}
	
	/*** after image loaded ***/
	function processBitmapData(cb)
	{
		sampleImage = new Image();
		sampleImage.src = imagePath;
	
		var imageData, imageWidth, imageHeight;
		
		var imageData = ImageTools.getImageData(sampleImage);
		var imageWidth = sampleImage.width;
		var imageHeight = sampleImage.height;
		
		var dx, dy;
		var numClips = 0;
		var blockNumPixels;
		var blockNumPixels_standard = blockWidth * blockHeight;
		var col, row;
		numCols = Math.floor(imageWidth/blockWidth);
		numRows = Math.floor(imageHeight/blockHeight);
		
		var numBlocks = numCols * numRows;
		var i=0;
		
		processStep();
		
		function processStep()
		{
			var step = 0;
			var numSteps = 30;
			for(step=0;step<numSteps;step++)
			{
				if(i < numBlocks)
				{
					row = Math.floor(i/numCols);
					col = i % numCols;
					processBlock(col, row);
					i++;
				}
				else
				{
					console.log("num clips = " + numClips + ", numCols = " + numCols + ", numRows = " + numRows);
					cb.apply(null);
					return;
				}
			}
						
			setTimeout(processStep, 30);
		}
		
		function processBlock(col, row)
		{
			blockNumPixels = 0;
				
				var startX = col*blockWidth;
				var startY = row*blockHeight;
				var tx, ty;				
				
				var r=0;g=0;b=0,a=0;
				
				for(dy=0;dy<blockHeight;dy++)
				{
					ty = startY + dy;
					if(ty > imageHeight) continue;
					
					for(dx=0;dx<blockWidth;dx++)
					{
						tx = startX + dx;
						if(tx > imageWidth) continue;
						
						var rgba = ImageTools.getRGBA(imageData, imageWidth, tx, ty);		
						
						if(rgba.a > 254) 
						{
							blockNumPixels ++;
							
							r += rgba.r;
							g += rgba.g;
							b += rgba.b;
							a += rgba.a;
						}
					}
				}
				
				var blockRGB = {};
				blockRGB.r = Math.floor(r / blockNumPixels);
				blockRGB.g = Math.floor(g / blockNumPixels);
				blockRGB.b = Math.floor(b / blockNumPixels);
				blockRGB.a = Math.floor(a / blockNumPixels);
				
				//console.log("a = " + blockRGB.a);
				
				if(blockRGB.a > 5)
				{
					var hex = ImageTools.RGBToHex(blockRGB);
					var clip;
					
					var clipX = (startX - imageWidth/2) * clipRangeScale;
					var clipY = (imageHeight/2 - startY) * clipRangeScale;
					var clipZ = initZ;
					
					if(useImageClip)
						clip = addClip(clipX, clipY, clipZ, true, hex, blockSize, useCache);
					else						
						clip = addClip(clipX, clipY, clipZ, false, hex, blockSize, useCache);
						
					clip.initScale = clipInitScale;
					clip.row = row;
					clip.col = col;
					
					numClips++;
				}
		}
	}
	
	function addClip(x3d, y3d, z3d, useImage, colorHex, size, useCache)
	{
		//var clip = new Clip3D(imgPath, imgOffsetX, imgOffsetY, size, useCache);
		var clip = new Clip3D();
		clip.x3d = clip.initX = x3d;
		clip.y3d = clip.initY = y3d;
		clip.z3d = clip.initZ = z3d;
		
		var color = ImageTools.hexToRGB(colorHex);
		
		if(useImage)
		{
			var particleImagePath = particleImagePathList[Math.floor(Math.random()*particleImagePathList.length)];
			var bitmap = new createjs.Bitmap(particleImagePath);
			
			bitmap.x = -20;
			bitmap.y = -20;
			
			/*
			var v = .23;
			var colorMatrixFilter = new createjs.ColorMatrixFilter([
				v, v, v, 0, color.r, // red
				v, v, v, 0, color.g, // green
				v, v, v, 0, color.b, // blue
				0, 0, 0, 1, 0  // alpha
			]);
			bitmap.filters = [colorMatrixFilter];
			*/
			
			var colorFilter = new createjs.ColorFilter(imageColorMultiply,imageColorMultiply,imageColorMultiply,1, color.r, color.g, color.b,0);
			bitmap.filters = [colorFilter];
		
			//var image = new createjs.Bitmap(img);
			bitmap.cache(0, 0, 40, 40);
			//stage.addChild(image);
			
			clip.bitmap = bitmap;

			clip.addChild(bitmap);
		}
		else
		{
			var g = new createjs.Graphics();
			
			g.beginFill(createjs.Graphics.getRGB(color.r,color.g,color.b));
			g.drawCircle(0,0,size);
		
			var s = new createjs.Shape(g);
			
			if(useCache)s.cache(-size,-size,size*2,size*2);
			clip.addChild(s);
		}
		
		clip.colorHex = colorHex;
		
		if(randomRotations) clip.rotation = Math.random()*360;
		
		s3d.addClip(clip);
		
		return clip;
	}
	
	function updateThumb()
	{
		$("#thumb_layer").attr("src", imagePath);
		
		var tWidth = 150, tHeight = 150;
		var image = new Image();
		image.src = imagePath;
		if(image.width >= image.height)
		{
			if(image.width > tWidth)
			{
				var ratio = image.height/image.width;
				tHeight = Math.floor(ratio*tWidth);
			}
			else
			{
				tWidth = image.width;
				tHeight = image.height;
			}
		}
		else
		{
			if(image.height > tHeight)
			{
				var ratio = image.width/image.height;
				tWidth = Math.floor(ratio*tHeight);
			}
			else
			{
				tWidth = image.width;
				tHeight = image.height;
			}
		}
		
		var tx = window.innerWidth - 10 - tWidth;
		var ty = 10;
		
		$("#sample_image_box").css("visibility", "visible");
		$("#sample_image_box").css("left", tx+"px");
		$("#sample_image_box").css("top", ty+"px");
		$("#sample_image_box").css("width", tWidth + "px");
		$("#sample_image_box").css("height", tHeight + "px");
	}
	
	function buildTools()
	{
		
		var tx = 0;
		var ty = Math.floor((window.innerHeight - $("#tool_box").height())/2);
		
		$("#tool_box").css("visibility", "visible");
		$("#tool_box").css("left", tx + "px");
		$("#tool_box").css("top", ty + "px");
		
		$("#rotate_x_lock").click( function(){ updateCheckBox("#rotate_x_lock", "rotateXLock") });
		$("#rotate_y_lock").click( function(){ updateCheckBox("#rotate_y_lock", "rotateYLock") });
		
		function updateCheckBox(elem, param)
		{			
			($(elem).attr("checked")) ?  eval(param + "= false") : eval(param + "= true");
			$(elem).attr("checked", eval(param));
		}
		
		$("#motion_method").val("turbo");
		
		$("#btn_reset_camera").click( resetCamera);
		
		$("#btn_snow_fall").click(function()
		{
			if(lockMotion) return;
			lockMotion = true;
			lockCameraRotation = true;
			lockSpaceMove = true;
			
			MM_snowFall(s3d.clipList, clipInitScale, s3d, snowFall_complete);
					
			function snowFall_complete()
			{
				lockMotion = false;
				lockCameraRotation = false;
				lockSpaceMove = false;
			}
		});
		
		$("#btn_change_image").click(function()	{$("#image_file").click(); });
		$("#image_file").change( function()
		{
			destroy();
			updateStage();
			createjs.Ticker.setPaused(true);
			loadingIcon = new SimplePreloading();
			loadingIcon.popInCenter();
			
			var file = document.getElementById("image_file").files[0];
			FileHandler.read(file, localImageLoaded, FileHandler.readMethods.readAsDataURL);
		});
		
		function localImageLoaded(loaclImagePath)
		{	
			var img = new Image();
			img.onload = function()
			{
				imagePath = loaclImagePath;
				build();
			};
			img.src = loaclImagePath;	
		}
	}
	
	function switchTools()
	{
		if(toolsHiding == false)
		{
			toolsHiding = true;
			var tx = -$("#tool_box").width()-1;
			TweenLite.to("#tool_box", .3, {left:tx, ease:Power1.easeOut});
			TweenLite.to("#sample_image_box", .3, {alpha:0, ease:Power1.easeOut});
		}
		else
		{
			toolsHiding = false;
			var tx = 0;
			TweenLite.to("#tool_box", .5, {left:tx, ease:Back.easeOut});
			TweenLite.to("#sample_image_box", .3, {alpha:1, ease:Power1.easeOut});
		}
	}
	
	function buildInteractive()
	{	
		$("body").mousemove( function(e){ mouseX = e.pageX; mouseY = e.pageY; } );
		
		$("#test_canvas").click( applyMotion );
		
		function applyMotion(evt)
		{
			if(lockMotion) return;
			switch($("#motion_method").val())
			{
				case "turbo":
					MM_circle(numCols/2, numRows/2, s3d.clipList, clipInitScale, clipRangeScale);
				break;
				
				case "random_even":
					MM_randomSend(s3d.clipList);
				break;
				
				case "snow_fall":
				
				break;
			}
		}
		
		KeyHandler.bindListener('body');
		KeyHandler.registKey("press", 87, keyPressHandler_w, .03);
		KeyHandler.registKey("press", 83, keyPressHandler_s, .03);
		KeyHandler.registKey("press", 65, keyPressHandler_a, .03);
		KeyHandler.registKey("press", 68, keyPressHandler_d, .03);
		
		KeyHandler.registKey("press", 38, keyPressHandler_up, .03);
		KeyHandler.registKey("press", 40, keyPressHandler_down, .03);
		KeyHandler.registKey("press", 37, keyPressHandler_left, .03);
		KeyHandler.registKey("press", 39, keyPressHandler_right, .03);
		
		KeyHandler.registKey("press", 33, keyPressHandler_pageUp, .10);
		KeyHandler.registKey("press", 34, keyPressHandler_pageDown, .10);
		
		KeyHandler.registKey("press", 82, keyPressHandler_r, .10);
		KeyHandler.registKey("press", 70, keyPressHandler_f, .10);
		
		KeyHandler.registKey("press", 81, keyPressHandler_q, .03);
		KeyHandler.registKey("press", 69, keyPressHandler_e, .03);
		
		KeyHandler.registKey("keydown", 32, keyDownHandler_space);
		
		function keyDownHandler_space()
		{
			switchTools();
		}
		
		function keyPressHandler_w()
		{
			if(lockSpaceMove) return;
			s3d.tPosY += 20;
			TweenLite.to(s3d, .5, {posY:s3d.tPosY});
		}
		
		function keyPressHandler_s()
		{
			if(lockSpaceMove) return;
			s3d.tPosY -= 20;
			TweenLite.to(s3d, .5, {posY:s3d.tPosY});
		}
		
		function keyPressHandler_a()
		{
			if(lockSpaceMove) return;
			s3d.tPosX -= 20;
			TweenLite.to(s3d, .5, {posX:s3d.tPosX});
		}
		
		function keyPressHandler_d()
		{
			if(lockSpaceMove) return;
			s3d.tPosX += 20;
			TweenLite.to(s3d, .5, {posX:s3d.tPosX});
		}
		
		function keyPressHandler_r()
		{
			if(lockSpaceMove) return;
			s3d.tPosZ += 40;
			TweenLite.to(s3d, .5, {posZ:s3d.tPosZ});
		}
		
		function keyPressHandler_f()
		{
			if(lockSpaceMove) return;
			s3d.tPosZ -= 40;
			TweenLite.to(s3d, .5, {posZ:s3d.tPosZ});
		}
		
		function keyPressHandler_q()
		{
			if(lockSpaceMove) return;
			s3d.tArcZ += 0.02;
			TweenLite.to(s3d, .5, {arcZ:s3d.tArcZ});
		}
		
		function keyPressHandler_e()
		{
			if(lockSpaceMove) return;
			s3d.tArcZ -= 0.02;
			TweenLite.to(s3d, .5, {arcZ:s3d.tArcZ});
		}
		
		/*** camera ***/
		function keyPressHandler_up()
		{
			if(lockSpaceMove) return;
			s3d.tCameraY += 20;
			TweenLite.to(s3d, .5, {cameraY:s3d.tCameraY});
		}
		
		function keyPressHandler_down()
		{
			if(lockSpaceMove) return;
			s3d.tCameraY -= 20;
			TweenLite.to(s3d, .5, {cameraY:s3d.tCameraY});
		}
		
		function keyPressHandler_left()
		{
			if(lockSpaceMove) return;
			s3d.tCameraX -= 20;
			TweenLite.to(s3d, .5, {cameraX:s3d.tCameraX});
		}
		
		function keyPressHandler_right()
		{
			if(lockSpaceMove) return;
			s3d.tCameraX += 20;
			TweenLite.to(s3d, .5, {cameraX:s3d.tCameraX});
		}
		
		function keyPressHandler_pageUp()
		{
			if(lockSpaceMove) return;
			s3d.tCameraZ -= 40;
			TweenLite.to(s3d, .5, {cameraZ:s3d.tCameraZ});
		}
		
		function keyPressHandler_pageDown()
		{
			if(lockSpaceMove) return;
			s3d.tCameraZ += 40;
			TweenLite.to(s3d, .5, {cameraZ:s3d.tCameraZ});
		}
}