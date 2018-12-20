var __reflect = (this && this.__reflect) || function (p, c, t) {
    p.__class__ = c, t ? t.push(c) : t = [c], p.__types__ = p.__types__ ? t.concat(p.__types__) : t;
};
var __extends = this && this.__extends || function __extends(t, e) { 
 function r() { 
 this.constructor = t;
}
for (var i in e) e.hasOwnProperty(i) && (t[i] = e[i]);
r.prototype = e.prototype, t.prototype = new r();
};
var Luck = (function (_super) {
    __extends(Luck, _super);
    function Luck() {
        var _this = _super.call(this) || this;
        _this.arr_img = [];
        _this.num = 0;
        _this.isjia = true;
        _this.jsq = 0;
        _this.point = []; //结果
        _this.bitmapArr = [];
        _this.init();
        return _this;
    }
    Luck.prototype.init = function () {
        console.log(Main.STAGEWIDTH);
        this.creatbtn();
        this.arr_img = ["xg_png", "ct_png", "lj_png", "zs_png", "my_png", "mg_png", "hua_png", "yy_png", "jct_png", "xr_png"];
        this.setcircle();
        this.tim = new egret.Timer(500, 0);
        this.tim.addEventListener(egret.TimerEvent.TIMER, this.Luckyanimation, this);
    };
    //抽奖按钮
    Luck.prototype.creatbtn = function () {
        //创建存放红色圆和抽奖文字的精灵
        this.btn = new egret.Sprite();
        this.addChild(this.btn);
        this.btn.x = Main.STAGEWIDTH / 2;
        this.btn.y = Main.STAGEHEIGHT / 2;
        this.btn.anchorOffsetX = this.btn.width / 2;
        this.btn.anchorOffsetY = this.btn.height / 2;
        this.btn.touchEnabled = true;
        this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnTap, this);
        //绘制红色的圆并添加到btn中
        var cir = new egret.Shape();
        cir.graphics.beginFill(0xff0000);
        cir.graphics.drawCircle(0, 0, 50);
        cir.graphics.endFill();
        this.btn.addChild(cir);
        //添加抽奖文字
        var cj = new egret.TextField();
        cj.text = '抽奖';
        cj.anchorOffsetX = cj.width / 2;
        cj.anchorOffsetY = cj.height / 2;
        cj.textColor = 0xd8ee1f;
        this.btn.addChild(cj);
    };
    //画圆
    Luck.prototype.setcircle = function () {
        this.getPoint(200, Main.STAGEWIDTH / 2, Main.STAGEHEIGHT / 2, this.arr_img.length);
        console.log(this.point[2].x);
        for (var i = 0; i < this.point.length; i++) {
            var img = new egret.Bitmap();
            img.texture = RES.getRes(this.arr_img[i]);
            img.width = 60;
            img.height = 60;
            img.anchorOffsetX = img.width / 2;
            img.anchorOffsetY = img.height / 2;
            img.x = this.point[i].x;
            img.y = this.point[i].y;
            img.name = i + '';
            this.addChild(img);
            this.bitmapArr.push(img);
        }
    };
    /**
     * 求圆周上等分点的坐标
     * @param r  圆的半径
     * @param ox 圆心坐标x
     * @param oy 圆心坐标y
     * @param count 等分个数
     */
    Luck.prototype.getPoint = function (r, ox, oy, count) {
        var radians = (Math.PI / 180) * Math.round(360 / count); //弧度
        for (var i = 0; i < count; i++) {
            var x = ox + r * Math.sin(radians * i);
            var y = oy + r * Math.cos(radians * i);
            this.point.unshift({ x: x, y: y }); //为保持数据顺时针
        }
    };
    //点击开始抽奖
    Luck.prototype.onbtnTap = function () {
        this.btn.removeEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnTap, this);
        console.log('抽奖');
        this.Getrandom();
        this.tim.start();
        this.isjia = true;
        this.jsq = 0;
    };
    //抽奖动画特效
    Luck.prototype.Luckyanimation = function () {
        this.num++;
        if (this.num >= this.arr_img.length)
            this.num = 0;
        this.creatfilter(this.bitmapArr[this.num == 0 ? this.arr_img.length - 1 : this.num - 1], this.bitmapArr[this.num]);
        //实现由慢到快,再由快到慢的过程
        // this.tim.delay-=10;
        // console.log(this.tim.delay)
        if (this.tim.delay > 30 && this.isjia) {
            this.tim.delay -= 30;
        }
        else {
            this.jsq++;
        }
        if (this.jsq >= 100) {
            this.isjia = false;
            this.tim.delay += 20;
        }
        if (!this.isjia && this.num == this.rad && this.tim.delay > 400) {
            this.tim.stop();
            this.btn.addEventListener(egret.TouchEvent.TOUCH_TAP, this.onbtnTap, this);
        }
    };
    //获取随机出现的值
    Luck.prototype.Getrandom = function () {
        this.rad = Math.floor(Math.random() * this.arr_img.length);
    };
    //设置滤镜
    Luck.prototype.creatfilter = function (bitmap0, bitmap) {
        var color = 0x33CCFF; /// 光晕的颜色，十六进制，不包含透明度
        var alpha = 0.8; /// 光晕的颜色透明度，是对 color 参数的透明度设定。有效值为 0.0 到 1.0。例如，0.8 设置透明度值为 80%。
        var blurX = 35; /// 水平模糊量。有效值为 0 到 255.0（浮点）
        var blurY = 35; /// 垂直模糊量。有效值为 0 到 255.0（浮点）
        var strength = 2; /// 压印的强度，值越大，压印的颜色越深，而且发光与背景之间的对比度也越强。有效值为 0 到 255。暂未实现
        var quality = 3 /* HIGH */; /// 应用滤镜的次数，建议用 BitmapFilterQuality 类的常量来体现
        var inner = false; /// 指定发光是否为内侧发光
        var knockout = false; /// 指定对象是否具有挖空效果
        var glowFilter = new egret.GlowFilter(color, alpha, blurX, blurY, strength, quality, inner, knockout);
        bitmap0.filters = []; //先清除上一个的发光滤镜,再给当前图片添加
        bitmap.filters = [glowFilter];
    };
    return Luck;
}(egret.DisplayObjectContainer));
__reflect(Luck.prototype, "Luck");
