# gulp-xmd5
用于将指定的文件计算出md5值，然后存放到指定的文件中
使用方法:

1. 安装

    npm install gulp-xmd5 --save-dev
    
2. 使用

var xmd5 = require('gulp-xmd5');

gulp.task('md5', function(){
    
    gulp.src([some-paths])
    
        .pipe(xmd5({
        
            format: "\t",               //可选,若不格式化json则不需要传递
            
            size: 5,                    //可选，默认是8位，统一截取后8位
            
            filename: "manifest.json",  //必传，保存到磁盘上的文件的名字，没有则新建，存在则覆盖
            
            basePath: "path/to"         //必传，保存到磁盘上，相对项目的根路径
            
        }));

});



