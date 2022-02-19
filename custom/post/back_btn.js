; (function () {

  // 添加 button 
  // console.log('add')
  window.addEventListener('load', function (event) {
    console.log("DOM fully loaded and parsed");  // 先打印
    if (!$) {
      return;
    }
    var back = $('.button.back')
    back.on('click', function () {
      if (document.referrer) {
        window.history.back(-1);
      }
    })
    var go = $('.button.go')
    go.on('click', function () {
      window.history.forward();
    });

    document.addEventListener('keydown', function (e) {
      if (e.shiftKey) {
        if (e.key == 'ArrowLeft') {
          //left key
          back.trigger('click')

        } else if (e.key == 'ArrowRight') {
          //right key 
          go.trigger('click')
        }
      }

    })
  });
})();
;/* lazyload */

; (function () {

  window.addEventListener('load', function () {
    var $ = window.$;
    $.fn.extend({
      LazyLoad: function () {
        const $this = $(this);
        if ($this.lazyload) {
          $this.lazyload({
            effect: 'fadeIn',
            // placeholder_data_img: "https://cdn.jsdelivr.net/gh/moezx/cdn@3.0.2/img/svg/loader/trans.ajax-spinner-preloader.svg",
          });
        } else {
          console.warn("没有图片懒加载插件");
        }
      }
    });
    console.log('use lazyload plugin => img.lazyload')
    $('img.lazyload[data-original]').LazyLoad()
    

  });
})();





