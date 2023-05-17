///// sign in btn //////////


$("#openBtn").click(function () {
  $("#window").css("display", "block");
});

$("#yak").click(function () {
  $("#loadingImg").css("display", "none");
});

$("#testbtn").click(function () {
  $("#testdiv").focus();
});

$("#testbtn2").click(function () {
  $("#testtext").focus();
});

let x = platform.os.family.toString();
console.log(x);
console.log("screen width: " + screen.width);

if (x.includes("Win")) {
  console.log("win");
  document.write('<link rel="stylesheet" href="winDark.css" />');

  var minimize = document.getElementById("minimize");
  var square = document.getElementById("square");
  var exit = document.getElementById("exit");
  var titleBar = document.getElementById("title-bar");

  ////////////////// Hover listeners //////////////////
  minimize.addEventListener("mouseover", function handleMouseOver() {
    minimize.style.backgroundColor = "#272727";
    minimize.style.cursor = "context-menu";
  });

  minimize.addEventListener("mouseout", function handleMouseOut() {
    minimize.style.backgroundColor = "black";
    minimize.style.cursor = "default";
  });

  square.addEventListener("mouseover", function handleMouseOver() {
    square.style.backgroundColor = "#272727";
    square.style.cursor = "context-menu";
  });

  square.addEventListener("mouseout", function handleMouseOut() {
    square.style.backgroundColor = "black";
    square.style.cursor = "default";
  });

  exit.addEventListener("mouseover", function handleMouseOver() {
    exit.style.backgroundColor = "red";
    exit.style.cursor = "context-menu";
  });

  exit.addEventListener("mouseout", function handleMouseOut() {
    exit.style.backgroundColor = "black";
    exit.style.cursor = "default";
  });

  titleBar.addEventListener("mouseover", function handleMouseOver() {
    titleBar.style.cursor = "context-menu";
  });

  titleBar.addEventListener("mouseout", function handleMouseOver() {
    titleBar.style.cursor = "default";
  });

  //////////////// Make window draggable start ////////////////
  // Make the DIV element draggable:
  var draggable = $("#window");
  var title = $("#title-bar");

  title.on("mousedown", function (e) {
    var dr = $(draggable).addClass("drag");
    height = dr.outerHeight();
    width = dr.outerWidth();
    (ypos = dr.offset().top + height - e.pageY),
      (xpos = dr.offset().left + width - e.pageX);
    $(document.body)
      .on("mousemove", function (e) {
        var itop = e.pageY + ypos - height;
        var ileft = e.pageX + xpos - width;
        if (dr.hasClass("drag")) {
          dr.offset({ top: itop, left: ileft });
        }
      })
      .on("mouseup", function (e) {
        dr.removeClass("drag");
      });
  });
  //////////////// Make window draggable end ////////////////

  ////////////////// Onclick listeners //////////////////
  // X button functionality
  $("#exit").click(function () {
    $("#window").css("display", "none");
  });

  // Maximize button functionality
  $("#square").click(enlarge);

  function enlarge() {
    if (square.classList.contains("enlarged")) {
      $("#window").css("width", "40%");
      $("#title-bar-width").css("width", "100%").css("width", "+=2px");
      $("#content").css("width", "100%");
      $("#square").removeClass("enlarged");
    } else {
      $("#window").css("width", "70%");
      $("#title-bar-width").css("width", "100%").css("width", "+=2px");
      $("#content").css("width", "100%");
      $("#square").addClass("enlarged");
    }
  }
} else if (x.includes("OS X")) {
  console.log("mac");
  document.write('<link rel="stylesheet" href="mac.css" />');

  var titleBar = document.getElementById("title-bar");
  var exit = document.getElementById("exit");
  var max = document.getElementById("maximize");
  var min = document.getElementById("minimize");

  titleBar.addEventListener("mouseover", function handleMouseOver() {
    titleBar.style.cursor = "context-menu";
  });

  titleBar.addEventListener("mouseout", function handleMouseOver() {
    titleBar.style.cursor = "default";
  });

  //////////////// Make window draggable start ////////////////
  // Make the DIV element draggable:
  var draggable = $("#window");
  var title = $("#title-bar");

  title.on("mousedown", function (e) {
    var dr = $(draggable).addClass("drag");
    height = dr.outerHeight();
    width = dr.outerWidth();
    (ypos = dr.offset().top + height - e.pageY),
      (xpos = dr.offset().left + width - e.pageX);
    $(document.body)
      .on("mousemove", function (e) {
        var itop = e.pageY + ypos - height;
        var ileft = e.pageX + xpos - width;
        if (dr.hasClass("drag")) {
          dr.offset({ top: itop, left: ileft });
        }
      })
      .on("mouseup", function (e) {
        dr.removeClass("drag");
      });
  });
  //////////////// Make window draggable end ////////////////

  ////////////////// Onclick listeners //////////////////
  // X button functionality
  $("#exit").click(function () {
    $("#window").css("display", "none");
  });

  // Maximize button functionality
  $("#maximize").click(enlarge);

  function enlarge() {
    if (max.classList.contains("enlarged")) {
      $("#window").css("width", "40%");
      $("#title-bar-width").css("width", "100%").css("width", "+=2px");
      $("#content").css("width", "100%");
      $("#maximize").removeClass("enlarged");
    } else {
      $("#window").css("width", "70%");
      $("#title-bar-width").css("width", "100%").css("width", "+=2px");
      $("#content").css("width", "100%");
      $("#maximize").addClass("enlarged");
    }
  }
} else {
  console.log("mobile");
  document.write('<link rel="stylesheet" href="mobile.css" />');
}
