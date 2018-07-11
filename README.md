# lazyimg_js


Lazy Image Plugin

Instructions：
    1. Put the image url in img tag, e.g: <img src="../resource/10.jpg" alt="">
    2. Depending on the mode, add "lazyImg" as class name to target tag.
    3. Active plugin
        LazyImg.load({
           loading_mode: 'range'
           loading_type:'bottom',
           loading_img: 'xxxx.jpg',
           loading_transition:false,
           loading_time: 500
        });

Options：
    loading_mode：select loading mode
                    'range'：Apply effect to all img tag under block with class: 'lazyImg'
                    'global'：Apply effect to all img tag.
                    'img'：Apply effect to all img tag with class: 'lazyImg'
    loading_type：Loading position.
                    'top'：Loading when the image just about in screen.
                    'middle'：Loading when half of the image in screen.
                    'bottom'：Loading when the whole image in screen.
    loading_img：Loading image URL
    loading_transition：Turn on transition or not.
    loading_time：Transition loading time (ms based).
    
    
    Feel free to let me know if there is any functions or parts need to be fixed :)
