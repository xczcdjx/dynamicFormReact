import {defineConfig} from 'vite'
import react from '@vitejs/plugin-react'
import dts from 'vite-plugin-dts'
import {libInjectCss} from "vite-plugin-lib-inject-css";
import path from "node:path";
// https://vite.dev/config/
export default defineConfig({
    plugins: [react(), dts({
        tsconfigPath: './tsconfig.app.json',
        // include: ['src'],
        // copyDtsFiles: true,
    }),
        libInjectCss(),],
    resolve: {
        alias: [{find: '@', replacement: path.join(__dirname, './src')}],
        extensions: ['.mjs', '.js', '.ts', '.jsx', '.tsx', '.json'],
    },
    server: {
        port: 6100
    },
    build: {
        outDir: 'dist',
        lib: {
            entry: {
                index: 'src/index.ts',
                antd: 'src/antd/index.ts',
            },
            name: 'DynamicForm',
            formats: ['es', 'cjs'],                // 👈 多入口建议用这两个
            fileName: (format, entryName) => {
                const ext = format === 'es' ? 'mjs' : 'cjs'
                // 核心版放根目录
                if (entryName === 'index') {
                    return `index.${ext}`
                }

                return `${entryName}/index.${ext}`
            },
        },
        rollupOptions: {
            external: [
                'react',
                'react-dom',
                'react/jsx-runtime',
                'react/jsx-dev-runtime',
                'clsx',
            ],
            output: {
                globals: {
                    react: 'React',
                    'react-dom': 'ReactDOM',
                    'react/jsx-runtime': 'jsxRuntime',
                    'react/jsx-dev-runtime': 'jsxDevRuntime',
                    'antd': 'antd',
                },
            },
        },
    },
})
