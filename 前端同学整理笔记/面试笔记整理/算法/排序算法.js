// 冒泡排序
function bubbleSort(arr) {
    for (let i = 0; i < arr.length - 1; i++) {
        for (let j = 0; j < arr.length - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                let temp = arr[j]
                arr[j] = arr[j + 1]
                arr[j + 1] = temp
            }
        }
    }
    return arr
}

console.log(bubbleSort(arr))
var arr = [1, 34, 56, 78, 56, 22, 33, 36]

// 插入排序
function insertSort(arr) {
    for (let i = 0; i < arr.length; i++) {
        for (let j = i; j > 0; j--) {
            if (arr[j] < arr[j - 1]) {
                let temp = arr[j]
                arr[j] = arr[j - 1]
                arr[j - 1] = temp
            }
        }
    }
    return arr
}

console.log(insertSort(arr))
var arr = [1, 34, 56, 78, 56, 22, 33, 36]

// 直接选择排序
function chooseSort(arr) {
    let maxIndex, maxNum, temp
    for (let i = 0; i < arr.length - 1; i++) {
        maxIndex = 0
        maxNum = arr[0]
        for (let j = 0; j < arr.length - i; j++) {
            if (arr[j] > maxNum) {
                maxIndex = j
                maxNum = arr[j]
            }
        }
        temp = arr[arr.length - i - 1]
        arr[maxIndex] = temp
        arr[arr.length - i - 1] = maxNum
    }
    return arr
}

console.log(chooseSort(arr))
var arr = [1, 34, 56, 78, 56, 22, 33, 36]

// 快速排序
function fastSort(arr) {
    if (arr.length <= 1) {
        return arr
    } else {
        let sign = arr[0],
            low = 0,
            high = arr.length - 1
        while (low < high) {
            while (arr[low + 1] < sign && low < high) {
                arr[low] = arr[low + 1]
                low++
            }
            if (low !== high) {
                let temp = arr[low + 1]
                arr[low + 1] = arr[high]
                arr[high] = temp
                high--
            }
        }
        arr[low] = sign
        return [...fastSort(arr.slice(0, low)), sign, ...fastSort(arr.slice(low + 1))]
    }
}

console.log('fast', fastSort(arr))

var arr = [1, 34, 56, 78, 56, 22, 33, 36]

// 归并排序
function merageSort(arr) {
    let len = arr.length
    if (len == 1) {
        return arr
    }
    let mid = Math.floor(len / 2)
    return merage(merageSort(arr.slice(0, mid)), merageSort(arr.slice(mid)))
}

function merage(left, right) {
    let result = []
    let li = 0,
        ri = 0,
        llen = left.length,
        rlen = right.length
    while (li < llen && ri < rlen) {
        if (left[li] < right[ri]) {
            result.push(left[li])
            li++
        } else {
            result.push(right[ri])
            ri++
        }
    }
    return li < llen ?
        result.concat(left.slice(li)) :
        result.concat(right.slice(ri))
}
console.log('merage', merageSort(arr))

var arr = [1, 34, 56, 78, 56, 22, 33, 36]

// 希尔排序
function hillSort(arr) {
    let gap = Math.floor(arr.length / 2)
    while (gap >= 1) {
        for (let i = gap; i < arr.length; i++) {
            let j, temp = arr[i]
            for (j = i - gap; j >= 0 && arr[j] > temp; j -= gap) {
                arr[j + gap] = arr[j]
            }
            arr[j + gap] = temp
        }
        gap = Math.floor(gap / 2)
    }
    return arr
}

console.log('hill', hillSort(arr))