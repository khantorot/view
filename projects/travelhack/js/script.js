class Noise {
  constructor(octaves = 1) {
      this.p = new Uint8Array(512);
      this.octaves = octaves;
      this.init();
  }
  init() {
      for (let i = 0; i < 512; ++i) {
          this.p[i] = Math.random() * 256;
      }
  }
  lerp(t, a, b) {
      return a + t * (b - a);
  }
  grad2d(i, x, y) {
      const v = (i & 1) === 0 ? x : y;
      return (i & 2) === 0 ? -v : v;
  }
  noise2d(x2d, y2d) {
      const X = Math.floor(x2d) & 255;
      const Y = Math.floor(y2d) & 255;
      const x = x2d - Math.floor(x2d);
      const y = y2d - Math.floor(y2d);
      const fx = (3 - 2 * x) * x * x;
      const fy = (3 - 2 * y) * y * y;
      const p0 = this.p[X] + Y;
      const p1 = this.p[X + 1] + Y;
      return this.lerp(
          fy,
          this.lerp(
              fx,
              this.grad2d(this.p[p0], x, y),
              this.grad2d(this.p[p1], x - 1, y)
          ),
          this.lerp(
              fx,
              this.grad2d(this.p[p0 + 1], x, y - 1),
              this.grad2d(this.p[p1 + 1], x - 1, y - 1)
          )
      );
  }
  noise(x, y) {
      let e = 1,
          k = 1,
          s = 0;
      for (let i = 0; i < this.octaves; ++i) {
          e *= 0.5;
          s += e * (1 + this.noise2d(k * x, k * y)) / 2;
          k *= 2;
      }
      return s;
  }
}

class Particle {
  constructor(x, y, a) {
      this.x = x;
      this.y = y;
      this.a = a;
  }
  move() {
      const n = perlin.noise(this.x * 0.01, this.y * 0.01);
      const a = this.a + n * 16;
      this.x += Math.cos(a);
      this.y += Math.sin(a);
      ctx.fillRect(this.x, this.y, 0.75, 0.75);
      if (
          this.x < 0 ||
          this.x > canvas.width ||
          this.y < 0 ||
          this.y > canvas.height
      ) {
          particles.delete(this);
      }
  }
}

const canvas = {
  init() {
      this.elem = document.querySelector('#canvas');
      this.resize();
      return this.elem.getContext("2d");
  },
  resize() {
      this.width = this.elem.width = this.elem.offsetWidth;
      this.height = this.elem.height = this.elem.offsetHeight;
  },
  reset() {
      this.resize();
      ctx.fillStyle = "#574dc2";
  }
};

const pointer = {
  init(canvas) {
      this.x = canvas.width * 0.5;
      this.y = canvas.height * 0.5;
      ["mousedown", "touchstart"].forEach((event, touch) => {
          document.querySelector('#canvas').addEventListener(
              event,
              e => {
                  if (touch) {
                      e.preventDefault();
                      this.x = e.targetTouches[0].clientX;
                      this.y = e.targetTouches[0].clientY;
                  } else {
                      this.x = e.clientX;
                      this.y = e.clientY;
                  }
                  init();
              },
              false
          );
      });
  }
};

const ctx = canvas.init();
pointer.init(canvas);
const perlin = new Noise(3);
const particles = new Set();

const init = () => {
  particles.clear();
  canvas.reset();
  perlin.init();
  for (let a = 0; a < 2 * Math.PI; a += Math.PI / 720) {
      particles.add(new Particle(pointer.x, pointer.y, a));
  }
};

const run = () => {
  requestAnimationFrame(run);
  for (const p of particles) {
      p.move();
  }
};
init();
run();




































