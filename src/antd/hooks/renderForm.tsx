import React from "react";
import {Input, Select, type SelectProps} from "antd";
import type {DyFormItem, SelectOptionItem} from "@/types/form";
import type {PasswordProps, TextAreaProps, InputProps} from "antd/es/input";

// input
export function renderInput(
    optionProps: PasswordProps,
    rf?: DyFormItem
): JSX.Element;
export function renderInput(
    optionProps: TextAreaProps,
    rf?: DyFormItem
): JSX.Element;
export function renderInput(
    optionProps?: InputProps,
    rf?: DyFormItem
): JSX.Element;

export function renderInput(
    optionProps: any = {},
    rf?: DyFormItem
) {
    const {type = "text", key, render2, ...resetRf} = (rf ?? {}) as DyFormItem;

    const handleChange = (e: React.ChangeEvent<any>) => {
        rf?.onChange?.(e.target.value, rf);
        optionProps?.onChange?.(e);
    };

    switch (type) {
        case 'password':
            return <Input.Password {...resetRf} {...optionProps} onChange={handleChange}/>
        case 'textarea':
            return <Input.TextArea {...resetRf} {...optionProps} onChange={handleChange}/>
        default:
            return <Input {...resetRf} {...optionProps} onChange={handleChange}/>
    }
}

// select
function mergeOptions(arr: SelectOptionItem[], obj: Partial<DyFormItem>) {
    const {labelField, valueField} = obj
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    return arr.map((it: any) => ({...it, label: it[labelF], value: it[valueF]}))
}

export function renderSelect(
    options: SelectOptionItem[] = [],
    optionProps: SelectProps = {},
    rf?: DyFormItem
) {
    const {type, key, showSearch, render2, ...resetRf} = (rf ?? {}) as DyFormItem;
    const sOptions = mergeOptions(options, resetRf)
    const handleChange = (value: string, opt: any) => {
        rf?.onChange?.(value, rf, opt);
        optionProps?.onChange?.(value, opt);
    };
    return <Select {...resetRf} options={sOptions} {...optionProps} onChange={handleChange}/>
}