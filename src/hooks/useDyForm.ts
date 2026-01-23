import {useEffect, useState, useCallback, useMemo, useRef, type Dispatch, type SetStateAction} from "react";
import type {DyFormItem} from "@/types/form";


type Options = {
    syncFromRaw?: boolean;
};

export function useReactiveForm<T extends Record<string, any>, U = any>(
    rawItems: DyFormItem<T, U>[],
    options: Options = {}
) {
    const [items, setItems] = useState<DyFormItem<T, U>[]>(() => rawItems);

    useEffect(() => {
        if (!options.syncFromRaw) return;
        setItems(rawItems);
    }, [options.syncFromRaw, rawItems]);
    return [items, setItems] as const;
}


type KeyOf<T> = Extract<keyof T, string>;
type ItemsState<Row extends Record<string, any>, RuleT = any> = readonly [
    DyFormItem<Row, RuleT>[],
    Dispatch<SetStateAction<DyFormItem<Row, RuleT>[]>>
];

export function useDyForm<Row extends Record<string, any>, RuleT = any>(
    itemsState: ItemsState<Row, RuleT>
) {
    const [items, setItems] = itemsState;

    // 避免闭包拿旧数据
    const itemsRef = useRef(items);
    useEffect(() => {
        itemsRef.current = items;
    }, [items]);

    const getItems = useCallback(() => itemsRef.current, []);

    const setDisabled = useCallback((disabled: boolean, keys?: KeyOf<Row>[]) => {
        const ks = keys?.length ? new Set(keys as string[]) : null;
        setItems((prev) =>
            prev.map((it) => {
                const k = it.key as string;
                if (!ks || ks.has(k)) return {...it, disabled};
                return it;
            })
        );
    }, [setItems]);

    const setHidden = useCallback((hidden: boolean, keys?: KeyOf<Row>[]) => {
        const ks = keys?.length ? new Set(keys as string[]) : null;
        setItems((prev) =>
            prev.map((it) => {
                const k = it.key as string;
                if (!ks || ks.has(k)) return {...it, hidden};
                return it;
            })
        );
    }, [setItems]);

    const setValue = useCallback(
        <K extends KeyOf<Row>>(key: K, value: Row[K]) => {
            setItems((prev) =>
                prev.map((it) => (it.key === key ? ({...it, value} as any) : it))
            );
        },
        [setItems]
    );

    const setValues = useCallback(
        (patch: Partial<{ [K in KeyOf<Row>]: Row[K] }>) => {
            setItems((prev) =>
                prev.map((it) => {
                    const k = it.key as KeyOf<Row>;
                    if (k in patch) return {...it, value: (patch as any)[k]} as any;
                    return it;
                })
            );
        },
        [setItems]
    );

    const getItem = useCallback(
        <K extends KeyOf<Row>>(key: K) =>
            getItems().find((i) => i.key === key) as DyFormItem<Row, RuleT> | undefined,
        [getItems]
    );

    const getValue = useCallback(
        <K extends KeyOf<Row>>(key: K): Row[K] | undefined => {
            const it = getItem(key);
            return it ? (it.value as any) : undefined; // ✅ 一层 value
        },
        [getItem]
    );

    const getValues = useCallback(
        <K extends KeyOf<Row>>(keys?: readonly K[]) => {
            const ks = keys?.length ? new Set(keys as readonly string[]) : null;
            return getItems().reduce((p, c) => {
                const k = c.key as string;
                if (!ks || ks.has(k)) (p as any)[k] = (c as any).value; // ✅ 一层 value
                return p;
            }, {} as Partial<Pick<Row, K>> & Record<string, any>);
        },
        [getItems]
    );

    const onReset = useCallback(
        (value: any = null) => {
            setItems((prev) => prev.map((it) => ({...it, value} as any)));
        },
        [setItems]
    );

    const setItem = useCallback(
        <K extends KeyOf<Row>>(k: K, patchItem: Partial<Omit<DyFormItem<Row, RuleT>, "key">>) => {
            setItems((prev) =>
                prev.map((it) => {
                    if (it.key !== k) return it;
                    const {key, ...rest} = patchItem as any;
                    return {...it, ...rest};
                })
            );
        },
        [setItems]
    );

    const setItemsPatch = useCallback(
        <K extends KeyOf<Row>>(patch: [K, Partial<Omit<DyFormItem<Row, RuleT>, "key">>][]) => {
            const patchMap = new Map(patch as any);
            setItems((prev) =>
                prev.map((it) => {
                    const p = patchMap.get(it.key as any);
                    if (!p) return it;
                    const {key, ...rest} = p as any;
                    return {...it, ...rest};
                })
            );
        },
        [setItems]
    );

    const updateKeys = useCallback(
        <K extends KeyOf<Row>>(patch: [K, string][]) => {
            const patchMap = new Map(patch as any);
            setItems((prev) =>
                prev.map((it) => {
                    const nextKey = patchMap.get(it.key as any);
                    return nextKey ? ({...it, key: nextKey} as any) : it;
                })
            );
        },
        [setItems]
    );

    return useMemo(
        () => ({
            items,
            setDisabled,
            setHidden,
            setValue,
            setValues,
            getValue,
            getValues,
            onReset,
            getItem,
            setItem,
            setItems: setItemsPatch,
            updateKeys,
        }),
        [
            items,
            setDisabled,
            setHidden,
            setValue,
            setValues,
            getValue,
            getValues,
            onReset,
            getItem,
            setItem,
            setItemsPatch,
            updateKeys,
        ]
    );
}
