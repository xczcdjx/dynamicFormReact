import {useRef, useState} from "react";
import {Button, Input, Radio} from "antd";
import {AdDynamicForm, type adDynamicFormRef, renderInput, renderSelect} from "@/antd";
import {useDyForm, useReactiveForm} from "@/index";
import type {Rule} from "antd/es/form";

type RowProps = {
    username: string
    password: string
    gender: number
    description: string
    email: string
    birthday: string
    desc: string
    sex: number
    birthdayT: number
    admin: number
    favorite: number[]
    job: number
    job2: number
    job3: number
}
const AllForm = () => {
    const [formItems, setFormItems] = useReactiveForm<RowProps, Rule | Rule[]>([
        {
            key: "username",
            label: "用户名",
            value: "",
            allowClear: true,
            render2: f => renderInput({}, f),
        },
        {
            key: "password",
            label: "密码",
            required: true,
            value: "",
            render2: (f) => renderInput({}, {...f, type: 'password'}),
        },
        {
            key: "gender",
            label: "性别",
            value: null,
            placeholder: '请选择性别',
            labelField: 'f',
            valueField: 'v',
            showSearch: true,
            options: [
                {f: '男', v: 0},
                {f: '女', v: 1}
            ],
            render2: (f) => renderSelect([], {}, f)
        },

    ])
    const useForm = useDyForm([formItems, setFormItems])
    const antdFormRef = useRef<adDynamicFormRef>(null)
    const rules: Partial<Record<keyof RowProps, Rule | Rule[]>> = {
        desc: [{required: true, message: '请输入详情'}]
    }
    return (
        <div className='dynamicFormTest'>
            <AdDynamicForm ref={antdFormRef} rules={rules} items={formItems}/>
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

export default AllForm;
