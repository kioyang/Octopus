const pluginName = 'CleanPlugin';
const fs  = require('fs');
const path  = require('path');


function deleteFolder(path) {
    let files = [];
    if (fs.existsSync(path)) {
        files = fs.readdirSync(path);
        files.forEach(function (file, index) {
            let curPath = path + "/" + file;
            if (fs.statSync(curPath).isDirectory()) {
                deleteFolder(curPath);
            } else {
                fs.unlinkSync(curPath);
            }
        });
        fs.rmdirSync(path);
    }
    console.warn('删除成功:', path);
}

class CleanPlugin {
    constructor(directories) {
        this.directories = directories;
    }
    apply(compiler) {
        compiler.hooks.run.tap(pluginName, () => {
            console.log("webpack 构建过程开始！", this.directories);
            this.directories.forEach((item) => {
                deleteFolder(path.resolve(__dirname, `../${item}`));
            })
        });
    }
}
module.exports = CleanPlugin;
