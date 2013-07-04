// JavaScript Document


(function()
{
	var ImageTools = function(){};
	
	ImageTools.getImageData = function(image)
	{
		var canvas = document.createElement("canvas");
		canvas.width = image.width;
		canvas.height = image.height;
		canvas.getContext('2d').drawImage(image, 0, 0, image.width, image.height);
		
		var imageData = canvas.getContext('2d').getImageData(0,0,image.width,image.height).data;
		
		return imageData;
	};
	
	ImageTools.toGray = function(imageData, imageWidth, imageHeight)
	{
		var i;
		
		for(i=0;i<imageData.length;i+=4)
		{
			var averageValue = 0;
			averageValue += imageData[i];
			averageValue += imageData[i+1];
			averageValue += imageData[i+2];
			averageValue = Math.floor(averageValue/3);
			imageData[i] = averageValue;
			imageData[i+1] = averageValue;
			imageData[i+2] = averageValue;
		}
		
		/*
		var w, h;
		for(w = 0;w < imageWidth; w++)
		{
			var startIndex = w
		}
		*/
	}
	
	ImageTools.getRGBA = function(imageData, imageWidth, tx, ty)
	{
		//var startIndex = tx*ty*4;
		var startIndex = (ty * imageWidth + tx) * 4; 
		if((startIndex+4) > imageData.length) console.error("illegal coordinate: (" + tx + ", " + ty + "), startIndex = " + startIndex + ", data length = " + imageData.length);
		
		var rgba = {};
		rgba.r = imageData[startIndex];
		rgba.g = imageData[startIndex+1];
		rgba.b = imageData[startIndex+2];
		rgba.a = imageData[startIndex+3];
		
		return rgba;
	}
	
	ImageTools.getHex = function(imageData, tx, ty)
	{
		if(tx*ty*4 > imageData.length) console.error("illegal coordinate: (" + tx + ", " + ty + ")");
	}
	
	ImageTools.hexToRGB = function(hex) { return { r: ((hex & 0xff0000) >> 16), g: ((hex & 0x00ff00) >> 8), b: ((hex & 0x0000ff)) }; };
	ImageTools.RGBToHex = function(rgb) { return rgb.r<<16 | rgb.g<<8 | rgb.b; };
	
	ImageTools.getBase64Image = function(img) 
	{
    	var canvas = document.createElement("canvas");
		canvas.width = img.width;
		canvas.height = img.height;
		
		var ctx = canvas.getContext("2d");
		ctx.drawImage(img, 0, 0);
		
		var dataURL = canvas.toDataURL("image/png");
		return dataURL.replace(/^data:image\/(png|jpg);base64,/, "");
	}
	
	ImageTools.printHex = function(data)
	{	
		var markup, n, aByte, byteStr;

        markup = [];
        for (n = 0; n < data.length; ++n) 
		{
            aByte = data.charCodeAt(n);
            byteStr = aByte.toString(16);
            if (byteStr.length < 2) byteStr = "0" + byteStr;
			
            markup.push(parseInt(byteStr, 16));
        }
		
		return markup.join(" ");
	}
	
	window.ImageTools = ImageTools;
}());