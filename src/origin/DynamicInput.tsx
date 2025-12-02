import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import type {ExposeType,FSize,ValueType,DyRandomFun,DyBtnConfig,DyListConfig,DyConfig,DyCFormItem} from "@/types";
import {formatNumberInput, resetObj, tranArr} from "@/utils/tools";
import clsx from "clsx";

type DynamicInputProps = {
    size?: FSize
    value: ValueType,
    isController?: boolean,
    dyCls?: string,
    randomFun?: DyRandomFun
    onChange: (v: ValueType) => void,
    onReset?: () => void,
    onMerge?: (v: ValueType, ori: DyCFormItem[]) => void,
    btnConfigs?: DyBtnConfig,
    configs?: DyConfig,
    dyListConfigs?: DyListConfig,
}
const DynamicInput = forwardRef<ExposeType, DynamicInputProps>((props, ref) => {
    // props
    const {
        value,
        size,
        dyCls,
        isController,
        configs,
        btnConfigs,
        dyListConfigs,
        randomFun = (i?: any) => `${Date.now()}_${i ?? 0}`,
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
    const mc: DyConfig = {
        hideReset: false,
        maxHeight: "300px",
        autoScroll: true,
        allowFilter: true,
        ...configs
    }
    const ml: DyListConfig = {
        arraySplitSymbol: ',',
        ...dyListConfigs
    }
    const [renderM, setRenderM] = useState<DyCFormItem[]>(() => tranArr(value, randomFun, ml.arraySplitSymbol))
    // const renderData = useRef<DyCFormItem[]>(tranArr(value, randomFun, ','))
    // const renderM=renderData.current
    // node
    const dyFormListRef = useRef<HTMLDivElement | null>(null)
    // expose
    useImperativeHandle(ref, () => ({
        getResult(t: "res" | "ori"): DyCFormItem[] | object {
            return t === 'ori' ? renderM : resetObj(renderM, ml.arraySplitSymbol);
        }, onSet(o: object | undefined): void {
            setRenderM(tranArr(o ?? value, randomFun, ml.arraySplitSymbol))
        }
    }))
    useEffect(() => {
        if (isController) {
            onChange(resetObj(renderM, ml.arraySplitSymbol))
        }
    }, [renderM])
    return (
        <div className={dyCls ?? `dynamicInput ${size}`}>
            <div className="dyFormList" ref={dyFormListRef} style={{maxHeight: mc.maxHeight}}>
                {renderM.map((r, i, arr) => <div className="dItem" key={r.rId}>
                    <div className="input">
                        <input value={r.key} className="key nativeInput" onInput={v => {
                            const key = (v.target as HTMLInputElement).value
                            setRenderM(p => {
                                const next = [...p]
                                const old = next[i]
                                next[i] = {...old, key}
                                return next
                            })
                        }}/>:
                        <div className="vInput">
                            <div className="slot">
                                <button
                                    className={clsx([
                                        r.isArray ? "success" : "default",
                                        "small",
                                        "bt"
                                    ])}
                                    onClick={() => {
                                        setRenderM(p => {
                                            const next = [...p]
                                            const old = next[i]
                                            next[i] = {...old, isArray: !old.isArray}
                                            return next
                                        })
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
                                        setRenderM(p => {
                                            const next = [...p]
                                            const old = next[i]
                                            next[i] = {...old, isNumber: !old.isNumber}
                                            return next
                                        })
                                    }}
                                >
                                    Number
                                </button>
                            </div>
                            <input value={r.value} className='value nativeV' onInput={v => {
                                const vv = (v.target as HTMLInputElement).value
                                let newV = vv
                                if (r.isNumber && mc.allowFilter) {
                                    newV = formatNumberInput(
                                        vv,
                                        r.isArray,
                                        ml.arraySplitSymbol
                                    )
                                }
                                setRenderM(p => {
                                    const next = [...p]
                                    const old = next[i]
                                    next[i] = {...old, value: newV}
                                    return next
                                })
                            }}/>
                        </div>
                    </div>
                    <div className="btn">
                        <button className={clsx([size, 'success', 'bt'])} disabled={i !== arr.length - 1}
                                onClick={() => {
                                    setRenderM(p => [...p, {rId: randomFun(), key: '', value: ''}])
                                    if (mc.autoScroll){
                                        setTimeout(() => {
                                            const el = dyFormListRef.current
                                            el?.scrollTo({top: el?.scrollHeight + 20, behavior: 'smooth'})
                                        })
                                    }
                                }}>+
                        </button>
                        <button className={clsx([
                            "danger",
                            size
                            , 'bt'
                        ])} onClick={() => {
                            setRenderM(p => p.filter(it => it.rId !== r.rId))
                        }}>-
                        </button>
                    </div>
                </div>)}
            </div>
            {
                <div className='control'>
                    {
                        !renderM.length && <button className={clsx([
                            "success",
                            size, 'bt'
                        ])} onClick={() => {
                            setRenderM(p => [...p, {rId: randomFun(), key: '', value: ''}])
                        }}>{mb.newTxt}</button>
                    }
                    {
                        !isController && <>
                            {!mc.hideReset && <button className={clsx([
                                "default",
                                size, 'bt'
                            ])} onClick={() => {
                                setRenderM(tranArr(value, randomFun, ml.arraySplitSymbol))
                                onReset?.()
                            }}>{mb.resetTxt}</button>}
                            <button className={clsx([
                                "info",
                                size, 'bt'
                            ])} onClick={() => {
                                const temp = [...renderM]
                                temp.sort((a, b) => +a.rId - +b.rId)
                                const obj = resetObj(renderM, ml.arraySplitSymbol)
                                onChange(obj)
                                onMerge?.(obj, renderM)
                                setRenderM(tranArr(obj, randomFun, ml.arraySplitSymbol))
                            }}>{mb.mergeTxt}</button>
                        </>
                    }
                </div>
            }
        </div>
    );

})
export default DynamicInput;