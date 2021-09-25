// 实现new LazyMan('mike').eat().sleep(10).eat().sleep(5)

function LazyMan(name) {
    if (!(this instanceof LazyMan)) {
        return new LazyMan(str)
    }
    this.name = name
    this.actions = []
    this.actions.push({
        type: 'greet'
    })
    setTimeout(() => {
        this.next()
    }, 0)
}

LazyMan.prototype = {
    next() {
        let action = this.actions.length > 0 ? this.actions.shift() : {}
        if (action.type === 'greet') {
            console.log(`hi i am ${this.name}`)
            this.next()
        } else if (action.type === 'eat') {
            console.log(`eat ${action.food}`)
            this.next()
        } else if (action.type === 'sleep') {
            console.log(`sleep and wake up after ${action.time} s`)
            setTimeout(() => {
                this.next()
            }, action.time * 1000)
        }
    },
    eat(food) {
        this.actions.push({
            type: 'eat',
            food
        })
        return this
    },
    sleep(time) {
        this.actions.push({
            type: 'sleep',
            time
        })
        return this
    }
}