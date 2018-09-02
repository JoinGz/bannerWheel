class Banner {
  constructor(options) {
    this.default = {
      loop: true,
      LR: true,
      control: true,
      model: 'pc',
      interval: 1000
    }
    this.options = Object.assign(this.default, options)
    this.begin = 1
    this.dot = 0
    this.mytime = null
    this.moving = false
    if (this.options.model === 'phone') {
      this.x = 0
      this.dist = 0
      this.end = 0
      this.move = 0
    }
    this.aniNum = ''
    this.reqAni()
    this.cssName = ''
    this.transName = ''
    if (this.has3d('translate3d(1px,0,0)')) {
      this.d3 = 'd3'
    } else if (this.has3d('translateX(1px)') && this.checkCss('transition')) {
      this.d3 = 'X'
    }else {
      this.d3 = 'IE9'
    }
    this.init()
  }
  init() {
    this.cloneLi()
    // 设置gzBox的宽度
    this.$('#gzBanner .gzBox').style.width = 100 * this.num() + '%'
    document.querySelectorAll('#gzBanner .gzBox li').forEach(v => {
      v.style.width = 100 / this.num() + '%'
    })
    // 初始切换到第二张
    this.animation(this.$('#gzBanner .gzBox'), `${this.liWidth() * -1}px`, true)
    this.moveEnd()
    // 显示左右切换
    if (this.options.LR) {
      let doc = document.createDocumentFragment()
      let div = document.createElement('div')
      let left = div.cloneNode()
      let right = div.cloneNode()
      left.setAttribute('class', 'gzButl gzBut')
      right.setAttribute('class', 'gzButr gzBut')
      doc.appendChild(left)
      doc.appendChild(right)
      document.querySelector('#gzBanner').appendChild(doc)
    }
    // 显示下方的白点触控
    if (this.options.control) {
      let doc = document.createDocumentFragment()
      let ul = document.createElement('ul')
      ul.setAttribute('class', 'point')
      let li = document.createElement('li')
      let num = this.num() - 2
      for (let i = 0, l = num; i < l; i++) {
        let myli = li.cloneNode()
        ul.appendChild(myli)
      }
      doc.appendChild(ul)
      document.querySelector('#gzBanner').appendChild(doc)
      this.dotShow(0)
      this.clickDot()
    }
    if (this.options.model === 'pc' && this.options.LR) {
      this.eventListen(this.$('#gzBanner .gzButl'), 'click', this.gzButl())
      this.eventListen(this.$('#gzBanner .gzButr'), 'click', this.gzButr())
    }
    if (this.options.model === 'phone') {
      this.$('#gzBanner').addEventListener('touchstart', e => {
        clearInterval(this.mytime)
        let touch = event.touches[0]
        this.x = touch.clientX
      })
      this.$('#gzBanner').addEventListener('touchmove', e => {
        let touch = event.touches[0]
        this.move = touch.clientX - this.x
        this.animation(
          this.$('#gzBanner .gzBox'),
          `${this.move + this.liWidth() * -1 * this.begin}px`,
          true
        )
      })
      this.$('#gzBanner').addEventListener('touchend', e => {
        // this.dist = this.move
        let max = this.liWidth() / 3
        if (Math.abs(this.move) > max) {
          if (this.move > 0) {
            this.gzButl()()
          } else {
            this.gzButr()()
          }
        } else {
          this.animation(
            this.$('#gzBanner .gzBox'),
            `${this.begin * this.liWidth() * -1}px`,
            false
          )
        }
      })
    }
    this.istime()
    this.eventListen(this.$('#gzBanner'), 'mouseenter', () => {
      clearInterval(this.mytime)
    })
    this.eventListen(this.$('#gzBanner'), 'mouseleave', () => {
      clearInterval(this.mytime)
      this.mytime = setInterval(() => {
        this.gzButr()()
      }, this.options.interval)
    })
  }
  liWidth() {
    return parseInt(this.getStyle(this.$('#gzBanner .gzBox li'), 'width'))
  }
  num() {
    return this.$('#gzBanner .gzBox').children.length
  }
  $(ele) {
    return document.querySelector(ele)
  }
  getStyle(obj, name) {
    if (obj.currentStyle) {
      return obj.currentStyle[name]
    } else {
      return getComputedStyle(obj, false)[name]
    }
  }
  eventListen(obj, type, fn) {
    if (obj.addEventListener) {
      obj.addEventListener(type, fn)
    } else if (obj.attachEvent) {
      obj.attachEvent(`on${type}`, fn)
    } else {
      obj[`on${type}`] = fn
    }
  }
  cloneLi() {
    let liFirst = this.$('#gzBanner .gzBox').children[0].cloneNode(true)
    let last = this.$('#gzBanner .gzBox').children[
      this.$('#gzBanner .gzBox').children.length - 1
    ].cloneNode(true)
    this.$('#gzBanner .gzBox').insertBefore(
      last,
      this.$('#gzBanner .gzBox').firstChild
    )
    this.$('#gzBanner .gzBox').appendChild(liFirst)
  }
  animation(ele, m, bool) {
    this.moving = true
    if (this.d3 === 'd3') {
      if (bool === true) {
        ele.style.transition = ''
        ele.style[this.cssName] = `translate3d(${m},0,0)`
        this.moving = false
      } else if (bool === false) {
        ele.style[this.cssName] = `translate3d(${m},0,0)`
        ele.style.transition = 'all 0.5s'
      }
    } else if (this.d3 === 'X') {
      if (bool === true) {
        ele.style[this.transName] = ''
        ele.style[this.cssName] = `translateX(${m})`
        this.moving = false
      } else if (bool === false) {
        ele.style[this.cssName] = `translateX(${m})`
        ele.style[this.transName] = 'all 0.5s'
      }
    }else {
      // let u = parseInt(this.getStyle(ele,'left'))
    let change = () => {
      console.log('1');
      
      if(bool === false){
        // console.log('准备开始变化');
      let num 
      this.aniNum = window.requestAnimationFrame(change)
      console.log(parseInt(this.getStyle(ele,'left')) +' '+ Math.abs(parseInt(m)));
      // console.log((u - parseInt(m))/15);
      
      // let x = parseInt((parseInt(m)/30))
      // let a = parseInt((u - parseInt(m))/15)
      if(parseInt(this.getStyle(ele,'left')) - parseInt(m) > 0){
        num = -100
      }else{
        num =  100
      }
      // console.log('num------------------------');
      // console.log(num);
      let now = parseInt(this.getStyle(ele,'left'))
      now += num
      ele.style.left = `${now}px`
      // console.log('现在是小于');
      if(Math.abs(parseInt(this.getStyle(ele,'left')) - parseInt(m))<=Math.abs(num)){
      ele.style.left = `${parseInt(m)}px`
        this.moving = false
        // console.log('大于');
        window.cancelAnimationFrame(this.aniNum)
      if (this.begin > this.num() - 2) {
        this.animation(ele, `${this.liWidth() * -1}px`, true)
        this.begin = 1
      } else if (this.begin < 1) {
        this.begin = this.num() - 2
        this.animation(ele, `${(this.num() - 2) * this.liWidth() * -1}px`, true)
      }
      }
      }else if (bool === true){
        // console.log('---');
        
        ele.style.left = m
        this.moving = false
      }
      
    }
    change()
    }
    
    // if (bool === true) {
    //   ele.style.transition = ''
    //   ele.style.transform = `translateX(${m})`
    // } else if (bool === false) {
    //   ele.style.transform = `translateX(${m})`
    //   ele.style.transition = 'all 0.5s'
    // }
  }
  dotShow(num) {
    document.querySelectorAll('#gzBanner .point li').forEach((v, i) => {
      v.className = ''
      let a = i
      v.myIndex = ++a
      if (i == num) {
        v.className = 'active'
      }
    })
  }
  clickDot() {
    this.eventListen(this.$('#gzBanner .point'), 'click', e => {
      let ele = e || window.event
      let target = ele.target || ele.srcElement
      if (target.nodeName.toLocaleLowerCase() === 'li') {
        this.animation(
          this.$('#gzBanner .gzBox'),
          `${this.liWidth() * target.myIndex * -1}px`,
          false
        )
        this.begin = target.myIndex
        this.dot = target.myIndex - 1
        this.dotShow(this.dot)
      }
    })
  }
  istime() {
    // console.log(this.mytime)
    clearInterval(this.mytime)
    this.mytime = setInterval(() => {
      this.gzButr()()
    }, this.options.interval)
    if (this.getVisibilityState()) {
      let name = this.getHiddenProp()
      name = name.replace(/hidden/i, 'visibilitychange')
      this.eventListen(document, name, () => {
        if (document[this.getHiddenProp()]) {
          clearInterval(this.mytime)
        } else {
          clearInterval(this.mytime)
          this.mytime = setInterval(() => {
            this.gzButr()()
          }, this.options.interval)
        }
      })
    } else {
      window.onfocus = () => {
        clearInterval(this.mytime)
        this.mytime = setInterval(() => {
          this.gzButr()()
        }, this.options.interval)
      }
      window.onblur = () => {
        clearInterval(this.mytime)
      }
    }
  }
  gzButl() {
    return () => {
      if (!this.moving) {        
        let ele = this.$('#gzBanner .gzBox')
        this.begin--
        this.dot--
        if (this.begin < 0) {
          // this.$('#gzBanner .gzBox').style.transition = ''
          // this.$('#gzBanner .gzBox').style.transform = `translateX(${(this.num() -1) * this.liWidth() *-1}px)`
          // this.$('#gzBanner .gzBox').style.left = `${(this.num() -1) * this.liWidth() *-1}px`
          // this.begin = this.num() - 3
          // this.animation(ele, `${(this.num() - 2) * this.liWidth() * -1}px`, true)
        }
        if (this.dot < 0) {
          this.dot = this.num() - 3
        }
        this.animation(ele, `${this.begin * -this.liWidth()}px`, false)
        this.dotShow(this.dot)
        // this.$('#gzBanner .gzBox').style.transform = 'translateX('+this.begin * -this.liWidth() + 'px)'
        // this.$('#gzBanner .gzBox').style.transition = 'all 0.5s'
        // this.$('#gzBanner .gzBox').style.transform = `translateX(${this.begin * -this.liWidth()*-1}px)`
      }
    }
  }
  gzButr() {
    return () => {
      // console.log('点击了');
      if (!this.moving) {
        let ele = this.$('#gzBanner .gzBox')
        this.begin++
        this.dot++
        if (this.begin > this.num() - 2) {
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
        if (this.dot > this.num() - 3) {
          this.dot = 0
        }
        this.animation(ele, `${this.begin * -this.liWidth()}px`, false)
        this.dotShow(this.dot)
      }
    }
  }
  getHiddenProp() {
    let prefixes = ['webkit', 'moz', 'ms', 'o']
    if ('hidden' in document) return 'hidden'
    for (let i = 0; i < prefixes.length; i++) {
      if (prefixes[i] + 'Hidden' in document) return prefixes[i] + 'Hidden'
    }
    return null
  }
  getVisibilityState() {
    let prefixes = ['webkit', 'moz', 'ms', 'o']
    if ('visibilityState' in document) return 'visibilityState'
    for (let i = 0; i < prefixes.length; i++) {
      if (prefixes[i] + 'VisibilityState' in document)
        return prefixes[i] + 'VisibilityState'
    }
    return null
  }
  moveEnd() {
    let ele = this.$('#gzBanner .gzBox')
    ele.addEventListener('webkitTransitionEnd', () => {
      this.moving = false
      if (this.begin > this.num() - 2) {
        this.animation(ele, `${this.liWidth() * -1}px`, true)
        this.begin = 1
      } else if (this.begin < 1) {
        this.begin = this.num() - 2
        this.animation(ele, `${(this.num() - 2) * this.liWidth() * -1}px`, true)
      }
    })
  }
  checkCss(name) {
    var arr = ['webkit', 'Moz', 'ms', 'o']
    if (name in document.body.style) {
      this.transName = name
      return name
    }
    var myname = name.slice(0, 1).toUpperCase() + name.slice(1)
    console.log(myname)

    for (var i = 0, l = 4; i < l; i++) {
      var cssName = arr[i] + myname
      if (cssName in document.body.style) {
        this.transName = cssName
        return true
      }
    }
    return false
  }
  has3d(name) {
    let cssName
    if (!window.getComputedStyle) {
      return false
    }
    var el = document.createElement('p'),
      has3d,
      transforms = {
        transform: 'transform',
        webkitTransform: '-webkit-transform',
        msTransform: '-ms-transform',
        OTransform: '-o-transform',
        MozTransform: '-moz-transform'
      }
    document.body.insertBefore(el, null)
    for (var t in transforms) {
      if (el.style[t] !== undefined) {
        el.style[t] = name
        has3d = window.getComputedStyle(el).getPropertyValue(transforms[t])
        if (has3d) {
          cssName = transforms[t]
          break
        }
      }
    }
    document.body.removeChild(el)
    if (has3d !== undefined && has3d.length > 0 && has3d !== 'none') {
      this.cssName = cssName
    }
    return has3d !== undefined && has3d.length > 0 && has3d !== 'none'
  }
   reqAni (){
    if(window.requestAnimationFrame && window.cancelAnimationFrame){
      return ;
    }
    let lastTime = 0;
    let vendors = ['webkit', 'moz'];
    for(let x = 0; x < vendors.length && !window.requestAnimationFrame; ++x) {
      window.requestAnimationFrame = window[vendors[x] + 'RequestAnimationFrame'];
      window.cancelAnimationFrame = window[vendors[x] + 'CancelAnimationFrame'] || window[vendors[x] + 'CancelRequestAnimationFrame'];
    }
    if(!window.requestAnimationFrame) {
      window.requestAnimationFrame = function(callback, element) {
        let currTime = new Date().getTime()
        let timeToCall = Math.max(0, 16.7 - (currTime - lastTime));
        let id = window.setTimeout(function() {
          callback(currTime + timeToCall);
        }, timeToCall)
        lastTime = currTime + timeToCall
        return id
      };
    }
    if(!window.cancelAnimationFrame) {
      window.cancelAnimationFrame = function(id) {
        clearTimeout(id)
      }
    }
  }
}
export default Banner
