var PENDING = 'pending';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';

function MyPromise(fn) {
    this.status = PENDING;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];
    this.value = null;
    this.reason = null;
    let that = this;

    function resolve(value) {
        if (that.status === PENDING) {
            that.status = FULFILLED;
            that.value = value;
            that.onFulfilledCallbacks.forEach(onFulfilled => {
                onFulfilled(value);
            });
        }
    }

    function reject(reason) {
        if (that.status === PENDING) {
            that.status = REJECTED;
            that.reason = reason;
            that.onRejectedCallbacks.forEach(onRejected => {
                onRejected(reason);
            });
        }
    }

    try {
        fn(resolve, reject)
    } catch (e) {
        reject(e)
    }
}

MyPromise.prototype.then = function (onFulfilled, onRejected) {
    let realOnFulfilled = typeof onFulfilled === 'function' ? onFulfilled : value => value;
    let realOnRejected = typeof onRejected === 'function' ? onRejected : reason => {
        throw reason
    };
    let that = this;
    if (this.status === FULFILLED) {
        let promise2 = new MyPromise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    if (typeof onFulfilled !== 'function') {
                        resolve(that.value);
                    } else {
                        let x = realOnFulfilled(that.value);
                        resolvePromise(promise2, x, resolve, reject)
                    }
                } catch (e) {
                    reject(e);
                }
            }, 0)
        })
        return promise2;
    }
    if (this.status === REJECTED) {
        let promise2 = new MyPromise(function (resolve, reject) {
            setTimeout(() => {
                try {
                    if (typeof onRejected !== "function") {
                        reject(that.reason);
                    } else {
                        let x = realOnRejected(that.reason);
                        resolvePromise(promise2, x, resolve, reject)
                    }
                } catch (e) {
                    reject(e);
                }
            }, 0)
        })

        return promise2;

    }
    if (this.status === PENDING) {
        let promise2 = new MyPromise((resolve, reject) => {
            this.onFulfilledCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = realOnFulfilled(that.value);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })
            this.onRejectedCallbacks.push(() => {
                setTimeout(() => {
                    try {
                        let x = realOnRejected(that.reason);
                        resolvePromise(promise2, x, resolve, reject);
                    } catch (e) {
                        reject(e)
                    }
                }, 0)
            })
        })
        return promise2;
    }
}

MyPromise.resolve = function (param) {
    if (param instanceof MyPromise) {
        return param;
    }
    return new MyPromise((reslove) => {
        reslove(param);
    })
}

MyPromise.reject = function (reason) {
    return new MyPromise((resolve, reject) => {
        reject(param)
    })
}
MyPromise.all = function (promiseList) {
    var resPromise = new MyPromise(function (resolve, reject) {
        var count = 0;
        var result = [];
        var length = promiseList.length;

        if (length === 0) {
            return resolve(result);
        }
        promiseList.forEach(function (promise, index) {
            promise.then(function (value) {
                count++;
                result[index] = value;
                if (count === length) {
                    resolve(result);
                }
            }, function (reason) {
                reject(reason);
            });
        });
    });

    return resPromise;
}
MyPromise.rece = function (promiseList) {
    var resPromise = new MyPromise((resolve, reject) => {
        if (promiseList.length === 0) {
            return resolve();
        }
        promiseList.forEach(promise => {
            MyPromise.resolve(promise).then(value => {
                return reslove(value);
            }, reason => {
                return reject(reason);
            })
        })
    })
    return resPromise;
}

function resolvePromise(promise, x, resolve, reject) {
    if (promise === x) {
        return reject(new TypeError("The promise and the return value are the same"));
    }

    if (x instanceof MyPromise) {
        x.then((y) => {
            resolvePromise(promise, y, resolve, reject)
        }, reject)
    } else if (typeof x === 'object' || typeof x === 'function') {
        if (x === null) {
            resolve(x)
        } else {
            try {
                var then = x.then;
            } catch (e) {
                return reject(error);
            }
            if (typeof then === 'function') {
                try {
                    then.call(x, (y) => {
                        resolvePromise(promise, y, resolve, reject)
                    }, (e) => {
                        reject(e)
                    })
                } catch (e) {
                    reject(e);
                }
            } else {
                resolve(x);
            }
        }
    } else {
        resolve(x);
    }


}
module.exports = MyPromise;