// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import '../static/css/reset.css'
import App from './App'
import Mobile from './Mobile'

Vue.config.productionTip = false
var width = document.documentElement.clientWidth
/* eslint-disable no-new */
new Vue({
  el: '#app',
  components: { App, Mobile },
  template: width > 500 ? '<App/>' : '<Mobile/>'
  // render: h => h(width > 500 ? App : Mobile)
})
