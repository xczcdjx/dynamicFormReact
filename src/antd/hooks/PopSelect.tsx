import React, {type ReactNode, useMemo} from "react";
import {Button, Checkbox, Dropdown, Popover, Space, Typography, Divider} from "antd";
import type {DropdownProps, PopoverProps, MenuProps, ButtonProps} from "antd";

type PropsOf<C> = C extends React.ComponentType<infer P> ? P : never;

export type PopSelectSingleProps = PropsOf<typeof Dropdown>;
export type PopSelectMultipleProps = PropsOf<typeof Popover>;
export type PopSelectOptionProps = PopSelectSingleProps | PopSelectMultipleProps;

type BasicOption = Record<string, any>;
export type SelectOption = BasicOption;

function getField<T extends BasicOption>(opt: T, field: string, fallback: any) {
    return opt?.[field] ?? fallback;
}

function isGroupOption(opt: any) {
    return !!opt && (opt.type === "group" || Array.isArray(opt.children) || Array.isArray(opt.options));
}

function normalizeSelectOptions(options: any[]) {
    return (options ?? []).map((o) => {
        if (isGroupOption(o)) {
            const children = o.children ?? o.options ?? [];
            return {...o, __isGroup: true, __children: children};
        }
        return {...o, __isGroup: false};
    });
}

function getLabelByValue(value: any, options: any[], labelField = "label", valueField = "value"): ReactNode {
    const list = normalizeSelectOptions(options);
    for (const o of list) {
        if (o.__isGroup) {
            for (const c of o.__children) {
                if (getField(c, valueField, c.value) === value) return getField(c, labelField, c.label);
            }
        } else {
            if (getField(o, valueField, o.value) === value) return getField(o, labelField, o.label);
        }
    }
    return "";
}

/** Dropdown */
function buildMenuItems(mOptions: any[], labelF: string, valueF: string) {
    const opts = normalizeSelectOptions(mOptions);
    const keyMap = new Map<string, { value: any; option: any }>();

    const items: MenuProps["items"] = opts.map((it: any, idx: number) => {
        if (it.__isGroup) {
            const groupLabel = getField(it, labelF, it.label);
            const children = (it.__children ?? []).map((x: any, j: number) => {
                const label = getField(x, labelF, x.label);
                const value = getField(x, valueF, x.value);
                const key = `opt-${idx}-${j}`;
                keyMap.set(key, {value, option: x});
                return {key, label, disabled: !!x.disabled};
            });

            return {key: `group-${idx}`, type: "group", label: groupLabel, children};
        }

        const label = getField(it, labelF, it.label);
        const value = getField(it, valueF, it.value);
        const key = `opt-${idx}`;
        keyMap.set(key, {value, option: it});
        return {key, label, disabled: !!it.disabled};
    });

    return {items, keyMap, opts};
}

type PopSelectCoreProps = {
    value?: string | number | null | Array<string | number>;
    onChange?: (next: any) => void;
    options: Array<SelectOption>;
    labelField?: string;
    valueField?: string;
    multiple?: boolean;
    onChangeEx?: (val: any, opt: any) => void;
    /** props */
    dropdownProps?: Omit<DropdownProps, "menu" | "children">;
    popoverProps?: Omit<PopoverProps, "content" | "children">;
    buttonProps?: ButtonProps;
    defaultRender?: ReactNode;
};

export function PopSelect(props: PopSelectCoreProps) {
    const {
        value,
        onChange,
        options,
        labelField = "label",
        valueField = "value",
        multiple,
        onChangeEx,
        dropdownProps,
        popoverProps,
        buttonProps,
        defaultRender,
    } = props;

    const mOptions = options ?? [];
    const isMultiple = multiple ?? Array.isArray(value);

    const {items, keyMap, opts} = useMemo(
        () => buildMenuItems(mOptions, labelField, valueField),
        [mOptions, labelField, valueField]
    );

    const triggerNode = useMemo(() => {
        if (defaultRender) return defaultRender;

        const text: ReactNode = isMultiple
            ? (Array.isArray(value) && value.length ? `已选 ${value.length} 项` : "请选择")
            : value != null
                ? getLabelByValue(value, mOptions, labelField, valueField) || String(value)
                : "请选择";

        return <Button {...buttonProps}>{text}</Button>;
    }, [defaultRender, isMultiple, value, mOptions, labelField, valueField, buttonProps]);

    // 多选：Popover + Checkbox.Group
    if (isMultiple) {
        const flat = opts.flatMap((it: any) => (it.__isGroup ? (it.__children ?? []) : [it]));
        const cur = Array.isArray(value) ? value : [];

        const content = (
            <div style={{maxWidth: 360}}>
                <Checkbox.Group
                    value={cur}
                    onChange={(vals) => {
                        // 1) 回写 Form
                        onChange?.(vals);
                        // 2) 扩展回调：给选中的 option 列表
                        const picked = flat.filter((x: any) => vals.includes(getField(x, valueField, x.value)));
                        onChangeEx?.(vals, picked);
                    }}
                >
                    <Space direction="vertical" size={8} style={{width: "100%"}}>
                        {opts.map((it: any, idx: number) => {
                            if (it.__isGroup) {
                                const groupLabel = getField(it, labelField, it.label);
                                const children = it.__children ?? [];
                                return (
                                    <div key={`g-${idx}`}>
                                        <Typography.Text strong>{groupLabel as any}</Typography.Text>
                                        <div style={{marginTop: 8}}>
                                            <Space wrap>
                                                {children.map((x: any, j: number) => {
                                                    const label = getField(x, labelField, x.label);
                                                    const v = getField(x, valueField, x.value);
                                                    return (
                                                        <Checkbox key={x.key ?? `${idx}-${j}`} value={v}
                                                                  disabled={!!x.disabled}>
                                                            {label as any}
                                                        </Checkbox>
                                                    );
                                                })}
                                            </Space>
                                        </div>
                                        <Divider style={{margin: "12px 0"}}/>
                                    </div>
                                );
                            }

                            const label = getField(it, labelField, it.label);
                            const v = getField(it, valueField, it.value);
                            return (
                                <Checkbox key={it.key ?? `o-${idx}`} value={v} disabled={!!it.disabled}>
                                    {label as any}
                                </Checkbox>
                            );
                        })}
                    </Space>
                </Checkbox.Group>
            </div>
        );

        return (
            <Popover trigger="click" placement={'bottom'} content={content} {...popoverProps}>
                <span style={{display: "inline-block"}}>{triggerNode}</span>
            </Popover>
        );
    }
    const selectedKey: any = useMemo(() => {
        if (value == null) return undefined;
        for (const [k, v] of keyMap.entries()) {
            if (v.value === value) return k;
        }
        return undefined;
    }, [value, keyMap]);
    // const selectedKey = value != null ? valueToKey.get(value) : undefined;
    // 单选：Dropdown menu
    const menu: MenuProps = {
        items,
        onClick: ({key}) => {
            const hit = keyMap.get(String(key));
            if (!hit) return;
            onChange?.(hit.value);              // 1) 回写 Form
            onChangeEx?.(hit.value, hit.option); // 2) 扩展回调
        },
        selectedKeys: selectedKey
    };

    return (
        <Dropdown trigger={["click"]} menu={menu} {...dropdownProps}>
            <span style={{display: "inline-block"}}>{triggerNode}</span>
        </Dropdown>
    );
}
