/*
 * Copyright (c) 2009 Simo Kinnunen.
 * Licensed under the MIT license.
 */
var Cufon = (function() {
	var K = function() {
		return K.replace.apply(null, arguments);
	};
	var U = K.DOM = {
		ready : (function() {
			var Z = false, b = {
				loaded : 1,
				complete : 1
			};
			var Y = [], a = function() {
				if (Z) {
					return
				}
				Z = true;
				for ( var c; c = Y.shift(); c()) {
				}
			};
			if (document.addEventListener) {
				document.addEventListener("DOMContentLoaded", a, false);
				window.addEventListener("pageshow", a, false);
			}
			if (!window.opera && document.readyState) {
				(function() {
					b[document.readyState] ? a() : setTimeout(arguments.callee,
							10);
				})();
			}
			if (document.readyState && document.createStyleSheet) {
				(function() {
					try {
						document.body.doScroll("left");
						a();
					} catch (c) {
						setTimeout(arguments.callee, 1);
					}
				})();
			}
			O(window, "load", a);
			return function(c) {
				if (!arguments.length) {
					a();
				} else {
					Z ? c() : Y.push(c);
				}
			};
		})()
	};
	var L = K.CSS = {
		Size : function(Z, Y) {
			this.value = parseFloat(Z);
			this.unit = String(Z).match(/[a-z%]*$/)[0] || "px";
			this.convert = function(a) {
				return a / Y * this.value;
			};
			this.convertFrom = function(a) {
				return a / this.value * Y;
			};
			this.toString = function() {
				return this.value + this.unit;
			};
		},
		getStyle : function(Z) {
			var Y = document.defaultView;
			if (Y && Y.getComputedStyle) {
				return new A(Y.getComputedStyle(Z, null));
			}
			if (Z.currentStyle) {
				return new A(Z.currentStyle);
			}
			return new A(Z.style);
		},
		ready : (function() {
			var a = false;
			var Z = [], b = function() {
				a = true;
				for ( var d; d = Z.shift(); d()) {
				}
			};
			var Y = Object.prototype.propertyIsEnumerable ? F("style") : {
				length : 0
			};
			var c = F("link");
			U.ready(function() {
				var g = 0, f;
				for ( var e = 0, d = c.length; f = c[e], e < d; ++e) {
					if (!f.disabled && f.rel.toLowerCase() == "stylesheet") {
						++g;
					}
				}
				if (document.styleSheets.length >= Y.length + g) {
					b();
				} else {
					setTimeout(arguments.callee, 10);
				}
			});
			return function(d) {
				if (a) {
					d();
				} else {
					Z.push(d);
				}
			};
		})(),
		supports : function(a, Z) {
			var Y = document.createElement("span").style;
			if (Y[a] === undefined) {
				return false;
			}
			Y[a] = Z;
			return Y[a] === Z;
		},
		textAlign : function(b, a, Y, Z) {
			if (a.get("textAlign") == "right") {
				if (Y > 0) {
					b = " " + b;
				}
			} else {
				if (Y < Z - 1) {
					b += " ";
				}
			}
			return b;
		},
		textDecoration : function(d, c) {
			if (!c) {
				c = this.getStyle(d);
			}
			var Z = {
				underline : null,
				overline : null,
				"line-through" : null
			};
			for ( var Y = d; Y.parentNode && Y.parentNode.nodeType == 1;) {
				var b = true;
				for ( var a in Z) {
					if (Z[a]) {
						continue;
					}
					if (c.get("textDecoration").indexOf(a) != -1) {
						Z[a] = c.get("color");
					}
					b = false;
				}
				if (b) {
					break;
				}
				c = this.getStyle(Y = Y.parentNode);
			}
			return Z;
		},
		textShadow : I(function(c) {
			if (c == "none") {
				return null;
			}
			var b = [], d = {}, Y, Z = 0;
			var a = /(#[a-f0-9]+|[a-z]+\(.*?\)|[a-z]+)|(-?[\d.]+[a-z%]*)|,/ig;
			while (Y = a.exec(c)) {
				if (Y[0] == ",") {
					b.push(d);
					d = {}, Z = 0;
				} else {
					if (Y[1]) {
						d.color = Y[1];
					} else {
						d[[ "offX", "offY", "blur" ][Z++]] = Y[2];
					}
				}
			}
			b.push(d);
			return b;
		}),
		color : I(function(Z) {
			var Y = {};
			Y.color = Z.replace(/^rgba\((.*?),\s*([\d.]+)\)/,
					function(b, a, c) {
						Y.opacity = parseFloat(c);
						return "rgb(" + a + ")";
					});
			return Y;
		}),
		textTransform : function(Z, Y) {
			return Z[{
				uppercase : "toUpperCase",
				lowercase : "toLowerCase"
			}[Y.get("textTransform")] || "toString"]();
		}
	};
	function Q(Z) {
		var Y = this.face = Z.face;
		this.glyphs = Z.glyphs;
		this.w = Z.w;
		this.baseSize = parseInt(Y["units-per-em"], 10);
		this.family = Y["font-family"].toLowerCase();
		this.weight = Y["font-weight"];
		this.style = Y["font-style"] || "normal";
		this.viewBox = (function() {
			var a = Y.bbox.split(/\s+/);
			return {
				minX : parseInt(a[0], 10),
				minY : parseInt(a[1], 10),
				width : parseInt(a[2], 10) - parseInt(a[0], 10),
				height : parseInt(a[3], 10) - parseInt(a[1], 10),
				toString : function() {
					return [ this.minX, this.minY, this.width, this.height ]
							.join(" ");
				}
			};
		})();
		this.ascent = -parseInt(Y.ascent, 10);
		this.descent = -parseInt(Y.descent, 10);
		this.height = -this.ascent + this.descent;
	}
	function E() {
		var Z = {}, Y = {
			oblique : "italic",
			italic : "oblique"
		};
		this.add = function(a) {
			(Z[a.style] || (Z[a.style] = {}))[a.weight] = a;
		};
		this.get = function(e, f) {
			var d = Z[e] || Z[Y[e]] || Z.normal || Z.italic || Z.oblique;
			if (!d) {
				return null;
			}
			f = {
				normal : 400,
				bold : 700
			}[f] || parseInt(f, 10);
			if (d[f]) {
				return d[f];
			}
			var b = {
				1 : 1,
				99 : 0
			}[f % 100], h = [], c, a;
			if (b === undefined) {
				b = f > 400;
			}
			if (f == 500) {
				f = 400;
			}
			for ( var g in d) {
				g = parseInt(g, 10);
				if (!c || g < c) {
					c = g;
				}
				if (!a || g > a) {
					a = g;
				}
				h.push(g);
			}
			if (f < c) {
				f = c;
			}
			if (f > a) {
				f = a;
			}
			h.sort(function(j, i) {
				return (b ? (j > f && i > f) ? j < i : j > i
						: (j < f && i < f) ? j > i : j < i) ? -1 : 1;
			});
			return d[h[0]];
		};
	}
	function P() {
		function a(c, d) {
			if (c.contains) {
				return c.contains(d);
			}
			return c.compareDocumentPosition(d) & 16;
		}
		function Y(d) {
			var c = d.relatedTarget;
			if (!c || a(this, c)) {
				return
			}
			Z(this);
		}
		function b(c) {
			Z(this);
		}
		function Z(c) {
			setTimeout(function() {
				K.replace(c, D.get(c).options, true);
			}, 10);
		}
		this.attach = function(c) {
			if (c.onmouseenter === undefined) {
				O(c, "mouseover", Y);
				O(c, "mouseout", Y);
			} else {
				O(c, "mouseenter", b);
				O(c, "mouseleave", b);
			}
		};
	}
	function X() {
		var a = {}, Y = 0;
		function Z(b) {
			return b.cufid || (b.cufid = ++Y);
		}
		this.get = function(b) {
			var c = Z(b);
			return a[c] || (a[c] = {});
		};
	}
	function A(Y) {
		var a = {}, Z = {};
		this.get = function(b) {
			return a[b] != undefined ? a[b] : Y[b];
		};
		this.getSize = function(c, b) {
			return Z[c] || (Z[c] = new L.Size(this.get(c), b));
		};
		this.extend = function(b) {
			for ( var c in b) {
				a[c] = b[c];
			}
			return this;
		};
	}
	function O(Z, Y, a) {
		if (Z.addEventListener) {
			Z.addEventListener(Y, a, false);
		} else {
			if (Z.attachEvent) {
				Z.attachEvent("on" + Y, function() {
					return a.call(Z, window.event);
				});
			}
		}
	}
	function R(Z, Y) {
		var a = D.get(Z);
		if (a.options) {
			return Z;
		}
		if (Y.hover && Y.hoverables[Z.nodeName.toLowerCase()]) {
			B.attach(Z);
		}
		a.options = Y;
		return Z;
	}
	function I(Y) {
		var Z = {};
		return function(a) {
			if (!Z.hasOwnProperty(a)) {
				Z[a] = Y.apply(null, arguments);
			}
			return Z[a];
		};
	}
	function C(d, c) {
		if (!c) {
			c = L.getStyle(d);
		}
		var Z = c.get("fontFamily").split(/\s*,\s*/), b;
		for ( var a = 0, Y = Z.length; a < Y; ++a) {
			b = Z[a].replace(/^(["'])(.*?)\1$/, "$2").toLowerCase();
			if (H[b]) {
				return H[b].get(c.get("fontStyle"), c.get("fontWeight"));
			}
		}
		return null;
	}
	function F(Y) {
		return document.getElementsByTagName(Y);
	}
	function G() {
		var Y = {}, b;
		for ( var a = 0, Z = arguments.length; a < Z; ++a) {
			for (b in arguments[a]) {
				Y[b] = arguments[a][b];
			}
		}
		return Y;
	}
	function M(b, k, Z, m, c, a) {
		var j = m.separate;
		if (j == "none") {
			return W[m.engine].apply(null, arguments);
		}
		var h = document.createDocumentFragment(), e;
		var f = k.split(N[j]), Y = (j == "words");
		if (Y && S) {
			if (/^\s/.test(k)) {
				f.unshift("");
			}
			if (/\s$/.test(k)) {
				f.push("");
			}
		}
		for ( var g = 0, d = f.length; g < d; ++g) {
			e = W[m.engine](b, Y ? L.textAlign(f[g], Z, g, d) : f[g], Z, m, c,
					a, g < d - 1);
			if (e) {
				h.appendChild(e);
			}
		}
		return h;
	}
	function J(Z, g) {
		var a, Y, d, f;
		for ( var b = R(Z, g).firstChild; b; b = d) {
			d = b.nextSibling;
			f = false;
			if (b.nodeType == 1) {
				if (!b.firstChild) {
					continue;
				}
				if (!/cufon/.test(b.className)) {
					arguments.callee(b, g);
					continue;
				} else {
					f = true;
				}
			}
			if (!Y) {
				Y = L.getStyle(Z).extend(g);
			}
			if (!a) {
				a = C(Z, Y);
			}
			if (!a) {
				continue;
			}
			if (f) {
				W[g.engine](a, null, Y, g, b, Z);
				continue;
			}
			var e = b.data;
			if (e === "") {
				continue;
			}
			var c = M(a, e, Y, g, b, Z);
			if (c) {
				b.parentNode.replaceChild(c, b);
			} else {
				b.parentNode.removeChild(b);
			}
		}
	}
	var S = " ".split(/\s+/).length == 0;
	var D = new X();
	var B = new P();
	var V = [];
	var W = {}, H = {}, T = {
		enableTextDecoration : false,
		engine : null,
		hover : false,
		hoverables : {
			a : true
		},
		printable : true,
		selector : (window.Sizzle || window.jQuery
				|| (window.dojo && dojo.query) || (window.$$ && function(Y) {
					return $$(Y);
				}) || (window.$ && function(Y) {
					return $(Y);
				}) || (document.querySelectorAll && function(Y) {
					return document.querySelectorAll(Y);
				}) || F),
		separate : "words",
		textShadow : "none"
	};
	var N = {
		words : /\s+/,
		characters : ""
	};
	K.now = function() {
		U.ready();
		return K;
	};
	K.refresh = function() {
		var a = V.splice(0, V.length);
		for ( var Z = 0, Y = a.length; Z < Y; ++Z) {
			K.replace.apply(null, a[Z]);
		}
		return K;
	};
	K.registerEngine = function(Z, Y) {
		if (!Y) {
			return K;
		}
		W[Z] = Y;
		return K.set("engine", Z);
	};
	K.registerFont = function(a) {
		var Y = new Q(a), Z = Y.family;
		if (!H[Z]) {
			H[Z] = new E();
		}
		H[Z].add(Y);
		return K.set("fontFamily", Z);
	};
	K.replace = function(a, Z, Y) {
		Z = G(T, Z);
		if (!Z.engine) {
			return K;
		}
		if (typeof Z.textShadow == "string") {
			Z.textShadow = L.textShadow(Z.textShadow);
		}
		if (!Y) {
			V.push(arguments);
		}
		if (a.nodeType || typeof a == "string") {
			a = [ a ];
		}
		L.ready(function() {
			for ( var c = 0, b = a.length; c < b; ++c) {
				var d = a[c];
				if (typeof d == "string") {
					K.replace(Z.selector(d), Z, true);
				} else {
					J(d, Z);
				}
			}
		});
		return K;
	};
	K.set = function(Y, Z) {
		T[Y] = Z;
		return K;
	};
	return K;
})();
Cufon
		.registerEngine(
				"canvas",
				(function() {
					var B = document.createElement("canvas");
					if (!B || !B.getContext || !B.getContext.apply) {
						return null;
					}
					B = null;
					var A = Cufon.CSS.supports("display", "inline-block");
					var E = !A
							&& (document.compatMode == "BackCompat" || /frameset|transitional/i
									.test(document.doctype.publicId));
					var F = document.createElement("style");
					F.type = "text/css";
					F
							.appendChild(document
									.createTextNode("@media screen,projection{.cufon-canvas{display:inline;display:inline-block;position:relative;vertical-align:middle"
											+ (E ? ""
													: ";font-size:1px;line-height:1px")
											+ "}.cufon-canvas .cufon-alt{display:none}"
											+ (A ? ".cufon-canvas canvas{position:relative}"
													: ".cufon-canvas canvas{position:absolute}")
											+ "}@media print{.cufon-canvas{padding:0 !important}.cufon-canvas canvas{display:none}.cufon-canvas .cufon-alt{display:inline}}"));
					document.getElementsByTagName("head")[0].appendChild(F);
					function D(O, H) {
						var M = 0, L = 0;
						var G = [], N = /([mrvxe])([^a-z]*)/g, J;
						generate: for ( var I = 0; J = N.exec(O); ++I) {
							var K = J[2].split(",");
							switch (J[1]) {
							case "v":
								G[I] = {
									m : "bezierCurveTo",
									a : [ M + ~~K[0], L + ~~K[1], M + ~~K[2],
											L + ~~K[3], M += ~~K[4],
											L += ~~K[5] ]
								};
								break;
							case "r":
								G[I] = {
									m : "lineTo",
									a : [ M += ~~K[0], L += ~~K[1] ]
								};
								break;
							case "m":
								G[I] = {
									m : "moveTo",
									a : [ M = ~~K[0], L = ~~K[1] ]
								};
								break;
							case "x":
								G[I] = {
									m : "closePath"
								};
								break;
							case "e":
								break generate;
							}
							H[G[I].m].apply(H, G[I].a);
						}
						return G;
					}
					function C(K, J) {
						for ( var I = 0, H = K.length; I < H; ++I) {
							var G = K[I];
							J[G.m].apply(J, G.a);
						}
					}
					return function(q, T, k, P, X, r) {
						var I = (T === null);
						var V = q.viewBox;
						var J = k.getSize("fontSize", q.baseSize);
						var h = k.get("letterSpacing");
						h = (h == "normal") ? 0 : J
								.convertFrom(parseInt(h, 10));
						var W = 0, j = 0, f = 0, R = 0;
						var U = P.textShadow, d = [];
						if (U) {
							for ( var p = 0, m = U.length; p < m; ++p) {
								var Z = U[p];
								var c = J.convertFrom(parseFloat(Z.offX));
								var b = J.convertFrom(parseFloat(Z.offY));
								d[p] = [ c, b ];
								if (b < W) {
									W = b;
								}
								if (c > j) {
									j = c;
								}
								if (b > f) {
									f = b;
								}
								if (c < R) {
									R = c;
								}
							}
						}
						var u = Cufon.CSS.textTransform(I ? X.alt : T, k)
								.split("");
						var G = 0, S = null;
						for ( var p = 0, m = u.length; p < m; ++p) {
							var Q = q.glyphs[u[p]] || q.missingGlyph;
							if (!Q) {
								continue;
							}
							G += S = Number(Q.w || q.w) + h;
						}
						if (S === null) {
							return null;
						}
						j += (V.width - S);
						R += V.minX;
						var O, K;
						if (I) {
							O = X;
							K = X.firstChild;
						} else {
							O = document.createElement("span");
							O.className = "cufon cufon-canvas";
							O.alt = T;
							K = document.createElement("canvas");
							O.appendChild(K);
							if (P.printable) {
								var n = document.createElement("span");
								n.className = "cufon-alt";
								n.appendChild(document.createTextNode(T));
								O.appendChild(n);
							}
						}
						var v = O.style;
						var a = K.style;
						var H = J.convert(V.height - W + f);
						var t = Math.ceil(H);
						var e = t / H;
						K.width = Math.ceil(J.convert(G + j - R) * e);
						K.height = t;
						W += V.minY;
						a.top = Math.round(J.convert(W - q.ascent)) + "px";
						a.left = Math.round(J.convert(R)) + "px";
						var N = Math.ceil(J.convert(G * e)) + "px";
						if (A) {
							v.width = N;
							v.height = J.convert(q.height) + "px";
						} else {
							v.paddingLeft = N;
							v.paddingBottom = (J.convert(q.height) - 1) + "px";
						}
						var s = K.getContext("2d"), Y = t / V.height;
						s.scale(Y, Y);
						s.translate(-R, -W);
						s.lineWidth = q.face["underline-thickness"];
						s.save();
						function L(i, g) {
							s.strokeStyle = g;
							s.beginPath();
							s.moveTo(0, i);
							s.lineTo(G, i);
							s.stroke();
						}
						var M = P.enableTextDecoration ? Cufon.CSS
								.textDecoration(r, k) : {};
						if (M.underline) {
							L(-q.face["underline-position"], M.underline);
						}
						if (M.overline) {
							L(q.ascent, M.overline);
						}
						s.fillStyle = k.get("color");
						function o() {
							for ( var w = 0, g = u.length; w < g; ++w) {
								var x = q.glyphs[u[w]] || q.missingGlyph;
								if (!x) {
									continue;
								}
								s.beginPath();
								if (x.d) {
									if (x.code) {
										C(x.code, s);
									} else {
										x.code = D("m" + x.d, s);
									}
								}
								s.fill();
								s.translate(Number(x.w || q.w) + h, 0);
							}
						}
						if (U) {
							for ( var p = 0, m = U.length; p < m; ++p) {
								var Z = U[p];
								s.save();
								s.fillStyle = Z.color;
								s.translate.apply(s, d[p]);
								o();
								s.restore();
							}
						}
						o();
						s.restore();
						if (M["line-through"]) {
							L(-q.descent, M["line-through"]);
						}
						return O;
					};
				})());
Cufon
		.registerEngine(
				"vml",
				(function() {
					if (!document.namespaces) {
						return
					}
					document
							.write('<!--[if vml]><script type="text/javascript">Cufon.vmlEnabled=true;<\/script><![endif]-->');
					if (!Cufon.vmlEnabled) {
						return
					}
					if (document.namespaces.cvml == null) {
						document.namespaces.add("cvml",
								"urn:schemas-microsoft-com:vml");
						document
								.write('<style type="text/css">@media screen{cvml\\:shape,cvml\\:group,cvml\\:shapetype,cvml\\:fill{behavior:url(#default#VML);display:inline-block;antialias:true;position:absolute}.cufon-vml{display:inline-block;position:relative;vertical-align:middle}.cufon-vml .cufon-alt{display:none}a .cufon-vml{cursor:pointer}}@media print{.cufon-vml *{display:none}.cufon-vml .cufon-alt{display:inline}}</style>');
					}
					var C = 0;
					function B(E, F) {
						return A(E, /(?:em|ex|%)$/i.test(F) ? "1em" : F);
					}
					function A(H, I) {
						if (/px$/i.test(I)) {
							return parseFloat(I);
						}
						var G = H.style.left, F = H.runtimeStyle.left;
						H.runtimeStyle.left = H.currentStyle.left;
						H.style.left = I;
						var E = H.style.pixelLeft;
						H.style.left = G;
						H.runtimeStyle.left = F;
						return E;
					}
					function D(F, H) {
						var E = document.createElement("cvml:shapetype");
						E.id = "cufon-glyph-" + C++;
						F.typeRef = "#" + E.id;
						E.stroked = "f";
						E.coordsize = H.width + "," + H.height;
						E.coordorigin = H.minX + "," + H.minY;
						var G = "m" + H.minX + "," + H.minY + " r" + H.width
								+ "," + H.height;
						E.path = (F.d ? "m" + F.d + "x" : "") + G;
						document.body.insertBefore(E, document.body.firstChild);
					}
					return function(n, T, f, P, W, o, d) {
						var G = (T === null);
						if (G) {
							T = W.alt;
						}
						var V = n.viewBox;
						var H = f.computedFontSize
								|| (f.computedFontSize = new Cufon.CSS.Size(B(
										o, f.get("fontSize"))
										+ "px", n.baseSize));
						var c = f.computedLSpacing;
						if (c == undefined) {
							c = f.get("letterSpacing");
							f.computedLSpacing = c = (c == "normal") ? 0 : H
									.convertFrom(A(o, c));
						}
						var O, I;
						if (G) {
							O = W;
							I = W.firstChild;
						} else {
							O = document.createElement("span");
							O.className = "cufon cufon-vml";
							O.alt = T;
							I = document.createElement("cvml:group");
							O.appendChild(I);
							if (P.printable) {
								var j = document.createElement("span");
								j.className = "cufon-alt";
								j.innerText = T;
								O.appendChild(j);
							}
							if (!d) {
								O.appendChild(document
										.createElement("cvml:group"));
							}
						}
						var u = O.style;
						var Y = I.style;
						var F = H.convert(V.height);
						Y.height = Math.ceil(F);
						Y.top = Math.round(H.convert(V.minY - n.ascent));
						Y.left = Math.round(H.convert(V.minX));
						var b = parseInt(Y.height, 10) / F;
						u.height = H.convert(-n.ascent + n.descent) + "px";
						var K = P.enableTextDecoration ? Cufon.CSS
								.textDecoration(o, f) : {};
						var S = f.get("color");
						var s = Cufon.CSS.textTransform(T, f).split("");
						var E = 0, a = 0, L = null;
						var U = P.textShadow;
						for ( var m = 0, h = -1, g = s.length; m < g; ++m) {
							var Q = n.glyphs[s[m]] || n.missingGlyph, M;
							if (!Q) {
								continue;
							}
							if (!Q.typeRef) {
								D(Q, V);
							}
							if (G) {
								M = I.childNodes[++h];
							} else {
								M = document.createElement("cvml:shape");
								I.appendChild(M);
							}
							M.type = Q.typeRef;
							var q = M.style;
							q.width = V.width;
							q.height = V.height;
							q.top = 0;
							q.left = a;
							q.zIndex = 1;
							M.fillcolor = S;
							if (U) {
								for ( var Z = 0, e = U.length; Z < e; ++Z) {
									var X = U[Z];
									var t = Cufon.CSS.color(X.color);
									var J = M.cloneNode(false), R = J.runtimeStyle;
									R.top = H.convertFrom(parseFloat(X.offY));
									R.left = a
											+ H.convertFrom(parseFloat(X.offX));
									R.zIndex = 0;
									J.fillcolor = t.color;
									if (t.opacity) {
										var r = document
												.createElement("cvml:fill");
										r.opacity = t.opacity;
										J.appendChild(r);
									}
									I.appendChild(J);
								}
								++h;
							}
							L = Number(Q.w || n.w) + c;
							E += L;
							a += L;
						}
						if (L === null) {
							return null;
						}
						var N = -V.minX + E + (V.width - L);
						I.coordsize = N + "," + V.height;
						Y.width = H.convert(N * b);
						u.width = Math.max(Math.ceil(H.convert(E * b)), 0);
						return O;
					};
				})());