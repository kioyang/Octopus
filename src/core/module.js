// 模块

class Module {
    name = 'module';

    description = '所有模块的父类';

    // 与外部通信的接口
    connectOutside = (options) {
        console.log(options);
    }

    // 获取模板字符串
    getTemplateString(options) {
        console.log(options);
    }

    // 渲染模板
    renderTemplate(options) {
        console.log(options);
    }

    // 模板写入文件 传到后端 由后端写入本地
    writeFile(options) {
        console.log(options);
    }

    // 模板eslint校验
    eslintFile(options) {
        console.log(options);
    }

}