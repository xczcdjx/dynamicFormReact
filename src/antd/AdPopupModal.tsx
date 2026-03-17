import {
    forwardRef,
    useImperativeHandle,
    useMemo,
    useState,
    type ReactNode, useRef,
} from "react";
import {Button, Modal} from "antd";
import type {ModalProps} from "antd";
import type {adPopupModalRef} from "@/antd";
import type {DraggableData, DraggableEvent} from 'react-draggable';
import Draggable from 'react-draggable';

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

const AdPopupModal = forwardRef<adPopupModalRef, AdPopupModalProps>(
    (
        {
            title,
            modalProps,
            to,
            showClose = true,
            closeOnMask = true,
            width = "min(1080px,90%)",
            onCancel = () => true,
            onSubmit = () => true,
            footerTxt = ["Cancel", "Submit"],
            draggable,
            modalRender,
            children,
        },
        ref
    ) => {
        const [open, setOpen] = useState(false);
        const [disabled, setDisabled] = useState(true);
        const [bounds, setBounds] = useState({left: 0, top: 0, bottom: 0, right: 0});
        const draggleRef = useRef<HTMLDivElement>(null!);
        const [btnObjLoading, setBtnObjLoading] = useState({
            c: false,
            s: false,
        });

        const toggle = (f?: boolean) => {
            setOpen((prev) => (typeof f === "boolean" ? f : !prev));
        };

        useImperativeHandle(ref, () => ({
            toggle,
        }));

        const mergedModalProps = useMemo<ModalProps>(
            () => ({
                destroyOnHidden: false,
                ...(modalProps ?? {}),
            }),
            [modalProps]
        );

        const handleCancelClick = async () => {
            setBtnObjLoading((prev) => ({...prev, c: true}));
            try {
                const ok = (await onCancel?.()) ?? true;
                if (ok) toggle(false);
            } finally {
                setBtnObjLoading((prev) => ({...prev, c: false}));
            }
        };

        const handleSubmitClick = async () => {
            setBtnObjLoading((prev) => ({...prev, s: true}));
            try {
                const ok = (await onSubmit?.()) ?? true;
                if (ok) toggle(false);
            } finally {
                setBtnObjLoading((prev) => ({...prev, s: false}));
            }
        };
        const onStart = (_event: DraggableEvent, uiData: DraggableData) => {
            const {clientWidth, clientHeight} = window.document.documentElement;
            const targetRect = draggleRef.current?.getBoundingClientRect();
            if (!targetRect) {
                return;
            }
            setBounds({
                left: -targetRect.left + uiData.x,
                right: clientWidth - (targetRect.right - uiData.x),
                top: -targetRect.top + uiData.y,
                bottom: clientHeight - (targetRect.bottom - uiData.y),
            });
        };

        const [cancelTxt, submitTxt] = footerTxt;

        return (
            <Modal
                open={open}
                title={
                    typeof title === "function" ? title() : <div
                        style={{width: '100%', cursor: draggable ? 'move' : 'default'}}
                        onMouseOver={() => {
                            if (!draggable) return
                            if (disabled) {
                                setDisabled(false);
                            }
                        }}
                        onMouseOut={() => {
                            setDisabled(true);
                        }}
                    >
                        {title}
                    </div>
                }
                width={width}
                closable={showClose}
                maskClosable={closeOnMask}
                getContainer={to || undefined}
                onCancel={handleCancelClick}
                modalRender={modalRender ?? ((modal) => (
                    <Draggable
                        disabled={disabled}
                        bounds={bounds}
                        nodeRef={draggleRef}
                        onStart={(event, uiData) => onStart(event, uiData)}
                    >
                        <div ref={draggleRef}>{modal}</div>
                    </Draggable>
                ))}
                footer={
                    <div style={{display: "flex", justifyContent: "flex-end", gap: 8}}>
                        <Button size="small" onClick={handleCancelClick} loading={btnObjLoading.c}>
                            {cancelTxt}
                        </Button>
                        <Button
                            size="small"
                            type="primary"
                            onClick={handleSubmitClick}
                            loading={btnObjLoading.s}
                        >
                            {submitTxt}
                        </Button>
                    </div>
                }
                {...mergedModalProps}
            >
                {children}
            </Modal>
        );
    }
);
export default AdPopupModal;