class Banner {
  constructor(options) {
    this.default = {
      loop: true,
      LR: true,
      control: true,
      model:'pc'
    }
    this.options = Object.assign(this.default, options)
    this.init()
    this.begin = 0
  }
  init() {
    this.$('#gzBanner .gzBox').innerHTML = this.cloneLi().innerHTML
    // 设置gzBox的宽度
    this.$('#gzBanner .gzBox').style.width = 100 * (this.num()+2) + '%'
    document.querySelectorAll('#gzBanner .gzBox li').forEach(v => {
      v.style.width = 100 / (this.num()+2) + '%'
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
      let num = this.num()
      for (let i = 0, l = num; i < l; i++) {
        let myli = li.cloneNode()
        ul.appendChild(myli)
      }
      doc.appendChild(ul)
      document.querySelector('#gzBanner').appendChild(doc)
    }
    if(this.options.model === 'pc'){
      this.eventListen(this.$('#gzBanner .gzButl'),'click',()=>{
        this.begin--
        if (this.begin<0) {
          this.begin = this.num()
        }
        this.$('#gzBanner .gzBox').style.transition = 'all 0.5s'
        // this.$('#gzBanner .gzBox').style.transform = 'translateX('+this.begin * -this.liWidth() + 'px)'
        this.$('#gzBanner .gzBox').style.transform = `translateX(${this.begin * -this.liWidth()}px)`

      })
    }
  }
  liWidth(){
    return parseInt(this.getStyle(this.$('#gzBanner .gzBox li'), 'width'))
  }
  num() {
    return this.$('#gzBanner .gzBox').children.length - 2
  }
  $(ele) {
    return document.querySelector(ele)
  }
  getStyle(obj, name) {
    if (obj.currentStyle) { 
      return obj.currentStyle[name];
    } else {
      return getComputedStyle(obj, false)[name]; 
    }
  }
  eventListen(obj,type,fn){
    if(obj.addEventListener){
      obj.addEventListener(type,fn)
    }else if(obj.attachEvent){
      obj.attachEvent(`on${type}`, fn)
    }else{
      obj[`on${type}`] = fn
    }
  }
  cloneLi(){
    let doc = document.createElement('ul')
    let liFirst = (this.$('#gzBanner .gzBox').children[0]).cloneNode(true)
    let last = (this.$('#gzBanner .gzBox').children[this.$('#gzBanner .gzBox').children.length-1]).cloneNode(true)
    doc.innerHTML = this.$('#gzBanner .gzBox').innerHTML
    doc.insertBefore(last, doc.firstChild);
    doc.appendChild(liFirst)
    this.$('#gzBanner .gzBox').innerHTML = ''
    return doc
  }
}
export default Banner