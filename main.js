bound = 3;
element = bound * bound; designated = element - 1;
frameGap = 5;
a = []; rn = [];
imgs = ["1.jpg", "2.jpg", "3.jpg", "4.jpg", "5.jpg", "6.jpg", "7.jpg", "8.jpg", "9.jpg"];
perWH = 0; blockInited = false; gaming = false; fullInited = false;
tid = 0; time = 3; step = 0;
sch = scw = 0;
lastmove = 0;

window.onresize = function() {
  sch = document.body.clientHeight;
  scw = document.body.clientWidth;
  if (scw <= 400) {
    $("#all").css("height", "").css("width", "90vw");
    // $("#all").css("left", "5%").css("right", "5%").css("width", "90vw");
  } else {
    $("#all").css("left", "").css("right", "");
    if (scw > sch) {
      // width > height
      $("#all").css("height", "65%");
    } else {
      // width <= height, set width = height
      $("#all").css("height", "55%");
    }
    $("#all").css("width", $("#all").css("height"));
  }

  /*$("center").css({ "font-size": sch * 0.65 * 0.225 * 0.5,
                    "padding-top": sch * 0.65 * 0.225 * 0.25
                  });*/
	$("h1").css({ "font-size": sch * 0.1 + "px",
                "height": sch * 0.067 + "px"
              });
  perWH = (parseFloat($("#all").css("height")) - (bound - 0 + 1) * frameGap) / bound;
  $(".block").css({ "width": perWH + "px",
                    "height": perWH + "px"
                  });
  setTimeout(window.onresize, 500);
  if (!blockInited) return 0;
  for (i = 0; i < element; i++) {
    if (designated == i) continue;
    $("#b" + (i + 1))[0].onresize();
  }
};

window.onload = function() {
  if (localStorage.bound) bound = localStorage.bound - 0;
  element = bound * bound; designated = element - 1;
  window.onresize();
  perWH = (parseFloat($("#all").css("height")) - (bound - 0 + 1) * frameGap) / bound;
  // designated = genRandomNum();
  if (localStorage.img) img = localStorage.img; else {
    img = imgs[parseInt(Math.random() * imgs.length)];
  }

  // generate random nums
  rn = []; // array for random nums

  if (localStorage.a) {
    a = JSON.parse(localStorage.a);
    for (var y = 0; y < bound; y++) {
      for (var x = 0; x < bound; x++) {
        rn[bound * y + x] = ((a[y][x]) ? a[y][x] : element) - 1; // lost that block == designated == element - 1
      }
    }
  } else {
    // initialize the 2d array
    for (i = 0; i < bound; i++) {
      a[i] = [];
    }
    /*
      设两个矩阵A和B。将矩阵从左到右，从上到下排成一个一维数组，设其逆序对的个数加上空白格在原矩阵所在的行列号之和P。
      若P(A)与P(B)的奇偶性相同，则两个矩阵可以通过拼图游戏进行转换。因此只要计算当前矩阵和正确矩阵的P值判断一下即可。
      --- from `http://blog.csdn.net/realmagician/article/details/17395035`
    */
    e0 = (bound - 1) * 2; // the designated element's col & rol id
    var x = 0, y = 0;
    while ((getiSeq(rn) + x + y) % 2 != e0 % 2 ) {
      h = []; // tmp array for checking existence
      //console.log(getiSeq(rn));
      for (i = 0; i < element; i++) {
        n = genRandomNum();
        console.log(h.toString());
        while (h[n]) {
          n = genRandomNum();
        }
        h[n] = 1; rn[i] = n;
        if (n == designated) {
          y = parseInt(i / bound);
          x = i - y * bound;
        }
      }
    }
  }
  // create win tip
  t = document.createElement("div");
  t.id = "win";
  t.style.left = t.style.right = t.style.top = t.style.bottom = frameGap;
  t.style.backgroundImage = "url(" + img + ")";
  t.innerHTML = "<h1 id='msg' style='color: rgb(250,248,239); padding-top: 25%'></h1>";
  $("#all").append(t);
  $("#loading").remove();
  $("#totalF").html(element);
  setTimeout(preStart, 4000);
  tid = setInterval(timer, 1000);
};

