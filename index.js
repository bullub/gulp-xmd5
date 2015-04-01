/**
 * Created by jkxydp on 15/3/25.
 */

var gutil = require('gulp-util'),
    through = require('through2'),
    crypto = require('crypto'),
    path = require('path'),
    fs = require('fs'),
    PluginError = gutil.PluginError,
    _options,
    md5Map,
    projectBase = path.join(__dirname, '../..'),
    _basePath;

module.exports = function(options) {
    _options = options;
    _basePath = path.join(projectBase, options.basePath) + "/";
    md5Map = {};
    return through.obj(calculate, saveFile);
}
/**
 * 计算单个文件的md5并将其插入到md5Map中
 * @param file 输入的文件对象
 * @param encoding 文件的编码格式
 * @param callback 回调
 */
function calculate(file, encoding, callback) {

    if (!file) {
        throw new PluginError('gulp-xmd5', '文件对象为空');
    }

    if(file.isStream()) {
        throw new PluginError('gulp-xmd5', '不支持流格式');
    }

    if(!file.contents) {
        //对目录不进行计算
        callback();
        return ;
    }

    var size = _options.size || 8,  //默认保留后8位
        //计算出当前路径的相对路径
        filePath = file.path.replace(_basePath, "");

    md5Map[filePath] = calculationMD5(file, encoding, size);
    //this.push(file);
    callback();

}

/**
 * 保存到文件中
 * @param callback 保存完成之后的回调
 */
function saveFile(callback) {
    var json;

    if(typeof _options.format === 'string') {
        json = JSON.stringify(md5Map, null, _options.format);
    } else {
        json = JSON.stringify(md5Map);
    }

    fs.writeFile(path.join(_basePath, _options.filename), json, {
        encoding: 'utf-8',
        mode: 777
    }, function(err) {
        if(err) {
            throw err;
        }
        callback();
    });
}

function calculationMD5(file, encoding, size) {
    var md5 = crypto.createHash('md5');
    md5.update(file.contents, encoding);
    return md5.digest('hex').slice(-size);
}