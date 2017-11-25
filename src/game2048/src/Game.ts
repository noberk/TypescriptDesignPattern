﻿class GameConfig {
    static animDuration: number = 100
    static canvasWidth: number = 1200
    static canvasHeight: number = 1200
    static bodyPaddingTop: number = 300
}
/**
 *  You can choose one of all difficult to start game , each difficult has different cells
 */
enum Difficult {
    // has 8 * 8 cells 
    Easy,
    // has 4 * 4 cells 
    Normal,
    Hard,
    Expert,
    Boss,
    God
}
/**
 * record which direction key has been pressed
 */
enum Direction {
    Left,
    Up,
    Down,
    Right
}
enum AnimationType {
    linear,
    easeIn,
    easeOut,
    easeInOut,

}
/**
 *there are some beaufully color  
 */
class ColorPan {
    public static Lv1 = "#cdbfb2";
    public static Lv2 = "#b89e8e";
    public static Lv3 = "#f5e280";
    public static Lv4 = "#ba97aa";
    public static Lv5 = "#f8a591";
    public static Lv6 = "#8c6912";
    public static backgroundDivBig = "#b8ac9e";
    public static backgroundDivSmall = "#d5cdc2";
}
/**
 * record users behaviour and operation state 
 */
class Player {
    canInput: boolean = true;
    curInputValue: Direction
    preInputValue: Direction
    historyInputValueList: Array<Direction> = new Array<Direction>();
    nextStep = (dir: Direction) => {

    }
    preStep = () => {

    }

    constructor(canvas: HTMLElement) {
        canvas.addEventListener('mouseup', (ev) => {
            console.log('already clicked')
        })
    }

}

class TileDictionary {

    /**
  * 索引
  */
    index: number = 0;
    /**
    * 数值
    */
    value: number = 0;
    /**
    * 元素宽度
    */
    width: number = 0;
    /**
    * 元素高度
    */
    height: number = 0;
    /**
    * 边框宽度
    */
    borderWidth: number = 0;
    borderHeight: number = 0;
    /**
    * 上偏移
    */
    top: number = 0;
    /**
    * 左偏移
    */
    left: number = 0;

    currentRowIndex(): number {
        return this.index / Constpoint.col;
    }
    currentColIndex(): number {
        return this.index % Constpoint.col;
    }
    currentTableSize(): Table {
        return Constpoint;
    }
    /**
 * 瓦片
 */
    own: HTMLDivElement;

    //更新
    update(): void {
        if (this.own.style.left)
            this.left = parseInt(this.own.style.left);
        if (this.own.style.top)
            this.top = parseInt(this.own.style.top);
        if (this.own.style.right)
            this.top = parseInt(this.own.style.right);
        if (this.own.style.bottom)
            this.top = parseInt(this.own.style.bottom);
    }
}
class Table {
    col: number;
    row: number;
    constructor(col: number, row: number) {
        this.col = col;
        this.row = row;
    }

}
//公开难度
var Constpoint: Table;
class Game {

    inputable: boolean = true
    canAnim: boolean = true;
    Name = "GameObject";
    uIRender: UIRender;
    score: number;
    canvas: HTMLDivElement;
    row: number;
    col: number;
    table: Array<Array<TileDictionary>>;
    cellArray = new Array<TileDictionary>();
    diff: Difficult;
    width: number;
    height: number;
    //开局生成随机多少个瓦片
    ranTileCount = 2;  //有bug 可能生成的元素会在同一个坐标上🐷
    //总数
    public tilesCount: number;

