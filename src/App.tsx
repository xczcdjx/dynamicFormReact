import DynamicInput from "./origin/DynamicInput";
import {useState} from "react";
// import {DynamicInput,dynamicFormRef} from "../dist";

function App() {
    const [obj,setObj]=useState({a:"123",b:"123",c:["123",321,'323223']});
    return (<div>
        <DynamicInput dyListConfigs={{arraySplitSymbol:'-'}} config={{autoScroll:false}} value={obj} onChange={(e) => setObj(e)}/>
        <pre>
            {JSON.stringify(obj,null, 2)}
        </pre>
    </div>)
}
export default App;