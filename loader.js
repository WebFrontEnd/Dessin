requirejs.config({
    baseUrl: 'src/',
    waitSeconds: 45,
    paths: {
        'underscore': '../vendor/underscore/underscore',
        'jquery': '../vendor/jquery/jquery.min',
        'jquery-ui': '../vendor/jquery-ui/ui/jquery-ui',
        'jquery-slider': '../vendor/jquery-ui/ui/jquery.ui.slider',
        'jquery-mouse': '../vendor/jquery-ui/ui/jquery.ui.mouse',
        'jquery-widget': '../vendor/jquery-ui/ui/jquery.ui.widget',
        'json2': '../vendor/json2/json2',
        'bootstrap': '../vendor/bootstrap/dist/js/bootstrap.min'
    },
    shim: {
        'jquery': { exports: '$' },
        'jquery-ui': { deps: ['jquery', 'jquery-slider'] },
        'jquery-slider': { deps: ['jquery', 'jquery-mouse'] },
        'jquery-mouse': { deps: ['jquery', 'jquery-widget'] },
        'jquery-widget': { deps: ['jquery'] },
        'bootstrap': { deps: ['jquery'] },
        'core/dessin.ToolSimpleFactory': {
            deps: [
                'core/tool/dessin.Image',
                'core/tool/dessin.Brush',
                'core/tool/dessin.Crayon',
                'core/tool/dessin.AirBrush',
                'core/tool/dessin.Eraser',
                'core/tool/dessin.Paint',
                'core/tool/dessin.Line',
                'core/tool/dessin.Pen',
                'core/tool/dessin.Pattern',
                'core/tool/dessin.Text',
                'core/tool/dessin.Pick'
            ]
        },

        /**
         * dessin Core Dependency Setting
         */
        'core/dessin.App': {
            deps: [
            /** LIB **/
                'underscore',
                'jquery',
                'bootstrap',
                'json2',

            /** DEFAULT **/
                'core/util/dessin.Utility',
                'core/util/dessin.Touch',

            /** CORE **/
                'core/dessin.ColorModel',
                'core/dessin.Controller',
                'core/dessin.Drawing',
                'core/dessin.Layer',
                'core/dessin.Layers',
                'core/dessin.Model',
                'core/dessin.PersistentStore',
                'core/dessin.Snapshots',
                'core/dessin.ToolSimpleFactory'
            ]
        },

        'core/util/dessin.Utility': {
            deps: [
            ]
        },

        /**
         * UI Dependency Setting
         */
        'ui/dessin.ui.LayerController': {
            deps: [
                'jquery',
                'ui/dessin.ui.TextUI',
                'ui/dessin.ui.LayerUI',
                'ui/dessin.ui.DrawingUI'
            ]
        },

        'ui/dessin.ui.ColorPickerUI': {
            deps: [
                'jquery-ui'
            ]
        },
        'ui/dessin.ui.ToolUI': {
            deps: [
            ]
        }
    }
});

// Default Dependency Included : "Namespace"
requirejs([
    'jquery',
    'namespace',
    'constant',
    'ui/dessin.ui.LayerController',
    'ui/dessin.ui.ToolUI',
    'ui/dessin.ui.ColorPickerUI',
    'core/dessin.App'
], function($){
    $(document).read(function(){
        var oPainter = new Dessin.App($('._dessin_stage'), {
            nLayerCount : 3,
            nWidth : 250,
            nHeight : 250
        });

        Dessin.ui.oToolUI = new Dessin.ui.ToolUI(oPainter);
        Dessin.ui.oColorPicker = new Dessin.ui.ColorPickerUI(oPainter);
        Dessin.ui.LayerController = new Dessin.ui.LayerController(oPainter);
    });
});