document.body.onkeyup = function(e) {
  if (!gaming) return;
  var y = findNullBlock()[0], x = findNullBlock()[1];
  switch (e.keyCode) {
    case 38: // up
      if (y != bound - 1) move(getId(y + 1, x)); break;
    case 37: // left
      if (x != bound - 1) move(getId(y, x + 1)); break;
    case 40: // down
      if (y != 0) move(getId(y - 1, x)); break;
    case 39: // right
      if (x != 0) move(getId(y, x - 1));
    }
};

function preStart() {
  $("#win").css("opacity", 0);
  setTimeout(function() { $("#win").css("z-index", "25"); $("#msg").html("Hurry!"); fullInited = true; }, 4000);
  initBlocks();
  if (localStorage.step) {
    step = localStorage.step;
    $("#stepCounter").html(step + ((localStorage.bestStep) ? ("/" + localStorage.bestStep) : ""));
  }
}

function timer() {
  if (!gaming) {
    if (time == 0) {
      $("#msg").html((localStorage.gaming) ? "Resumed" : "Start!");
      localStorage.gaming = gaming = true; return 0;
    }
    $("#msg").html(time--);
  } else {
    if (localStorage.time) time = localStorage.time;
    $("#timeCounter").html(time++ + ((localStorage.bestTime) ? ("/" + localStorage.bestTime) : ""));
    localStorage.time = time;
  }
}

function initBlocks() {
    for (i = 0; i < element; i++) {
      // i: ith img num  n: random number (nth image piece)
      n = rn[i];
      y = getY(i); x = getX(i);
      if (!localStorage.a) {
        if (designated == n) {
          a[getY(i)][getX(i)] = "";
          continue;
        }
        a[y][x] = n + 1;
      }
      if (designated == n) continue;
      t = document.createElement("div");
      t.id = "b" + (n + 1);
      t.className = "block";
      t.innerHTML = "<center class='nums' style='color:white; opacity: 0; font-size:" + perWH / 2 +
                    "px; sbpadding-top:" + perWH / 4 + "'>" + (n + 1) + "</center>";
      t.style.position = "absolute";
      t.style.width = t.style.height = perWH + "px";
      t.style.backgroundSize = bound + "00%";
      t.style.backgroundColor = "rgb(" + genRandomColor() + ", " + genRandomColor() + ", " + genRandomColor() + ")";
      t.y = y; t.x = x;
      // console.log("i = " + i + ", x = " + x + ", y = " + y);
      t.style.left = getLeft(x) + "px";
      t.style.top =  getTop(y) + "px";
      t.style.backgroundPositionX = 100 / (bound - 1) * getX(n) + "%";
      t.style.backgroundPositionY = 100 / (bound - 1) * getY(n) + "%";
      t.style.backgroundImage = "url(" + img + ")";
      t.onclick = move;
      // ontouchend cannot be added directly...
      t.addEventListener("touchend", move);
      t.onresize = blockResize; // not a standard function
      $("#all").append(t);
    }
    blockInited = true;
}

function getiSeq(seq) {
  if (seq.length == 0) return -1;
  total = 0; var i, j;
  for (i = 0; i < seq.length; i++) {
    // "x" is ignored.
    if (designated == seq[i]) continue;

    for (j = 0; j < i; j++) {
      if (seq[j] > seq[i]) total += 1;
    }
  }
  return total;
}

function blockResize() {
  this.style.width = this.style.height = perWH + "px";
  this.style.left = getLeft(this.x) + "px";
  this.style.top =  getTop(this.y) + "px";
}

function getX(i) {
  return (i + 1) - getY(i) * bound - 1;
}

function getY(i) {
  return parseInt(i /  bound);
}

function getLeft(x) {
  return perWH * x + frameGap * (x + 1);
}

function getTop(y) {
  return perWH * y + frameGap * (y + 1);
}

function genRandomColor() {
  return parseInt(Math.random() * 255);
}

function genRandomNum() {
  return parseInt(Math.random() * element);
}

function findNullBlock() {
  var x, y;
  for (y = 0; y < bound; y++) {
    for (x = 0; x < bound; x++) {
      if (!a[y][x]) return [y, x];
    }
  }
}

function getI(y, x) {
  return a[y][x];
}

function getId(y, x) {
  return $("#b" + a[y][x])[0];
}

