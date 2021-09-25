## flex-basis
我们可以通过设置flex-basis来设置flex中每个flex item的main size（不一定是宽度，也可能是高度，当flex-direction设置为column的时候就为高度）

flex-basis属性定义了在分配多余空间之前，项目占据的主轴空间

设置flex-basis时，会覆盖掉width/height的设置

而flex-basis又受max-width/min-width/max-height/min-height的限制

如果几个item的总宽度大于容器宽度，item被压缩，压缩时各占的比例为flex-basis的比

如果几个item的总宽度小于容器宽度，那么就按basis的大小显示

如果flex-basis为百分数的话，那这个百分数是相对于容器的主轴长度

## flex-shrink
flex-shrink属性定义了项目的缩小比例，默认为1，即如果空间不足，该项目将缩小

如果所有项目的flex-shrink属性都为1，当空间不足时，都将等比例缩小。如果一个项目的flex-shrink属性为0，其他项目都为1，则空间不足时，前者不缩小。

## flex-grow
flex-grow属性定义项目的放大比例，默认为0，即如果存在剩余空间，也不放大。

如果所有项目的flex-grow属性都为1，则它们将等分剩余空间（如果有的话）。如果一个项目的flex-grow属性为2，其他项目都为1，则前者占据的剩余空间将比其他项多一倍。

## order
order属性定义项目的排列顺序。数值越小，排列越靠前，默认为0。

## flex
flex是一个复合的属性，默认值为0 1 auto
表示为flex-grow flex-shrink flex-basis
```css
flex:1
```
表示
```css
flex-grow:1
flex-shrink:1
```