import React, {
    forwardRef,
    useEffect,
    useImperativeHandle, useRef,
    useState,
} from "react";
import {Button, Drawer} from "antd";
import {useDyForm} from "@/hooks/useDyForm";
import AdDynamicForm from "./AdDynamicForm";
import {Pagination} from "antd";
import type {AdZealTableSearchProps, AdZealTableSearchRef, AntZealTablePaginationControlProps} from "@/antd/types";


function InnerAdZealTableSearch<Row extends Record<string, any>, RuleT = any>(
    props: AdZealTableSearchProps<Row, RuleT>,
    ref: React.ForwardedRef<AdZealTableSearchRef<Row>>
) {
    const {
        title,
        drawerTitle,
        searchItemsState,
        searchFormMaxHeight = "200px",
        drawerMaxHeight = 420,
        drawerOpenTxt = "Search Drawer",
        searchBtnTxt = ["Reset", "Search"],
        mobileDrawer = true,
        closeDrawerAuto = true,
        copyDefault = false,
        isMobile = false,
        onReset,
        onSearch,
        slots,
        drawerConfig
    } = props;

    const [drawShow, setDrawShow] = useState(false);
    const [copyData, setCopyData] = useState<Record<string, any>>({});
    const useForm = useDyForm<Row, RuleT>(searchItemsState);
    const [searchItems] = searchItemsState;

    const toggleDrawer = (f?: boolean) => {
        setDrawShow((prev) => (typeof f === "boolean" ? f : !prev));
    };

    const handleReset = () => {
        if (copyDefault) {
            useForm.setValues(copyData as Partial<Row>);
        } else {
            useForm.onReset(null);
        }
        onReset?.();
        toggleDrawer(false);
    };

    const handleSearch = () => {
        const data = useForm.getValues() ?? {};
        onSearch?.(data as Row);
        toggleDrawer(false);
    };

    useEffect(() => {
        if (!closeDrawerAuto) return;
        if (!isMobile) {
            toggleDrawer(false);
        }
    }, [isMobile, closeDrawerAuto]);

    useEffect(() => {
        if (copyDefault) {
            const values = useForm.getValues() ?? {};
            setCopyData(values);
        }
    }, [copyDefault]);

    useImperativeHandle(ref, () => ({
        onReset: handleReset,
        onSearch: handleSearch,
        toggleDrawer,
        getParams: () => useForm.getValues() as Row,
    }));

    const [rTxt, sTxt] = searchBtnTxt;

    const renderSearchBtns = () => {
        if (slots?.searchBtn) {
            return slots.searchBtn({
                onSearch: handleSearch,
                onReset: handleReset,
            });
        }

        return (
            <div className="searchBtn">
                <Button size="small" onClick={handleReset}>
                    {rTxt}
                </Button>
                <Button type="primary" size="small" onClick={handleSearch}>
                    {sTxt}
                </Button>
            </div>
        );
    };

    const normalMode = !mobileDrawer || !isMobile;

    return (
        <div className="adZealTableSearch">
            {normalMode ? (
                <>
                    {slots?.title?.() ?? <div className="naiTitle">{title}</div>}

                    <div
                        className="searchForm"
                        style={{
                            maxHeight: searchFormMaxHeight,
                        }}
                    >
                        <AdDynamicForm
                            key="desktop-form"
                            items={searchItems}
                            preset="grid"
                            formConfig={{
                                // labelPlacement: "left",
                            }}
                        />
                    </div>

                    {renderSearchBtns()}
                </>
            ) : (
                <div className="drawerSearchBtn">
                    {slots?.title?.() ?? <div className="naiTitle">{title}</div>}
                    {slots?.drawerBtn ? (
                        slots.drawerBtn({
                            openDrawer: () => toggleDrawer(true),
                        })
                    ) : (
                        <Button size="small" onClick={() => toggleDrawer(true)}>
                            {drawerOpenTxt}
                        </Button>
                    )}
                </div>
            )}

            <Drawer
                className="adZealSearchDrawer"
                title={drawerTitle ?? title}
                placement="top"
                open={drawShow}
                onClose={() => toggleDrawer(false)}
                height={drawerMaxHeight}
                footer={renderSearchBtns()}
                destroyOnHidden={false}
                maskClosable
                {...drawerConfig}
            >
                <div className="searchForm">
                    <AdDynamicForm
                        key={isMobile ? "mobile-form" : "desktop-hidden-form"}
                        items={searchItems}
                        formConfig={{
                            size: "small",
                        }}
                    />
                </div>
            </Drawer>
        </div>
    );
}

export const AdZealTableSearch = forwardRef(InnerAdZealTableSearch) as <
    Row extends Record<string, any>,
    RuleT = any
>(
    props: AdZealTableSearchProps<Row, RuleT> & {
        ref?: React.Ref<AdZealTableSearchRef<Row>>;
    }
) => React.ReactElement;

// pagination

export function AdZealTablePaginationControl(
    props: AntZealTablePaginationControlProps
) {
    const {
        paginationModal,
        onChange,
        pageConfig,
        isMobile = false,
        prefix,
    } = props;
    const {pagination, setPageSize, setPageNo} = paginationModal
    const skipNextChangeRef = useRef(false);

    return (
        <div className="adZealTablePaginationControl">
            {prefix ? prefix(pagination) : null}

            <Pagination
                size={isMobile ? 'small' : 'default'}
                current={pagination.pageNo}
                pageSize={pagination.pageSize}
                total={pagination.total}
                pageSizeOptions={pagination.pageSizes?.map(String)}
                showSizeChanger={prefix && isMobile ? false : pagination.showSizePicker}
                showLessItems={isMobile}
                onChange={(page, size) => {
                    if (skipNextChangeRef.current) {
                        skipNextChangeRef.current = false;
                        return;
                    }
                    setPageNo(page);
                    if (size && size !== pagination.pageSize) {
                        setPageSize(size);
                    }
                    pagination.onChange(page, size);
                    onChange?.(page, size);
                }}
                onShowSizeChange={(_, size) => {
                    skipNextChangeRef.current = true;
                    setPageNo(1);
                    setPageSize(size);
                    pagination.onPageSizeChange?.(size);
                    onChange?.(1, size);
                }}
                {...pageConfig}
            />
        </div>
    );
}