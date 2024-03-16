package main 


import (
    "sync"
	"fmt"
)
var wg sync.WaitGroup 

func main() {
    // wg.Add(5)
    ch := make(chan struct{},5)
    for i:=1;i<=5;i++ {
        go func(j int) {
            fmt.Println("",j)
            ch <- struct{}{}
        }(i)
    }
    for i,v := range ch {
		fmt.Println("end ",i)
    }

}
func main1() {
    // wg.Add(5)
    for i:=1;i<=5;i++ {
        wg.Add(1)
        go func(j int) {
            fmt.Println("--",j)
            wg.Done()
        }(i)
    }
    wg.Wait()
}