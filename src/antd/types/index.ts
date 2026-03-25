import type {ItemsState, PresetType} from "@/types";
import {type DrawerProps, type FormProps, type ModalProps, type PaginationProps, Row, type RowProps} from "antd";
import type {ZealTableSearchSlots} from "@/types/slots.ts";
import type {DyFormItem, ZealPagination} from "@/types/form.ts";
import React, {type ReactNode} from "react";
import type {Rule} from "antd/es/form";
export type RulesMap = Record<string, Rule | Rule[]>;

export type AdDynamicFormProps<Row extends Record<string, any>, RuleT = any> = {
    header?: () => ReactNode;
    footer?: () => ReactNode;

    items: DyFormItem<Row, RuleT>[];

    preset?: PresetType; // 'fullRow' | 'grid'
    formConfig?: FormProps;
    gridConfig?: RowProps;
    validateTrigger?: string | null
    // 字段级 rules（外部覆盖内部 required 自动规则）
    rules?: RulesMap;
};
export type AdPopupModalProps = {
    title?: ReactNode | (() => ReactNode);
    modalProps?: ModalProps;
    to?: string | HTMLElement;
    showClose?: boolean;
    draggable?: boolean;
    closeOnMask?: boolean;
    width?: string | number;
    onCancel?: () => boolean | void | Promise<boolean | void>;
    onSubmit?: () => boolean | void | Promise<boolean | void>;
    footerTxt?: [string, string] | string[];
    modalRender?: ((node: ReactNode) => ReactNode) | undefined
    children?: ReactNode;
};
export type ZealCardSlotArgs = {
    width: number;
    height: number;
    isMobile: boolean;
};

export type ZealCardDefaultArgs = ZealCardSlotArgs & {
    tableHeight: number;
};

export type AntZealCardProps = {
    title?: ReactNode;
    zealHeight?: string;
    outPadding?: number;
    searchBtnTxt?: [string, string] | string[];
    checkWindowSize?: [number, number] | number[];

    header?: (args: ZealCardSlotArgs) => ReactNode;
    footer?: (args: ZealCardSlotArgs) => ReactNode;
    searchForm?: () => ReactNode;
    searchBtn?: () => ReactNode;
    controlBtn?: () => ReactNode;
    toolBtn?: () => ReactNode;
    rest?: () => ReactNode;
    children?: ReactNode | ((args: ZealCardDefaultArgs) => ReactNode);
};
export type AdZealTableSearchProps<Row extends Record<string, any>, RuleT = any> = {
    title?: string;
    drawerTitle?: string;
    searchItemsState: ItemsState<Row, RuleT>;
    searchFormMaxHeight?: string;
    drawerMaxHeight?: number;
    drawerOpenTxt?: string;
    searchBtnTxt?: [string, string] | string[];
    mobileDrawer?: boolean;
    closeDrawerAuto?: boolean;
    drawerConfig?: DrawerProps;
    copyDefault?: boolean;
    isMobile?: boolean;

    onReset?: () => void;
    onSearch?: (data: Row) => void;

    slots?: ZealTableSearchSlots;
};

export type AdZealTableSearchRef<Row extends Record<string, any> = Record<string, any>> = {
    onReset: () => void;
    onSearch: () => void;
    toggleDrawer: (f?: boolean) => void;
    getParams: () => Row;
};
export type AntZealPaginationState = {
    pagination: ZealPagination
    setPageNo: (page: number) => void;
    setPageSize: (pageSize: number) => void;
};
export type AntZealTablePaginationControlProps = {
    paginationModal: AntZealPaginationState;
    onChange: (pageNo: number, pageSize: number) => void;
    pageConfig?: PaginationProps;
    isMobile?: boolean;
    prefix?: (pageModal: ZealPagination) => React.ReactNode;
};