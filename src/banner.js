class Banner {
  constructor(options) {
    this.default = {
      loop: true,
      LR: true,
      control: true,
      model: 'pc',
      interval: 3000
    }
    this.options = Object.assign(this.default, options)
    this.begin = 0
    this.dot = 0
    this.mytime = null
    this.init()
  }
  init() {
    this.cloneLi()
    // 设置gzBox的宽度
    this.$('#gzBanner .gzBox').style.width = 100 * this.num() + '%'
    document.querySelectorAll('#gzBanner .gzBox li').forEach(v => {
      v.style.width = 100 / this.num() + '%'
    })
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
      let num = this.num() - 1
      for (let i = 0, l = num; i < l; i++) {
        let myli = li.cloneNode()
        ul.appendChild(myli)
      }
      doc.appendChild(ul)
      document.querySelector('#gzBanner').appendChild(doc)
      this.dotShow(0)
    }
    if (this.options.model === 'pc') {
      this.eventListen(this.$('#gzBanner .gzButl'), 'click', this.gzButl())
      this.eventListen(this.$('#gzBanner .gzButr'), 'click', this.gzButr())
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
    this.$('#gzBanner .gzBox').appendChild(liFirst)
  }
  animation(ele, m, bool) {
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
      if (i == num) {
        v.className = 'active'
      }
    })
  }
  istime() {
    // console.log(this.mytime)
    clearInterval(this.mytime)
    this.mytime = setInterval(() => {
      this.gzButr()()
    }, this.options.interval)
    window.onfocus = ()=> {
      // console.log('onfocue')
      // console.log(this.mytime);
      clearInterval(this.mytime)
      this.mytime = setInterval(() => {
        this.gzButr()()
      }, this.options.interval)
    }
    window.onblur = ()=> {
      // console.log('onblur');
      // console.log(this.mytime);
      clearInterval(this.mytime)
    }
  }
  gzButl() {
    return () => {
      let ele = this.$('#gzBanner .gzBox')
      this.begin--
      this.dot--
      if (this.begin < 0) {
        // this.$('#gzBanner .gzBox').style.transition = ''
        // this.$('#gzBanner .gzBox').style.transform = `translateX(${(this.num() -1) * this.liWidth() *-1}px)`
        // this.$('#gzBanner .gzBox').style.left = `${(this.num() -1) * this.liWidth() *-1}px`
        this.begin = this.num() - 2
        this.animation(ele, `${(this.num() - 1) * this.liWidth() * -1}px`, true)
      }
      if (this.dot < 0) {
        this.dot = this.num() - 2
      }
      this.animation(ele, `${this.begin * -this.liWidth()}px`, false)
      this.dotShow(this.dot)
      // this.$('#gzBanner .gzBox').style.transform = 'translateX('+this.begin * -this.liWidth() + 'px)'
      // this.$('#gzBanner .gzBox').style.transition = 'all 0.5s'
      // this.$('#gzBanner .gzBox').style.transform = `translateX(${this.begin * -this.liWidth()*-1}px)`
    }
  }
  gzButr() {
    return () => {
      let ele = this.$('#gzBanner .gzBox')
      this.begin++
      this.dot++
      if (this.begin > this.num() - 1) {
        // let fn = () => {
        //   this.animation(ele, `0px`, true)
        // }
        // if (this.begin > this.num() - 2) {
        //   ele.addEventListener('transitionend', fn)
        // }
        this.animation(ele, `0px`, true)
        this.begin = 1

        // ele.removeEventListener('transitionend', fn)
      }
      if (this.dot > this.num() - 2) {
        this.dot = 0
      }
      this.animation(ele, `${this.begin * -this.liWidth()}px`, false)
      this.dotShow(this.dot)
    }
  }
}
export default Banner
