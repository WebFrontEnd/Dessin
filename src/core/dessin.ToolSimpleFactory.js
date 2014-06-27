Dessin.ToolSimpleFactory = function(){
};

Dessin.ToolSimpleFactory.prototype = {

	createDrawing : function(nSelectedTool, options){
		var htTools = Dessin.TOOL;
		var oDrawing;
		var oColor = options.oColor;
		var nToolSize = options.nToolSize;
		var sFontName = options.sFontName,
            nFontSize = options.nFontSize;

		switch(nSelectedTool){
			case htTools.PEN :
				oDrawing = new Dessin.Pen({ color : oColor, size : nToolSize });
				break;

			case htTools.BRUSH :
				oDrawing = new Dessin.Brush({color : oColor, size : nToolSize});
				break;

			case htTools.CRAYON :
				oDrawing = new Dessin.Crayon({color: oColor, size: nToolSize});
				break;

			case htTools.AIR_BRUSH :
				oDrawing = new Dessin.AirBrush({color: oColor, size: nToolSize});
				break;

			case htTools.PAINT :
				oDrawing = new Dessin.Paint({ color : oColor });
				break;

			case htTools.ERASER :
				oDrawing = new Dessin.Eraser({size: nToolSize });
				break;

			case htTools.PATTERN :
				oDrawing = new Dessin.Pattern({ color : oColor, size : nToolSize });
				break;

			case htTools.TEXT :
				oDrawing = new Dessin.Text({ color : oColor, size : nFontSize , fontName : sFontName });
				break;

            case htTools.PICK :
                oDrawing = new Dessin.Pick({});
                break;

			default :

				break;
		}

		return oDrawing;
	}
};

/**
 * singleton pattern
 */
Dessin.ToolSimpleFactory.getInstance = function () {
	if (Dessin.ToolSimpleFactory.instance == null) {
		Dessin.ToolSimpleFactory.instance = new Dessin.ToolSimpleFactory();
	}

	return Dessin.ToolSimpleFactory.instance;
};

Dessin.ToolSimpleFactory.instance = null;