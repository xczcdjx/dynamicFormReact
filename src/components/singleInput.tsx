import {useRef, useState} from "react";
// import DynamicInput from "../origin/DynamicInput";
import {DynamicInput} from "../../dist";
import type {dynamicInputRef} from "../index";

function App() {
    const [obj,setObj]=useState<Record<string, any>>({
        a: 'Hello world',
        b: 1314,
        c: [5, 2, 0]
    });
    const dynamicInputRef=useRef<dynamicInputRef>(null)
    return (<div>
        <DynamicInput ref={dynamicInputRef} isController value={obj} onChange={(e) => setObj(e)}/>
        <pre>
            {JSON.stringify(obj,null, 2)}
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