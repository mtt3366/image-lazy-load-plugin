(function () {
    function LazyImage(options) {
        //这样即能使用函数直接生成实例，又能当作构造函数使用
        return new LazyImage.prototype.init(options);
    }

    LazyImage.prototype = {
        constructor: LazyImage,
        init: function init(options) {//使用jQuery的工厂模式，这个init里的逻辑，其实就相当于原来的构造函数中的逻辑，因为最后要new init

            // init params 合并config
            options = options || {};
            let defaults = {
                context: document,
                attr: 'lazy-image',
                threshold: 1,
                speed: 300,
                callback: Function.prototype
            };
            let config = Object.assign(defaults, options)
            // 把信息挂在到实例上：在其它方法中，基于实例即可获取这些信息
            this.config = config;

            this.imageBoxList = [];

            // 创建监听器
            const oboptions = {
                threshold: [config.threshold]
            };
            this.ob = new IntersectionObserver(changes => {
                changes.forEach(item => {
                    let {
                        isIntersecting,
                        target
                    } = item;
                    if (isIntersecting) {
                        this.singleHandle(target);
                        this.ob.unobserve(target);//已经加载过了，就取消监听
                    }
                });
            }, oboptions);
            this.observeAll();//监听所有
        },
        // 单张图片的延迟加载
        singleHandle: function singleHandle(imgBox) {
            let config = this.config,
                imgObj = imgBox.querySelector('img'),
                trueImage = imgObj.getAttribute(config.attr);
            imgObj.src = trueImage;
            imgObj.removeAttribute(config.attr);
            imgObj.onload = () => {
                imgObj.style.transition = `opacity ${config.speed}ms`;
                imgObj.style.opacity = 1;
                // 回调函数->插件的生命周期函数「回调函数 & 发布订阅」
                config.callback.call(this, imgObj);
            };
        },
        // 监听需要的DOM元素
        observeAll(refresh) {
            let config = this.config,
                allImages = config.context.querySelectorAll(`img[${config.attr}]`);
            [].forEach.call(allImages, item => {
                let imageBox = item.parentNode;
                //list里面已经监听了这个盒子，就不监听了
                if (refresh && this.imageBoxList.includes(imageBox)) return;
                //还没监听的，放到list里面，然后监听，以后用来和refresh对比
                this.imageBoxList.push(imageBox);
                this.ob.observe(imageBox);//监听盒子
            });
        },
        // 刷新：获取新增的需要延迟加载的图片，做延迟加载
        refresh: function refresh() {
            this.observeAll(true);
        }
    };
    //因为我们最后new的是init，所以需要把LazyImage.prototype指定到init上
    LazyImage.prototype.init.prototype = LazyImage.prototype;

    if (typeof window !== "undefined") {
        window.LazyImage = LazyImage;
    }
    if (typeof module === "object" && typeof module.exports === "object") {
        //支持commonjs和es6module规范
        module.exports = LazyImage;
    }
})();