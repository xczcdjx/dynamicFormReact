import type {CSSProperties, ReactNode} from "react";

export interface SelectOptionItem {
    label?: string
    value: any
    // class?: string;
    // style?: string | CSSProperties;
    disabled?: boolean;
}

export interface BaseDyFormItem<T = any> {
    key: keyof T
    label?: string
    value: any
    placeholder?: string
    options?: SelectOptionItem[] | any[]
    onChange?: (value: any, associationItem: DyFormItem, options?: SelectOptionItem[] | any[]) => void
    span?: number
    offset?: number
    sort?: number
}

export interface DyFormItem<K = any, RuleT = any> extends BaseDyFormItem<K> {
    path?: string
    hidden?: boolean
    render2?: (formItem: DyFormItem) => ReactNode
    // reset?: (formItem: DyFormItem) => void
    rule?: RuleT
    required?: boolean
    requiredHint?: (label: string) => string
    disabled?: boolean
    allowClear?: boolean
    // 以下是简化类型
    type?: "text" | "textarea" | "password"
    rows?: number
    labelField?: string
    valueField?: string
    showSearch?: boolean | object
    showCount?: boolean
    mode?: 'multiple' | 'tags'
}

export type PageModal = {
    pageSize: number
    pageNo: number
    total: number
}
export type ZealPagination = {
    showSizePicker: boolean
    pageCount?: number
    pageSizes: number[]
    pageSlot?: number
    onChange: () => void
    onPageSizeChange: () => void
    setTotalSize: (totalSize: number) => void
    layout?: string
} & PageModal

export type ZealColumn<T extends Record<string, any>> = {
    label?: string;
    prop?: keyof T;
    key?: string;
    width?: string | number;
    type?: 'default' | 'selection' | 'index' | 'expand';
    minWidth?: string | number;
    align?: "left" | "center" | "right";
    fixed?: boolean | "left" | "right";
    sortable?: boolean | "custom";
    showOverflowTooltip?: boolean;
    resizable?: boolean;
    render2?: (row: T, $index: number) => ReactNode;
    slot?: string;
};