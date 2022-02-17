;(function(){

  // 添加 button 
  // console.log('add')
  document.addEventListener('DOMContentLoaded', function(event) {
    console.log("DOM fully loaded and parsed");  // 先打印
    if(!$) {
      return;
    }
    var back = $('.button.back')
    back.on('click',function() {
      if(document.referrer) {
        window.history.back(-1);
      }
    })
    var go = $('.button.go')
    go.on('click' ,function(){
      window.history.forward();
    });

    document.addEventListener('keydown',function(e) {
      if(e.shiftKey) {
        if(e.key =='ArrowLeft') {
          //left key
          back.trigger('click')

        }else if (e.key=='ArrowRight' ) {
          //right key 
          go.trigger('click')
        }
      }

    })
  });
})();