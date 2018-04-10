<template>
  <div class="styleEditor moveEditor" ref="container">
    <div class="code" v-html="codeInStyleTag"></div>
    <pre v-html="highlightedCode"></pre>
  </div>
</template>

<script>
import Prism from 'prismjs'
export default {
  name: 'style-editor',
  props: ['code'],
  data () {
    return {
    }
  },
  computed: {
    highlightedCode: function () {
      return Prism.highlight(this.code, Prism.languages.css)
    },
    codeInStyleTag: function () {
      return `<style>${this.code}</style>`
    }
  },
  methods: {
    goBottom() {
      this.$refs.container.scrollTop = 100000
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
  .code {
    display: none;
  }
</style>
