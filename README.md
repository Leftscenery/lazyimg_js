
### A Lazy Image Plugin
---
#### Instruction：
+ Put the image url in img tag, e.g: <img src="xxxx" alt="">
+ Depending on the mode, add "lazyImg" as class name to target tag
+ Active plugin
```javascript
LazyImg.load({
    loading_mode: 'global',
    loading_type: 'bottom',
    loading_img: 'xxxx',
    loading_transition: true,
    loading_time: 300
});
```
---
#### Options：
+ loading_mode：select loading mode
	+ 'range'：Apply effect to all img tag under the block with class: 'lazyImg'
	+ 'global'：Apply effect to all img tag.
    + 'img'：Apply effect to all img tag with class: 'lazyImg'
+ loading_type：Loading position.
	+ 'top'：Loading when the image just about in screen.
	+ 'middle'：Loading when half of the image in the screen.
	+ 'bottom'：Loading when the whole image in the screen.
+ loading_img：Loading image URL
+ loading_transition：Turn on transition or not.
+ loading_time：Transition loading time (ms based).
---
Feel free to let me know if there are any functions or parts need to be fixed :)
<br>By Jiawei Zhou 2018
