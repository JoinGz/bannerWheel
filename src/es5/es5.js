'use strict';

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Banner = function () {
  function Banner(options) {
    _classCallCheck(this, Banner);

    this.default = {
      loop: true,
      LR: true,
      control: true,
      model: 'pc',
      interval: 1000
      // this.options = Object.assign(this.default, options)
    };this.options = this.myAssign(this.default, options);
    this.begin = 1;
    this.dot = 0;
    this.nowDot = null;
    this.mytime = null;
    this.moving = false;
    if (this.options.model === 'phone') {
      this.x = 0;
      this.dist = 0;
      this.end = 0;
      this.move = 0;
    }
    this.aniNum = '';
    this.reqAni();
    this.cssName = '';
    this.transName = '';
    this.dotDir = null;
    console.log(this.endName);

    if (this.has3d('translate3d(1px,0,0)')) {
      this.d3 = 'd3';
      // this.d3 = ''
    } else if (this.has3d('translateX(1px)') && this.checkCss('transition')) {
      this.d3 = 'X';
    } else {
      this.d3 = 'IE9';
    }
    this.init();
  }

  _createClass(Banner, [{
    key: 'init',
    value: function init() {
      var _this = this;

      this.cloneLi();
      // 设置gzBox的宽度
      this.$('#gzBanner .gzBox').style.width = 100 * this.num() + '%';
      document.querySelectorAll('#gzBanner .gzBox li').forEach(function (v) {
        v.style.width = 100 / _this.num() + '%';
      });
      // 初始切换到第二张
      this.animation(this.$('#gzBanner .gzBox'), this.liWidth() * -1 + 'px', true);
      this.moveEnd();
      // 显示左右切换
      if (this.options.LR) {
        var doc = document.createDocumentFragment();
        var div = document.createElement('div');
        var left = div.cloneNode();
        var right = div.cloneNode();
        left.setAttribute('class', 'gzButl gzBut');
        right.setAttribute('class', 'gzButr gzBut');
        doc.appendChild(left);
        doc.appendChild(right);
        document.querySelector('#gzBanner').appendChild(doc);
      }
      // 显示下方的白点触控
      if (this.options.control) {
        var _doc = document.createDocumentFragment();
        var ul = document.createElement('ul');
        ul.setAttribute('class', 'point');
        var li = document.createElement('li');
        var num = this.num() - 2;
        for (var i = 0, l = num; i < l; i++) {
          var myli = li.cloneNode();
          ul.appendChild(myli);
        }
        _doc.appendChild(ul);
        document.querySelector('#gzBanner').appendChild(_doc);
        this.dotShow(0);
        this.clickDot();
      }
      if (this.options.model === 'pc' && this.options.LR) {
        this.eventListen(this.$('#gzBanner .gzButl'), 'click', this.gzButl());
        this.eventListen(this.$('#gzBanner .gzButr'), 'click', this.gzButr());
      }
      if (this.options.model === 'phone') {
        this.$('#gzBanner').addEventListener('touchstart', function (e) {
          clearInterval(_this.mytime);
          var touch = event.touches[0];
          _this.x = touch.clientX;
        });
        this.$('#gzBanner').addEventListener('touchmove', function (e) {
          var touch = event.touches[0];
          _this.move = touch.clientX - _this.x;
          _this.animation(_this.$('#gzBanner .gzBox'), _this.move + _this.liWidth() * -1 * _this.begin + 'px', true);
        });
        this.$('#gzBanner').addEventListener('touchend', function (e) {
          // this.dist = this.move
          var max = _this.liWidth() / 3;
          if (Math.abs(_this.move) > max) {
            if (_this.move > 0) {
              _this.gzButl()();
            } else {
              _this.gzButr()();
            }
          } else {
            _this.animation(_this.$('#gzBanner .gzBox'), _this.begin * _this.liWidth() * -1 + 'px', false);
          }
        });
      }
      this.istime();
      this.eventListen(this.$('#gzBanner'), 'mouseenter', function () {
        clearInterval(_this.mytime);
      });
      this.eventListen(this.$('#gzBanner'), 'mouseleave', function () {
        clearInterval(_this.mytime);
        _this.mytime = setInterval(function () {
          _this.gzButr()();
        }, _this.options.interval);
      });
    }
  }, {
    key: 'liWidth',
    value: function liWidth() {
      // IE返回的是20% ...
      // return parseInt(this.getStyle(this.$('#gzBanner .gzBox li'), 'width'))
      return parseInt(this.$('#gzBanner .gzBox li').offsetWidth);
    }
  }, {
    key: 'num',
    value: function num() {
      return this.$('#gzBanner .gzBox').children.length;
    }
  }, {
    key: '$',
    value: function $(ele) {
      return document.querySelector(ele);
    }
  }, {
    key: 'getStyle',
    value: function getStyle(obj, name) {
      if (obj.currentStyle) {
        return obj.currentStyle[name];
      } else {
        return getComputedStyle(obj, false)[name];
      }
    }
  }, {
    key: 'eventListen',
    value: function eventListen(obj, type, fn) {
      if (obj.addEventListener) {
        obj.addEventListener(type, fn);
      } else if (obj.attachEvent) {
        obj.attachEvent('on' + type, fn);
      } else {
        obj['on' + type] = fn;
      }
    }
  }, {
    key: 'cloneLi',
    value: function cloneLi() {
      var liFirst = this.$('#gzBanner .gzBox').children[0].cloneNode(true);
      var last = this.$('#gzBanner .gzBox').children[this.$('#gzBanner .gzBox').children.length - 1].cloneNode(true);
      this.$('#gzBanner .gzBox').insertBefore(last, this.$('#gzBanner .gzBox').firstChild);
      this.$('#gzBanner .gzBox').appendChild(liFirst);
    }
  }, {
    key: 'animation',
    value: function animation(ele, m, bool) {
      var _this2 = this;

      this.moving = true;
      if (this.d3 === 'd3') {
        if (bool === true) {
          ele.style.transition = '';
          // ele.style[this.cssName] = `translate3d(${m},0,0)` //会闪一下
          ele.style[this.cssName] = 'translateX(' + m + ')';
          this.moving = false;
        } else if (bool === false) {
          ele.style[this.cssName] = 'translate3d(' + m + ',0,0)';
          ele.style.transition = 'all 0.5s';
        }
      } else if (this.d3 === 'X') {
        if (bool === true) {
          ele.style[this.transName] = '';
          ele.style[this.cssName] = 'translateX(' + m + ')';
          this.moving = false;
        } else if (bool === false) {
          ele.style[this.cssName] = 'translateX(' + m + ')';
          ele.style[this.transName] = 'all 0.5s';
        }
      } else {
        // let u = parseInt(this.getStyle(ele,'left'))
        var change = function change() {
          // console.log('1')
          if (bool === false) {
            // console.log('准备开始变化');
            var num = void 0;
            _this2.aniNum = window.requestAnimationFrame(change);
            // console.log(
            //   parseInt(this.getStyle(ele, 'left')) + ' ' + Math.abs(parseInt(m))
            // )
            // console.log((u - parseInt(m))/15);
            // let x = parseInt((parseInt(m)/30))
            // let a = parseInt((u - parseInt(m))/15)
            if (parseInt(_this2.getStyle(ele, 'left')) - parseInt(m) > 0) {
              num = -40;
            } else {
              num = 40;
            }
            // console.log('num------------------------');
            // console.log(num);
            var now = parseInt(_this2.getStyle(ele, 'left'));
            now += num;
            ele.style.left = now + 'px';
            // console.log('现在是小于');
            if (Math.abs(parseInt(_this2.getStyle(ele, 'left')) - parseInt(m)) <= Math.abs(num)) {
              ele.style.left = parseInt(m) + 'px';
              _this2.moving = false;
              // console.log('大于');
              window.cancelAnimationFrame(_this2.aniNum);
              if (_this2.dotDir === 'left') {
                _this2.$('#gzBanner .gzBox').removeChild(document.querySelectorAll('#gzBanner .gzBox li')[_this2.begin]);
                _this2.animation(_this2.$('#gzBanner .gzBox'), _this2.liWidth() * -1 * _this2.nowDot + 'px', true);
                _this2.begin = _this2.nowDot;
                _this2.dot = _this2.nowDot - 1;
                _this2.dotShow(_this2.dot);
                _this2.dotDir = null;
              } else if (_this2.dotDir === 'right') {
                _this2.$('#gzBanner .gzBox').removeChild(document.querySelectorAll('#gzBanner .gzBox li')[_this2.begin + 1]);
                _this2.animation(_this2.$('#gzBanner .gzBox'), _this2.liWidth() * -1 * _this2.nowDot + 'px', true);
                _this2.begin = _this2.nowDot;
                _this2.dot = _this2.nowDot - 1;
                _this2.dotShow(_this2.dot);
                _this2.dotDir = null;
              }

              if (_this2.begin > _this2.num() - 2) {
                _this2.animation(ele, _this2.liWidth() * -1 + 'px', true);
                _this2.begin = 1;
              } else if (_this2.begin < 1) {
                _this2.begin = _this2.num() - 2;
                _this2.animation(ele, (_this2.num() - 2) * _this2.liWidth() * -1 + 'px', true);
              }
            }
          } else if (bool === true) {
            // console.log('---');
            ele.style.left = m;
            _this2.moving = false;
          }
        };
        change();
      }

      // if (bool === true) {
      //   ele.style.transition = ''
      //   ele.style.transform = `translateX(${m})`
      // } else if (bool === false) {
      //   ele.style.transform = `translateX(${m})`
      //   ele.style.transition = 'all 0.5s'
      // }
    }
  }, {
    key: 'dotShow',
    value: function dotShow(num) {
      document.querySelectorAll('#gzBanner .point li').forEach(function (v, i) {
        v.className = '';
        var a = i;
        v.myIndex = ++a;
        if (i == num) {
          v.className = 'active';
        }
      });
    }
  }, {
    key: 'clickDot',
    value: function clickDot() {
      var _this3 = this;

      this.eventListen(this.$('#gzBanner .point'), 'click', function (e) {
        var ele = e || window.event;
        var target = ele.target || ele.srcElement;
        console.log('\u4E0A\u4E00\u5F20\u56FE\u7247\uFF1A' + _this3.begin);
        console.log('\u5F53\u524D\u7684\u5706\u70B9index:' + target.myIndex);
        // 点击同一圆点就不用进来了
        if (_this3.begin === target.myIndex) {
          return;
        }
        if (target.nodeName.toLocaleLowerCase() === 'li') {
          if (_this3.begin > target.myIndex) {
            _this3.dotDir = 'left';
            console.log('jinlail');
            var li = document.querySelectorAll('#gzBanner .gzBox li');
            var _ele = li[target.myIndex].cloneNode(true);
            _ele.className += '1';
            _this3.$('#gzBanner .gzBox').insertBefore(_ele, li[_this3.begin]);
            // console.log(this.begin)
            // console.log(this.liWidth())
            console.log('\u8FDB\u6765\u65F6\u5019\u7684\u4E4B\u524D\u7684\u56FE\u7247' + _this3.begin);
            console.log('\u8FDB\u6765\u65F6\u5019\u7684\u5706\u70B9' + target.myIndex);
            _this3.nowDot = target.myIndex;

            // setTimeout(() => {
            // console.log(this.liWidth() * -1 * this.begin);
            // console.log('--------------')
            // console.log(this.liWidth())
            _this3.animation(_this3.$('#gzBanner .gzBox'), _this3.liWidth() * -1 * (_this3.begin + 1) + 'px', true);
            _this3.animation(_this3.$('#gzBanner .gzBox'), _this3.liWidth() * -1 * _this3.begin + 'px', false);
            // }, 0);

            // setTimeout(() => {
            //   this.$('#gzBanner .gzBox').removeChild(
            //     document.querySelectorAll('#gzBanner .gzBox li')[this.begin]
            //   )
            //   this.animation(
            //     this.$('#gzBanner .gzBox'),
            //     `${this.liWidth() * -1 * target.myIndex}px`,
            //     true
            //   )
            //   this.begin = target.myIndex
            //   this.dot = target.myIndex - 1
            //   this.dotShow(this.dot)
            // }, 500)
          } else if (_this3.begin < target.myIndex) {
            console.log('jinlail');
            _this3.dotDir = 'right';
            var _li = document.querySelectorAll('#gzBanner .gzBox li');
            var _ele2 = _li[target.myIndex].cloneNode(true);
            _ele2.className += ' 2';
            _this3.$('#gzBanner .gzBox').insertBefore(_ele2, _li[_this3.begin + 1]);
            console.log('\u8FDB\u6765\u65F6\u5019\u7684\u4E4B\u524D\u7684\u56FE\u7247' + _this3.begin);
            console.log('\u8FDB\u6765\u65F6\u5019\u7684\u5706\u70B9' + target.myIndex);
            _this3.nowDot = target.myIndex;
            // console.log(this.liWidth())
            // setTimeout(() => {
            // console.log(this.liWidth() * -1 * this.begin);
            // console.log('--------------')
            // console.log(this.liWidth())
            // this.animation(
            //   this.$('#gzBanner .gzBox'),
            //   `${this.liWidth() * -1 * (this.begin + 1)}px`,
            //   true
            // )
            _this3.animation(_this3.$('#gzBanner .gzBox'), _this3.liWidth() * -1 * (_this3.begin + 1) + 'px', false);
            // }, 0);

            // setTimeout(() => {
            //   this.$('#gzBanner .gzBox').removeChild(
            //     document.querySelectorAll('#gzBanner .gzBox li')[this.begin + 1]
            //   )
            //   this.animation(
            //     this.$('#gzBanner .gzBox'),
            //     `${this.liWidth() * -1 * target.myIndex}px`,
            //     true
            //   )
            //   this.begin = target.myIndex
            //   this.dot = target.myIndex - 1
            //   this.dotShow(this.dot)
            // }, 500)
          } else {
            // -- yuan ban --
            _this3.animation(_this3.$('#gzBanner .gzBox'), _this3.liWidth() * target.myIndex * -1 + 'px', false);
            _this3.begin = target.myIndex;
            _this3.dot = target.myIndex - 1;
            _this3.dotShow(_this3.dot);
          }
        }
      });
    }
  }, {
    key: 'istime',
    value: function istime() {
      var _this4 = this;

      // console.log(this.mytime)
      clearInterval(this.mytime);
      this.mytime = setInterval(function () {
        _this4.gzButr()();
      }, this.options.interval);
      if (this.getVisibilityState()) {
        var name = this.getHiddenProp();
        name = name.replace(/hidden/i, 'visibilitychange');
        this.eventListen(document, name, function () {
          if (document[_this4.getHiddenProp()]) {
            clearInterval(_this4.mytime);
          } else {
            clearInterval(_this4.mytime);
            _this4.mytime = setInterval(function () {
              _this4.gzButr()();
            }, _this4.options.interval);
          }
        });
      } else {
        window.onfocus = function () {
          clearInterval(_this4.mytime);
          _this4.mytime = setInterval(function () {
            _this4.gzButr()();
          }, _this4.options.interval);
        };
        window.onblur = function () {
          clearInterval(_this4.mytime);
        };
      }
    }
  }, {
    key: 'gzButl',
    value: function gzButl() {
      var _this5 = this;

      return function () {
        if (!_this5.moving) {
          var ele = _this5.$('#gzBanner .gzBox');
          _this5.begin--;
          _this5.dot--;
          if (_this5.begin < 0) {
            // this.$('#gzBanner .gzBox').style.transition = ''
            // this.$('#gzBanner .gzBox').style.transform = `translateX(${(this.num() -1) * this.liWidth() *-1}px)`
            // this.$('#gzBanner .gzBox').style.left = `${(this.num() -1) * this.liWidth() *-1}px`
            // this.begin = this.num() - 3
            // this.animation(ele, `${(this.num() - 2) * this.liWidth() * -1}px`, true)
          }
          if (_this5.dot < 0) {
            _this5.dot = _this5.num() - 3;
          }
          _this5.animation(ele, _this5.begin * -_this5.liWidth() + 'px', false);
          _this5.dotShow(_this5.dot);
          // this.$('#gzBanner .gzBox').style.transform = 'translateX('+this.begin * -this.liWidth() + 'px)'
          // this.$('#gzBanner .gzBox').style.transition = 'all 0.5s'
          // this.$('#gzBanner .gzBox').style.transform = `translateX(${this.begin * -this.liWidth()*-1}px)`
        }
      };
    }
  }, {
    key: 'gzButr',
    value: function gzButr() {
      var _this6 = this;

      return function () {
        // console.log('点击了');
        if (!_this6.moving) {
          var ele = _this6.$('#gzBanner .gzBox');
          _this6.begin++;
          _this6.dot++;
          if (_this6.begin > _this6.num() - 2) {
            // let fn = () => {
            //   this.animation(ele, `0px`, true)
            // }
            // if (this.begin > this.num() - 2) {
            //   ele.addEventListener('transitionend', fn)
            // }
            // this.animation(ele, `0px`, true)
            // this.begin = 1
            // ele.removeEventListener('transitionend', fn)
          }
          if (_this6.dot > _this6.num() - 3) {
            _this6.dot = 0;
          }
          _this6.animation(ele, _this6.begin * -_this6.liWidth() + 'px', false);
          _this6.dotShow(_this6.dot);
        }
      };
    }
  }, {
    key: 'getHiddenProp',
    value: function getHiddenProp() {
      var prefixes = ['webkit', 'moz', 'ms', 'o'];
      if ('hidden' in document) return 'hidden';
      for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + 'Hidden' in document) return prefixes[i] + 'Hidden';
      }
      return null;
    }
  }, {
    key: 'getVisibilityState',
    value: function getVisibilityState() {
      var prefixes = ['webkit', 'moz', 'ms', 'o'];
      if ('visibilityState' in document) return 'visibilityState';
      for (var i = 0; i < prefixes.length; i++) {
        if (prefixes[i] + 'VisibilityState' in document) return prefixes[i] + 'VisibilityState';
      }
      return null;
    }
  }, {
    key: 'moveEnd',
    value: function moveEnd() {
      var _this7 = this;

      var ele = this.$('#gzBanner .gzBox');
      ele.addEventListener('transitionend', function () {
        _this7.moving = false;
        if (_this7.begin > _this7.num() - 2) {
          _this7.animation(ele, _this7.liWidth() * -1 + 'px', true);
          _this7.begin = 1;
        } else if (_this7.begin < 1) {
          _this7.begin = _this7.num() - 2;
          _this7.animation(ele, (_this7.num() - 2) * _this7.liWidth() * -1 + 'px', true);
        }
        if (_this7.dotDir === 'left') {
          _this7.$('#gzBanner .gzBox').removeChild(document.querySelectorAll('#gzBanner .gzBox li')[_this7.begin]);
          _this7.animation(_this7.$('#gzBanner .gzBox'), _this7.liWidth() * -1 * _this7.nowDot + 'px', true);
          _this7.begin = _this7.nowDot;
          _this7.dot = _this7.nowDot - 1;
          _this7.dotShow(_this7.dot);
          _this7.dotDir = null;
        } else if (_this7.dotDir === 'right') {
          _this7.$('#gzBanner .gzBox').removeChild(document.querySelectorAll('#gzBanner .gzBox li')[_this7.begin + 1]);
          _this7.animation(_this7.$('#gzBanner .gzBox'), _this7.liWidth() * -1 * _this7.nowDot + 'px', true);
          _this7.begin = _this7.nowDot;
          _this7.dot = _this7.nowDot - 1;
          _this7.dotShow(_this7.dot);
          _this7.dotDir = null;
        }
      });
    }
  }, {
    key: 'checkCss',
    value: function checkCss(name) {
      var arr = ['webkit', 'Moz', 'ms', 'o'];
      if (name in document.body.style) {
        this.transName = name;
        return name;
      }
      var myname = name.slice(0, 1).toUpperCase() + name.slice(1);
      for (var i = 0, l = 4; i < l; i++) {
        var cssName = arr[i] + myname;
        if (cssName in document.body.style) {
          this.transName = cssName;
          return true;
        }
      }
      return false;
    }
  }, {
    key: 'has3d',
    value: function has3d(name) {
      var cssName = void 0;
      if (!window.getComputedStyle) {
        return false;
      }
      var el = document.createElement('p'),
          has3d,
          transforms = {
        transform: 'transform',
        webkitTransform: '-webkit-transform',
        msTransform: '-ms-transform',
        OTransform: '-o-transform',
        MozTransform: '-moz-transform'
      };
      document.body.insertBefore(el, null);
      for (var t in transforms) {
        if (el.style[t] !== undefined) {
          el.style[t] = name;
          has3d = window.getComputedStyle(el).getPropertyValue(transforms[t]);
          if (has3d) {
            cssName = transforms[t];
            break;
          }
        }
      }
      document.body.removeChild(el);
      if (has3d !== undefined && has3d.length > 0 && has3d !== 'none') {
        this.cssName = cssName;
      }
      return has3d !== undefined && has3d.length > 0 && has3d !== 'none';
    }
  }, {
    key: 'reqAni',
    value: function reqAni() {
      if (window.requestAnimationFrame && window.cancelAnimationFrame) {
        return;
      }
      var lastTime = 0;
      var vendors = ['webkit', 'moz'];
      for (var x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
        window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
        window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
      }
      if (!window.requestAnimationFrame) {
        window.requestAnimationFrame = function (callback, element) {
          var currTime = new Date().getTime();
          var timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
          var id = window.setTimeout(function () {
            callback(currTime + timeToCall);
          }, timeToCall);
          lastTime = currTime + timeToCall;
          return id;
        };
      }
      if (!window.cancelAnimationFrame) {
        window.cancelAnimationFrame = function (id) {
          clearTimeout(id);
        };
      }
    }
  }, {
    key: 'myAssign',
    value: function myAssign(obj, obj2) {
      if (Object.assign) {
        return Object(obj, obj2);
      } else {
        for (var i in obj2) {
          obj[i] = obj2[i];
        }
        return obj;
      }
    }
  }]);
	window.banner = Banner
  return Banner;
}();
// export default Banner
