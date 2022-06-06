const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");

module.exports = {
  mode: "development",
  entry: {
    index: "./src/index.js",
    print: "./src/print.js",
  },
  devtool: "inline-source-map",
  devServer: {
    static: "./dist",
  },
  plugins: [
    new HtmlWebpackPlugin({
      // title: "管理输出",
      title: "Development",
    }),
  ],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(__dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  module: {
    rules: [
      // 加载 css，最终放到 html header 标签 style 中
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"], // 顺序不能改
      },
      // 加载 image 图片
      {
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
        type: "asset/resource",
      },
      // 加载 fonts 字体
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: "asset/resource",
      },
      // 支持 csv、tsv
      {
        test: /\.(csv|tsv)$/i,
        use: ["csv-loader"],
      },
      // 支持 xml
      {
        test: /\.xml$/i,
        use: ["xml-loader"],
      },
    ],
  },
};
