import {forwardRef, useImperativeHandle, useState} from "react";
import type {ExposeType} from "@/types";
import {formatNumberInput, resetObj, tranArr} from "../../utils/tools.ts";
import clsx from "clsx";

type DynamicFormProps = {
    size?: string
    value: ValueType,
    isController?: boolean,
    randomFun?: DyRandomFun
    onChange?: (v: ValueType) => void,
    onReset?: () => void,
    onMerge?: (v: ValueType, ori: DyCFormItem[]) => void,
}
type dynamicFormRef = ExposeType
const DynamicInput = forwardRef<dynamicFormRef, DynamicFormProps>((props, ref) => {
    const {value, randomFun = (i?: any) => `${Date.now()}_${i ?? 0}`, isController, onReset, onMerge, onChange} = props
    const [renderM, setRenderM] = useState<DyCFormItem[]>(tranArr(value, randomFun, ','))
    // config
    const mb: DyBtnConfig = {
        resetTxt: "重置",
        newTxt: "添加项",
        mergeTxt: "合并",
    }
    const mc: DyConfig = {
        hideReset: false,
        maxHeight: "300px",
        autoScroll: true,
        allowFilter: true,
    }
    const ml: DyListConfig = {
        arraySplitSymbol: ',',
    }
    // expose
    useImperativeHandle(ref, () => ({
        getResult(t: "res" | "ori"): DyCFormItem[] | object {
            return t === 'ori' ? value : resetObj(renderM, ml.arraySplitSymbol);
        }, onSet(o: object | undefined): void {
            setRenderM(tranArr(o ?? value, randomFun, ml.arraySplitSymbol))
        }
    }))
    const size = 'small'
    return (
        <div className={'dynamicInput'}>
            <div className="dyFormList">
                {renderM.map((r, i, arr) => <div className="dItem" key={r.rId}>
                    <div className="input">
                        <input value={r.key} className="key nativeInput" onInput={v => {
                            r.key = (v.target as HTMLInputElement).value
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
                            </div>
                            <input value={r.value} className='value nativeV' onInput={v => {
                                const vv = (v.target as HTMLInputElement).value
                                if (!mc.allowFilter) {
                                    r.value = vv
                                } else {
                                    if (r.isNumber) {
                                        r.value = formatNumberInput(
                                            vv,
                                            r.isArray,
                                            ml.arraySplitSymbol
                                        )
                                    } else {
                                        r.value = vv
                                    }
                                }
                            }}/>
                        </div>
                    </div>
                    <div className="btn">
                        <button className={clsx([size, 'success', 'bt'])} disabled={i !== arr.length - 1}
                                onClick={() => {
                                    renderM.push({rId: randomFun(), key: '', value: ''})
                                    // el?.scrollTo({top: el.scrollHeight, behavior: 'smooth'})
                                }}>+
                        </button>
                        <button className={clsx([
                            "danger",
                            size
                            , 'bt'
                        ])} onClick={() => {
                            setRenderM(renderM.filter(it => it.rId !== r.rId))
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
                            renderM.push({rId: randomFun(), key: '', value: ''})
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
                                onChange?.(obj)
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