    constructor(canvas: HTMLDivElement, difficult: Difficult) {

        this.setDifficult(difficult);
        this.canvas = canvas;
        this.canvas.tabIndex = 100;
        this.tilesCount = this.row * this.col;
        this.uIRender = new UIRender(this.canvas);
        this.init();
        this.uIRender.createElement(this.width, this.height, this.row, this.col, "div");
        this.canvas.onkeydown = (e) => {
            if (this.inputable) {
                switch (e.keyCode) {//判断e.indexCode
                    //是37: 就左移
                    case 37:

                        console.log("左");
                        if (this.canAnim) {
                            this.cellArray.forEach((ele) => {
                                this.uIRender.TailMove(ele, Direction.Left);
                            });
                        }
                        //有问题.
                        break;
                    //是38: 就上移
                    case 38:
                        console.log("上");

                        break;
                    //是39: 就右移
                    case 39:
                        console.log("右");
                        if (this.canAnim) {
                            this.cellArray.forEach((ele) => {
                                this.uIRender.TailMove(ele, Direction.Right);
                            });
                        }
                        this.uIRender.createNewOne();
                        break;
                    //是40: 就下移
                    case 40:
                        console.log("下");
                        break;
                    default:
                        console.log(e.code);
                }
            }

        }


        this.canvas.onmouseover = this.mouseOver;

    }


    setDifficult(diff: Difficult): void {
        let sideLenOfCell: number = 4;
        let sideLenOfGodMode: number = 100;

        switch (diff) {
            case Difficult.Normal:
                this.row = sideLenOfCell;
                this.col = sideLenOfCell;
                break;
            case Difficult.Easy:
                this.row = sideLenOfCell << 1;
                this.col = sideLenOfCell << 1;
                break;
            case Difficult.Hard:
                this.row = sideLenOfCell << 2;
                this.col = sideLenOfCell << 2;
                break;
            case Difficult.Expert:
                this.row = sideLenOfCell << 3;
                this.col = sideLenOfCell << 3;
                break;
            case Difficult.Boss:
                this.row = sideLenOfCell << 4;
                this.col = sideLenOfCell << 4;
                break;
            case Difficult.God:
                this.row = sideLenOfGodMode;
                this.col = sideLenOfGodMode;
                break;
            default:
        }
        this.diff = diff;
        Constpoint = new Table(this.col, this.row);
    }
    init(): void {

        this.width = GameConfig.canvasWidth;
        this.height = GameConfig.canvasHeight;


        this.table = new Array<Array<TileDictionary>>(this.row);
        let tab = 0;
        //设置 棋盘格初始化数据
        for (let i = 0; i < this.row; i++) {
            let array1 = new Array<TileDictionary>(this.col);
            for (var j = 0; j < array1.length; j++) {
                array1[j] = new TileDictionary();
                array1[j].index = tab;
                tab++;
            }
            this.table[i] = array1;
        }
        //把矩形2维数组转换1维

        // 2 2 1 
        // 1 9 2
        // 4 6 8

        // 2 2 1 1 9 2 4 6 8

        this.table.forEach(element => {
            element.forEach(tile => {
                this.cellArray.push(tile);
            });
        });

        //设置初始化瓦片索引和值      
        for (let i = 0; i < this.ranTileCount; i++) {
            //开始创建2个随机的数字 2或者4
            let tileIndex = Math2048.createRandom(this.tilesCount);
            let tileValue = this.createNumber2or4();
            this.cellArray[tileIndex].value = tileValue;
        }
    }
    mouseOver(mouse: MouseEvent) {
        console.log(mouse.x);
    }

