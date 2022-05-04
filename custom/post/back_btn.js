; (function () {

  // 添加 button 
  // console.log('add')
  window.addEventListener('load', function (event) {
    var $ = window.jQuery;
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
    var top = $('.button.topUrl');
    top.on('click',function() {
      var a = window.location.href;
      a = decodeURI(a)
      if(a==window.location.origin||a==window.location.origin+'/') {
        return;//is top
      }
      let ed = a.lastIndexOf('/')
      if (ed == a.length || ed == a.length-1) {
        a = a.substring(0,a.length-1)
      }
      let ne = a.substring(0,a.lastIndexOf('/'));
      window.location.href = ne;

    });
    document.addEventListener('keydown', function (e) {
      if (e.shiftKey) {
        if (e.key == 'ArrowLeft') {
          //left key
          back.trigger('click')

        } else if (e.key == 'ArrowRight') {
          //right key 
          go.trigger('click')
      
        }else if(e.key == 'ArrowUp') {
          top.trigger('click')
        } 
      }

    })
  });
})();
;/* lazyload */

; (function () {

  window.addEventListener('load', function () {
    var $ = window.$;
    // lazyload
    var cover_img = null;
    if(window.location.href.indexOf('/friends/')>-1) {
      //友人帐
      cover_img = "/default_avatar.jpg"
    }
    
    $.fn.extend({
      LazyLoad: function () {
        const $this = $(this);

        if ($this.lazyload) {
          $this.lazyload({
            effect: 'fadeIn',
            url_rewriter_fn: function ($el,srcattr) {
              // $el?.addClass('x-img-loading')
              return srcattr
            },
            load: function () {
              // $(this).removeClass('x-img-loading').addClass('x-loadend');
            },
            placeholder_data_img: cover_img,
          });
        } else {
          console.warn("没有图片懒加载插件");
        }
        // $(this).on('load',function() {
        //   console.log('load end => ',this);
        // })
      }
    });
    $('img.lazyload[data-original]').LazyLoad()
    console.log('use lazyload plugin => img.lazyload')

  });
})();

// clipboard 插件
$(function () {

  /* add copy btn to code */
  function createCopyButton(highlightDiv) {
    const button = document.createElement("button");
    button.className = "copy-code-button";
    button.type = "button";
    button.innerText = "Copy";
    button.addEventListener("click", () =>
      copyCodeToClipboard(button, highlightDiv)
    );
    addCopyButtonToDom(button, highlightDiv);
  }
  
  async function copyCodeToClipboard(button, highlightDiv) {
    const codeToCopy = highlightDiv.querySelector(":last-child > .chroma > code")
      .innerText;
    try {
      result = await navigator.permissions.query({ name: "clipboard-write" });
      if (result.state == "granted" || result.state == "prompt") {
        await navigator.clipboard.writeText(codeToCopy);
      } else {
        copyCodeBlockExecCommand(codeToCopy, highlightDiv);
      }
    } catch (_) {
      copyCodeBlockExecCommand(codeToCopy, highlightDiv);
    } finally {
      codeWasCopied(button);
    }
  }
  
  function copyCodeBlockExecCommand(codeToCopy, highlightDiv) {
    const textArea = document.createElement("textArea");
    textArea.contentEditable = "true";
    textArea.readOnly = "false";
    textArea.className = "copyable-text-area";
    textArea.value = codeToCopy;
    highlightDiv.insertBefore(textArea, highlightDiv.firstChild);
    const range = document.createRange();
    range.selectNodeContents(textArea);
    const sel = window.getSelection();
    sel.removeAllRanges();
    sel.addRange(range);
    textArea.setSelectionRange(0, 999999);
    document.execCommand("copy");
    highlightDiv.removeChild(textArea);
  }
  
  function codeWasCopied(button) {
    button.blur();
    button.innerText = "Copied!";
    setTimeout(function () {
      button.innerText = "Copy";
    }, 2000);
  }
  
  function addCopyButtonToDom(button, highlightDiv) {
    highlightDiv.insertBefore(button, highlightDiv.firstChild);
    const wrapper = document.createElement("div");
    wrapper.className = "highlight-wrapper";
    highlightDiv.parentNode.insertBefore(wrapper, highlightDiv);
    wrapper.appendChild(highlightDiv);
  }
  //添加 copy 按钮
  document
    .querySelectorAll(".highlight")
    .forEach((highlightDiv) => createCopyButton(highlightDiv));


});
 

$(function(){
  //双链支持
  let ok = window.location.href.indexOf('/post/')>-1;
  if(!ok) {
    return;
  }

  const pdom = $('body .post-content p');
  pdom.each(function(i,e){
    let $e = $(e);
    var t = $e.html();
    if(t && t.indexOf('[[')>-1) {
       
      $e.html(t.replace(/\[\[(.*)\]\]/g,function(a,b){
        //双链
        let prefix = '' //默认相对路径
        if(b.indexOf('post')>-1) {
          //采用绝对路径
          prefix = '/'
        }

        return '<a class="doubleLink" href="'+prefix+b+'" target="_blank">'+b+'</a> <br/>';
      }))
      //s.replace(/\[\[.*\]\]/,'')
      // $(e).append('<a class="x-link-to-next" href="javascript:void(0)">下一篇</a>');
    }
    t = $e.html();
    //markdown 黄色字体高亮显示
    if(t && t.indexOf('==') > -1) {
      $e.html(t.replace(/==(.*)==/g,function(a,b){
        //实现高亮文字
        return `<span style="background-color:yellow">`+b+`</span>`;
      }))
    }
  })


});