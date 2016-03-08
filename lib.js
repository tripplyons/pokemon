(function () {
	var FX = {
		easing: {
			linear: function (progress) {
				return progress;
			},
			quadratic: function (progress) {
				return Math.pow(progress, 2);
			},
			swing: function (progress) {
				return 0.5 - Math.cos(progress * Math.PI) / 2;
			},
			circ: function (progress) {
				return 1 - Math.sin(Math.acos(progress));
			},
			back: function (progress, x) {
				return Math.pow(progress, 2) * ((x + 1) * progress - x);
			},
			bounce: function (progress) {
				for (var a = 0, b = 1, result; 1; a += b, b /= 2) {
					if (progress >= (7 - 4 * a) / 11) {
						return -Math.pow((11 - 6 * a - 11 * progress) / 4, 2) + Math.pow(b, 2);
					}
				}
			},
			elastic: function (progress, x) {
				return Math.pow(2, 10 * (progress - 1)) * Math.cos(20 * Math.PI * x / 3 * progress);
			}
		},
		animate: function (options) {
			var start = new Date;
			var id = setInterval(function () {
				var timePassed = new Date - start;
				var progress = timePassed / options.duration;
				if (progress > 1) {
					progress = 1;
				}
				options.progress = progress;
				var delta = options.delta(progress);
				options.step(delta);
				if (progress == 1) {
					clearInterval(id);
					options.complete();
				}
			}, options.delay || 10);
		},
		fadeOut: function (element, options) {
			var to = 1;
			this.animate({
				duration: options.duration,
				delta: function (progress) {
					progress = this.progress;
					return FX.easing.swing(progress);
				},
				complete: options.complete,
				step: function (delta) {
					element.style.opacity = to - delta;
				}
			});
		},
		fadeIn: function (element, options) {
			var to = 0;
			this.animate({
				duration: options.duration,
				delta: function (progress) {
					progress = this.progress;
					return FX.easing.swing(progress);
				},
				complete: options.complete,
				step: function (delta) {
					element.style.opacity = to + delta;
				}
			});
		}
	};
	window.FX = FX;
})()

function getStyle(el, styleProp) {
	var value, defaultView = (el.ownerDocument || document).defaultView;
	// W3C standard way:
	if (defaultView && defaultView.getComputedStyle) {
		// sanitize property name to css notation
		// (hypen separated words eg. font-Size)
		styleProp = styleProp.replace(/([A-Z])/g, "-$1").toLowerCase();
		return defaultView.getComputedStyle(el, null).getPropertyValue(styleProp);
	} else if (el.currentStyle) { // IE
		// sanitize property name to camelCase
		styleProp = styleProp.replace(/\-(\w)/g, function (str, letter) {
			return letter.toUpperCase();
		});
		value = el.currentStyle[styleProp];
		// convert other units to pixels on IE
		if (/^\d+(em|pt|%|ex)?$/i.test(value)) {
			return (function (value) {
				var oldLeft = el.style.left,
					oldRsLeft = el.runtimeStyle.left;
				el.runtimeStyle.left = el.currentStyle.left;
				el.style.left = value || 0;
				value = el.style.pixelLeft + "px";
				el.style.left = oldLeft;
				el.runtimeStyle.left = oldRsLeft;
				return value;
			})(value);
		}
		return value;
	}
}

function mergeoptions(obj1, obj2) {
	var obj3 = {};
	for (var attrname in obj1) {
		obj3[attrname] = obj1[attrname];
	}
	for (var attrname in obj2) {
		obj3[attrname] = obj2[attrname];
	}
	return obj3;
}