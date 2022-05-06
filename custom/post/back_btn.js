; (function () {
  window.addEventListener('load', function (event) {
    var $ = window.jQuery;
    // console.log("DOM fully loaded and parsed");  // 先打印
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
    top.on('click', function () {
      var a = window.location.href;
      a = decodeURI(a)
      if (a == window.location.origin || a == window.location.origin + '/') {
        return;//is top
      }
      let ed = a.lastIndexOf('/')
      if (ed == a.length || ed == a.length - 1) {
        a = a.substring(0, a.length - 1)
      }
      let ne = a.substring(0, a.lastIndexOf('/'));
      window.location.href = ne;

    });
    document.addEventListener('keydown', function (e) {
      if (e.shiftKey) {
        if (e.key == 'ArrowLeft') {
          //left key
          back.trigger('click');

        } else if (e.key == 'ArrowRight') {
          //right key 
          go.trigger('click');

        } else if (e.key == 'ArrowUp') {
          top.trigger('click');
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
    if (window.location.href.indexOf('/friends/') > -1) {
      //友人帐
      cover_img = "/default_avatar.jpg"
    }

    $.fn.extend({
      LazyLoad: function () {
        const $this = $(this);

        if ($this.lazyload) {
          $this.lazyload({
            effect: 'fadeIn',
            url_rewriter_fn: function ($el, srcattr) {
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
    $('img.lazyload[data-original]').LazyLoad();
    // console.log('use lazyload plugin => img.lazyload');

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
    button.addEventListener("click", () => copyCodeToClipboard(button, highlightDiv));
    addCopyButtonToDom(button, highlightDiv);
  }

  async function copyCodeToClipboard(button, highlightDiv) {
    const codeToCopy = highlightDiv.querySelector(":last-child > .chroma > code").innerText;
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

//hightlight
$(function () {
  //双链支持
  let ok = window.location.href.indexOf('/post/') > -1;
  if (!ok) {
    return;
  }
  //双链支持 和 高亮文本
  function _renderText(i, e) {
    let $e = $(e);
    //raw text
    let _t = $e.text();
    let hasDoubleLink = _t && _t.indexOf('[[') > -1;
    let hasHightLight = _t && _t.indexOf('==') > -1
    if (hasDoubleLink) {
      //双链渲染
      $e.contents()
      .filter(function(){
        return this.nodeType === 3; //text nodes
      }).each(function (i, e) { 
        const $this = $(this); //$(this).text()
        let $text = $this.text();
        let t = $this.text().replace(/\[\[(.*)\]\]/g, function (a, b) {
          //双链
          let prefix = '' //默认相对路径
          if (b.indexOf('post') == 0) {
            //采用绝对路径
            prefix = '/'
          }
          let link;
          let linkName;
          // 别名判断
          let _arr = b.split('|');
  
          if (_arr[1]) {
            linkName = _arr[1];// 别名
            link = prefix + _arr[0];
          } else {
            linkName = b;//默认
            link = prefix + b; 
            
          }
          return '<a class="doubleLink" href="' + link + '" target="_blank">' + linkName + '</a><br/>';
        });
        if($text != t) {
          $this.replaceWith(t);
        }
      });
 
    }
    if (hasHightLight) {
      $e.contents().filter(function () {
        return this.nodeType === 3; //text nodes
      }).each(function () {
        let $this = $(this); 
        let prev = $this.text();
        let t = prev.replace(/==(.*)==/g, function (a, b) {
          //实现高亮文字
          return `<span class='hightlight_text'>` + b + `</span>`;
        });
        if(prev != t) {//被替换了元素，就更新文本
          $this.replaceWith(t);
        }
      });

    }
    
  }

  const pdom = $('body .post-content p');
  //渲染文本
  pdom.each(_renderText);

});
 
$(function () {
  //dark-theme button 插件
  const $body = $('body');
  // $body.append($(`<div id='darkThemeBtn'>T</div>`))
  $body.delegate('#darkThemeBtn', 'click', function () {
    let isDark = $body.hasClass('dark-theme');
    console.log('dark', isDark);
    localStorage.setItem('dark-theme', !isDark);
    // darkThemeToggle_();
    $body.toggleClass('dark-theme');
  });
  let x = localStorage.getItem('dark-theme')
  if (x == 'true' || x == true) {
    $body.addClass('dark-theme');
  }
  let btn1 = $('#darkThemeBtn');
  setTimeout(() => {
    btn1.addClass('hide');
  }, 1200);

   
  function debounce(fn, wait) {
    var timeout = null;      //定义一个定时器
    return function () {
      if (timeout !== null)
        clearTimeout(timeout);  //清除这个定时器
      timeout = setTimeout(fn, wait);
    }
  }
  let hide = debounce(()=> {
    btn1.addClass('hide');
  },1500);
  $('#BR_cornner').on('mouseover', function (e) {
    btn1.removeClass('hide');
   
  }).on('mouseout', function (e) {
    // btn1.addClass('hide');
    hide();
  });

});