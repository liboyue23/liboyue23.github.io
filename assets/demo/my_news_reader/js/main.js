function H$(e){return document.getElementById(e)}function H$$(e,t){return t?t.getElementsByTagName(e):document.getElementsByTagName(e)}function _shadowClone(e){var t={};for(var n in e)e.hasOwnProperty(n)&&(t[n]=e[n]);return t}function attrStyle(e,t){return e.style[t]?e.style[t]:e.currentStyle?e.currentStyle[t]:document.defaultView&&document.defaultView.getComputedStyle?(t=t.replace(/([A-Z])/g,"-$1").toLowerCase(),document.defaultView.getComputedStyle(e,null).getPropertyValue(t)):null}function AutoLoader(e,t){if("function"!=typeof e)throw new TypeError;this._generator=e,this._timeout=t,this._context=arguments[2],this._pool=[]}function _cutGrid(e,t){function n(n){function c(n){var s,l=_shadowClone(n);f++,s=f===d?e[r.measure]-a:Math.floor(n[r.measure]*e[r.measure]/100),l[i.offset]=o+e[i.offset],l[r.offset]=a+e[r.offset],l[i.measure]=u,l[r.measure]=s,l.colorPattern=e.colorPattern,t(l),a+=s}var u,d=n[r.name].length,f=0;l++,u=l===s?e[i.measure]-o:Math.floor(n[i.measure]*e[i.measure]/100),n.random===!1?n[r.name].forEach(c):n[r.name].randomEach(c),a=0,o+=u}var i,r;e.rows?(i={name:"rows",measure:"height",offset:"top"},r={name:"cols",measure:"width",offset:"left"}):(i={name:"cols",measure:"width",offset:"left"},r={name:"rows",measure:"height",offset:"top"});var o=0,a=0,s=e[i.name].length,l=0;e.random===!1?e[i.name].forEach(n):e[i.name].randomEach(n)}function _getGrids(e){var t=[],n=0,i=.18,r=e.colorPatterns[0];return _cutGrid(e.pageLayout,function(e){if(e.colorPattern||(e.colorPattern=r[n++]),e.rows||e.cols)_cutGrid(e,arguments.callee);else{var o=e.colorPattern,a=o.backgrounds,s=a.length,l=o.fontColor;e.fontSize=Math.floor(Math.sqrt(e.width*e.height)*i),e.backgroundColor=a[Math.floor(Math.random()*s)],e.fontColor=l,t.push(e)}}),t}var tagElems=[];!function(){function e(e,t){var n=[];for("undefined"==typeof t&&(t=e,e=0);t>e;e++)n.push(e);return n}Array.prototype.randomEach=function(t){if("function"!=typeof t)throw new TypeError;for(var n=this.length,i=e(n);n;){var r=Math.floor(Math.random()*n--);if(t(this[i[r]])===!1)break;i[r]=i[n]}},Array.prototype.forEach||(Array.prototype.forEach=function(e){var t=this.length;if("function"!=typeof e)throw new TypeError;for(var n=arguments[1],i=0;t>i;i++)i in this&&e.call(n,this[i],i,this)})}(),AutoLoader.prototype._load=function(){var e=this;clearTimeout(this._loading),this._loading=setTimeout(function(){e._pool.push(e._generator.apply(e._context))},this._timeout)},AutoLoader.prototype.get=function(){var e;return clearTimeout(this._loading),e=this._pool.length>0?this._pool.pop():this._generator.apply(this._context)};var myReader=function(){function e(e){this.dom=H$(e.domId),this.len=e.len,this.block=e.block,this.fillStage(H$("container")),this.clickEve()}return e.prototype={clickEve:function(){var e=this,t=H$$("button");t[0].onclick=function(){H$("container").innerHTML="",e.fillStage(H$("container"))}},reflowTagElem:function(e,t,n,i){e.style.top=t.top*i+"px",e.style.left=t.left*n+"px",e.style.width=t.width*n-2+"px",e.style.height=t.height*i-2+"px",e.style.fontSize=t.fontSize*n+"px",e.style.color=t.fontColor,e.style.backgroundColor=t.backgroundColor,e.order=t.width*n*t.height*i},fillStage:function(e){var t=this,n=_getGrids(window.tagConfig);n.forEach(function(n){var i=document.createElement("div");i.className="tag",t.reflowTagElem(i,n,6,4),e.appendChild(i),tagElems.push(i)})}},e}(),myData={domId:"container"};new myReader(myData);