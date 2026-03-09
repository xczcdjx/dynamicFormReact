import {useDyForm} from "@/hooks/useDyForm.ts";
import type {Rule} from "antd/es/form";
import {
    AdDynamicForm,
    type adDynamicFormRef, useDecorateForm,
    datePickerFormat
} from "@/antd";
import {useRef} from "react";
import {Button} from "antd";
import {DATETIME_FORMAT, TIME_FORMAT} from "@/constants";
import {renderCheckbox, renderDynamicTags, renderInputNumber, renderSlider} from "../../../dist/antd";

type FormRow = {
    password: string
    job: number
    birthday: string
    time: string
    checkbox: boolean
    future: string[]
    slider: number
    inputNumber: number
}
const DecorateForm = () => {
    const [formItems, setFormItems] = useDecorateForm<FormRow, Rule | Rule[]>([
        {
            key: "password",
            label: "密码",
            value: null,
            allowClear: true,
            placeholder: '请输入密码',
            required: true,
            type: 'password',
            renderType: 'renderInput'
        },
        {
            key: "job",
            label: "职位",
            value: null,
            allowClear: true,
            options: ['前端', '后端'].map((label, value) => ({label, value})),
            renderType: 'renderSelect',
        },
        {
            key: "birthday",
            label: "生日",
            value: null,
            // render2: f => renderDatePicker({type: 'datetime', showTime: true, isRange: true}, f),
            renderType: 'renderDatePicker',
            renderProps: {
                type: 'datetime', showTime: true
            },
            formItemProps: {
                ...datePickerFormat({formatStr: DATETIME_FORMAT})
            }
        },
        {
            key: "time",
            label: "时间",
            value: ['00:00:00', '23:59:00'],
            renderType: 'renderDatePicker',
            renderProps: {
                isRange: true,
            },
            formItemProps: {
                ...datePickerFormat({formatStr: TIME_FORMAT})
            }
        },
        {
            key: "future",
            label: "未来",
            value: [
                {label: '你没见过不等于没有', value: 'hello world 1'},
                {
                    label: '不要给自己设限',
                    value: 'hello world 2'
                },
                {
                    label: '不要说连升两级',
                    value: 'hello world 3'
                },
                {
                    label: '直接升到 CEO 都是有可能的',
                    value: 'hello world 4'
                }
            ],
            renderType: 'renderDynamicTags',
        },
        {
            key: "checkbox",
            label: "复选",
            value: true,
            renderType:'renderCheckbox',
            formItemProps: {
                valuePropName: 'checked',
            }
        },
        {
            key: "slider",
            label: "滑块",
            value: 0,
            renderType:'renderSlider'
        },
        {
            key: "inputNumber",
            label: "数字输入",
            value: 20,
            renderType:'renderInput'
        },
    ])
    const useForm = useDyForm([formItems, setFormItems])
    const antdFormRef = useRef<adDynamicFormRef>(null)
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
                        password: 'Antd',
                        job: 0,
                        birthday: '2026-02-11'
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
}
export default DecorateForm;