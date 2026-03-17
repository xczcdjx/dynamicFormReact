import {Debounce, getPadY} from "../utils/tools";
import {useEffect, useMemo, useRef, useState} from "react";


function useWindowSize(mobileWidth: number = 756, delay: number = 500) {
    const [winSize, setWinSize] = useState({
        width: window.innerWidth,
        height: window.innerHeight
    })

    const isMobile = useMemo(() => winSize.width <= mobileWidth, [winSize.width, mobileWidth]);

    useEffect(() => {
        const listenSize = Debounce(() => {
            setWinSize({width: window.innerWidth, height: window.innerHeight})
        }, delay)
        window.addEventListener('resize', listenSize)
        return () => {
            window.removeEventListener('resize', listenSize)
        }
    }, [delay])
    return {
        width: winSize.width,
        height: winSize.height,
        isMobile
    }
}

function useObserverSize() {
    const wrapRef = useRef<HTMLDivElement | null>(null);
    const restRef = useRef<HTMLDivElement | null>(null);
    const cardRef = useRef<HTMLDivElement | null>(null);

    const [tableHeight, setTableHeight] = useState(0);

    useEffect(() => {
        let ro: ResizeObserver | null = null;

        const calc = () => {
            const wrap = wrapRef.current;
            const cardEl = cardRef.current;

            if (!wrap || !cardEl) return;

            const wrapInnerH = wrap.clientHeight - getPadY(wrap);

            const restH = restRef.current?.offsetHeight ?? 0;

            const headerWrap =
                (cardEl.querySelector(".ant-card-head") as HTMLElement | null) ?? null;

            const footerWrap =
                (cardEl.querySelector(".ant-card-actions") as HTMLElement | null) ?? null;

            const contentEl =
                (cardEl.querySelector(".ant-card-body") as HTMLElement | null) ?? null;

            const headerH = headerWrap?.offsetHeight ?? 0;
            const footerH = footerWrap?.offsetHeight ?? 0;
            const contentPadY = getPadY(contentEl);

            setTableHeight(
                Math.max(0, wrapInnerH - restH - headerH - footerH - contentPadY)
            );
        };

        calc();

        ro = new ResizeObserver(calc);
        if (wrapRef.current) ro.observe(wrapRef.current);
        if (restRef.current) ro.observe(restRef.current);
        if (cardRef.current) ro.observe(cardRef.current);

        window.addEventListener("resize", calc);

        return () => {
            ro?.disconnect();
            window.removeEventListener("resize", calc);
        };
    }, []);

    return {
        wrapRef,
        cardRef,
        restRef,
        tableHeight,
    };
}

export {
    useWindowSize,useObserverSize
}
