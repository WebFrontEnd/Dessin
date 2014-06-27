Dessin.BRUSH = {
    RES_BRUSH_IMAGE_URL : "res/img/brush_circle.png",
    RES_CRAYON_IMAGE_URL : "res/img/brush_crayon.png",
    RES_AIR_BRUSH_IMAGE_URL : "res/img/brush_air.png",
    RES_PATTERN_IMAGE_URL : "res/img/pattern.png"
};

Dessin.DRAW_MODE = {
    STROKE: 0,
    IN_ADVANCE: 1,
    SESSION: 2
};

Dessin.TOOL = {
    NONE : 0,
    PEN: 1,
    PAINT: 2,
    PATTERN: 3,
    ERASER: 4,
    BRUSH: 5,
    CRAYON: 6,
    AIR_BRUSH: 7,
    TEXT: 8,
    PICK: 9
};

Dessin.LAYER_ACTION = {
    "UNDO" : 1,
    "REDO" : 2,
    "RESET" : 3,
    "ZOOMIN": 4,
    "ZOOMOUT": 5,
    "ZOOMMOVE": 6,
    "NONE" : 0
};

Dessin.ZOOM_LEVEL = {
    MIN: 0,
    MAX: 3
};

Dessin.ui = {
    DEFAULT_FONT_SIZE : 20,
    DEFAULT_BRUSH_SIZE : 10,
    DEFAULT_BLUR_SIZE : 10,
    DEFAULT_MAX_SAVE_COLOR_COUNT : 24
}
