let _Vue = null
export default class VueRouter {
  static install(Vue) {
    if (VueRouter.install.installed) {
      return
    }
    VueRouter.install.installed = true
    _Vue = Vue
    _Vue.mixin({
      beforeCreate() {
        if (this.$options.router) {
          _Vue.prototype.$router = this.$options.router
          this.$options.router.init()
        }
      }
    })
  }
  constructor(options) {
    this.options = options
    this.routeMap = {}
    this.data = _Vue.observable({
      current: '/'
    })
  }
  createRouteMap() {
    this.options.routes.forEach(route => {
      this.routeMap[route.path] = route.component
    })
  }
  initComponents(Vue) {
    const self = this
    Vue.component('route-link', {
      props: {
        to: String
      },
      render(h) {
        return h(
          'a',
          {
            attrs: {
              href: this.to
            },
            on: {
              click: this.clickHandler
            }
          },
          [this.$slots.default]
        )
      },
      methods: {
        clickHandler(e) {
          e.preventDefault()
          if (self.options.mode === 'history') {
            window.history.pushState(null, null, this.to)
            this.$router.data.current = this.to
          } else {
            window.loacation.hash = this.to
          }
        }
      }
    })
    Vue.component('router-view', {
      render(h) {
        const component = self.routeMap[self.data.current]
        return h(component)
      }
    })
  }
  initEvent() {
    if (this.options.mode === 'history') {
      window.addEventListener('popstate', () => {
        this.data.current = window.location.pathname
      })
    } else {
      window.addEventListener('hashchange', () => {
        this.data.current = window.location.hash.substr(1)
      })
    }
  }
  init() {
    this.createRouteMap()
    this.initComponents()
    this.initEvent()
  }
}
