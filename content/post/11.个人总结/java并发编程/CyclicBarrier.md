## cyclicBarrier 用法





```java
  public static void main(String[] args) {
        CyclicBarrier cb = new CyclicBarrier(2);
        new Thread(()-> {
            try {
                cb.await();
            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
            System.out.println("继续向下执行");
        }).start();
        new Thread(()->{
            try {
                cb.await();

            } catch (InterruptedException e) {
                e.printStackTrace();
            } catch (BrokenBarrierException e) {
                e.printStackTrace();
            }
            System.out.println("继续向下执行");
        }).start();

    }
```

这个栅栏用于同时执行【同时放线程开始执行】



## 定时器的时候用



```java
 public static void main(String[] args) {
        CyclicBarrier cb = new CyclicBarrier(2,()->{
            System.out.println("任务执行完成，触发回调函数");
        });
        for (int i=0;i<2;++i) {
            int finalI = i;
            new Thread(()-> {
                try {
                    cb.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println("继续向下执行"+ finalI);
            }).start();
            int finalI1 = i;
            new Thread(()->{
                try {
                    cb.await();

                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println("继续向下执行"+ finalI1);
            }).start();
        }

    }
```



### syclibarrier 能重复使用多次， countDownLatch 只能使用1次



```java
 public static void main(String[] args) {
        CyclicBarrier cb = new CyclicBarrier(2,()->{
            System.out.println("任务执行完成，触发回调函数");
        });
        for (int i=0;i<2;++i) {
            int finalI = i;
            new Thread(()-> {
                try {
                    cb.await();
                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println("继续向下执行"+ finalI);
            }).start();
            int finalI1 = i;
            new Thread(()->{
                try {
                    cb.await();

                } catch (InterruptedException e) {
                    e.printStackTrace();
                } catch (BrokenBarrierException e) {
                    e.printStackTrace();
                }
                System.out.println("继续向下执行"+ finalI1);
            }).start();
        }

    }
```