    start() {
        console.dir(this.table);
        console.dir(this.cellArray);
        console.dir(this.tilesCount);
        this.cellArray.forEach((tile) => {
            if (tile.value > 0) {
                this.uIRender.createTail(this.row, this.col, tile);
            }
        })

    }
    /**
    * 创建随机数字 2 or 4
    */
    createNumber2or4(): number {
        var ran = Math2048.createRandom(10);
        var beginRan = ran % 2 == 0 ? 2 : 4;
        return beginRan;

    }


}
class Math2048 {
    public static createRandom(n: number): number {
        return Math.floor(Math.random() * n);
    }
}
class Animation {
    private static linear(t: number, b: number, c: number, d: number): number {
        return c * t / d + b;
    }
    private static easeIn(t: number, b: number, c: number, d: number): number {
        return c * (t /= d) * t + b;
    }
    private static easeOut(t: number, b: number, c: number, d: number): number {
        return -c * (t /= d) * (t - 2) + b;
    }
    private static easeInOut(t: number, b: number, c: number, d: number): number {
        if ((t /= d / 2) < 1) return c / 2 * t * t + b;
        return -c / 2 * ((--t) * (t - 2) - 1) + b;
    }
    /**
     * 
     * @param currentTime（当前时间）
     * @param beginningValue（初始值） 当前的值 
     * @param ChangeInValue（增量） 坐标100px to 200px  公式200-100=100   100px to 150px  公式150-100= 50
     * @param duration (帧率) t++   t<d   值120 每秒
     * @param animType
     * @param divElement (div元素)
     */
    static BeginAnim(currentTime: number, beginningValue: number, ChangeInValue: number, duration: number, animType: AnimationType, divElement: HTMLDivElement): void {

        //var t = 0;
        //var b = parseInt(divElement.style.left);
        //var c = -400;
        //var d = 120;
        var ms = 1000;
        var colseID = setInterval(() => {
            switch (animType) {
                case AnimationType.linear:

                    var val = this.linear(currentTime, beginningValue, ChangeInValue, duration);
                    var str;
                    if (currentTime <= duration) {
                        str = val + "px";
                        if (divElement != null) {
                            divElement.style.left = str;
                        }
                    }
                    currentTime++;
                    if (currentTime == duration) {
                        //  divElement.style.left = str;
                    }

                    break;
                case AnimationType.easeIn:
                    this.easeIn(currentTime, beginningValue, ChangeInValue, duration);
                    break;
                case AnimationType.easeOut:
                    this.easeOut(currentTime, beginningValue, ChangeInValue, duration);
                    break;
                case AnimationType.easeInOut:
                    this.easeInOut(currentTime, beginningValue, ChangeInValue, duration);
                    break;
                default:
                    this.linear(currentTime, beginningValue, ChangeInValue, duration);
                    break;
            }

        }, ms / duration);

        setTimeout(() => { clearInterval(colseID); }, ms);
    }

}
class UIRender {
    private canvasStyle(): any {
        let canvas = document.getElementById('d') as HTMLDivElement;
        canvas.style.width = this.toPx(GameConfig.canvasWidth)
        canvas.style.height = this.toPx(GameConfig.canvasHeight)
    }
    private bodyStyle(): void {
        var body = document.getElementsByTagName('body').item(0);
        body.style.paddingTop = this.toPx(GameConfig.bodyPaddingTop);
        body.style.opacity = '0.9';
        body.style.backgroundImage = 'url(./img/huge2.jpg)';
    }

    private toPx(val: number): string {
        return val + 'px';
    }
    /**
     * 最外层的div容器
     */
    private canvas: HTMLDivElement;
    constructor(canvas: HTMLDivElement) {
        this.canvas = canvas;
        this.backgroundSkin();
        this.bodyStyle();
        this.canvasStyle();
    }



