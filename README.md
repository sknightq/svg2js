# svg2js
A tool for transforming svg to js which can be import in vue component

## Command
```
npm run svg2js
```
## How to use
```
<template>
  <div id="example-app" class="example-wrapper">
    <icon name="doc"></icon>
    <icon name="jpg"></icon>
  </div>
</template>
<script>
import './icons/doc.js'
import './icons/jpg.js'
import Icon from './Icon.vue'
export default {
  components: {
    icon: Icon
  }
}
</script>
```
## Tips
The styles without inline cann't be transformed into javascript file. You can use 'classIntoAttr.html' to move the styles into tag's attributes.

## TODO
1. Merge transforming class into svg attributes
