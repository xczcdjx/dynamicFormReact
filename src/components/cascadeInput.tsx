import {useRef, useState} from "react";
import {DynamicCascadeInput,dynamicCascadeInputRef} from "../../dist";

const App=()=>{
    const [obj,setObj]=useState<Record<string, any>>({
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
    const dynamicInputRef=useRef<dynamicCascadeInputRef>(null)
    return (<div>
        <DynamicCascadeInput ref={dynamicInputRef} isController value={obj} onChange={(e) => setObj(e)}/>
        <pre>
            {JSON.stringify(obj,null, 2)}
        </pre>
        <div>
            <button onClick={() => {
                dynamicInputRef.current?.onSet?.({
                    test:'hello world'
                })
            }}>setData
            </button>
        </div>
    </div>)
}
export default App;