### 开始
```bash
  npm i -D babel-cli babel-core babel-preset-env babel-runtime bable-plugin-transform-runtime
```
### 说明
#### babel-cli
babel的cli
#### babel-core
作用是把 `js` 新语法 转为 低版本的 `js` 语法

#### babel-preset-env
每年每个 preset 只编译当年批准的内容。 而 babel-preset-env 相当于 es2015 ，es2016 ，es2017 及最新版本。(官方说明)

#### babel-runtime + babel-plugin-transform-runtime
babel 几乎可以编译所有时新的 `js` 语法，但对于 APIs 来说却并非如此。例如： Promise、Set、Map 等新增对象，Object.assign、Object.entries等静态方法。因此社区出现了两种方案 一种是`babel-polyfill` ,另外一种是`babel-runtime+babel-plugin-transform-runtime`

`babel-polyfill` 的做法是将全局对象通通污染一遍。
`babel-runtime` 的做法是自己手动引入 helper 函数


### 配置
```bash
  /* .babelrc  */
  {
    "presets":["env"],
    "plugins":["transform-runtime"]
  }
```
```json
  /* 修改package.json */
  "script":{
    "start":"babel src/main.js -o dist/bundle.js"
  }
```
### 编写代码
```javascript
  /* src/main.js  新建dist/bundle.js为空*/
  const  sum = 10
  const promise = new Promise()
```
执行 `npm start`

```javascript
  /* 转译后的代码 dist/bundle.js */

  "use strict";

  var _promise = require("babel-runtime/core-js/promise");

  var _promise2 = _interopRequireDefault(_promise);

  function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

  var sum = 10;
  var promise = new _promise2.default();


```
### 心得
理解了babel各个包的来源,足够在项目中使用了,但对其原理还未了解

### 参考文章
> - [babel](https://www.babeljs.cn/)
> - [babel的使用](https://segmentfault.com/a/1190000008159877)
> - [babel到底该如何配置？](https://segmentfault.com/a/1190000011665642)
