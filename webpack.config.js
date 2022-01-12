const path = require('path')
const { CleanWebpackPlugin } = require('clean-webpack-plugin');
module.exports = {
    mode: 'production', // 环境
    entry: './index.ts', // 入口文件
    resolve: {
        extensions: ['.ts'],
        fallback: {
            path: false
        }
    },    
    output: {
        filename: '[name].js',// 生成的fiename需要与package.json中的main一致
        path: path.resolve(__dirname, 'dist'),
        libraryTarget: 'commonjs',
    },
    plugins: [
        new CleanWebpackPlugin({
            cleanOnceBeforeBuildPatterns: path.resolve(__dirname, 'dist')
        }), // 清除上一次打包内容
    ],
    module: {
        rules: [
            {
                test: /\.ts?$/,
                use: [
                    {
                        loader: 'ts-loader',
                        options: {
                            // 指定特定的ts编译配置，为了区分脚本的ts配置
                            configFile: path.resolve(__dirname, './tsconfig.json'),
                        },
                    },
                ],
                exclude: /node_modules/,
            },
        ],
    },
    externals: {
        // 不参与打包编译
    },
}