import {useRef, useState, type CSSProperties} from "react";

const ActBtnCls: Record<string, CSSProperties> = {
    array: {
        color: 'red'
    },
    number: {
        color: 'blue'
    }
}
// import DynamicInput from "../origin/DynamicInput";
import {DynamicInput} from "@/index";
import type {dynamicInputRef} from "../index";

function App() {
    const [obj, setObj] = useState<Record<string, any>>({
        a: 'Hello world',
        b: 1314,
        c: [5, 2, 0]
    });
    const dynamicInputRef = useRef<dynamicInputRef>(null)
    return (<div>
        <DynamicInput ref={dynamicInputRef} value={obj} onChange={(e) => setObj(e)}
                      isController
                      /*newBtn={({newItem}) => <button onClick={newItem}>新</button>}
                      resetBtn={({reset}) => <button onClick={reset}>重</button>}
                      mergeBtn={({merge}) => <button onClick={merge}>合</button>}
                      typeTools={({toggleArray, toggleNumber, row}) => <>
                          <button onClick={toggleArray} style={row.isArray ? ActBtnCls.array : undefined}>array</button>
                          <button onClick={toggleNumber}
                                  style={row.isNumber ? ActBtnCls.number : undefined}>number
                          </button>
                      </>}
                      rowActions={({isLast, addItem, removeItem}) => <>
                          <button onClick={addItem} disabled={!isLast}>+</button>
                          <button onClick={removeItem} disabled={!isLast}>-</button>
                      </>}*/
        />
        <pre>
            {JSON.stringify(obj, null, 2)}
        </pre>
        <div>
            <button onClick={() => {
                dynamicInputRef.current?.onSet?.({
                    test: 'hello World'
                })
            }}>setData
            </button>
        </div>
    </div>)
}

export default App