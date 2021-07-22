(function (){
    function LazyImage(options){
        return new LazyImage.prototype.init(options)
    }
    LazyImage.prototype = {
        constructor: LazyImage,
        init:function init(options){

        },
    }
    LazyImage.prototype.init.prototype = LazyImage.prototype
    if(typeof window!=='undefined'){
        window.LazyImage = LazyImage
    }
    if(typeof module==='object' && typeof module.exports==='object'){
        //支持commonjs和es6module规范
        module.exports = LazyImage
    }
})()