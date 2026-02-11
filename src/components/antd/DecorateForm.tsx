import {useDyForm, useReactiveForm} from "@/hooks/useDyForm.ts";
import type {Rule} from "antd/es/form";
import {
    AdDynamicForm,
    type adDynamicFormRef, renderDatePicker, useDecorateForm,
} from "@/antd";
import {useRef} from "react";
import {Button} from "antd";
import dayjs from 'dayjs';
import {datePickerFormat, DATETIME_FORMAT} from "@/constants";

type FormRow = {
    password: string
    job: number
    birthday: string
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
            render2: f => renderDatePicker({type: 'datetime', showTime: true, format: DATETIME_FORMAT}, f),
            formItemProps: {
                ...datePickerFormat({formatStr: DATETIME_FORMAT})
            }
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