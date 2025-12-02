const tranArr = (obj: ValueType, arrayFun: DyRandomFun, splitSymbol: string) => Object.keys(obj).map((it, i) => {
    const v = obj[it]
    const isArray = Array.isArray(v)
    const isNumber = isArray ? v.every(v => typeof v === 'number') : typeof v === 'number'
    return {
        rId: arrayFun(i),
        key: it,
        value: isArray ? v.join(splitSymbol) : v,
        isArray: isArray || undefined,
        isNumber: isNumber || undefined
    }
}) as DyCFormItem[];
const resetObj = (arr: DyCFormItem[], splitSymbol: string) => {
    return arr.reduce((pre, cur) => {
        if (cur.key.trim()) {
            pre[cur.key] = parseValue(cur.value, cur.isArray, cur.isNumber, splitSymbol);
        }
        return pre;
    }, {} as ValueType);
};
const parseValue = (value: string, isArray?: boolean, isNumber?: boolean, splitSym: string = ',') => {
    let d: any
    if (isArray) {
        if (isNumber) {
            d = String(value).split(splitSym).map(Number).filter(it => !Number.isNaN(it))
        } else d = String(value).split(splitSym)
    } else {
        if (isNumber) {
            d = parseFloat(value)
        } else d = value.toString()
    }
    return d
};
/*// 只允许数字和小数点，顺便兼容数组（用 splitSymbol 分隔）
const formatNumberInput = (
    val: string,
    isArray?: boolean,
    splitSymbol: string = ','
) => {
    // 处理单个数字：只保留数字和一个小数点
    const sanitizeOne = (s: string) => {
        // 去掉非数字和小数点
        s = s.replace(/[^\d.]/g, '')
        // 只保留第一个小数点
        const firstDot = s.indexOf('.')
        if (firstDot !== -1) {
            s =
                s.slice(0, firstDot + 1) +
                s.slice(firstDot + 1).replace(/\./g, '')
        }
        return s
    }

    if (isArray) {
        return val
            .split(splitSymbol)
            .map(item => sanitizeOne(item))
            .join(splitSymbol)
    } else {
        return sanitizeOne(val)
    }
}*/
// 允许数字 / 小数点 / 负号，兼容数组（用 splitSymbol 分隔）
const formatNumberInput = (
    val: string,
    isArray?: boolean,
    splitSymbol: string = ','
) => {
    const sanitizeOne = (s: string) => {
        // 只保留数字、小数点、负号
        s = s.replace(/[^\d.-]/g, '')

        // 处理负号：只允许一个负号，且在最前面
        let negative = false
        if (s.startsWith('-')) {
            negative = true
        }
        // 去掉所有负号
        s = s.replace(/-/g, '')

        // 处理小数点：只保留第一个 '.'
        const firstDot = s.indexOf('.')
        if (firstDot !== -1) {
            s =
                s.slice(0, firstDot + 1) +
                s.slice(firstDot + 1).replace(/\./g, '')
        }

        // 重新加上负号
        return (negative ? '-' : '') + s
    }

    if (isArray) {
        return val
            .split(splitSymbol)
            .map(item => sanitizeOne(item))
            .join(splitSymbol)
    } else {
        return sanitizeOne(val)
    }
}
const getDepthColor = (depth: number) => {
    const hue = (depth * 35) % 360
    const saturation = 60
    const lightness = 65

    return `hsl(${hue}, ${saturation}%, ${lightness}%)`
}
const saferRepairColor = (colors: string[], i: number): string => {
    const c = colors[i - 1]
    return c ?? getDepthColor(i)
}
export {
    tranArr,
    resetObj,
    parseValue,
    formatNumberInput,
    getDepthColor,
    saferRepairColor
}