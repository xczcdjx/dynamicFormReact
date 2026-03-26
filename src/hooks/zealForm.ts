import {type SetStateAction, useCallback, useEffect, useMemo, useRef, useState} from "react";
import type {PageModal, ZealPagination} from "@/types/form";

export function useStateCallback<T>(
    initialValue: T
): [T, (value: SetStateAction<T>, cb?: (v: T) => void) => void] {
    const [state, setState] = useState<T>(initialValue)
    const cbRef = useRef<null | ((v: T) => void)>(null)

    useEffect(() => {
        if (cbRef.current) {
            cbRef.current(state)
            cbRef.current = null
        }
    }, [state])

    const setStateCallback = useCallback((value: SetStateAction<T>, cb?: (v: T) => void) => {
        cbRef.current = cb || null
        setState(value)
    }, [])

    return [state, setStateCallback]
}

export function usePagination(
    cb?: (pageNo: number, pageSize?: number) => void,
    options?: Partial<Omit<ZealPagination, "onChange" | "onPageSizeChange" | "setTotalSize">>
) {
    const initialPageModal: PageModal = {
        pageNo: options?.pageNo ?? 1,
        pageSize: options?.pageSize ?? 25,
        total: options?.total ?? 0,
    };
    const [pageModal, setPageModal] = useStateCallback<PageModal>(initialPageModal);
    const pageModalRef = useRef<PageModal>(initialPageModal);

    function setPageNo(pageNo: number, skip?: boolean) {
        setPageModal(p => ({
            ...p, pageNo
        }), pm => {
            pageModalRef.current = pm
            if (skip) return
            cb?.(pm.pageNo, pm.pageSize ?? pageModal.pageSize);
        })
    }

    function setPageSize(pageSize: number) {
        setPageModal(p => ({
            ...p, pageSize
        }), pm => {
            pageModalRef.current = pm
            cb?.(pm.pageNo, pm.pageSize ?? pageModal.pageSize);
        })
    }

    function setTotal(total: number) {
        setPageModal(p => ({
            ...p, total
        }), pm => pageModalRef.current = pm)
    }

    const pagination = useMemo<ZealPagination>(
        () => ({
            ...pageModal,
            showSizePicker: options?.showSizePicker ?? true,
            pageSizes: options?.pageSizes ?? [25, 50, 100, 200],
            pageSlot: options?.pageSlot ?? 5,
            layout: options?.layout ?? "total, prev, pager, next, sizes, jumper",

            onChange(nextPageNo, nextPageSize) {
                setPageNo(nextPageNo);
                if (nextPageSize && nextPageSize !== pageModal.pageSize) {
                    setPageSize(nextPageSize);
                }
            },

            onPageSizeChange(nextPageSize) {
                setPageNo(1, true);
                setPageSize(nextPageSize!);
            },

            setTotalSize(totalSize: number) {
                setTotal(totalSize);
            },
        }),
        [pageModal, options]
    );

    return {
        pagination,
        pageModalRef,
        setPageNo,
        setPageSize,
        setTotal,
    };
}