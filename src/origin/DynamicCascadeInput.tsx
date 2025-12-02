import {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import type {
    ValueType,
    DyRandomFun,
    DyBtnConfig,
    DyListConfig,
    DyCasConfig,
    DyCasFormItem,
    ExposeType,
} from "@/types";
import {formatNumberInput, parseValue, saferRepairColor} from "@/utils/tools";
import clsx from "clsx";

type DynamicCascadeInputProps = {
    depth?: number;
    value: ValueType,
    isController?: boolean,
    dyCls?: string,
    randomFun?: DyRandomFun
    newChildTxt?: (it: DyCasFormItem) => string
    onChange: (v: ValueType) => void,
    onReset?: () => void,
    onMerge?: (v: ValueType, ori: DyCasFormItem[]) => void,
    btnConfigs?: DyBtnConfig,
    configs?: DyCasConfig,
    dyListConfigs?: DyListConfig,
}
const DynamicCascadeInput = forwardRef<ExposeType, DynamicCascadeInputProps>((props, ref) => {
    // props
    const {
        depth = 3,
        value,
        isController,
        dyCls,
        configs,
        btnConfigs,
        dyListConfigs,
        randomFun = (i?: any) => `${Date.now()}_${i ?? 0}`,
        newChildTxt = (it: DyCasFormItem) => `添加 '${it.key}' 子项`,
        onReset,
        onMerge,
        onChange
    } = props
    // config
    const mb: DyBtnConfig = {
        resetTxt: "重置",
        newTxt: "添加项",
        mergeTxt: "合并",
        ...btnConfigs
    }
    const mc: DyCasConfig = {
        hideReset: false,
        maxHeight: "600px",
        allowFilter: true,
        showBorder: true,
        showPad: true,
        retractLen: 0,
        borderColors: [],
        ...configs,
    }
    const ml: DyListConfig = {
        arraySplitSymbol: ',',
        ...dyListConfigs
    }
    // function
    const allowType = (v: any): boolean => ['string', 'number'].includes(v)
    // data
    const [renderM, setRenderM] = useState<DyCasFormItem[]>(() => tranMulObj(value))
    // expose
    useImperativeHandle(ref, () => ({
        getResult(t: "res" | "ori"): DyCasFormItem[] | object {
            return t === 'ori' ? renderM : resetMulObj(renderM);
        }, onSet(o: object | undefined): void {
            setRenderM(tranMulObj(o ?? value))
        }
    }))

    // 初始化数据，支持嵌套
    function tranMulObj(obj: ValueType): DyCasFormItem[] {
        return Object.keys(obj).map((it, i) => {
            let v = obj[it]
            const isArray = Array.isArray(v)
            const isNumber = isArray ? v.every((it2: string | number) => typeof it2 === 'number') : typeof v === 'number'
            const isNull = v === null
            if (allowType(typeof v)) v = obj[it]
            if (isNull) v = ''
            return {
                rId: randomFun(i),
                key: it,
                value: Object.prototype.toString.call(v) === '[object Object]' ? tranMulObj(obj[it]) : isArray ? v.join(ml.arraySplitSymbol) : v,
                isArray: isArray || undefined,
                isNumber: isNumber || undefined
            }
        });
    }

    const resetMulObj = (items: DyCasFormItem[]): ValueType => {
        return items.reduce((pre, cur) => {
            const v = cur.value
            if (cur.key.trim().length) {
                pre[cur.key] = Array.isArray(v) ? resetMulObj(v) : parseValue(cur.value as string, cur.isArray, cur.isNumber, ml.arraySplitSymbol);
            }
            return pre;
        }, {} as ValueType);
    };
    // render Cascade form
    const renderFormItems = (items: DyCasFormItem[], depthC = 1, oriObj?: DyCasFormItem) => {
        return <div className={clsx([
            `depth-${depthC}`,
            mc.showBorder ? '' : 'no-border',
            mc.showPad ? '' : 'no-pad',
        ])}
                    style={{
                        //@ts-ignore
                        '--depth': depthC,
                        ['--c' + [depthC]]: saferRepairColor(mc.borderColors!, depthC),
                    }}>
            {
                items.map((r, i, arr) => {
                    const isChildren = Array.isArray(r.value)
                    const isAllow = allowType(typeof r.value)
                    return <div className="dItem" key={r.rId}
                                style={{marginLeft: depthC > 1 ? `${depthC * mc.retractLen!}px` : '0'}}>
                        <div className="input">
                            {
                                !isChildren && <>
                                    <input value={r.key} className="key nativeInput"
                                           onInput={v=> {
                                               const key=(v.target as HTMLInputElement).value
                                               setRenderM(p=>{
                                                   const next = [...p]
                                                   const old = next[i]
                                                   if (depth>1) {

                                                   }
                                                   else next[i] = {...old, key}
                                                   return next
                                               })
                                           }}/>
                                    :
                                </>
                            }
                            <div className="vInput">
                                <div className="slot">
                                    {Array.isArray(r.value) ? undefined : <>
                                        <button
                                            className={clsx([
                                                r.isArray ? "success" : "default",
                                                "small",
                                                "bt"
                                            ])}
                                            onClick={() => {
                                                r.isArray = !r.isArray
                                            }}
                                        >
                                            Array
                                        </button>
                                        &nbsp;
                                        <button
                                            className={clsx([
                                                r.isNumber ? "success" : "default",
                                                "small",
                                                "bt"
                                            ])}
                                            onClick={() => {
                                                r.isNumber = !r.isNumber
                                            }}
                                        >
                                            Number
                                        </button>
                                    </>}
                                </div>
                                <input
                                    className={`value nativeV ${isChildren ? 'isKey' : ''}`}
                                    value={isAllow ? r.value as string : r.key}
                                    onInput={(tv) => {
                                        const v = (tv.target as HTMLInputElement).value
                                        if (isChildren) {
                                            r.key = v
                                            return
                                        }
                                        if (!mc.allowFilter) r.value = v
                                        else {
                                            if (r.isNumber) {
                                                r.value = formatNumberInput(
                                                    v,
                                                    r.isArray,
                                                    ml.arraySplitSymbol
                                                )
                                            } else r.value = v
                                        }
                                    }}
                                />
                                <div className="surSlot">
                                    {
                                        depthC < depth ? (
                                            !isChildren && <button
                                                className={clsx([
                                                    "success",
                                                    "bt"
                                                ])}
                                                onClick={() => {
                                                    if (isAllow) {
                                                        r.value = [];
                                                        r.isArray = undefined
                                                    }
                                                    (r.value as DyCasFormItem[]).push({
                                                        rId: randomFun(),
                                                        key: "",
                                                        value: ""
                                                    });
                                                }}
                                            >
                                                {newChildTxt(r)}
                                            </button>
                                        ) : null
                                    }
                                </div>
                            </div>
                        </div>
                        <div className="btn">
                            <button
                                className={clsx(['success', 'bt'])}
                                disabled={i !== arr.length - 1}
                                onClick={() => {
                                    items.push({rId: randomFun(), key: "", value: ""});
                                }}
                            >
                                +
                            </button>
                            <button
                                className={clsx([
                                    "danger",
                                    'bt'
                                ])}
                                onClick={() => {
                                    items.splice(i, 1);
                                    if (items.length < 1) {
                                        if (oriObj === undefined) return resetMulObj([])
                                        const fIndex = renderM.findIndex(it2 => it2.rId === oriObj?.rId)
                                        if (depthC < 1) renderM.splice(fIndex, 1, {...oriObj!, value: ""})
                                        else oriObj!.value = ""
                                    }
                                }}
                            >
                                -
                            </button>
                        </div>
                        {Array.isArray(r.value) && renderFormItems(r.value, depthC + 1, r)}
                    </div>
                })
            }
        </div>
    };
    useEffect(() => {
        if (isController) {
            onChange(resetMulObj(renderM))
        }
    }, [renderM])
    return (<div className={dyCls ?? `dynamicCascadeInput`}>
        <div className="dyFormList" style={{maxHeight: mc.maxHeight}}>{renderFormItems(renderM)}</div>
        <div className='control'>
            {!renderM.length && (
                <button
                    className={clsx([
                        "success", 'bt'
                    ])}
                    onClick={() => {
                        setRenderM(p => [...p, {rId: randomFun(), key: "", value: ""}])
                    }}
                >
                    {mb.newTxt}
                </button>
            )}
            {
                !isController && <>
                    {!mc.hideReset && <button
                        className={clsx([
                            "default", 'bt'
                        ])}
                        onClick={() => {
                            setRenderM(tranMulObj(value))
                            onReset?.()
                        }}
                    >
                        {mb.resetTxt}
                    </button>}
                    <button
                        className={clsx([
                            "info", 'bt'
                        ])}
                        onClick={() => {
                            const obj = resetMulObj(renderM);
                            onChange(obj)
                            onMerge?.(obj, renderM)
                            setRenderM(tranMulObj(obj))
                        }}
                    >
                        {mb.mergeTxt}
                    </button>
                </>
            }
        </div>
    </div>)
})
export default DynamicCascadeInput;