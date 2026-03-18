import type {ReactNode} from "react";

export type ZealTableSearchSlots = {
    title?: () => ReactNode;
    searchBtn?: (args: { onSearch: () => void; onReset: () => void }) => ReactNode;
    drawerBtn?: (args: { openDrawer: () => void }) => ReactNode;
};