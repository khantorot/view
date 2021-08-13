/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/js/index.js");
/******/ })
/************************************************************************/
/******/ ({
    
    /***/ "./src/js/header.js":
    /*!**************************!*\
      !*** ./src/js/header.js ***!
      \**************************/
    /*! exports provided: header */
    /***/ (function(module, __webpack_exports__, __webpack_require__) {
    
        "use strict";
        eval("__webpack_require__.r(__webpack_exports__);\n/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, \"header\", function() { return header; });\nvar header = function header() {\n  var getRandomInt = function getRandomInt(min, max) {\n    min = Math.ceil(min);\n    max = Math.floor(max);\n    return Math.floor(Math.random() * (max - min + 1)) + min;\n  };\n\n  var canvas = document.getElementById('letters-canvas');\n\n  if (!canvas) {\n    return;\n  }\n\n  canvas.width = document.body.clientWidth + 300;\n  canvas.height = document.body.clientHeight + 200;\n  var ctx = canvas.getContext('2d');\n  var matrixChars = '*+-/@_$[%£!XO1&>';\n  var originalText = 'MOSCOW TRAVEL HACK';\n\n  var convertText = function convertText(text, matrixChars, random) {\n    var newText = '';\n\n    for (var i = 0; i < text.length; i++) {\n      var newChar = void 0;\n\n      if (text[i] === ' ') {\n        newChar = ' ';\n      } else {\n        var currentRandom = (i + 1) * random;\n\n        if (random > 60) {\n          newChar = text[i];\n        } else {\n          var matrixCharIndex = currentRandom % matrixChars.length;\n          newChar = matrixChars[matrixCharIndex];\n        }\n      }\n\n      newText += newChar;\n    }\n\n    return newText;\n  };\n\n  ctx.fillStyle = '#000';\n  ctx.fillRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);\n  var charWidth = 23;\n  var lineHeight = 30;\n  var gradientX = 20;\n\n  var render = function render() {\n    var width = canvas.width;\n    var height = canvas.width;\n    var charsNumbers = Math.round(width / charWidth);\n    var textsPerLine = Math.round(charsNumbers / originalText.length) + 5;\n    var linesNumbers = Math.round(height / lineHeight);\n    ctx.fillStyle = 'rgba(0,0,0,0.7)';\n    ctx.fillRect(0, 0, width, height);\n    ctx.fillStyle = '#1c1c1c';\n    ctx.font = '20pt HelveticaM';\n    var y = 0;\n\n    for (var lineCount = 0; lineCount < linesNumbers; lineCount++) {\n      var lineText = '';\n\n      for (var textCount = 0; textCount < textsPerLine; textCount++) {\n        var random = getRandomInt(1, 100);\n        lineText += convertText(originalText, matrixChars, random);\n      }  var x = void 0;\n\n      if (lineCount % 2 === 0) {\n        ctx.fillText(lineText, 0, y);\n        y += lineHeight;\n      } else {\n        ctx.fillText(lineText, 50, y);\n        y += lineHeight;\n      }\n    }\n\n    ctx.shadowBlur = 0;\n    var grd = ctx.createLinearGradient(0, 0, gradientX, 0);\n    grd.addColorStop(0, 'rgba(0,0,0,0)');\n    grd.addColorStop(0.5, 'rgba(0,0,0,0.8)');\n    grd.addColorStop(1, 'rgba(0,0,0,1)');\n    ctx.fillStyle = grd;\n    ctx.fillRect(0, 0, width + 500, height);\n  };\n\n  var showSite = function showSite() {\n    var wrap = document.querySelector('.letters');\n    wrap.classList.add('letters__fx-finish');\n    setTimeout(function () {\n      canvas.parentNode.removeChild(canvas);\n    }, 1000);\n  };\n\n  var headerBgLinesNumber = 100;\n  var headerBgTextsPerLineNumber = 20;\n  var words = originalText.trim().split(' ');\n\n  var generateHeaderBgText = function generateHeaderBgText() {\n    var allLines = '';\n\n    for (var lineCount = 0; lineCount < headerBgLinesNumber; lineCount++) {\n      var line = '';\n\n      for (var textCount = 0; textCount < headerBgTextsPerLineNumber; textCount++) {\n        for (var wordCount = 0; wordCount < words.length; wordCount++) {\n          if (lineCount % 2 === 0) {\n            line += \"<span class=\\\"letterBgText-Item\\\">\".concat(words[wordCount], \"</span>\");\n          } else {\n            line += \"<span class=\\\"letterBgText-Item letterBgText-Item_second\\\">\".concat(words[wordCount], \"</span>\");\n          }\n        }\n      }\n\n      allLines += \"<div class=\\\"letterBgText-Line\\\">\".concat(line, \"</div>\");\n    }\n\n    var wrap = document.querySelector('.letterBgText');\n    wrap.innerHTML = allLines;\n    var items = document.querySelectorAll('.letterBgText-Item');\n\n    var setNewText = function setNewText(element) {\n      var random = getRandomInt(1, 100);\n      var newText = convertText(element.textContent, matrixChars, random);\n      requestAnimationFrame(function () {\n        element.innerHTML = newText;\n      });\n    };\n\n    var handleItemEnter = function handleItemEnter(event) {\n      if (!event.target.timerId) {\n        event.target.originalText = event.target.textContent;\n        event.target.classList.add('letterBgText-Item_highlight');\n        setNewText(event.target);\n        event.target.timerId = setInterval(function () {\n          setNewText(event.target);\n        }, 300);\n      }\n    };\n\n    var handleItemLeave = function handleItemLeave(event) {\n      if (event.target.timerId) {\n        setTimeout(function () {\n          clearInterval(event.target.timerId);\n          event.target.innerHTML = event.target.originalText;\n          event.target.classList.remove('letterBgText-Item_highlight');\n          event.target.timerId = null;\n        }, 300);\n      }\n    };\n\n    items.forEach(function (item) {\n      item.addEventListener('mouseenter', handleItemEnter);\n      item.addEventListener('mouseleave', handleItemLeave);\n    });\n  };\n\n  if (document.documentElement.clientWidth > 1040 && !/#+/.test(window.location.href)) {\n    var intervalId = setInterval(function () {\n      render();\n      gradientX += 150;\n\n      if (gradientX >= canvas.width + 3000) {\n        clearInterval(intervalId);\n        generateHeaderBgText();\n        showSite();\n        window.location = '#';\n      }\n    }, 100);\n  } else {\n    generateHeaderBgText();\n    showSite();\n  }\n};\n\n//# sourceURL=webpack:///./src/js/header.js?");
        
        /***/ }),
        
        /***/ "./src/js/index.js":
        /*!*************************!*\
          !*** ./src/js/index.js ***!
          \*************************/
        /*! no exports provided */
        /***/ (function(module, __webpack_exports__, __webpack_require__) {
        
        "use strict";
        eval("__webpack_require__.r(__webpack_exports__);\n/* harmony import */ var _header_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./header.js */ \"./src/js/header.js\");\n/**\n/*\n/* harmony import */ \n if (window.NodeList && !NodeList.prototype.forEach) {\n  NodeList.prototype.forEach = Array.prototype.forEach;\n} // find polifill for explorer\n\n\nArray.prototype.find = Array.prototype.find || function (callback) {\n  if (this === null) {\n    throw new TypeError('Array.prototype.find called on null or undefined');\n  } else if (typeof callback !== 'function') {\n    throw new TypeError('callback must be a function');\n  }\n\n  var list = Object(this);\n  var length = list.length >>> 0;\n  var thisArg = arguments[1];\n\n  for (var i = 0; i < length; i++) {\n    var element = list[i];\n\n    if (callback.call(thisArg, element, i, list)) {\n      return element;\n    }\n  }\n};\n\ndocument.addEventListener(\"DOMContentLoaded\", function () {\n  Object(_header_js__WEBPACK_IMPORTED_MODULE_0__[\"header\"])();\n  \n // initTiming()\n});\n\n//# sourceURL=webpack:///./src/js/index.js?");
        
        /***/ })
        
        /******/ });
    
    
    
    