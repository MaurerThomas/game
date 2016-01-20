/**
 * Created by Thomas on 21-11-2015.
 */

// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.
;(function ( $, window, document, undefined ) {

    "use strict";

    // undefined is used here as the undefined global variable in ECMAScript 3 is
    // mutable (ie. it can be changed by someone else). undefined isn't really being
    // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
    // can no longer be modified.

    // window and document are passed through as local variable rather than global
    // as this (slightly) quickens the resolution process and can be more efficiently
    // minified (especially when both are regularly referenced in your plugin).

    // Create the defaults once
    var gameName = "fruitFall",
        defaults = {
            canvasSize: {x:640,y:690}
        };

    // The actual plugin constructor
    function Game ( element, options ) {
        this.element = element;
        // jQuery has an extend method which merges the contents of two or
        // more objects, storing the result in the first object. The first object
        // is generally empty as we don't want to alter the default options for
        // future instances of the plugin
        this.settings = $.extend( {}, defaults, options );
        this._defaults = defaults;
        this._name = gameName;
        this.init();
    }

    // Avoid Game.prototype conflicts
    $.extend(Game.prototype, {
        init: function () {
            // Create a root pixi object container in order to handle scaling/rotation/etc.
            this.scene = new PIXI.Container();

            // Create a renderer instance and set size to defaults.
            this.renderer = PIXI.autoDetectRenderer(defaults.canvasSize.x, defaults.canvasSize.y);

            // Add the renderer to the DOM
            $(this.element).append(this.renderer.view);

            // Start animation ticker
            requestAnimationFrame(this.animate.bind(this));

            this.loadAssets();

        },
        loadAssets:function(){
            var loader = new PIXI.loaders.Loader();
            loader.add('interface', 'assets/interface.json');
            loader.once('complete', this.onLoadAssets.bind(this));

            loader.load();

        },
        onLoadAssets:function(){
            var texture = PIXI.Texture.fromImage('bg.png');
            var paperBG = new PIXI.Sprite(texture);
            this.scene.addChild(paperBG);

        },
        animate: function(){
            requestAnimationFrame(this.animate.bind(this));

            this.renderer.render(this.scene);
        }

    });

    // A really lightweight plugin wrapper around the constructor,
    // preventing against multiple instantiations
    $.fn[ gameName ] = function ( options ) {
        return this.each(function() {
            if ( !$.data( this, "plugin_" + gameName ) ) {
                $.data( this, "plugin_" + gameName, new Game( this, options ) );
            }
        });
    };

})( jQuery, window, document );