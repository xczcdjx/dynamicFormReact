import { useMemo, useState } from "react";
import type {ZealPagination} from "@/types/form";


export function usePagination(
    cb?: (pageNo: number, pageSize?: number) => void,
    options?: Partial<Omit<ZealPagination, "onChange" | "onPageSizeChange" | "setTotalSize">>
) {
    const [pageNo, setPageNo] = useState(options?.pageNo ?? 1);
    const [pageSize, setPageSize] = useState(options?.pageSize ?? 25);
    const [total, setTotal] = useState(options?.total ?? 0);

    const pagination = useMemo<ZealPagination>(
        () => ({
            pageNo,
            pageSize,
            total,
            showSizePicker: options?.showSizePicker ?? true,
            pageSizes: options?.pageSizes ?? [25, 50, 100, 200],
            pageSlot: options?.pageSlot ?? 5,
            layout: options?.layout ?? "total, prev, pager, next, sizes, jumper",

            onChange(nextPageNo) {
                cb?.(nextPageNo, pageSize);
            },

            onPageSizeChange(nextPageSize) {
                cb?.(1, nextPageSize);
            },

            setTotalSize(totalSize: number) {
                setTotal(totalSize);
            },
        }),
        [pageNo, pageSize, total, cb, options]
    );

    return {
        pagination,
        setPageNo,
        setPageSize,
        setTotal,
    };
}