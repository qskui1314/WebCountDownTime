//倒计时时间
//显示区域大小
var WINDOW_WIDTH = 1920;
var WINDOW_HEIGHT = 1080;
//宽度
var RADIUS = 8;
var MARGIN_TOP = 60;
var MARGIN_LEFT = 30;
//倒计时结束时间
//endTime.setTime(endTime.getTime() + 36000 * 1000); //设置倒计时为十个小时
var endTime = new Date('2019/1/1 00:00:00');//最终时间设定为2019年元旦
var curShowTimeSeconds = 0; //倒计时时间中扣除的
//随机小球的颜色
var balls = [];
const colors = ["#33B5E5", "#0099CC", "#AA66CC", "#9933CC", "#99CC00", "#669900", "#FFBB33", "#FF8800", "#FF4444", "#CC0000"]
//初始化加载部分，用于设定画布位置和大小
window.onload = function() {
  WINDOW_WIDTH = document.body.clientWidth;
  WINDOW_HEIGHT = document.body.clientHeight;
  MARGIN_LEFT = Math.round(WINDOW_WIDTH / 100);
  RADIUS = Math.round(WINDOW_WIDTH * 4 / 5 / 108) - 1;
  MARGIN_TOP = Math.round(WINDOW_HEIGHT / 8);
  var canvas = document.getElementById('canvas');
  var context = canvas.getContext("2d");
  canvas.width = WINDOW_WIDTH;
  canvas.height = WINDOW_HEIGHT;
  //当先显示的时间秒数
  curShowTimeSeconds = getCurrentShowTimeSeconds()
  setInterval(
    function() {
      render(context); //对画布的渲染
      update(); //对显示数据的更新
    },
    50
  );
}
//获取当前显示的时间秒
function getCurrentShowTimeSeconds() {
  var curTime = new Date();
  //当前时间距离结束时间锁剩下的时间
  var ret = endTime.getTime() - curTime.getTime();
  //round用于四舍五入计算
  ret = Math.round(ret / 1000);
  //确保返回值不出现负数
  return ret >= 0 ? ret : 0;
}
//更新时间线
function update() {
  var nextShowTimeSeconds = getCurrentShowTimeSeconds();
  var nextDays = parseInt(nextShowTimeSeconds / 3600 / 24);
  var nextHours = parseInt(nextShowTimeSeconds / 3600);
  var nextMinutes = parseInt((nextShowTimeSeconds - nextHours * 3600) / 60);
  var nextSeconds = nextShowTimeSeconds % 60;
  var curDays = parseInt(curShowTimeSeconds / 3600 / 24);
  var curHours = parseInt(curShowTimeSeconds / 3600);
  var curMinutes = parseInt((curShowTimeSeconds - curHours * 3600) / 60);
  var curSeconds = curShowTimeSeconds % 60;
  //添加小球掉落部分小球，不影响数字部分
  if (nextSeconds != curSeconds) {
    //代表天数的两个数字
    if (parseInt(curDays / 10) != parseInt(nextDays / 10)) {
      addBalls(MARGIN_LEFT + 0, MARGIN_TOP, parseInt(curDays / 10));
    }
    if (parseInt(curDays % 10) != parseInt(nextDays % 10)) {
      addBalls(MARGIN_LEFT + 13 * (RADIUS + 1), MARGIN_TOP, parseInt(curDays % 10));
    }
    //代表小时的两个数字
    if (parseInt(curHours / 10) != parseInt(nextHours / 10)) {
      addBalls(MARGIN_LEFT + 33, MARGIN_TOP, parseInt(curHours / 10));
    }
    if (parseInt(curHours % 10) != parseInt(nextHours % 10)) {
      addBalls(MARGIN_LEFT + 48 * (RADIUS + 1), MARGIN_TOP, parseInt(curHours % 10));
    }
    //代表分钟的两个数字
    if (parseInt(curMinutes / 10) != parseInt(nextMinutes / 10)) {
      addBalls(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes / 10));
    }
    if (parseInt(curMinutes % 10) != parseInt(nextMinutes % 10)) {
      addBalls(MARGIN_LEFT + 84 * (RADIUS + 1), MARGIN_TOP, parseInt(curMinutes % 10));
    }
    //代表秒的两个数字
    if (parseInt(curSeconds / 10) != parseInt(nextSeconds / 10)) {
      addBalls(MARGIN_LEFT + 104 * (RADIUS + 1), MARGIN_TOP, parseInt(curSeconds / 10));
    }
    if (parseInt(curSeconds % 10) != parseInt(nextSeconds % 10)) {
      addBalls(MARGIN_LEFT + 119 * (RADIUS + 1), MARGIN_TOP, parseInt(nextSeconds % 10));
    }
    curShowTimeSeconds = nextShowTimeSeconds;
  }
  updateBalls();
  //console.log(balls.length)
}
//更新小球
function updateBalls() {
  for (var i = 0; i < balls.length; i++) {
    balls[i].x += balls[i].vx;
    var c = 1.0;
    if (balls[i].y + RADIUS + balls[i].vy >= WINDOW_HEIGHT) {
      c = (WINDOW_HEIGHT - (balls[i].y + RADIUS)) / balls[i].vy;
      //console.log(c);
    }
    balls[i].y += balls[i].vy;
    balls[i].vy += c * balls[i].g;;
    if (balls[i].y >= WINDOW_HEIGHT - RADIUS) {
      balls[i].y = WINDOW_HEIGHT - RADIUS;
      balls[i].vy = -Math.abs(balls[i].vy) * 0.75;
    }
  }
  var cnt = 0
  for (var i = 0; i < balls.length; i++)
    if (balls[i].x + RADIUS > 0 && balls[i].x - RADIUS < WINDOW_WIDTH)
      balls[cnt++] = balls[i]
  while (balls.length > Math.min(400, cnt)) {
    balls.pop();
  }
}
//形成运动的小球
function addBalls(x, y, num) {
  for (var i = 0; i < digit[num].length; i++)
    for (var j = 0; j < digit[num][i].length; j++)
      if (digit[num][i][j] == 1) {
        var aBall = {
          x: x + j * 2 * (RADIUS + 1) + (RADIUS + 1),
          y: y + i * 2 * (RADIUS + 1) + (RADIUS + 1),
          g: 1.5 + Math.random(),
          vx: Math.pow(-1, Math.ceil(Math.random() * 1000)) * 4,
          vy: -5,
          color: colors[Math.floor(Math.random() * colors.length)]
        }
        balls.push(aBall)
      }
}
//画出时间的小球
function render(cxt) {
  cxt.clearRect(0, 0, WINDOW_WIDTH, WINDOW_HEIGHT);
  var days = parseInt(curShowTimeSeconds / 3600 / 24);
  var hours = parseInt(curShowTimeSeconds / 3600);
  var minutes = parseInt((curShowTimeSeconds - hours * 3600) / 60)
  var seconds = curShowTimeSeconds % 60
  renderDigit(MARGIN_LEFT, MARGIN_TOP, parseInt(days / 10), cxt)
  renderDigit(MARGIN_LEFT + 13 * (RADIUS + 1), MARGIN_TOP, parseInt(days % 10), cxt)
  renderDigit(MARGIN_LEFT + 26 * (RADIUS + 1), MARGIN_TOP, 10, cxt) /*冒号*/
  renderDigit(MARGIN_LEFT + 33 * (RADIUS + 1), MARGIN_TOP, parseInt((hours%24) / 10), cxt);
  renderDigit(MARGIN_LEFT + 48 * (RADIUS + 1), MARGIN_TOP, parseInt((hours%24) % 10), cxt);
  renderDigit(MARGIN_LEFT + 61 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
  renderDigit(MARGIN_LEFT + 69 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes / 10), cxt);
  renderDigit(MARGIN_LEFT + 84 * (RADIUS + 1), MARGIN_TOP, parseInt(minutes % 10), cxt);
  renderDigit(MARGIN_LEFT + 97 * (RADIUS + 1), MARGIN_TOP, 10, cxt);
  renderDigit(MARGIN_LEFT + 104 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds / 10), cxt);
  renderDigit(MARGIN_LEFT + 119 * (RADIUS + 1), MARGIN_TOP, parseInt(seconds % 10), cxt);
  for (var i = 0; i < balls.length; i++) {
    cxt.fillStyle = balls[i].color;
    cxt.beginPath();
    cxt.arc(balls[i].x, balls[i].y, RADIUS, 0, 2 * Math.PI, true);
    cxt.closePath();
    cxt.fill();
  }
}
//根据矩阵画出小球
function renderDigit(x, y, num, cxt) {
  cxt.fillStyle = "rgb(0,102,153)";
  for (var i = 0; i < digit[num].length; i++)
    for (var j = 0; j < digit[num][i].length; j++)
      if (digit[num][i][j] == 1) {
        cxt.beginPath();
        cxt.arc(x + j * 2 * (RADIUS + 1) + (RADIUS + 1), y + i * 2 * (RADIUS + 1) + (RADIUS + 1), RADIUS, 0, 2 * Math.PI)
        cxt.closePath()
        cxt.fill()
      }
}
