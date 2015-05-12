# gesture.js

make the elements can scaling,rotatiton and translation

在移动设备上，让元素可以缩放、旋转和平移

### Demo
<a href="http://iancj.github.io/gesture.js/" target="_blank">Click Here</a>

<img src="qrcode.png" alt="">

### 使用方法

项目中引入gesture.js

```
<script src="gesture.js"></script>
```

实例化：

```
var $e = $("#e");
var dragable = new Dragable($e);
```

提供的接口:
dragable.getStatus() //获取元素的状态