import SingleInput from "./components/singleInput";
import CascadeInput from "./components/cascadeInput";
import SimpleForm from "./components/antd/simpleForm";
import AntdIndex from "./components/antd/AntdIndex";
import {ConfigProvider, theme} from "antd";

function App() {
    return (
        <>
        {/*<ConfigProvider theme={{algorithm: theme.darkAlgorithm}}>*/}
            {/*<SingleInput/>*/}
            {/*<CascadeInput/>*/}
            <AntdIndex/>
        {/*</ConfigProvider>*/}
        </>
    )
}

export default App;