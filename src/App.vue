<template>
  <div id="app">
    <styleEditor ref="styleEditor" :code="currentStyle"></styleEditor>
    <resume ref="resumeEditor" :markdown="currentMarkdown" :enableHtml="enableHtml"></resume>
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
      interval: 40,
      currentStyle: '',
      currentMarkdown: '',
      enableHtml: false,
      fullStyle: [
        `/*
* Inspired by http://strml.net/
* 大家好，我是Claus
* 发现一个动态的简历很炫啊，我也做一个吧。
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
  transform: translateX(115%);
  transform: translateX(115%) rotateY(-10deg);
  transform: translateX(115%) rotateY(-10deg) translateZ(-100px);
}
/* 接下来我给自己准备一个编辑器 */
.resumeEditor{
  position: fixed; left: 0; top: 0;
  padding: .5em;  margin: .5em;
  width: 48vw; height: 90vh;
  border: 1px solid;
  background: white; color: #222;
  overflow: auto;
}
/* 好了，我开始写简历了 */

`,
        `
/* 这个简历好像差点什么
 * 对了，这是 Markdown 格式的，我需要变成对 HR 更友好的格式
 * 简单，用开源工具翻译成 HTML 就行了
 */
`,
        `
/* 再对 HTML 加点样式 */
.resumeEditor{
  padding: 2em;
}
.resumeEditor h2{
  display: inline-block;
  border-bottom: 1px solid;
  margin: 1em 0 .5em;
}
.resumeEditor ul,.resumeEditor ol{
  list-style: none;
}
.resumeEditor ul> li::before{
  content: '•';
  margin-right: .5em;
}
.resumeEditor ol {
  counter-reset: section;
}
.resumeEditor ol li::before {
  counter-increment: section;
  content: counters(section, ".") " ";
  margin-right: .5em;
}
.resumeEditor blockquote {
  margin: 1em 1em 1em 0;
  padding: .5em;
  background: #ddd;
}
`
      ],
      fullMarkdown: `梁永刚
----

资深前端工程师，嗯，嗯，对，资深。

技能
----

* 前端开发
* 吹牛
* ...

工作经历
----

1. xxx
2. xxx
3. xxx

保密...

可以私聊

爱好
----

* 阅读
* 看电影
* 健身
* ...

链接
----

* [GitHub](https://github.com/liangyonggang)
* [我的个人网站](http://liangyonggang.cn)

> 如果你对我感兴趣，联系我给我发邮件呗。yonggangliang@sina.cn

`
    }
  },
  created () {
    this.makeResume()
  },
  methods: {
    makeResume: async function () {
      await this.progressivelyShowStyle(0)
      await this.progressivelyShowResume()
      await this.progressivelyShowStyle(1)
      await this.showHtml()
      await this.progressivelyShowStyle(2)
    },
    showHtml: function () {
      return new Promise((resolve, reject) => {
        this.enableHtml = true
        resolve()
      })
    },
    progressivelyShowStyle (n) {
      return new Promise((resolve, reject) => {
        let interval = this.interval
        // 计算前 n 个 style 的字符总数
        let length = this.fullStyle.filter((_, index) => index <= n).map((item) => item.length).reduce((p, c) => p + c, 0)
        let showStyle = () => {
          let style = this.fullStyle[n]
          let prefixLength = length - style.length // 前面已经渲染完的样式编辑框的样式的长度
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
        }
        showStyle()
      })
    },
    progressivelyShowResume() {
      return new Promise((resolve, reject) => {
        let length = this.fullMarkdown.length
        let interval = this.interval
        let showResume = () => {
          if (this.currentMarkdown.length < length) {
            this.currentMarkdown = this.fullMarkdown.substring(0, this.currentMarkdown.length + 1)
            let prevChar = this.currentMarkdown[this.currentMarkdown.length - 2]
            if (prevChar === '\n' && this.$refs.resumeEditor) {
              this.$nextTick(() => this.$refs.resumeEditor.goBottom())
            }
            setTimeout(showResume, interval)
          } else {
            resolve()
          }
        }
        showResume()
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
