class Banner {
  constructor(options) {
    this.default = {
      loop: true,
      LR: true,
      control: true
    }
    this.options = Object.assign(this.default, options)
    this.init()
  }
  init() {
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
  }
  num() {
    return this.$('#gzBanner .gzBox').children.length
  }
  $(ele) {
    return document.querySelector(ele)
  }
}
export default Banner
