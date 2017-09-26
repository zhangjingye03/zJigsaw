bound = 3;
element = bound * bound;
frameGap = 5;
a = [];
imgs = ["1.jpg", "2.jpg", "3.jpg"];
perWH = 0; designated = 0; firstLoad = 2;

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
				        "color": "#776e65",
                "height": sch * 0.067 + "px"
              });
  perWH = (parseFloat($("#all").css("height")) - (bound + 1) * frameGap) / bound;
  $(".block").css({ "width": perWH + "px",
                    "height": perWH + "px"
                  });
  setTimeout(window.onresize, 500);
  if (--firstLoad > 0) {
    /*$("*").css({ "transition": "all 0.2s" });*/ return 0;
  }
  for (i = 0; i < element; i++) {
    if (designated == i) continue;
    $("#b" + (i + 1))[0].onresize();
  }
};

window.onload = function() {
  window.onresize();
  perWH = (parseFloat($("#all").css("height")) - (bound + 1) * frameGap) / bound;
  designated = genRandomNum();
  img = imgs[parseInt(Math.random() * imgs.length)];
  // initialize the 2d array
  for (i = 0; i < bound; i++) {
    a[i] = [];
  }
  // generate random nums
  rn = []; // array for random nums
  while (getiSeq(rn) % 2 != 0) {
    h = []; // tmp array for checking existence
    console.log(getiSeq(rn));
    for (i = 0; i < element; i++) {
      n = genRandomNum();
      while (h[n]) {
        n = genRandomNum();
      }
      h[n] = 1; rn[i] = n;
    }
  }

  // initialize the elements

  for (i = 0; i < element; i++) {
    // i: ith img num  n: random number (nth image piece)
    n = rn[i];
    console.log(h.toString());
    if (designated == n) {
      a[getY(i)][getX(i)] = "";
      continue;
    }
    t = document.createElement("div");
    t.id = "b" + (n + 1);
    t.className = "block";
    t.innerHTML = "<center class='nums' style='color:white; opacity: 0; font-size:" + perWH / 2 +
                  "px; sbpadding-top:" + perWH / 4 + "'>" + (n + 1) + "</center>";
    t.style.position = "absolute";
    t.style.width = t.style.height = perWH + "px";
    t.style.backgroundSize = bound + "00%";
    t.style.backgroundColor = "rgb(" + genRandomColor() + ", " + genRandomColor() + ", " + genRandomColor() + ")";
    y = getY(i); x = getX(i);
    t.y = y; t.x = x;
    a[y][x] = n + 1;
    // console.log("i = " + i + ", x = " + x + ", y = " + y);
    t.style.left = getLeft(x) + "px";
    t.style.top =  getTop(y) + "px";
    t.style.backgroundPositionX = 100 / (bound - 1) * getX(n) + "%";
    t.style.backgroundPositionY = 100 / (bound - 1) * getY(n) + "%";
    t.style.backgroundImage = "url(" + img + ")";
    t.onclick = move;
    t.onresize = blockResize; // not a standard function
    $("#all").append(t);
  }
  // create win tip
  t = document.createElement("div");
  t.id = "win";
  t.style.left = t.style.right = t.style.top = t.style.bottom = frameGap;
  t.style.backgroundImage = "url(" + img + ")";
  $("#all").append(t);
  $("#loading").remove();
};

function getiSeq(seq) {
  if (seq.length == 0) return -1;
  total = 0; var i, j;
  for (i = 0; i < seq.length; i++) {
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

function move() {
  y = this.y; x = this.x;

  if (!a[y][x]) {
    // non-exist
    return 2;
  }

  // if succeed
  if (succeed()) {
    //TODO
    $(".block").css("opacity", 0);

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
  this.y = res[0]; this.x = res[1];
  printA();
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
  setTimeout(hideHint, 3000);
}

function hideHint() {
  $(".nums").css("opacity", 0);
}
