import React from "react";
import {Input} from "antd";
import type {DyFormItem} from "@/types/form";
import type {PasswordProps, TextAreaProps, InputProps} from "antd/es/input";

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
