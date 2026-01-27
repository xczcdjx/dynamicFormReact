import {useRef, useState} from "react";
import {Button, Input, Radio} from "antd";
import {AdDynamicForm, type adDynamicFormRef, renderInput} from "../../../dist/antd";
import {omitFormCommonKey, OmitValue, useDyForm, useReactiveForm} from "../../../dist";
import type {PresetType} from "../../../dist/types";
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
                display:'flex',
                gap:'5px'
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
