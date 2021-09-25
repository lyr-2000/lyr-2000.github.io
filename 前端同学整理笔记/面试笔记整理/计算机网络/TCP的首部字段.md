> SYN：建立连接  
> FIN：断开连接  
> ACK：确认号，仅当ACK=1时确认字段才有效，TCP在连接建立后所有传送的报文段都必须把ACK置为1  
> RST：复位，当RST=1时，表明TCP连接中出现严重错误，必须释放连接，然后再重新建立运输连接  
> PST：推送，当发送方把PST置为1创建一个报文段发送出去，接收方收到该报文段后，不再等待缓存满，尽快交付接受应用进程  

TCP连接三次握手
1. 连接请求报文：SYN=1,seq=x
2. 连接响应报文：SYN=1,seq=y,ack=x+1,ACK=1
3. 连接确认报文：ACK=1,seq=x+1,ack=y+1

TCP连接的四次挥手
1. FIN=1,seq=u
2. ACK=1,seq=v,ack=u+1
3. FIN=1,ACK=1,seq=w,ack=u+1
4. ACK=1,seq=u+1,ack=w+1