import {type CSSProperties, useRef, useState} from "react";
import {DynamicCascadeInput, type dynamicCascadeInputRef} from "@/index";

const ActBtnCls: Record<string, CSSProperties> = {
    array: {
        color: 'red'
    },
    number: {
        color: 'blue'
    }
}
const App = () => {
    const [obj, setObj] = useState<Record<string, any>>({
        a: {
            b: {
                c: {
                    d: {
                        e: "hello world"
                    }
                }
            }
        },
        aa: [5, 2, 0],
        aaa: 1314
    });
    const dynamicInputRef = useRef<dynamicCascadeInputRef>(null)
    return (<div>
        <DynamicCascadeInput ref={dynamicInputRef}
            // isController
                             configs={
                                 {
                                     showBorder: false,
                                     showPad: false
                                 }
                             }
                             value={obj} onChange={(e) => setObj(e)}
                             /*newBtn={({newItem}) => <button onClick={newItem}>新</button>}
                             resetBtn={({reset}) => <button onClick={reset}>重</button>}
                             mergeBtn={({merge}) => <button onClick={merge}>合</button>}
                             typeTools={({toggleArray, toggleNumber, row}) => <>
                                 <button onClick={toggleArray} style={row.isArray ? ActBtnCls.array : undefined}>array
                                 </button>
                                 <button onClick={toggleNumber}
                                         style={row.isNumber ? ActBtnCls.number : undefined}>number
                                 </button>
                             </>}
                             rowActions={({isLast, addItem, removeItem}) => <>
                                 <button onClick={addItem} disabled={!isLast}>+</button>
                                 <button onClick={removeItem} disabled={!isLast}>-</button>
                             </>}
                             newChild={({addChild,row}) => <button onClick={addChild}>+{row.value}+</button>}*/

        />
        <pre>
            {JSON.stringify(obj, null, 2)}
        </pre>
        <div>
            <button onClick={() => {
                dynamicInputRef.current?.onSet?.({
                    test: 'hello world'
                })
            }}>setData
            </button>
        </div>
    </div>)
}
export default App;