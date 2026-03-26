import React, {
    useMemo,
    type RefObject,
} from "react";
import {Button, Card} from "antd";
import {useObserverSize, useWindowSize} from "../hooks/useTool";
import type {AntZealCardProps} from "@/antd/types";

export default function AntZealCard(props: AntZealCardProps) {
    const {
        title,
        zealHeight = "100vh",
        outPadding = 20,
        searchBtnTxt = ["Reset", "Search"],
        checkWindowSize = [756, 500],

        header,
        footer,
        searchForm,
        searchBtn,
        controlBtn,
        toolBtn,
        rest,
        children,
    } = props;

    const [mobileWidth = 756, delay = 500] = checkWindowSize;

    const sizeObj = useWindowSize(mobileWidth, delay);
    const {wrapRef, cardRef, restRef, tableHeight} = useObserverSize();

    const slotArgs = useMemo(
        () => ({
            width: sizeObj.width,
            height: sizeObj.height,
            isMobile: sizeObj.isMobile,
        }),
        [sizeObj.width, sizeObj.height, sizeObj.isMobile]
    );

    const [rTxt, sTxt] = searchBtnTxt;

    const renderHeader = () => {
        if (header) {
            return (
                <div className="header">
                    {header(slotArgs)}
                    <div className="controlBtn">
                        <div>{controlBtn?.()}</div>
                        {toolBtn?.()}
                    </div>
                </div>
            );
        }

        return (
            <div className="header">
                <div className="main">
                    <div className="title">{title}</div>
                    <div className="search">
                        {searchForm?.()}
                        {searchBtn?.() ||
                            (searchForm && (
                                <div className="searchBtn">
                                    <Button size="small">{rTxt}</Button>
                                    <Button type="primary" size="small">
                                        {sTxt}
                                    </Button>
                                </div>
                            ))}
                    </div>
                </div>

                <div className="controlBtn">
                    <div>{controlBtn?.()}</div>
                    {toolBtn?.()}
                </div>
            </div>
        );
    };

    const renderBody = () => {
        if (typeof children === "function") {
            return children({
                tableHeight,
                ...slotArgs,
            });
        }
        return children;
    };

    return (
        <div
            className="zealCard"
            style={{
                height: `calc(${zealHeight} - ${outPadding * 2}px)`,
            }}
            ref={wrapRef}
        >

            <Card
                ref={cardRef as RefObject<HTMLDivElement>}
                title={renderHeader()}
                actions={footer ? [footer(slotArgs)] : undefined}
                style={{height: "100%"}}
                styles={{
                    header: {
                        padding:'10px'
                    },
                    body: {
                        padding: '1px',
                        height: tableHeight + 'px',
                        overflowY: 'hidden',
                    },
                }}
            >
                {renderBody()}
            </Card>
            {/*<div className="footer">{footer?.(slotArgs)}</div>*/}
            <div ref={restRef}>{rest?.()}</div>
        </div>
    );
}