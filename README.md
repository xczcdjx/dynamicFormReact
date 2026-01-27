# dynamicformdjx-react

基于 **React** 的动态表单输入组件。

[Document](https://xczcdjx.github.io/dynamicFormDoc/react/install.html)

[Vue3 版本](https://www.npmjs.com/package/dynamicformdjx)

[Vue2 版本](https://www.npmjs.com/package/dynamicformdjx-vue2) (后续适配)

## 概述

`DynamicForm` 一个灵活且动态的表单组件，使用数组，简化模版操作，提供多种hook快速操作表单等。

- 简化节点代码，快速处理表单
- 提供render2函数渲染表单项，使用函数渲染值或自定义Component函数
- 提供多种hooks函数，快速处理数据值

## 安装

```bash
# 任意一种
npm install dynamicformdjx-react
# or
yarn add dynamicformdjx-react
# or
pnpm add dynamicformdjx-react
```

### 动态表单

#### 与Antd配合

> 需配合antd v5+ 版本以上

##### 简单表单

> 更多render函数请等待后续更新，可直接使用下方自定义渲染

```tsx
import {useRef, useState} from "react";
import {Button, Input, Radio} from "antd";
import {AdDynamicForm, type adDynamicFormRef, renderInput} from "dynamicformdjx-react/antd";
import {omitFormCommonKey, OmitValue, useDyForm, useReactiveForm} from "dynamicformdjx-react";
import type {PresetType} from "dynamicformdjx-react/types";
import type {Rule} from "antd/es/form";

type RowProps = {
    username: string
    password: string
    desc: string
    preset: string
}
const SimpleForm = () => {
    const [presetType, setPresetType] = useState<PresetType>('fullRow')
    const [formItems, setFormItems] = useReactiveForm<RowProps, Rule | Rule[]>([
        {
            key: "username",
            label: "用户名",
            value: "",
            allowClear: true,
            rule: [{required: true, message: 'Please input your username!', validateTrigger: 'onBlur'}],
            render2: f => renderInput({}, f),
            span: 12
        },
        {
            key: "password",
            label: "密码",
            required: true,
            value: "",
            render2: (f) => <Input.Password placeholder="请输入密码" {...OmitValue(f, omitFormCommonKey)}/>,
            span: 8,
            offset: 2,
            sort: 0
        },
        {
            key: "preset",
            label: "表格预设",
            value: "fullRow",
            render2: (f) => <Radio.Group
                value={f.value}
                options={[
                    {value: 'fullRow', label: 'row'},
                    {value: 'grid', label: 'grid'},
                ]}
                onChange={(v) => {
                    setPresetType(v.target.value)
                }}
            />,
        }
    ])
    const useForm = useDyForm([formItems, setFormItems])
    const antdFormRef = useRef<adDynamicFormRef>(null)
    const rules: Partial<Record<keyof RowProps, Rule | Rule[]>> = {
        desc: [{required: true, message: '请输入详情'}]
    }
    return (
        <div className='dynamicFormTest'>
            <AdDynamicForm ref={antdFormRef} rules={rules} validateTrigger={null} items={formItems}
                           preset={presetType}/>
            <div className="footer" style={{
                display: 'flex',
                gap: '5px'
            }}>
                <Button color={'green'} variant={'outlined'} onClick={() => {
                    // const res=antdFormRef.current?.getResult?.()
                    const res = useForm.getValues()
                    console.log(res)
                }}>getData</Button>
                <Button color={'orange'} variant={'outlined'} onClick={() => {
                    useForm.setValues({
                        username: 'antd',
                        password: 'I love you'
                    })
                }}>setData</Button>
                <Button color={'blue'} variant={'outlined'} onClick={() => {
                    antdFormRef.current?.validator().then(v => {
                        console.log(v)
                    }).catch(r => {
                        console.log(r)
                    })
                }}>validator</Button>
                <Button color={'red'} variant={'outlined'} onClick={() => {
                    useForm.onReset()
                }}>reset</Button>
                <Button variant={'outlined'} onClick={() => {
                    useForm.setDisabled(true)
                }}>setDisabled</Button>
            </div>
        </div>
    );
};

export default SimpleForm;

```

##### 自定义表单

```tsx
import {useRef} from "react";
import {Button, Input, Select} from "antd";
import {
    DynamicInput,
    type dynamicInputRef,
    omitFormCommonKey,
    OmitValue,
    useDyForm,
    useReactiveForm
} from "dynamicformdjx-react";
import {AdDynamicForm, type adDynamicFormRef} from "dynamicformdjx-react/antd";
import type {Rule} from "antd/es/form";

type RowProps = {
    username: string
    job: string
    json: object
}
const CustomForm = () => {
    const [formItems, setFormItems] = useReactiveForm<RowProps, Rule | Rule[]>([
        {
            key: "username",
            label: "用户名",
            value: "",
            allowClear: true,
            render2: (f) => <Input placeholder="请输入姓名" {...OmitValue(f, omitFormCommonKey)}/>,
            rule: [
                {
                    required: true,
                    message: 'Please confirm your username!',
                },
                {
                    validator: async (_, value) => {
                        if (!value) return; // 交给 required 处理
                        if (value.length < 3) {
                            throw new Error('至少 3 个字符');
                        }
                    },
                }
            ],
        },
        {
            key: "job",
            label: "职位",
            value: "",
            required: true,
            render2: (f) => <Select
                style={{
                    width: '100%'
                }}
                options={[
                    {value: 'jack', label: 'Jack'},
                    {value: 'lucy', label: 'Lucy'},
                    {value: 'Yiminghe', label: 'yiminghe'},
                    {value: 'disabled', label: 'Disabled', disabled: true},
                ]}
            />,
        },
        {
            key: "json",
            label: "Json",
            value: {},
            isCustom: true,
            rule: [
                {
                    required: true,
                    message: 'json 不能为空'
                },
                {
                    validator: async (_, value) => {
                        if (!value || Object.keys(value).length === 0) {
                            throw new Error('json 不能为空');
                        }
                    },
                }
            ],
            render2: f => {
                return <DynamicInput ref={dynamicInputRef} value={f.value} onChange={(v: object) => {
                    f.value = v
                }} isController/>
            },
        },
    ])
    const useForm = useDyForm([formItems, setFormItems])
    const antdFormRef = useRef<adDynamicFormRef>(null)
    const dynamicInputRef = useRef<dynamicInputRef>(null)
    return (
        <div className='dynamicFormTest'>
            <AdDynamicForm ref={antdFormRef} items={formItems}/>
            <div className="footer" style={{
                display: 'flex',
                gap: '5px'
            }}>
                <Button color={'green'} variant={'outlined'} onClick={() => {
                    // const res=antdFormRef.current?.getResult?.()
                    const res = useForm.getValues()
                    console.log(res)
                }}>getData</Button>
                <Button color={'orange'} variant={'outlined'} onClick={() => {
                    useForm.setValues({
                        username: 'antd',
                        job: 'jack'
                    })
                    dynamicInputRef.current?.onSet?.({
                        a: 'Hello world',
                        b: 1314,
                        c: [5, 2, 0]
                    })
                }}>setData</Button>
                <Button color={'blue'} variant={'outlined'} onClick={() => {
                    antdFormRef.current?.validator().then(v => {
                        console.log(v)
                    }).catch(r => {
                        console.error(r)
                    })
                }}>validator</Button>
                <Button color={'red'} variant={'outlined'} onClick={() => {
                    useForm.onReset()
                    dynamicInputRef.current?.onSet?.({})
                }}>reset</Button>
            </div>
        </div>
    );
};

export default CustomForm;

```

### 动态录入

> 此录入无需组件库依赖

### 1.单组件

```tsx
import {useState} from "react";
import {DynamicInput, dynamicFormRef} from "dynamicformdjx-react";

function App() {
    const [obj, setObj] = useState<Record<string, any>>({
        a: 'Hello world',
        b: 1314,
        c: [5, 2, 0]
    });
    const dynamicInputRef = useRef<dynamicFormRef>(null)
    return (<div>
        <DynamicInput ref={dynamicInputRef} isController value={obj} onChange={(e) => setObj(e)}/>
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
```

### 2.级联基本使用

```tsx
import {useState} from "react";
import {DynamicCascadeInput, dynamicCascadeInputRef} from "dynamicformdjx-react";

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
        <DynamicCascadeInput ref={dynamicInputRef} isController value={obj} onChange={(e) => setObj(e)}/>
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
```