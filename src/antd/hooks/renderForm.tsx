import React, {type ReactNode} from "react";
import {Input, Select, type SelectProps, TreeSelect, type TreeSelectProps} from "antd";
import type {DyFormItem, SelectOptionItem, TreeSelectOption} from "@/types/form";
import type {PasswordProps, TextAreaProps, InputProps} from "antd/es/input";
import {
    PopSelect,
    type PopSelectMultipleProps, type PopSelectOptionProps,
    type PopSelectSingleProps,
    type SelectOption
} from "@/antd/hooks/PopSelect.tsx";

function reactNodeToText(node: ReactNode): string {
    if (node == null || node === false || node === true) return "";
    if (typeof node === "string" || typeof node === "number") return String(node);
    if (Array.isArray(node)) return node.map(reactNodeToText).join("");
    if (React.isValidElement(node)) return reactNodeToText(node.props?.children);
    return "";
}

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
function mergeOptions(arr: TreeSelectOption[], obj: Partial<DyFormItem>, labelFV = 'label') {
    const {labelField, valueField, childField, options = []} = obj
    const opts = arr.length ? arr : options
    const labelF = labelField ?? "label";
    const valueF = valueField ?? "value";
    const childF = childField ?? "children";
    return opts.map((it: any) => {
        const labelNode = it[labelF];
        const next = {
            ...it,
            [labelFV]: labelNode, value: it[valueF],
            searchText: reactNodeToText(labelNode),
        }
        if (Array.isArray(it[childF])) {
            next.children = mergeOptions(it[childF], obj, labelFV)
        }
        return next
    })
}

export function renderSelect(
    options: SelectOptionItem[] = [],
    optionProps: SelectProps = {},
    rf?: DyFormItem
) {
    const {type, key, render2, searchOnLabel, ...resetRf} = (rf ?? {}) as DyFormItem;
    const {labelField, valueField, childField, ...restParams} = resetRf as any
    const sOptions = mergeOptions(options, resetRf)
    const onSearch = (kw: string) => {
        optionProps?.onSearch?.(kw);
        const k = kw.trim().toLowerCase();
        const matched = sOptions.filter((op: any) =>
            (op.searchText ?? "").toLowerCase().includes(k)
        );
        const exact = matched.find((op: any) => (op.searchText ?? "").toLowerCase() === k);
        if (exact) return handleChange(exact.value, exact);
        if (matched.length === 1) return handleChange(matched[0].value, matched[0]);
    };
    const handleChange = (value: string, opt: any) => {
        rf?.onChange?.(value, rf, opt);
        optionProps?.onChange?.(value, opt);
    };
    return <Select {...restParams} options={sOptions} onSearch={searchOnLabel ? onSearch : undefined}
                   optionFilterProp={searchOnLabel ? 'searchText' : undefined} {...optionProps}
                   onChange={handleChange}/>
}

export function renderTreeSelect(
    options: TreeSelectOption[],
    optionProps: TreeSelectProps = {},
    rf?: DyFormItem
) {
    const {type, key, render2, searchOnLabel, ...resetRf} = (rf ?? {}) as DyFormItem;
    const {labelField, valueField, childField, ...restParams} = resetRf as any
    const sOptions = mergeOptions(options, resetRf, 'title')
    const onSearch = (kw: string) => {
        optionProps?.onSearch?.(kw);
        const k = kw.trim().toLowerCase();
        const matched = sOptions.filter((op: any) =>
            (op.searchText ?? "").toLowerCase().includes(k)
        );
        const exact = matched.find((op: any) => (op.searchText ?? "").toLowerCase() === k);
        if (exact) return handleChange(exact.value, rf, exact);
        if (matched.length === 1) return handleChange(matched[0].value, rf, matched[0]);
    };
    const handleChange = (value: string, opt: any, extra: any) => {
        rf?.onChange?.(value, rf, opt);
        optionProps?.onChange?.(value, opt, extra);
    };
    return <TreeSelect {...restParams} treeData={sOptions} onSearch={searchOnLabel ? onSearch : undefined}
                       treeNodeFilterProp={searchOnLabel ? 'searchText' : undefined} {...optionProps}
                       onChange={handleChange}/>
}

// renderPopSelect
export function renderPopSelect(
    options: Array<SelectOption>,
    optionProps?: PopSelectMultipleProps,
    rf?: DyFormItem,
    defaultRender?: ReactNode
): React.ReactElement;

export function renderPopSelect(
    options: Array<SelectOption>,
    optionProps?: PopSelectSingleProps,
    rf?: DyFormItem,
    defaultRender?: ReactNode
): React.ReactElement;

export function renderPopSelect(
    options: Array<SelectOption>=[],
    optionProps: PopSelectOptionProps = {},
    rf?: DyFormItem,
    defaultRender?: ReactNode
) {
    const {labelField, valueField, onChange: rfOnChange, mode, key, ...restRf} = (rf ?? {}) as any;

    // 你原来的 rf.onChange 形态：rfOnChange(val, rf, opt)
    const onChangeEx = (val: any, opt: any) => {
        rfOnChange?.(val, rf, opt);
    };
    const multiple = mode === 'multiple';
    const opts=options.length?options:rf?.options
    // 这里不传 value/onChange！交给 Form.Item 注入
    return (
        <PopSelect
            {...restRf}
            options={opts}
            labelField={labelField}
            valueField={valueField}
            multiple={multiple}
            defaultRender={defaultRender}
            onChangeEx={onChangeEx}
            // 根据 multiple 决定 optionProps 走哪边
            dropdownProps={multiple ? undefined : (optionProps as any)}
            popoverProps={multiple ? (optionProps as any) : undefined}
        />
    );
}
