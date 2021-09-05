---
title: "shiro框架使用总结"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



## shiro使用总结



口述： 自定义一个 realm

调用 login 方法，shiro 自动 去从 realm 里面获取用户信息，  然后 我这个 realm 注入 usermapper ，userMapper 或者 userService 获取 用户的信息， 获取信息之后 就 存入 session，大概就是这个样子 【面试总结】



```java
package com.aaa.ssm.realm;
import com.aaa.ssm.entity.Users;
import com.aaa.ssm.service.UserService;
import org.apache.shiro.authc.*import org.apache.shiro.authz.AuthorizationInfo;
import org.apache.shiro.realm.AuthorizingRealm;
import org.apache.shiro.realm.Realm;
import org.apache.shiro.subject.PrincipalCollection;
import org.springframework.beans.factory.annotation.Autowired;
/**
* 实现自定义域
* Authorization 授权（权限校验）
*
* Authentication 认证（登录校验）
*
*/
public class AuthRealm extends AuthorizingRealm {
@Autowired
private UserService userService;
//获取授权信息
protected AuthorizationInfo doGetAuthorizationInfo(PrincipalCollection principalCollection) {
	return null;
}//获取认证信息
protected AuthenticationInfo doGetAuthenticationInfo(AuthenticationToken token) throws
AuthenticationException {
//获取用户名 不过一般往shiro中放置用户身份信息的时候，不直接放用户名字符串，放用户对象
	String username = token.getPrincipal().toString();
//有了用户名，要根据用户名在数据库中查询用户对象
	Users user = userService.findByUsername(username);
//判断如果用户对象不存在，抛出UnknownAccountException
	if(user==null){
		throw new UnknownAccountException("用户名不存在");
	}
//封装用户的身份对象 返回这个身份对象
	SimpleAuthenticationInfo info = new SimpleAuthenticationInfo(user,user.getPassword(),"authRealm");
	return info;
	}
}
```

