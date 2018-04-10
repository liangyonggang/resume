<template>
  <div id="app">
    <styleEditor ref="styleEditor" :code="currentStyle"></styleEditor>
  </div>
</template>

<script>
import styleEditor from './components/styleEditor'
import resume from './components/resume'
export default {
  name: 'App',
  components: {styleEditor, resume},
  data () {
    return {
      interval: 10,
      currentStyle: '',
      fullStyle: [
        `/*
* Inspired by http://strml.net/
* 大家好，我是Claus
* 看那动态的简历很炫啊，我也做一个吧。
*/

/* 首先给所有元素加上过渡效果 */
* {
  transition: all .3s;
}
/* 白色背景太单调了，我们来点背景 */
html {
  color: rgb(222,222,222);
  background: rgb(0,43,54);
}
/* 文字离边框太近了 */
.styleEditor {
  padding: .5em;
  border: 1px solid;
  margin: .5em;
  overflow: auto;
  width: 45vw;
  height: 90vh;
}
/* 代码高亮 */
.token.selector{ color: rgb(133,153,0); }
.token.property{ color: rgb(187,137,0); }
.token.punctuation{ color: yellow; }
.token.function{ color: rgb(42,161,152); }

/* 加点 3D 效果呗 */
html{
  perspective: 1000px;
}
.styleEditor {
  position: fixed; left: 0; top: 0;
  -webkit-transition: none;
  transition: none;
  transform: rotateY(10deg) translateZ(-100px);
}
/* 挪到右边呗 */
.moveEditor {
  position: absolute;
  transform: translateX(115%) rotateY(-10deg) translateZ(-100px);
}
/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed; right: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */`
      ]
    }
  },
  created () {
    this.makeResume()
  },
  methods: {
    makeResume: async function () {
      await this.progressivelyShowStyle(0)
    },
    progressivelyShowStyle (n) {
      return new Promise((resolve, reject) => {
        let interval = this.interval
        let showStyle = (async function () {
          let style = this.fullStyle[n]
          if (!style) { return false}
          // 计算前 n 个 style 的字符总数
          let length = this.fullStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
          let prefixLength = length - style.length
          if (this.currentStyle.length < length) {
            let l = this.currentStyle.length - prefixLength
            let char = style.substring(l, l + 1) || ' '
            this.currentStyle += char
            if (style.substring(l - 1, l) === '\n' && this.$refs.styleEditor) {
              this.$nextTick(() => {
                this.$refs.styleEditor.goBottom()
              })
            }
            setTimeout(showStyle, interval)
          } else {
            resolve()
          }
        }).bind(this)
        showStyle()
      })
    }

  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}
</style>
