import './index.less'
import {useRef, useState} from "react";
import {Button, Form, Input, Radio, Select} from "antd";
import {AdDynamicForm, type adDynamicFormRef} from "@/antd";
import {
    DynamicInput,
    type dynamicInputRef,
    omitFormCommonKey,
    OmitValue,
    useDyForm
} from "@/index";
import {useReactiveForm} from "@/hooks/useDyForm";
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
            span: 12
        },
        {
            key: "job",
            label: "职位",
            value: "",
            required: true,
            render2: (f) => <Select
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
            <AdDynamicForm ref={antdFormRef} validateTrigger={null} items={formItems}/>
            <div className="footer">
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
