---
title: "封装websocket api 【golang后端】"
date: 2021-08-17T13:48:22+08:00
draft: false
author: LYR
---



###  封装websocket api 



[参考的相关文章](https://studygolang.com/articles/9478)
[参考github的 example](https://github.com/gorilla/websocket/blob/master/examples/echo/client.go)







###  golang 后台



```go
package ws

import (
	"github.com/gorilla/websocket"
	log "github.com/sirupsen/logrus"
	"net/http"
	"oj_backend1/core"
	"oj_backend1/util"
)
var upgrader = websocket.Upgrader{
	ReadBufferSize: 1024,
	WriteBufferSize: 1024,
	CheckOrigin: func(r *http.Request) bool {
		return true
	},
}
func reader(con *websocket.Conn) {
	var submit core.SubmitModel
	for  {
		msgType, p, err := con.ReadMessage()
		if err != nil {
			log.Printf("error %v",err)
			break
		}

	    util.JsonAsObj(p,&submit)
		log.Printf("submit := %v",submit)
		if err := con.WriteMessage(msgType,p); err!= nil {
			log.Printf("write err := %v",err)
			break
		}
	}
	con.Close()
}
func WsEndPointV1(w http.ResponseWriter, r*http.Request) {
	 ws, err := upgrader.Upgrade(w,r,nil)
	 if err != nil {
	 	log.Printf("error %v",err)
         return 
	 }
	 log.Println("connected ok ")
	 reader(ws)
}

```

