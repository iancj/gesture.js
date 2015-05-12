/*
 * gesture.js
 * by iancj 2015-05-12
 * https://github.com/iancj/gesture.js
 * make the elements can scaling,rotatiton and translation
**/

;(function(window,document){
	function Dragable($el){
	    this.startX=0;
	    this.startY=0;
	    this.curX=0;
	    this.curY=0;
	    this.startScale=0;
        this.curScale=1;
	    this.rotation=0;
	    this.$el=$el;
	    this.tid;
	    this.init();
	}

	Dragable.prototype.init=function(){
	    var convertMatrix=matrixToAngleScale(document.defaultView.getComputedStyle(this.$el,null).webkitTransform);
	    this.rotation=convertMatrix.rotate;

	    this.start();
	};

	Dragable.prototype.start=function(){
		var self=this;

	    //单指拖动
	    self.$el.addEventListener("touchstart", _moveStart, false);
	    self.$el.addEventListener('touchmove', _moveMoving, false);

	    //缩放和旋转
	    self.$el.addEventListener("gesturestart", function(e) {
	    	self.$el.removeEventListener('touchmove', _moveMoving, false);

	        var computedStyle=document.defaultView.getComputedStyle(this,null);
	        var convertMatrix=matrixToAngleScale(computedStyle.webkitTransform);

	        self.startScale=e.scale;
	        self.curScale=self.startScale-convertMatrix.scale;
	    }, false);

	    self.$el.addEventListener("gesturechange", function(e) {
	        var scale=e.scale-self.curScale;

	        this.style.webkitTransform="rotate("+((self.rotation+e.rotation)%360)+"deg) scale("+scale+")";
	        
	        e.preventDefault();
	    }, false);

	    self.$el.addEventListener("gestureend", function(e) {
	        self.rotation = (self.rotation + e.rotation) % 360;

	        clearTimeout(self.tid);

	        self.tid=setTimeout(function(){
	        	self.$el.addEventListener('touchmove', _moveMoving, false);
	        },100)
	    }, false);

	    function _moveStart(e){
	    	var touch = e.targetTouches[0];
	        var computedStyle=document.defaultView.getComputedStyle(this,null);
	        var posX=parseInt(computedStyle.left) || 0;
	        var posY=parseInt(computedStyle.top) || 0;

	        self.startX=touch.pageX;
	        self.startY=touch.pageY;
	        self.curX=parseInt(self.startX-posX);
	        self.curY=parseInt(self.startY-posY);
	    }

	    function _moveMoving(e){
	    	var touch = e.targetTouches[0];

	        this.style.left =parseInt(touch.pageX-self.curX) + 'px';
	        this.style.top = parseInt(touch.pageY-self.curY) + 'px';

	        e.preventDefault();
	    }
	};

	Dragable.prototype.getStatus=function(){
		var convertMatrix=matrixToAngleScale(document.defaultView.getComputedStyle(this.$el,null).webkitTransform);
		 var computedStyle=document.defaultView.getComputedStyle(this.$el,null);

		return{
			top:computedStyle.top,
			left:computedStyle.left,
			rotate:convertMatrix.rotate,
			scale:convertMatrix.scale
		}
	}

	//换算成rotate和scale
	function matrixToAngleScale(matrix){
	    if(matrix.indexOf("matrix")<=-1){
	        return {
	            rotate:0,
	            scale:1
	        }
	    }

	    var values = matrix.split('(')[1];
	        values = values.split(')')[0];
	        values = values.split(',');

	    var a = values[0];
	    var b = values[1];
	    var c = values[2];
	    var d = values[3];

	    var scale = Math.sqrt(a*a + b*b);

	    var sin = b/scale;
	    var angle = Math.round(Math.asin(sin) * (180/Math.PI));

	    return {
	        rotate:angle,
	        scale:scale
	    }
	}

	window.Dragable=Dragable;
})(window,document);