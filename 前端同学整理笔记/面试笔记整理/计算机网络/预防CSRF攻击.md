https://blog.csdn.net/qq_29999249/article/details/65627893?ops_request_misc=%257B%2522request%255Fid%2522%253A%2522159785303119195162557015%2522%252C%2522scm%2522%253A%252220140713.130102334..%2522%257D&request_id=159785303119195162557015&biz_id=0&utm_medium=distribute.pc_search_result.none-task-blog-2~all~top_click~default-1-65627893.first_rank_v2_rank_v25&utm_term=CSRF&spm=1018.2118.3001.4187

CSRF跨站点请求伪造(Cross—Site Request Forgery)

（转载）
1. 使用请求令牌  
首先服务器端要以某种策略生成随机字符串，作为令牌(token)，保存在 Session 里。然后在发出请求的页面，把该令牌以隐藏域一类的形式，与其他信息一并发出。在接收请求的页面，把接收到的信息中的令牌与 Session 中的令牌比较，只有一致的时候才处理请求，处理完成后清理session中的值，否则返回 HTTP 403 拒绝请求或者要求用户重新登陆验证身份
2. token验证  
* 在 HTTP 请求中以参数的形式加入一个随机产生的 token，并在服务器端建立一个拦截器来验证这个 token，如果请求中没有 
token 或者 token 内容不正确，则认为可能是 CSRF 攻击而拒绝该请求。  
* token需要足够随机  
* 敏感的操作应该使用POST，而不是GET，以form表单的形式提交，可以避免token泄露。
3. 验证 HTTP Referer 字段
4. 设置cookie的sameSite为strict，使得请求在发送时无法自动携带cookie

# CSRF漏洞检测
检测CSRF漏洞是一项比较繁琐的工作，最简单的方法就是抓取一个正常请求的数据包，去掉Referer字段后再重新提交，如果该提交还有效，那么基本上可以确定存在CSRF漏洞。