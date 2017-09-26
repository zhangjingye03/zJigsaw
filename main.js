bound = 3;
element = bound * bound;
a = [];
animating = false;
perWH = 0; designated = 0; firstLoad = 2;

window.onresize = function() {
  sch = document.body.clientHeight;
  scw = document.body.clientWidth;
  if (scw <= 400) {
    $("#all").css("height", "").css("width", "");
    $("#all").css("left", "5%").css("right", "5%").css("width", "90vw");
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

  $("center").css({ "font-size": sch * 0.65 * 0.225 * 0.5,
                    "padding-top": sch * 0.65 * 0.225 * 0.25
                  });
	$("h1").css({ "font-size": sch * 0.1 + "px",
				        "color": "#776e65",
                "height": sch * 0.067 + "px"
              });
  perWH = (parseFloat($("#all").css("height")) - (bound + 1) * 10) / bound;
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
  perWH = (parseFloat($("#all").css("height")) - (bound + 1) * 10) / bound;
  designated = parseInt(Math.random() * element);
  // initialize the 2d array
  for (i = 0; i < bound; i++) {
    a[i] = [];
  }
  // initialize the elements
  for (i = 0; i < element; i++) {
    if (designated == i) {
      a[getY(i)][getX(i)] = "";
      continue;
    }
    t = document.createElement("div");
    t.id = "b" + (i + 1);
    t.className = "block";
    t.innerHTML = "<center class='nums' style='color:white; font-size:" + perWH / 2 +
                  "px; padding-top:" + perWH / 4 + "'>" + (i + 1) + "</center>";
    t.style.position = "absolute";
    t.style.width = t.style.height = perWH + "px";
    t.style.backgroundColor = "rgb(" + genRandomColor() + ", " + genRandomColor() + ", " + genRandomColor() + ")";
    y = getY(i); x = getX(i);
    t.y = y; t.x = x;
    a[y][x] = i + 1;
    // console.log("i = " + i + ", x = " + x + ", y = " + y);
    t.style.left = getLeft(x) + "px";
    t.style.top =  getTop(y) + "px";
    t.onclick = move;
    t.onresize = blockResize;
    $("#all").append(t);
  }
};

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
  return perWH * x + 10 * (x + 1);
}

function getTop(y) {
  return perWH * y + 10 * (y + 1);
}

function genRandomColor() {
  return parseInt(Math.random() * 255);
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

function move() {
//  if (animating) return 1;
  y = this.y; x = this.x;

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