/******/ (function (modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if (installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
      /******/
}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
      /******/
};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
    /******/
}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function (exports, name, getter) {
/******/ 		if (!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
      /******/
}
    /******/
};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function (exports) {
/******/ 		if (typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
      /******/
}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
    /******/
};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function (value, mode) {
/******/ 		if (mode & 1) value = __webpack_require__(value);
/******/ 		if (mode & 8) return value;
/******/ 		if ((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if (mode & 2 && typeof value != 'string') for (var key in value) __webpack_require__.d(ns, key, function (key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
    /******/
};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function (module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
    /******/
};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function (object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
  /******/
})
/************************************************************************/
/******/({

    /***/ "./src/js/header.js":
    /*!**************************!*\
      !*** ./src/js/header.js ***!
      \**************************/
    /*! exports provided: header */
    /***/ (function (module, __webpack_exports__, __webpack_require__) {

      "use strict";
      eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"header\", function() { return header; });\nvar header = function header() {\n  var getRandomInt = function getRandomInt(min, max) {\n    min = Math.ceil(min);\n    max = Math.floor(max);\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n  };\n\n  var canvas = document.getElementById('letters-canvas');\n\n  if (!canvas) {\n    return;\n  }\n\n  canvas.width = document.body.clientWidth + 300;\n  canvas.height = document.body.clientHeight + 200;\n  var ctx = canvas.getContext('2d');\n  var matrixChars = '*+-/@_$[%£!XO1&>';\n  var originalText = 'MOSCOW TRAVEL HACK';\n\n  var convertText = function convertText(text, matrixChars, random) {\n    var newText = '';\n\n    for (var i = 0; i < text.length; i++) {\n      var newChar = void 0;\n\n      if (text[i] === ' ') {\n        newChar = ' ';\n      } else {\n        var currentRandom = (i + 1) * random;\n\n        if (random > 60) {\n          newChar = text[i];\n        } else {\n          var matrixCharIndex = currentRandom % matrixChars.length;\n          newChar = matrixChars[matrixCharIndex];\n        }\n      }\n\n      newText += newChar;\n    }\n\n    return newText;\n  };\n\n  ctx.fillStyle = '#000';\n  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);\n  var charWidth = 23;\n  var lineHeight = 30;\n  var gradientX = 20;\n\n  var render = function render() {\n    var width = canvas.width;\n    var height = canvas.width;\n    var charsNumbers = Math.round(width / charWidth);\n    var textsPerLine = Math.round(charsNumbers / originalText.length) + 5;\n    var linesNumbers = Math.round(height / lineHeight);\n    ctx.fillStyle = 'rgba(0,0,0,0.7)';\n    ctx.fillRect(0, 0, width, height);\n    ctx.fillStyle = '#1c1c1c';\n    ctx.font = '20pt HelveticaM';\n    var y = 0;\n\n    for (var lineCount = 0; lineCount < linesNumbers; lineCount++) {\n      var lineText = '';\n\n      for (var textCount = 0; textCount < textsPerLine; textCount++) {\n        var random = getRandomInt(1, 100);\n        lineText += convertText(originalText, matrixChars, random);\n      }  var x = void 0;\n\n      if (lineCount % 2 === 0) {\n        ctx.fillText(lineText, 0, y);\n        y += lineHeight;\n      } else {\n        ctx.fillText(lineText, 50, y);\n        y += lineHeight;\n      }\n    }\n\n    ctx.shadowBlur = 0;\n    var grd = ctx.createLinearGradient(0, 0, gradientX, 0);\n    grd.addColorStop(0, 'rgba(0,0,0,0)');\n    grd.addColorStop(0.5, 'rgba(0,0,0,0.8)');\n    grd.addColorStop(1, 'rgba(0,0,0,1)');\n    ctx.fillStyle = grd;\n    ctx.fillRect(0, 0, width + 500, height);\n  };\n\n  var showSite = function showSite() {\n    var wrap = document.querySelector('.letters');\n    wrap.classList.add('letters__fx-finish');\n    setTimeout(function () {\n      canvas.parentNode.removeChild(canvas);\n    }, 1000);\n  };\n\n  var headerBgLinesNumber = 100;\n  var headerBgTextsPerLineNumber = 20;\n  var words = originalText.trim().split(' ');\n\n  var generateHeaderBgText = function generateHeaderBgText() {\n    var allLines = '';\n\n    for (var lineCount = 0; lineCount < headerBgLinesNumber; lineCount++) {\n      var line = '';\n\n      for (var textCount = 0; textCount < headerBgTextsPerLineNumber; textCount++) {\n        for (var wordCount = 0; wordCount < words.length; wordCount++) {\n          if (lineCount % 2 === 0) {\n            line += \"<span class=\\\"letterBgText-Item\\\">\".concat(words[wordCount], \"</span>\");\n          } else {\n            line += \"<span class=\\\"letterBgText-Item letterBgText-Item_second\\\">\".concat(words[wordCount], \"</span>\");\n          }\n        }\n      }\n\n      allLines += \"<div class=\\\"letterBgText-Line\\\">\".concat(line, \"</div>\");\n    }\n\n    var wrap = document.querySelector('.letterBgText');\n    wrap.innerHTML = allLines;\n    var items = document.querySelectorAll('.letterBgText-Item');\n\n    var setNewText = function setNewText(element) {\n      var random = getRandomInt(1, 100);\n      var newText = convertText(element.textContent, matrixChars, random);\n      requestAnimationFrame(function () {\n        element.innerHTML = newText;\n      });\n    };\n\n    var handleItemEnter = function handleItemEnter(event) {\n      if (!event.target.timerId) {\n        event.target.originalText = event.target.textContent;\n        event.target.classList.add('letterBgText-Item_highlight');\n        setNewText(event.target);\n        event.target.timerId = setInterval(function () {\n          setNewText(event.target);\n        }, 300);\n      }\n    };\n\n    var handleItemLeave = function handleItemLeave(event) {\n      if (event.target.timerId) {\n        setTimeout(function () {\n          clearInterval(event.target.timerId);\n          event.target.innerHTML = event.target.originalText;\n          event.target.classList.remove('letterBgText-Item_highlight');\n          event.target.timerId = null;\n        }, 300);\n      }\n    };\n\n    items.forEach(function (item) {\n      item.addEventListener('mouseenter', handleItemEnter);\n      item.addEventListener('mouseleave', handleItemLeave);\n    });\n  };\n\n  if (document.documentElement.clientWidth > 1040 && !/#+/.test(window.location.href)) {\n    var intervalId = setInterval(function () {\n      render();\n      gradientX += 150;\n\n      if (gradientX >= canvas.width + 3000) {\n        clearInterval(intervalId);\n        generateHeaderBgText();\n        showSite();\n        window.location = '#';\n      }\n    }, 100);\n  } else {\n    generateHeaderBgText();\n    showSite();\n  }\n};\n\n//# sourceURL=webpack:///./src/js/header.js?");

      /***/
}),

      /***/ "./src/js/index.js":
      /*!*************************!*\
        !*** ./src/js/index.js ***!
        \*************************/
      /*! no exports provided */
      /***/ (function (module, __webpack_exports__, __webpack_require__) {

      "use strict";
      eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.js */ \"./src/js/header.js\");\n/**\n/*\n/* harmony import */ \n if (window.NodeList && !NodeList.prototype.forEach) {\n  NodeList.prototype.forEach = Array.prototype.forEach;\n} // find polifill for explorer\n\n\nArray.prototype.find = Array.prototype.find || function (callback) {\n  if (this === null) {\n    throw new TypeError('Array.prototype.find called on null or undefined');\n  } else if (typeof callback !== 'function') {\n    throw new TypeError('callback must be a function');\n  }\n\n  var list = Object(this);\n  var length = list.length >>> 0;\n  var thisArg = arguments[1];\n\n  for (var i = 0; i < length; i++) {\n    var element = list[i];\n\n    if (callback.call(thisArg, element, i, list)) {\n      return element;\n    }\n  }\n};\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  Object(_header_js__WEBPACK_IMPORTED_MODULE_0__[\"header\"])();\n  \n // initTiming()\n});\n\n//# sourceURL=webpack:///./src/js/index.js?");

      /***/
})

  /******/
});













var maxDist;
var mouse = { x: 0, y: 0 };
var cursor = {
  x: window.innerWidth,
  y: window.innerHeight
};

Math.dist = function (a, b) {
  var dx = b.x - a.x;
  var dy = b.y - a.y;
  return Math.sqrt(Math.pow(dx, 2), Math.pow(dy, 2));
}


const title = document.querySelector('#title');
title.addEventListener("mousemove", function (e) {
  cursor.x = e.clientX;
  cursor.y = e.clientY;
});

title.addEventListener("touchmove", function (e) {
  var t = e.touches[0];
  cursor.x = t.clientX;
  cursor.y = t.clientY;
}, {
  passive: false
});

var Char = function (container, char) {
  var span = document.createElement("span");
  span.setAttribute('data-char', char);
  span.innerText = char;
  container.appendChild(span);
  this.getDist = function () {
    this.pos = span.getBoundingClientRect();
    return Math.dist(mouse, {
      x: this.pos.x + (this.pos.width / 1.75),
      y: this.pos.y
    });
  }
  this.getAttr = function (dist, min, max) {
    var wght = max - Math.abs((max * dist / maxDist));
    return Math.max(min, wght + min);
  }
  this.update = function (args) {
    var dist = this.getDist();
    this.wdth = args.wdth ? ~~this.getAttr(dist, 5, 200) : 100;
    this.wght = args.wght ? ~~this.getAttr(dist, 100, 800) : 400;
    this.alpha = args.alpha ? this.getAttr(dist, 0, 1).toFixed(2) : 1;
    this.ital = args.ital ? this.getAttr(dist, 0, 1).toFixed(2) : 0;
    this.draw();
  }
  this.draw = function () {
    var style = "";
    style += "opacity: " + this.alpha + ";";
    style += "font-variation-settings: 'wght' " + this.wght + ", 'wdth' " + this.wdth + ", 'ital' " + this.ital + ";";
    span.style = style;
  }
  return this;
}

var VFont = function () {
  this.scale = false;
  this.flex = true;
  this.alpha = true;
  this.stroke = false;
  this.width = true;
  this.weight = true;
  this.italic = false;
  var title, str, chars = [];

  this.init = function () {
    title = document.getElementById("title");
    str = title.innerText;
    title.innerHTML = "";
    for (var i = 0; i < str.length; i++) {
      var _char = new Char(title, str[i]);
      chars.push(_char);
    }
    this.set();
    window.addEventListener("resize", this.setSize.bind(this));
  }

  this.set = function () {
    title.className = "";
    title.className += this.flex ? " flex" : "";
    title.className += this.stroke ? " stroke" : "";
    this.setSize();
  }

  this.setSize = function () {
    var fontSize = window.innerWidth / (str.length / 2);
    title.style = "font-size: " + fontSize + "px;";
    if (this.scale) {
      var scaleY = (window.innerHeight / title.getBoundingClientRect().height).toFixed(2);
      var lineHeight = scaleY * 0.8;
      title.style = "font-size: " + fontSize + "px; transform: scale(1," + scaleY + "); line-height: " + lineHeight + "em;"
    }
  }

  this.animate = function () {
    mouse.x += (cursor.x - mouse.x) / 30;
    mouse.y += (cursor.y - mouse.y) / 30;
    requestAnimationFrame(this.animate.bind(this));
    this.render();
  }

  this.render = function () {
    maxDist = title.getBoundingClientRect().width / 2;
    for (var i = 0; i < chars.length; i++) {
      chars[i].update({
        wght: this.weight,
        wdth: this.width,
        ital: this.italic,
        alpha: this.alpha
      });
    }
  }
  this.init();
  this.animate();
  return this;
}

var txt = new VFont();