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
      if (bool === true) {
        ele.style.transition = ''
        ele.style.transform = `translateX(${m})`
      } else if (bool === false) {
        ele.style.transform = `translateX(${m})`
        ele.style.transition = 'all 0.5s'
      }
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
    
    
    // if(this.moving){
    //   return ()=>{}
    // }
    return () => {
      console.log(this.moving);
      
      if(!this.moving){
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
      console.log('---');
      console.log(this.moving);
      
      
      if (this.begin > this.num() - 2) {
        this.animation(ele, `${this.liWidth() * -1}px`, true)
        this.begin = 1
        this.moving = false
      } else if (this.begin < 1) {
        this.begin = this.num() - 2
        this.animation(ele, `${(this.num() - 2) * this.liWidth() * -1}px`, true)
        this.moving = false
      }
    })
  }
}
export default Banner
