import {forwardRef, useImperativeHandle, useState} from "react";
import type {ExposeType} from "@/types";
import {resetObj, tranArr} from "../../utils/tools.ts";

type DynamicFormProps = {
    size?: string
    value: ValueType,
    randomFun?: DyRandomFun
}
type dynamicFormRef = ExposeType
const DynamicInput = forwardRef<dynamicFormRef, DynamicFormProps>((props, ref) => {
    const {value, randomFun = (i?: any) => `${Date.now()}_${i ?? 0}`} = props
    const [renderM, setRenderM] = useState<DyCFormItem[]>(tranArr(value, randomFun, ','))
    const ml: DyListConfig = {
        arraySplitSymbol: ',',
        // ...props.dyListConfigs,
    }
    // expose
    useImperativeHandle(ref, () => ({
        getResult(t: "res" | "ori"): DyCFormItem[] | object {
            return t === 'ori' ? value : resetObj(renderM, ml.arraySplitSymbol);
        }, onSet(o: object | undefined): void {
            setRenderM(tranArr(o ?? value, randomFun, ml.arraySplitSymbol))
        }
    }))

    return (
        <div className={'dynamicInput'}>
            <div className={'aaa'}>
                aaaaaa
            </div>
        </div>
    );

})
export default DynamicInput;