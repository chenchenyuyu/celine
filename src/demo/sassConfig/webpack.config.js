// webpack.config.js
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const path = require('path');

//加载顺序
// sass-loader->postcss-loader->css-loader->mini-css-extract-plugin
module.exports = {
  module: {
    rules: [
      {
        test: /\.(scss|sass)$/,
        oneOf: [
          // 针对 .module.scss 使用 CSS Modules
          {
            test: /\.module\.(scss|sass)$/,
            use: [
              {
                loader: MiniCssExtractPlugin.loader,
                options: {
                  publicPath: '../', // 调整资源路径
                },
              },
              {
                loader: 'css-loader',
                options: {
                  modules: {
                    localIdentName: '[name]__[local]--[hash:base64:5]',
                    exportLocalsConvention: 'camelCase',
                  },
                  importLoaders: 2, // 在 css-loader 前执行的 loader 数量
                },
              },
              {
                loader: 'postcss-loader',
                options: {
                  postcssOptions: {
                    plugins: [
                      require('autoprefixer'),
                      require('postcss-preset-env')({
                        stage: 3,
                        features: {
                          'nesting-rules': true,
                        },
                      }),
                    ],
                  },
                },
              },
              {
                loader: 'sass-loader',
                options: {
                  implementation: require('sass'), // 使用 Dart Sass
                  sassOptions: {
                    includePaths: [path.resolve(__dirname, 'src/styles')],
                    outputStyle: 'expanded',
                  },
                  additionalData: `
                    @use "@/styles/variables" as *;
                    @use "@/styles/mixins" as *;
                  `,
                },
              },
            ],
          },
          // 普通 Sass 文件
          {
            use: [
              MiniCssExtractPlugin.loader,
              'css-loader',
              'postcss-loader',
              {
                loader: 'sass-loader',
                options: {
                  sassOptions: {
                    includePaths: [path.resolve(__dirname, 'src/styles')],
                  },
                },
              },
            ],
          },
        ],
      },
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: 'assets/css/[name].[contenthash:8].css',
      chunkFilename: 'assets/css/[name].[contenthash:8].chunk.css',
    }),
  ],
  optimization: {
    minimizer: [
      new CssMinimizerPlugin({
        minimizerOptions: {
          preset: [
            'default',
            {
              discardComments: { removeAll: true },
            },
          ],
        },
      }),
    ],
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, 'src'),
    },
  },
};