    randomRGB(): string {
        let Max = 2 << 7 - 1;
        let R = Math2048.createRandom(Max);
        let G = Math2048.createRandom(Max);
        let B = Math2048.createRandom(Max);
        return `RGB(${R},${G},${B})`;
    }
    private backgroundSkin() {
        this.canvas.style.backgroundColor = ColorPan.backgroundDivBig;
        this.canvas.style.margin = "auto";
        this.canvas.style.position = "relative";
        this.canvas.style.borderRadius = this.toPx(6)
    }
    public createElement(canvasWidth: number, canvasHeight: number, row: number, col: number, eleName: string): void {

        let borderWidth = canvasWidth * (1 / 6);
        let borderHeight = canvasHeight * (1 / 6);
        let width = (canvasWidth - borderWidth) / col;
        let height = (canvasHeight - borderHeight) / row;
        let pieceOfRectangle = row * col;
        let singleborderWidth = borderWidth / (col + 1);
        let singleborderHeight = borderHeight / (row + 1);


        for (var i = 0; i < pieceOfRectangle; i++) {

            let element = document.createElement(eleName);
            element.style.width = this.toPx(width);
            element.style.height = this.toPx(height);
            element.style.backgroundColor = ColorPan.backgroundDivSmall;
            element.style.borderRadius = this.toPx(10);
            element.style.position = "absolute";

            let x = ((singleborderWidth + ((singleborderWidth + width) * (i % col))));
            element.style.left = this.toPx(x);
            let y = singleborderHeight + (singleborderHeight + height) * (Math.floor(i / col));
            element.style.top = this.toPx(y);

            this.canvas.appendChild(element);

        }
    }
    //随机创建一个新的  "格子""
    public createNewOne(cellArray: Array<TileDictionary>) {
        //找出空的集合
        let emptyIndexArray = new Array<number>();
        for (let i = 0; i < cellArray.length; i++) {
            if (cellArray[i].value == 0)
                emptyIndexArray.push(i)
        }
        //选出用可用的下标
        let ranIndex = Math2048.createRandom(emptyIndexArray.length);
        let availableIndex = emptyIndexArray[ranIndex]

        this.createTail(1,1,)
    }
    public createTail(row: number, col: number, dict: TileDictionary
        , ): HTMLDivElement {
        if (dict == null) {
            console.log("dict is null")
        }
        let index = dict.index;
        let value = dict.value;

        let borderWidth = GameConfig.canvasWidth * (1 / 6);
        let borderHeight = GameConfig.canvasHeight * (1 / 6);
        let width = (GameConfig.canvasWidth - borderWidth) / col;
        let height = (GameConfig.canvasHeight - borderHeight) / row;
        let pieceOfRectangle = row * col;
        let singleborderWidth = borderWidth / (col + 1);
        let singleborderHeight = borderHeight / (row + 1);
        let eleDiv = document.createElement("div");


        eleDiv.style.width = this.toPx(width);
        eleDiv.style.height = this.toPx(height);
        eleDiv.style.backgroundColor = ColorPan.Lv2;
        eleDiv.style.borderRadius = this.toPx(10);
        eleDiv.style.position = "absolute";
        eleDiv.style.lineHeight = this.toPx(height);
        eleDiv.style.textAlign = "center";
        let x = ((singleborderWidth + ((singleborderWidth + width) * (index % col))));
        eleDiv.style.left = this.toPx(x);
        let y = singleborderHeight + (singleborderHeight + height) * (Math.floor(index / col));
        eleDiv.style.top = this.toPx(y);

        dict.own = eleDiv;
        dict.width = width;
        dict.height = height;
        dict.borderWidth = singleborderWidth;
        dict.borderHeight = singleborderHeight;
        dict.left = x;
        dict.top = y;


        var a = document.createElement("a");
        a.style.fontSize = this.toPx(height / 2.5);
        a.innerText = dict.value.toString();
        eleDiv.appendChild(a);
        this.canvas.appendChild(eleDiv);

        return eleDiv;
    }
    TailMove(tile: TileDictionary, dir: Direction): void {
        let frameRate: number = 60;
        if (tile) {
            if (dir != null) {
                if (dir == Direction.Left) {

                    Animation.BeginAnim(0, tile.left, tile.borderWidth - tile.left, frameRate, AnimationType.linear, tile.own);
                    setTimeout(() => {
                        tile.update();
                    }, GameConfig.animDuration);
                }
                if (dir == Direction.Right) {
                    var tileWidth = tile.width + tile.borderWidth;
                    Animation.BeginAnim(0, tile.left, (tileWidth * (tile.currentTableSize().col - 1)) - (tileWidth * tile.currentColIndex()), frameRate, AnimationType.linear, tile.own);
                    setTimeout(() => {
                        tile.update();
                    }, GameConfig.animDuration);
                }
            }

        } else {
            console.log("div不存在");
        }
    }

}

//start

let canvas = document.getElementById('d') as HTMLDivElement
if (canvas != null) {
    let game = new Game(canvas, Difficult.Easy);
    game.start();
    let guan = new Player(canvas);
}
