import {useRef, useState} from "react";
import {Button, Input, Radio} from "antd";
import {
    AdDynamicForm,
    type adDynamicFormRef, renderCheckboxGroup, renderDatePicker,
    renderInput,
    renderPopSelect, renderRadioButtonGroup, renderRadioGroup,
    renderSelect, renderSwitch, renderTimePicker,
    renderTreeSelect
} from "@/antd";
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
            allowClear: true,
            searchOnLabel: true,
            options: [
                {f: <b>男</b>, v: 0},
                {f: '女', v: 1}
            ],
            render2: (f) => renderSelect([], {}, f)
        },
        {
            key: "job",
            label: "职业",
            value: null,
            placeholder: '请选择职业',
            labelField: 'f',
            valueField: 'v',
            showSearch: true,
            allowClear: true,
            searchOnLabel: true,
            childField: 'childOptions',
            options: [
                {
                    f: '前端', v: '1', childOptions: [
                        {f: '网页开发', v: '1-1'},
                        {f: '小程序开发', v: '1-2'},
                    ]
                },
                {
                    f: '后端', v: '2', childOptions: [
                        {f: '后台开发', v: '2-1'},
                        {f: '运维', v: '2-2'},
                    ]
                }
            ],
            render2: (f) => renderTreeSelect([], {
                treeDefaultExpandAll: true
            }, f),
        },
        {
            key: "job2",
            label: "职位2",
            value: null,
            labelField: 'l',
            valueField: 'v',
            options: ['Drive My Car', 'Norwegian Wood'].map((label, index) => ({
                l: label,
                v: label,
                children: [
                    {l: 'aaa' + index, v: 'aaa' + index},
                    {l: 'bbb' + index, v: 'bbb' + index},
                ]
            })),
            // mode: 'multiple',
            render2: f => renderPopSelect([], {}, f),
        },
        {
            key: "sex",
            label: "性别",
            labelField: 'label1',
            valueField: 'value1',
            value: null,
            options: [
                {label1: '男', value1: 0}, {label1: '女', value1: 1},
            ],
            render2: f => renderRadioGroup([], {}, f),
        },
        {
            key: "favorite",
            label: "爱好",
            labelField: 'fl',
            valueField: 'fv',
            sort: 1,
            options: [
                {fl: '吃饭', fv: 0},
                {fl: '睡觉', fv: 1},
                {fl: '打豆豆', fv: 2},
            ],
            value: [],
            render2: f => renderCheckboxGroup([], {}, f),
        },
        {
            key: "admin",
            label: "管理员？",
            value: null,
            render2: f => renderSwitch({}, f),
        },
        {
            key: "birthday",
            label: "生日",
            value: null,
            render2: f => renderDatePicker({showTime: true}, f),
        },
        {
            key: "birthdayT",
            label: "时间",
            value: null,
            render2: f => renderTimePicker({}, f),
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