function swap(f, l) {
  t = a[f[0]][f[1]];
  a[f[0]][f[1]] = a[l[0]][l[1]];
  a[l[0]][l[1]] = t;
  e = (t) ? t : a[f[0]][f[1]]; // get the not null block id
  $("#b" + e).css({ "left": getLeft((t) ? l[1] : f[1]) + "px",
                    "top": getTop((t) ? l[0] : f[0]) + "px"
                  });
  // return new x & y
  return [(t) ? l[0] : f[0], (t) ? l[1] : f[1]];
}

function succeed() {
  counter = 0; var x, y;
  for (y = 0; y < bound; y++) {
    for (x = 0; x < bound; x++) {
      if (++counter != a[y][x] && a[y][x] != "") return 0;
    }
  }
  return 1;
}

function move(what) {
  console.log(new Date().getTime() - lastmove);
  if (new Date().getTime() - lastmove < 50) return; // touch screen temporarily solution
  if (what.id) { // not a event..
    y = what.y; x = what.x;
  } else {
    y = this.y; x = this.x;
  }

  if (!a[y][x]) {
    // non-exist
    return 2;
  }

  res = [];
  if (x > 0 && !a[y][x - 1]) {
    res = swap([y, x - 1], [y, x]); // left
  } else if (x < bound - 1 && !a[y][x + 1]) {
    res = swap([y, x + 1], [y, x]); // right
  } else if (y > 0 && !a[y - 1][x]) {
    res = swap([y - 1, x], [y, x]); // up
  } else if (y < bound - 1 && !a[y + 1][x]) {
    res = swap([y + 1, x], [y, x]);// down
  } else {
    console.warn("No path to move.");
    return 3;
  }
  console.log(res);
  if (what.id) { // not a event..
    what.y = res[0]; what.x = res[1];
  } else {
    this.y = res[0]; this.x = res[1];
  }
  lastmove = new Date().getTime();
  printA();
  $("#stepCounter").html(++step + ((localStorage.bestStep) ? ("/" + localStorage.bestStep) : ""));
  localStorage.step = step;
  localStorage.a = JSON.stringify(a); // localStorage can only storage string...
  localStorage.img = img;
  // if succeed
  if (succeed()) {
    $(".block").css("opacity", 0);
    $("#win").css("z-index", "200").css("opacity", 1);
    window.clearInterval(tid);
    $("#msg").html("You Win!");
    if (!localStorage.bestStep || localStorage.bestStep > step) localStorage.bestStep = step;
    if (!localStorage.bestTime || localStorage.bestTime > time) localStorage.bestTime = time;
    reset();
  }
}

function printA() {
  for (y = 0; y < bound; y++) {
    tmp = "";
    for (x = 0; x < bound; x++) {
      tmp += ((a[y][x]) ? a[y][x] : "x") + " ";
    }
    console.info(tmp);
  }
  console.info("======");
}

function showHint() {
  $(".nums").css("opacity", 1);
  setTimeout(function() {
     $(".nums").css("opacity", 0);
  }, 3000);
}

function showOrig() {
  $("#win").css("z-index", "200").css("opacity", 1);
  setTimeout(function() {
    $("#win").css("opacity", 0);
    setTimeout(function() {
      $("#win").css("z-index", 25);
    }, 4000);
  }, 4000);
}

function restart(val) {
  if (confirm("Are you sure to restart with " + (bound - (-val)) + "x" + (bound - (-val)) + " fragments?")) {
    if (val) {
      bound -= -val; // + is awful
      localStorage.bound = bound;
    }
    gaming = false; blockInited = false; fullInited = false; time = 3;
    $("#all").html('<p id="loading">Initializing...</p>'); $("#win").remove(); reset();
    window.clearInterval(tid);
    window.onload();
  }
}

function reset() {
  toRemove = ["gaming", "a", "img", "time", "step"];
  for (i = 0; i < toRemove.length; i++) {
    localStorage.removeItem(toRemove[i]);
  }
}

function changeD(val) {
  if (val < 0) {
    if (bound <= 2) {
      alert("Are you serious?"); return;
    }
  } else {
    if (bound >= 10) {
      alert("You will suffer from being hanged..."); return;
    }
  }
  restart(val);
}

function clearRec() {
  if (!confirm("Are you sure to clear the best record?")) return;
  localStorage.removeItem("bestTime"); localStorage.removeItem("bestStep");
}
