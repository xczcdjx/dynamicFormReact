# dynamicformdjx-react

基于 **React** 的动态表单输入组件。

[//]: # (React 版本)

Vue3 版本 [Document](https://xczcdjx.github.io/dynamicFormDoc/)

[Vue2 版本](https://www.npmjs.com/package/dynamicformdjx-vue2) (正在适配)


## 安装

```bash
# 任意一种
npm install dynamicformdjx-react
# or
yarn add dynamicformdjx-react
# or
pnpm add dynamicformdjx-react
```

### 基本使用
```tsx
import {useState} from "react";
import {DynamicInput,dynamicFormRef} from "dynamicformdjx-react";

function App() {
    const [obj,setObj]=useState<Record<string, any>>({
        a: 'Hello world',
        b: 1314,
        c: [5, 2, 0]
    });
    const dynamicInputRef=useRef<dynamicFormRef>(null)
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
```

### 级联基本使用
```tsx
import {useState} from "react";
import {DynamicCascadeInput,dynamicCascadeInputRef} from "dynamicformdjx-react";
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
```