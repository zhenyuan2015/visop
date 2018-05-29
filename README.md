# visop [![Build Status](https://img.shields.io/circleci/project/vuejs/vue-cli/master.svg)](https://circleci.com/gh/vuejs/vue-cli) [![npm package](https://img.shields.io/npm/v/vue-cli.svg)](https://www.npmjs.com/package/vue-cli)

`Vis`ible `Op`erate。一个可视化管理代码或其他资源的工具，通过 `界面<=>json文件<=>钩子代码<=>代码(资源)` 的方式来实现.


### 工具的术语

- `元素`：代码里的最小功能模块，比如后端的一个接口，前端的一个页面，一个组件，一个数据库表等等，是软件管理的基本单位。一个代码可能有多种类型元素。
- `配置文件`：管理元素的json文件，在代码根目录下的visop里，一个代码可能有多个配置文件组成，每个配置文件管理某一类型的元素。
- `钩子文件`：每个配置文件都有一个钩子文件，内容是一些nodejs代码，用于在增删该查某个配置文件时，触发某些对实际资源操作（比如从模板文件拷贝到代码目录里，修改代码的配置，修改数据库配置等等）。在使用本工具管理资源之前，需要先编写`钩子文件`来**接入**。
- `元素模板`：钩子文件里的代码使用模板来创建元素。

### 工具解决的问题

- `降低软件复杂度`。通过可视化管理代码的方式，80%复杂的代码不需要大部分人了解，一般开发人员只需要关注业务部分即可。
- `降低使用软件或框架的难度`。将软件或框架20%关键业务抽象成元素，在界面增删改查，新增加功能和业务，只需要简单的在界面点击即可，不需要一开始就面对复杂的代码逻辑。
- `经验复用`。将开发过程中的精华经验固化到元素模板里，其他人可以直接使用，而不是在去重新读开发文档或者过多的沟通交流。
- `提高开发和维护的效率`。通过积累元素和模板，使得后续开发可以直接复用已有的元素和模板，提高开发效率。元素化代码本质上类似于微服务的概念，新增元素不影响已有元素的功能，结合每个元素后续会实现自动化测试，保证修改的元素功能正常，从而使得代码维护起来更加方便。
- `降低软件开发成本`。由于软件开发和维护的效率太低，导致现在开发一个软件的成本很高，另外很多软件在升级时比较困难。希望后面能够通过积累不同的元素、组件、系统和框架，来快速开发一个可以方便维护的软件。
- `创造更美好的软件世界`。这个有点虚，也许最终能够实现。重新梳理现有软件，元素化和重新编织组合，将开发者从重复繁琐的码农工作中解放出来，这些重复性工作通过界面点击就可以完成，让程序员去研究和探索新的技术，去发挥自己的创造性价值。让软件对于普通人不再神秘，普通人也可以像使用视频软件一样去编辑一个软件，通过软件去解决现实问题。

### 工具的原则
- `简单方便`。使用简单，接入方便，扩展改造方便。
- `开放开源`。可以与任何技术和系统对接。
- `解决问题`。不是为了做而做，而是为了解决软件开发过程中的问题。


### 安装

