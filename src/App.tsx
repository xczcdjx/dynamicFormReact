import DynamicInput from "./origin/DynamicInput";
import {useState} from "react";
// import {DynamicInput,dynamicFormRef} from "../dist";

function App() {
    const [obj,setObj]=useState({a:"123"});
    return (<div>
        <DynamicInput value={obj}/>
    </div>)
}
export default App;