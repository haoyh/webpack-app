## Webpack

[文档地址](https://webpack.docschina.org/guides/)

### 一、简介

Webpack 是用于 JavaScript 应用程序的*静态模块打包工具*。

在内部从一个或多个入口点构建一个依赖图（dependency graph），将项目中所需的每一个模块组合成一个或多个 bundles，他们均为静态资源。

### 二、核心概念

在开始之前，先上一份基础的 webpack 配置文件

```js
// webpack.config.js

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
  plugins: [new HtmlWebpackPlugin({ title: "Development" })],
  output: {
    filename: "[name].bundle.js",
    path: path.resolve(_dirname, "dist"),
    clean: true,
  },
  optimization: {
    runtimeChunk: "single",
  },
  module: {
    rules: [
      {
        test: /\.css$/i,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
};
```

#### 入口（entry）

指示 webpack 应该使用哪儿个模块，作为构建其内部依赖图的开始。可以指定一个（或多个）不同的入口。

默认值是 `./src/index.js`。

以下列子包含：

- 单入口语法

- 对象语法

  - 该方式扩展性更高：配置重复使用、与其他配置组合使用
  - 插件生成入口时，传入空对象 `{}` 给 `entry`

  对象语法包含的属性：

  - dependOn：当前入口所依赖的入口，必须在该入口加载前被加载
  - filename：指定要输出的文件名称
  - import：启动时需加载的模块
  - library：指定 library 选项，为当前 entry 构建一个 library
  - runtime：运行时 chunk 的名字，如果设置了，就会创建一个新的运行时 chunk，在 webpack 5.43.0 之后可将其设置为 false 避免一个新的运行时 chunk
  - publicPath：当该入口的输出文件在浏览器中被引用时，为它们指定一个公共 URL 地址

  **注意：**

  **1. runtime 和 depondOn 不应在同一个入口上同时使用；**

  **2. runtime 不能指向已存在的入口名称；**

  **3. depondOn 不能是循环引用的;**

配置文件中配置指定文件为入口：

```js
// 单入口（简写）
module.exports = {
  entry: "./src/app.js",
};

// 以上简写形式的完整形式
module.exports = {
  entry: {
    main: "./src/app.js",
  },
};

// 多个文件传递给 entry
module.exports = {
  entry: ["./src/file_1.js", "./src/file_2.js"],
  output: {
    filename: "bundle.js",
  },
};

// 对象语法
module.exports = {
  entry: {
    app: "./src/index.js",
    adminApp: "./src/admin.js",
  },
};
```

#### 输出（output）

设置创建出的 bundle 所在的位置及命名。

**只能指定一个 output 配置**

默认值是 `./dist/main.js`，其他生成文件默认在 `./dist` 目录中。

使用 `publicPath` 设置输出文件 CDN 发布地址。

配置文件中配置：

```js
const path = require("path");

module.exports = {
  entry: {
    app: "./src/app.js",
    search: "./src/search.js",
  },
  output: {
    path: path.resolve(__dirname, "dist"),
    // filename: 'my-first-webpack.bundle.js', // 单入口输出文件
    filename: "[name].js", // 多入口起点，使用占位符确保每个文件具有唯一性
  },
};
```

#### loader

webpack 只能理解 JavaScript 和 JSON 文件。loader 让 webpack 能够处理其他类型的文件，并将他们转换为有效的模块，供应用使用，以及被添加到依赖图中。

loader 有两个属性：

1. `test ` 属性， 识别出哪些文件会被转换；
2. `use ` 属性，定义出在进行转换时，应该使用哪儿个 loader。

##### 使用方式

1. 配置方式（推荐）：在 webpack.config.js 文件中指定 loader

   loader 从右到左（从下到上）的执行，也就是位于后面的 lader 会先执行。

2. 内联方式：在每个 import 语句中显式指定 loader

##### loader 特性

1. 支持链式调用。
2. 可以是同步，也可以是异步的
3. 运行在 Node.js 中，并能够执行任何操作
4. 可以通过 options 对象配置
5. 除了通过 package.json 的 main 来将一个 npm 模块导出为 loader，还可以在 moudle.rules 中使用 loader 字段直接引用一个模块
6. 插件可以为 loader 带来更多特性
7. 能够产生额外的任意文件

_可以通过 loader 的预处理函数，为 JavaScripte 生态系统提供更多能力。灵活的引入细粒度逻辑，例如：压缩、打包、语言转译（或编译）等特性。_

配置文件中配置：

```js
const path = require("path");

module.exports = {
  entry: "./src/app.js",
  output: {
    path: path.resolve(__dirname, "dist"),
    filename: "my-first-webpack.bundle.js",
  },
  module: {
    rules: [
      {
        test: /\.txt$/, // 注意：这里的正则表达式不需要添加引号，此处正则表达式表示：任何以 .txt 结尾的文件
        use: "raw-loader",
      },
      { test: /\.css$/, use: "css-loader" }, // 加载 CSS 文件,需安装 css-loader
      { test: /\.ts$/, use: "ts-loader" }, // 将 TypeScript 转为 JavaScripte，需安装 ts-loader
    ],
  },
};
```

#### 插件（plugin）

插件用于执行范围更广的任务，包括：打包优化、资源管理、注入环境变量。

配置文件中配置：

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');
const webpack = require('webpack');

module.exports = {
  module: {
    rules: [{ test: /\.txt$/, use: 'raw-loader'}],
  }
  plugins: [
  	// 编译过程中的进度报告
  	new webpack.ProgressPlugin(),
  	// 为应用程序生成一个 HTML 文件，并自动将生成的所有 bundle 注入到此文件中
  	new HtmlWebpackPlugin({ template: './ser/index.html'})
  ],
}
```

#### 模式（mode）

通过选择 `development`，`pruduction` 或 `none` 之中的一个，来设置 `mode` 参数，启用 webpack 内置在相应环境下的优化，默认值为 `pruduction`。

配置文件中配置：

```js
module.exports = {
  mode: "production",
};
```

#### 浏览器兼容性（browser compatibility）

Webpack 支持所有符合 ES5 标准的浏览器（）。webpack 的 import() 和 require.ensure() 需要 Promise 。想要支持旧版本浏览器，在使用这些表达式之前，还需要提前加载 polyfill。

#### 环境（environment）

Webpack 5 运行于 Node.js v10.13.0+ 的版本。

### 三、配置（Configuration）

webpack 的配置文件是 JavaScript 文件，文件导出一个 webpack 配置的对象。webpack 会根据该配置定义的属性进行处理。

- 多个 target

  可以将单个配置导出为 object，fucntion 或 Promise，还可以将其导出为多个配置。

- 其他配置语言

  支持多种编程和数据语言编写的配置文件。

### 四、模块（Modules）

在模块化编程中，开发者将程序分解为功能离散的 chunk，称之为 模块。

#### webpack 模块：

- ES2015 import 语句
- CommonJS require() 语句
- css 文件中的 @import 语句
- stylesheet `url(...)` 或者 HTML `<img src=...>` 文件中的图片链接

#### 支持的模块类型

- [ECMAScript 模块](https://webpack.docschina.org/guides/ecma-script-modules)
- CommonJS 模块
- AMD 模块
- [Assets](https://webpack.docschina.org/guides/asset-modules)
- WebAssembly 模块

通过 loader 使 webpack 支持多种语言和预处理器语法编写的模版。

### 五、使用

####1. 首先初始化项目

```shell
# mkdir webpack-app
# cd webpack-app
# npm init -y
```

####2.安装及配置

```shell
# npm i webpack webpack-cli // 安装 webpack、webpack-cli
```

在项目中新建目录 `./src`，并在该目录创建文件 index.js

在工程中新建目录 `./dist`，并在该目录中新建文件 index.html

在工程目录中新建 webpack 配置文件：webpack.config.js

```js
// webpack.config.js 内容如下
const path = require("path");

module.exports = {
  entry: {
    app: "./src/index.js",
  },
  output: {
    filename: "main.js",
    path: path.resolve(__dirname, "dist"),
  },
};
```

此时在终端执行：`npx webpack` 会看到目录 dist 中看到生成的 main.js 文件。

`# npx webpack ` // 如果文件 webpack.config.js 存在，则将默认选择使用这个文件，否则按不配置的默认值执行

`# npx webpack --config webpack.config.js` // 指定配置文件

####3.配置 package.json 文件

```json
"scripts": {
    "build": "webpack",
    "test": "echo \"Error: no test specified\" && exit 1"
},
```

在终端执行命令：`npm run build` 同样可以看到打包成功的提示

####4.管理资源

##### a) 图片

在 webpack 5 中使用内置的 Asset Modules

在 webpack.config.js 中配置 rule

```js
module: {
  rules: [
    {
      test: '/\.(png|svg|jpg|jpeg|gif)$/i,
      type: 'asset/resource',
    },
  ]
}
```

#####b) CSS

1. 安装

   `npm install style-loader css-loader`

2. 在 webpack.config.js 中配置 rule

   ```js
   module: {
     rules: [
       {
         test: /\.css$/i,
         use: ["style-loader", "css-loader"], // 顺序不能调换
       },
     ];
   }
   ```

##### c) 字体

在 webpack 5 中使用内置的 Asset Modules

配置 rule

```js
module: {
  rules: [
    {
      test: '/\.(woff|woff2|eot|ttf|otf)$/i,
      type: 'asset/resource',
    },
  ]
}
```

##### d) 其他文件 CSV 、XML

1. 安装

   `npm i csv-loader xml-loader`

2. 在 webpack.config.js 中配置 rule

   ```js
   module: {
     rules: [
       {
         test: /\.(csv|tsv)$/i,
         use: ["csv-loader"],
       },
       {
         test: /\.xml$/i,
         use: ["xml-loader"],
       },
     ];
   }
   ```

#### 5.管理输出

##### HtmlWebpackPlugin

解决入口发生改变后，需要手动修改 index.html 中生成的 bundle 的文件名。

安装

`npm i -D html-webpack-plugin`

配置

```js
const HtmlWebpackPlugin = require('html-webpack-plugin');

entry:{
	...
},
plugins: [
  new HtmlWebpackPlugin({
    title: "管理输出"，
  }),
],
```

执行 `HtmlWebpackPlugin`，会看到会生成 ./dist/index.html 文件。

##### 清理 /dist 目录

在 output 中添加配置

```js
output: {
  ...
	clean: true,
}
```

#### 6.开发环境

##### source map

source map 有许多可用选项

使用 inline-source-map 选项：定位错误代码行

```js
module.exports = {
  entry: {
    ...
  },
  devtool: 'inline-source-map',
  plugins: [
    ...
  ],
}
```

##### watch mode(观察模式)

使用该模式当文件被更新时，代码将被重新编译，不需要手动构建

配置一下内容：

```js
{
  "scripts": [
    "test": ...,
    "watch": "webpack --watch",
    "build": ...,
  ]
}
```

然后运行 `npm run watch` 编译代码。当文件发生变化后，会自动编译，等编译完成手动刷新页面即可看到最新内容。

##### webpack-dev-server

提供了一个基本的 web-server，具有 live reloading 的功能。

首先安装：`npm i -D webpack-dev-server`

修改配置文件：

```js
module.exports = {
  devtools:...,
  devServer: {
  	static: './dist',
	},
  plugins: [
    ...
  ],
  output: {
    ...
  },
  optimization: {
    runtimeChunk: 'single',
  }
}
```

上面配置告知 webpack-dev-server 将 dist 目录下的文件 serve 到 localhost:8080 下。

webpack-dev-server 在编译之后不会写入到任何输出文件，bundle 文件保留在内存中。

在 package.json 中添加

```js
scripts: {
  "test":...,
  "start": "webpack serve --open",
}
```

接下来执行：`npm start` 可以看到浏览器自动加载页面，当文件发生变化会自动编译后重新加载。

##### webpack-dev-middleware

webpack-dev-middleware 是一个封装器。可以把 webpack 处理过的文件发送到一个 server。web-dev-server 在内部使用了它，它可以作为一个单独的 package 来用。

首先安装：`npm i -D express webpack-dev-middleware`

1. 配置

   ```js
   output:{
     ...,
     clean: ...,
     publickPath: '/', // server.js 文件中要使用
   },
   ```

2. 在项目根目录创建 server.js 文件，内容如下：

   ```js
   const express = require("express");
   const webpack = require("webpack");
   const webpackDevMiddleware = require("webpack-dev-middleware");

   const app = express();
   const config = require("./webpack.config.js");
   const compiler = webpack(config);

   // express 使用 webpackDevMiddleware， 并设置配置文件
   app.use(
     webpackDevMiddleware(compiler, {
       publicPath: config.output.publicPath,
     })
   );

   // 将文件 serve 到端口 3000
   app.listen(3000, function () {
     console.log("app listening on port 3000!\n");
   });
   ```

3. package.json 中添加命令

   ```js
   {
     ...
     scripts: {
       "test":...,
       "server": "node server.js",
     }
   }
   ```

4. 执行命令 `npm run server`

### 后续内容待完善

https://webpack.docschina.org/guides/code-splitting/