Prerequisites: [Node.js](https://nodejs.org/en/) (>=6.x, 8.x preferred), npm version 4+ and [Git](https://git-scm.com/).

``` bash
$ npm install -g visop
```

### Usage

``` bash
$ visop start -p /home/codepath
```

Example:

``` bash
$ cd /home/codepath
$ visop start
```

上面的例子会从 [zhenyuan2015/visop-defaultconfig](https://github.com/zhenyuan2015/visop-defaultconfig)下载visop的配置到指定目录下`./visop/`.

### vue build

Use vue-cli as a zero-configuration development tool for your Vue apps and component, check out the [docs](/docs/build.md).

### Official Templates

The purpose of official Vue project templates are to provide opinionated, battery-included development tooling setups so that users can get started with actual app code as fast as possible. However, these templates are un-opinionated in terms of how you structure your app code and what libraries you use in addition to Vue.js.

All official project templates are repos in the [vuejs-templates organization](https://github.com/vuejs-templates). When a new template is added to the organization, you will be able to run `vue init <template-name> <project-name>` to use that template. You can also run `vue list` to see all available official templates.

Current available templates include:

- [webpack](https://github.com/vuejs-templates/webpack) - A full-featured Webpack + vue-loader setup with hot reload, linting, testing & css extraction.

- [webpack-simple](https://github.com/vuejs-templates/webpack-simple) - A simple Webpack + vue-loader setup for quick prototyping.

- [browserify](https://github.com/vuejs-templates/browserify) - A full-featured Browserify + vueify setup with hot-reload, linting & unit testing.

- [browserify-simple](https://github.com/vuejs-templates/browserify-simple) - A simple Browserify + vueify setup for quick prototyping.

- [pwa](https://github.com/vuejs-templates/pwa) - PWA template for vue-cli based on the webpack template

- [simple](https://github.com/vuejs-templates/simple) - The simplest possible Vue setup in a single HTML file

### Custom Templates

It's unlikely to make everyone happy with the official templates. You can simply fork an official template and then use it via `vue-cli` with:

``` bash
vue init username/repo my-project
```

Where `username/repo` is the GitHub repo shorthand for your fork.

The shorthand repo notation is passed to [download-git-repo](https://github.com/flipxfx/download-git-repo) so you can also use things like `bitbucket:username/repo` for a Bitbucket repo and `username/repo#branch` for tags or branches.

If you would like to download from a private repository use the `--clone` flag and the cli will use `git clone` so your SSH keys are used.

### Local Templates

Instead of a GitHub repo, you can also use a template on your local file system:

``` bash
vue init ~/fs/path/to-custom-template my-project
```

### Writing Custom Templates from Scratch

- A template repo **must** have a `template` directory that holds the template files.

- A template repo **may** have a metadata file for the template which can be either a `meta.js` or `meta.json` file. It can contain the following fields:

  - `prompts`: used to collect user options data;

  - `filters`: used to conditional filter files to render.
  
  - `metalsmith`: used to add custom metalsmith plugins in the chain.

  - `completeMessage`: the message to be displayed to the user when the template has been generated. You can include custom instruction here.

  - `complete`: Instead of using `completeMessage`, you can use a function to run stuffs when the template has been generated.

#### prompts

The `prompts` field in the metadata file should be an object hash containing prompts for the user. For each entry, the key is the variable name and the value is an [Inquirer.js question object](https://github.com/SBoudrias/Inquirer.js/#question). Example:

``` json
{
  "prompts": {
    "name": {
      "type": "string",
      "required": true,
      "message": "Project name"
    }
  }
}
```

After all prompts are finished, all files inside `template` will be rendered using [Handlebars](http://handlebarsjs.com/), with the prompt results as the data.

##### Conditional Prompts

A prompt can be made conditional by adding a `when` field, which should be a JavaScript expression evaluated with data collected from previous prompts. For example:

``` json
{
  "prompts": {
    "lint": {
      "type": "confirm",
      "message": "Use a linter?"
    },
    "lintConfig": {
      "when": "lint",
      "type": "list",
      "message": "Pick a lint config",
      "choices": [
        "standard",
        "airbnb",
        "none"
      ]
    }
  }
}
```

The prompt for `lintConfig` will only be triggered when the user answered yes to the `lint` prompt.

##### Pre-registered Handlebars Helpers

Two commonly used Handlebars helpers, `if_eq` and `unless_eq` are pre-registered:

``` handlebars
{{#if_eq lintConfig "airbnb"}};{{/if_eq}}
```

##### Custom Handlebars Helpers

You may want to register additional Handlebars helpers using the `helpers` property in the metadata file. The object key is the helper name:

``` js
module.exports = {
  helpers: {
    lowercase: str => str.toLowerCase()
  }
}
```

Upon registration, they can be used as follows:

``` handlebars
{{ lowercase name }}
```

#### File filters

The `filters` field in the metadata file should be an object hash containing file filtering rules. For each entry, the key is a [minimatch glob pattern](https://github.com/isaacs/minimatch) and the value is a JavaScript expression evaluated in the context of prompt answers data. Example:

``` json
{
  "filters": {
    "test/**/*": "needTests"
  }
}
```

Files under `test` will only be generated if the user answered yes to the prompt for `needTests`.

Note that the `dot` option for minimatch is set to `true` so glob patterns would also match dotfiles by default.

#### Skip rendering

The `skipInterpolation` field in the metadata file should be a [minimatch glob pattern](https://github.com/isaacs/minimatch). The files matched should skip rendering. Example:

``` json
{
  "skipInterpolation": "src/**/*.vue"
}
```

#### Metalsmith

`vue-cli` uses [metalsmith](https://github.com/segmentio/metalsmith) to generate the project.

You may customize the metalsmith builder created by vue-cli to register custom plugins.

```js
{
  "metalsmith": function (metalsmith, opts, helpers) {
    function customMetalsmithPlugin (files, metalsmith, done) {
      // Implement something really custom here.
      done(null, files)
    }
    
    metalsmith.use(customMetalsmithPlugin)
  }
}
```

If you need to hook metalsmith before questions are asked, you may use an object with `before` key.

```js
{
  "metalsmith": {
    before: function (metalsmith, opts, helpers) {},
    after: function (metalsmith, opts, helpers) {}
  }
}
```

#### Additional data available in meta.{js,json}

- `destDirName` - destination directory name

```json
{
  "completeMessage": "To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev"
}
```

- `inPlace` - generating template into current directory

```json
{
  "completeMessage": "{{#inPlace}}To get started:\n\n  npm install\n  npm run dev.{{else}}To get started:\n\n  cd {{destDirName}}\n  npm install\n  npm run dev.{{/inPlace}}"
}
```

### `complete` function

Arguments:

- `data`: the same data you can access in `completeMessage`:
  ```js
  {
    complete (data) {
      if (!data.inPlace) {
        console.log(`cd ${data.destDirName}`)
      }
    }
  }
  ```

- `helpers`: some helpers you can use to log results.
  - `chalk`: the `chalk` module
  - `logger`: [the built-in vue-cli logger](/lib/logger.js)
  - `files`: An array of generated files
  ```js
  {
    complete (data, {logger, chalk}) {
      if (!data.inPlace) {
        logger.log(`cd ${chalk.yellow(data.destDirName)}`)
      }
    }
  }
  ```

### Installing a specific template version

`vue-cli` uses the tool [`download-git-repo`](https://github.com/flipxfx/download-git-repo) to download the official templates used. The `download-git-repo` tool allows you to indicate a specific branch for a given repository by providing the desired branch name after a pound sign (`#`).

The format needed for a specific official template is:

```
vue init '<template-name>#<branch-name>' <project-name>
```

Example:

Installing the [`1.0` branch](https://github.com/vuejs-templates/webpack-simple/tree/1.0) of the webpack-simple vue template:

```
vue init 'webpack-simple#1.0' mynewproject
```

_Note_: The surrounding quotes are necessary on zsh shells because of the special meaning of the `#` character.


### License

[MIT](http://opensource.org/licenses/MIT)
