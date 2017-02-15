/* HTML DOM对象初始化及事件绑定 */

var container = document.getElementById("container");
var menu = document.getElementById("menu");
var mainCanvasDiv = document.getElementById("mainCanvasDiv");
var header = document.getElementById("header");
container.style.height = window.innerHeight-48+"px";
container.setAttribute("width",window.innerWidth);

//按钮事件注册
var save = document.getElementById("scrollIn");

// var cmd = document.getElementById("cmd");
// var cmdWindow = document.getElementById("cmdWindow");
// var execute = document.getElementById("execute");
// var cmdInput = document.getElementById("cmdInput");

// console.log(window.innerWidth,document.body.clientWidth);