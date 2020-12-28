class Compiler {
  constructor(vm) {
    this.el = vm.$el
    this.vm = vm
    this.compile(this.el)
  }
  //编译模板处理文本节点和元素节点
  compile(el) {
    let childNodes = el.childNodes
    Array.from(childNodes).forEach(node => {
      if (this.isTextNode(node)) {
        //处理文本节点
        this.compileText(node)
      } else if (this.isElementNode(node)) {
        //处理元素节点
        this.compileElement(node)
      }
      //判断node是否有子节点,如果有递归调用
      if (node.childNodes && node.childNodes.length) {
        this.compile(node)
      }
    })
  }
  //编译元素节点,处理指令
  compileElement(node) {
    //遍历所有属性节点
    Array.from(node.attributes).forEach(attr => {
      //判断是否是指令
      let attrName = attr.name
      if (this.isDirective(attrName)) {
        attrName = attrName.substr(2)
        let key = attr.value
        this.update(node, key, attrName)
      }
    })
  }
  update(node, key, attrName) {
    //处理click事件
    if (attrName.indexOf('click') > -1) {
      this.clickEvent(node, key, attrName)
    } else {
      let updateFn = this[attrName + 'Updater']
      updateFn && updateFn.call(this, node, this.vm[key], key)
    }
  }
  //v-text
  textUpdater(node, value, key) {
    node.textContent = value
    new Watcher(this.vm, key, newValue => {
      node.textContent = newValue
    })
  }
  //v-model
  modelUpdater(node, value, key) {
    node.value = value
    new Watcher(this.vm, key, newValue => {
      node.value = newValue
    })
    //双向绑定
    node.addEventListener('input', () => {
      this.vm[key] = node.value
    })
  }
  //将字符串转换成dom
  parseStringToHTML(text) {
    let i,
      a = document.createElement('div'),
      b = document.createDocumentFragment()
    a.innerHTML = text
    while ((i = a.firstChild)) b.appendChild(i)
    return b
  }
  //v-html
  htmlUpdater(node, value, key) {
    if (node.getAttribute('v-html') === key) {
      const flag = this.parseStringToHTML(value)
      node.appendChild(flag)
    }
  }
  //处理点击事件
  clickEvent(node, value, key) {
    //编译触发事件
    // console.log(node, value, key)
    node.addEventListener(
      'click',
      e => {
        if (value.indexOf('(') && value.indexOf(')')) {
          this.indexStart = value.indexOf('(')
          this.indexLast = value.indexOf(')')
          this.param = value.substring(this.indexStart + 1, this.indexLast)
        }
        //将所有函数存入这个集合
        if (this.vm.$options.methods) {
          const fnSet = this.vm.$options.methods
          const val = value.substring(0, this.indexStart)
          for (let i in fnSet) {
            //传入了参数
            if (this.param) {
              if (i === val) {
                //方便在控制台不显示引号
                fnSet[i](this.param.replace(/\'/g, ''))
              }
            } else {
              //没有传参
              if (i === value || i === val) {
                fnSet[i](e)
              }
            }
          }
        }
      },
      false
    )
  }
  //编译文本节点处理差值表达式
  compileText(node) {
    let reg = /\{\{(.+?)\}\}/
    let value = node.textContent
    if (reg.test(value)) {
      let key = RegExp.$1.trim()
      node.textContent = value.replace(reg, this.vm[key])
      //创建Watcher,数据改变更新视图
      new Watcher(this.vm, key, newValue => {
        node.textContent = newValue
      })
    }
  }
  //判断元素属性是否是指令
  isDirective(attrName) {
    return attrName.startsWith('v-')
  }
  //判断节点是否是文本节点
  isTextNode(node) {
    return node.nodeType === 3
  }
  //判断是否是元素节点
  isElementNode(node) {
    return node.nodeType === 1
  }
}
