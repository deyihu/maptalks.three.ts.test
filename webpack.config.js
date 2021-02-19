const path = require('path');

const webpackconfig = {
    mode: 'development', // 开发模式
    module: {
        rules: [
            {
                test: /\.ts$/,
                exclude: /node_modules/,
                use: ['ts-loader']
            }

        ]
    },
    resolve: {

    },
    entry: {
        main: path.resolve(__dirname, './index.ts')
    }, // 入口文件
    output: {
        filename: 'bundle.js', // 打包后的文件名称
        // publicPath: '../',
        path: path.resolve(__dirname, './dist/') // 打包后的目录
    },
    plugins: [

    ],
    externals: {

    }
};
module.exports = webpackconfig;