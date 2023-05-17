
const express = require("express");
const fs = require("fs");
const app = express();
const http = require("http");
const https = require("https");
const server = http.createServer(app);
const { Server } = require("socket.io");
const io = new Server(server, { cors: { origin: "*" } });
const shell = require("shelljs");
var path = require("path");

app.use(express.static(path.join(__dirname, "public")));

app.get("/", (req, res) => {
  res.sendFile(__dirname + "/public/index.html");
});

var users = 0;
var usersArray = [];
var containersArray = [];
var fuckOffArray = [];

shell.exec("./killConts.sh");

io.on("connection", (socket) => {
  console.log(
    "\n---------------------------------------------------------------"
  );

  var pupCheck = socket.handshake.query["foo"];
  console.log("PUPCHECK: " + pupCheck);

  if (pupCheck === "vnc") {
    var ip = socket.request.connection.remoteAddress;
    ip = ip.replace(/^.*:/, "").trim();
    var urlCheck = socket.handshake.query["url"];
    var testArr = urlCheck.split("/");
    var urlOS = testArr[4];
    console.log("url hostname: " + urlOS);

    let dCont = containersArray.find((dCont) => dCont.hostname == urlOS);
    var pupsockid = dCont.pupSocketID;
    var vncsockid = socket.id;
    var ind = containersArray.indexOf(dCont);
    containersArray[ind].vncSockID = vncsockid;
    console.log("vncsockid: " + socket.id);
    console.log("pupsockid: " + pupsockid);
    socket.on("errTest", function (data) {
      console.log("testx: " + data.x);
      console.log("testy: " + data.y);
    });

    socket.on("toggleDragSent", function (data) {
      console.log("toggleDrag sent");
      io.to(vncsockid).emit("toggleDragRec", "");
    });
    var inputFieldsRect = containersArray[ind].inputFieldsRect;
    io.to(vncsockid).emit("inputRectSend", inputFieldsRect);

    socket.on("idOfClickedEl", function (data) {
      console.log("what a cunt");
      io.to(pupsockid).emit("idOfClickedEl2", data);
    });
  } else if (pupCheck === "vncUI") {
    var urlCheck = socket.handshake.query["url"];
    var testArr = urlCheck.split("/");
    var urlOS = testArr[4];
    console.log("url hostname: " + urlOS);

    let dCont = containersArray.find((dCont) => dCont.hostname == urlOS);
    var pupsockid = dCont.pupSocketID;
    var vncuisockid = socket.id;
    var ind = containersArray.indexOf(dCont);
    containersArray[ind].vncUISockID = vncuisockid;
    console.log("vncuisockid: " + socket.id);
    console.log("pupsockid: " + pupsockid);

    socket.on("onBlurKBSent", function (data) {
      var vncsockid = dCont.vncSockID;
      var inputFieldsRect = containersArray[ind].inputFieldsRect;
      io.to(vncsockid).emit("onBlurKBRec", inputFieldsRect);
      try {
        console.log("vnc ui:");
        console.log(inputFieldsRect[0].el2.x);
        console.log(inputFieldsRect[0].el2.y);
        console.log(inputFieldsRect[0].el2.width);
        console.log(inputFieldsRect[0].el2.height);
      } catch {
        console.log(" data.el. undef ui");
      }
    });
  } else if (pupCheck === "vncGest") {
    var urlCheck = socket.handshake.query["url"];
    //console.log("url check: " + urlCheck);
    var testArr = urlCheck.split("/");
    var urlOS = testArr[4];
    console.log("url hostname: " + urlOS);

    let dCont = containersArray.find((dCont) => dCont.hostname == urlOS);
    var pupsockid = dCont.pupSocketID;
    var vncgestsockid = socket.id;
    var ind = containersArray.indexOf(dCont);
    containersArray[ind].vncGestSockID = vncgestsockid;
    console.log("vncgestsockid: " + socket.id);
    console.log("pupsockid: " + pupsockid);

    socket.on("gestEnd", function (data) {
      var vncsockid = dCont.vncSockID;
      var inputFieldsRect = containersArray[ind].inputFieldsRect;
      io.to(vncsockid).emit("inputRectSend", inputFieldsRect);
      try {
        console.log("gestEnd:");
        console.log(inputFieldsRect[0].el2.x);
        console.log(inputFieldsRect[0].el2.y);
        console.log(inputFieldsRect[0].el2.width);
        console.log(inputFieldsRect[0].el2.height);
      } catch {
        console.log(" data.el. undef 1");
      }
    });

    socket.on("gestEnd2", function (data) {
      var vncsockid = dCont.vncSockID;
      var inputFieldsRect = containersArray[ind].inputFieldsRect;
      io.to(vncsockid).emit("closeKeyRec2", inputFieldsRect);

      try {
        console.log("gestEnd2:");
        console.log(inputFieldsRect[0].el2.x);
        console.log(inputFieldsRect[0].el2.y);
        console.log(inputFieldsRect[0].el2.width);
        console.log(inputFieldsRect[0].el2.height);
        console.log("2 end");
      } catch {
        console.log(" data.el. undef 2");
      }
    });
  } else if (pupCheck === "bar") {
    console.log("Pup connected");

    var ip = socket.request.connection.remoteAddress;
    ip = ip.replace(/^.*:/, "").trim();

    var pupsocketid = socket.id;

    var hostname = socket.handshake.query["hostname"];
    console.log("pup hostname: " + hostname);
    let toSearch = hostname.trim();
    let dContResArr = containersArray.filter((o) =>
      o.hostname.includes(toSearch)
    );
    let dCont = dContResArr[0];

    var ind = containersArray.indexOf(dCont);
    containersArray[ind].pupSocketID = pupsocketid;
    console.log("pupsockid: " + containersArray[ind].pupSocketID);

    var usersockid = dCont.userSocketID;
    var indexsock = dCont.indexsockid;
    var ua = dCont.hostname;

    if (!ua.includes("iOS") && !ua.includes("Android")) {
      console.log("sending pup ready onconnection");
      io.to(indexsock).emit("pupready");
    }

    socket.on("raybigger", function (data) {
      console.log(data);
    });

    var pupsendcount = 0;

    socket.on("pupSendErr", function (data) {
      console.log(data);
    });

    socket.on("redirSent", function (data) {
      // get contAr[this socket], get client socket, emit to that socket
      console.log("redir sent");
      io.to(usersockid).emit("redirRec", "");
    });
    /*
        socket.on('pageLoadSent', function (data) {
                 let dCont = containersArray.find(dCont => dCont.dockerIP === ip);
                var ind = containersArray.indexOf(dCont);
                 var vncsockid = containersArray[ind].vncSockID;
                        io.to(vncsockid).emit('pageLoadRec',data);

        });
*/

    socket.on("authenticated", function (data) {
      let toSearch = hostname.trim();
      let dContResArr = containersArray.filter((o) =>
        o.hostname.includes(toSearch)
      );
      let dCont = dContResArr[0];
      var ind = containersArray.indexOf(dCont);

      var vncsockid = containersArray[ind].vncSockID;
      io.to(vncsockid).emit("authenticatedRec", data);
      console.log("++++ Authenticated ++++");
    });

    var pupsendcount = 0;

    socket.on("pupSendField", function (data) {
      let toSearch = hostname.trim();
      let dContResArr = containersArray.filter((o) =>
        o.hostname.includes(toSearch)
      );
      let dCont = dContResArr[0];
      var ind = containersArray.indexOf(dCont);
      console.log("pupSendField Rec: " + ind);
      containersArray[ind].inputFieldsRect = data;
      // redirects iOS when ready

      if (pupsendcount < 1 && (ua.includes("iOS") || ua.includes("Android"))) {
        console.log("pup send count " + pupsendcount);
        io.to(indexsock).emit("pupready");
        console.log("pup ready sent to user sockid");
        console.log("usersockid:" + indexsock);
      }
      pupsendcount++;

      if (containersArray[ind].vncSockID != null) {
        var vncsockid = containersArray[ind].vncSockID;
        io.to(vncsockid).emit("inputRectSend", data);
        console.log("inputRectSend");
        try {
          console.log(data[0].el2.x);
          console.log(data[0].el2.y);
          console.log(data[0].el2.width);
          console.log(data[0].el2.height);
        } catch {
          console.log(" data.el. undef pup send");
        }
      }
    });

    socket.on("testKey", function (data) {
      console.log("testkey in");
      var vncsock = dCont.vncSockID;
      io.to(vncsock).emit("testKeyRec", "");
    });

    socket.on("closeKey", function (data) {
      console.log("closekey in");
      var vncsock = dCont.vncSockID;
      io.to(vncsock).emit("closeKeyRec", "");
    });

    socket.on("disconnect", () => {
      console.log("pup disconnect fired");

      //              shell.exec('./killaCont.sh ' + contName);
    });
  } else {
    ////// NORMIE CONNECTED

    console.log("normie connected");
    console.log("Normie socketID: " + socket.id);

    var user_Fingerprint = socket.handshake.query["fp"];

    console.log("FINGERPRINT: " + user_Fingerprint);

    if (user_Fingerprint === undefined) {
      console.log("normie fp undefined i.e. iframe: disregard");
    } else {
      /// check if FP exists already to avoid duplicate spam and shit
      usersArray.push(user_Fingerprint);
      let instancesOfUserFingerprint = 0;
      usersArray.forEach((element) => {
        if (element === user_Fingerprint) {
          instancesOfUserFingerprint += 1;
        }
      });
      console.log("# of fingerprint: " + instancesOfUserFingerprint);

      // emit resoltion and appropriate resize mode to portal socket
      var os_shortform = socket.handshake.query["os"];
      var screenX = socket.handshake.query["x"];
      var screenY = socket.handshake.query["y"];
      console.log("OS: " + os_shortform + ", x: " + screenX + ", y:" + screenY);

      var osStr = "";
      if (os_shortform.includes("Android")) {
        osStr = "and";
      } else if (os_shortform.includes("iOS")) {
        osStr = "ios";
      } else if (os_shortform.includes("Win")) {
        osStr = "win";
      } else if (os_shortform.includes("Mac")) {
        osStr = "mac";
      } else {
        console.log("error cant find os str");
      }
      console.log("operating system string to search = " + osStr);

      var statusVacantSlotArr = containersArray.filter(function (e) {
        return e.hostname.includes(osStr) && e.status == 0;
      });
      console.log(statusVacantSlotArr.length + " vacant count");

      var statusIsReadyArr = containersArray.filter(function (e) {
        return e.hostname.includes(osStr) && e.status == 1;
      });
      console.log(statusIsReadyArr.length + " ready count");

      var statusInuseArr = containersArray.filter(function (e) {
        return e.hostname.includes(osStr) && e.status == 2;
      });
      console.log(statusInuseArr.length + " in use count");

      var total = statusIsReadyArr.length + statusVacantSlotArr.length;

      if (statusVacantSlotArr.length > 0 || statusInuseArr.length < WIN_MAX) {
        var un = 0;
        var hn = "";

        if (statusIsReadyArr.length !== 0) {
          var launched_IMG = statusIsReadyArr[0];
          un = launched_IMG.userNumber;
          hn = launched_IMG.hostname;
          var indy = launched_IMG.userNumber - 1;
          containersArray[indy].indexsockid = socket.id;
          containersArray[indy].status = 2;
          console.log("using cont at hostname: " + hn + ", userNum: " + un);
        } else {
          var availSlot = statusVacantSlotArr[0];
          un = availSlot.userNumber;
          hn = availSlot.hostname;
          var indy = availSlot.userNumber - 1;
          containersArray[indy].indexsockid = socket.id;
          containersArray[indy].status = 2;

          var runContStr = "";

          if (os_shortform.includes("Android")) {
            runContStr = "./runContAndroid.sh ";
          } else if (os_shortform.includes("iOS")) {
            runContStr = "./runContiOS.sh ";
          } else if (os_shortform.includes("Win")) {
            runContStr = "./runContWin.sh ";
          } else if (os_shortform.includes("Mac")) {
            runContStr = "./runContMac.sh ";
          } else {
            console.log("error cant find os str for run cont");
          }

          shell.exec(
            runContStr +
              availSlot.IMG_IP +
              " " +
              availSlot.wsProxy +
              " " +
              availSlot.hostname +
              " user" +
              availSlot.userNumber
          );
          console.log(
            "using cont at hostname: " +
              hn +
              ", userNum: " +
              un +
              ", wsP " +
              availSlot.wsProxy +
              ", ip: " +
              availSlot.IMG_IP
          );
          shell.exec(
            "./startWebsockify.sh " +
              availSlot.userNumber +
              " " +
              availSlot.wsProxy
          );
          console.log(
            "websockify started at: " +
              availSlot.wsProxy +
              " " +
              availSlot.userNumber
          );
        }

        var iframeSrcArgs = "";
        var domainTLD = your.domain "/novnc/";
        console.log("UN: " + un);
        console.log("HN: " + hn);
        console.log("PF: " + os_shortform);
        if (os_shortform.includes("Win")) {
          iframeSrcArgs =
            domainTLD +
            hn +
            "/vnc.html?autoconnect=true&password=headless&resize=remote&path=novnc/" +
            hn +
            "/websockify";
          console.log("runPupDesktop Win");
          shell.exec("./runPup.sh " + un);
        } else if (os_shortform.includes("Android")) {
          iframeSrcArgs =
            domainTLD +
            hn +
            "/vnc.html?autoconnect=true&password=headless&resize=local&path=novnc/" +
            hn +
            "/websockify";
          console.log("runPupAndroid android");
          var dim = screenX + " " + screenY;
          shell.exec("./runPupAndroid.sh " + un + " " + dim);
        } else if (os_shortform.includes("OS X")) {
          iframeSrcArgs =
            domainTLD +
            hn +
            "/vnc.html?autoconnect=true&password=headless&resize=remote&path=novnc/" +
            hn +
            "/websockify";
          console.log("runPupDesktop OS X");
          shell.exec("./runPup.sh " + un);
        } else if (os_shortform.includes("iOS")) {
          iframeSrcArgs =
            domainTLD +
            hn +
            "/vnc.html?autoconnect=true&password=headless&resize=local&path=novnc/" +
            hn +
            "/websockify";
          console.log("runPupAndroid iOS");
          var dim = screenX + " " + screenY;
          shell.exec("./runPupAndroid.sh " + un + " " + dim);
        }

        socket.on("pupready2", () => {
          var em = iframeSrcArgs;
          console.log("emitting iframe src   " + em);
          io.to(socket.id).emit("setIframeSrc", em);
        });
      } else {
        fuckOffArray.push(socket.id);
        console.log("Max reached ========== emit redirect");
      }
    }

    socket.on("disconnect", () => {
      // Normie Disconnect
      console.log("normie disconnect");

      var user_Fingerprint = socket.handshake.query["fp"];
      console.log("FINGERPRINT: " + user_Fingerprint);

      var fuckOffExistsArr = fuckOffArray.filter(function (e) {
        return e.includes(socket.id);
      });
      console.log("fuckoff length count " + fuckOffExistsArr.length);

      if (user_Fingerprint === undefined || fuckOffExistsArr.length > 0) {
        console.log("maybe they should fuck off ey");
        console.log("normie fp undefined i.e. iframe: disregard");
      } else {
        console.log("socket id = " + socket.id + "\n");
        let obj = containersArray.find((o) => o.indexsockid === socket.id);

        let indx = obj.userNumber - 1;
        let osStrwNums = obj.hostname;

        let osStr = osStrwNums.replace(/[0-9]/g, "");
        containersArray[indx].status = 0;
        containersArray[indx].indexsockid = "";
        containersArray[indx].pupSocketID = "";
        containersArray[indx].vncGestSockID = "";
        containersArray[indx].vncSockID = "";
        containersArray[indx].vncUISockID = "";

        shell.exec("./killaCont.sh " + obj.userNumber);

        //++ normie dc cont: check if we have a live placeholder, if not create a fresh one at available slot
        var statusVacantSlotArr = containersArray.filter(function (e) {
          return e.hostname.includes(osStr) && e.status == 0;
        });
        console.log(statusVacantSlotArr.length + " vacant count");

        var statusIsReadyArr = containersArray.filter(function (e) {
          return e.hostname.includes(osStr) && e.status == 1;
        });
        console.log(statusIsReadyArr.length + " ready count");

        var statusInuseArr = containersArray.filter(function (e) {
          return e.hostname.includes(osStr) && e.status == 2;
        });
        console.log(statusInuseArr.length + " in use count");

        var un = 0;
        var hn = "";

        if (statusIsReadyArr.length !== 0) {
          var launched_IMG = statusIsReadyArr[0];
          un = launched_IMG.userNumber;
          hn = launched_IMG.hostname;
          var indy = launched_IMG.userNumber - 1;
          containersArray[indy].indexsockid = socket.id;
          containersArray[indy].status = 1;
          console.log("using cont at hostname: " + hn + ", userNum: " + un);
        } else {
          var availSlot = statusVacantSlotArr[0];
          un = availSlot.userNumber;
          hn = availSlot.hostname;
          var indy = availSlot.userNumber - 1;
          containersArray[indy].indexsockid = socket.id;
          containersArray[indy].status = 1;
          shell.exec(
            "./runContWin.sh " +
              availSlot.IMG_IP +
              " " +
              availSlot.wsProxy +
              " " +
              availSlot.hostname +
              " user" +
              availSlot.userNumber
          );
          console.log(
            "using cont at hn: " +
              hn +
              ", un: " +
              un +
              ", wsP " +
              availSlot.wsProxy +
              ", ip: " +
              availSlot.IMG_IP
          );
          shell.exec(
            "./startWebsockify.sh " +
              availSlot.userNumber +
              " " +
              availSlot.wsProxy
          );
          console.log(
            "websockify started at: " +
              availSlot.wsProxy +
              " " +
              availSlot.userNumber
          );
        }
      }
    });
  }

  console.log(
    "---------------------------------------------------------------\n"
  );
});

const WIN_MAX = 4;
const MAC_MAX = 4;
const AND_MAX = 4;
const IOS_MAX = 4;

server.listen(3000, () => {
  console.log("listening on *:3000\n");

  const SUBNET_INIT = "172.18.0.";
  const WEBSOCKIFY_INIT = 6080;
  let userNum = 1;

  const WIN_MIN = 4;
  const MAC_MIN = 4;
  const AND_MIN = 4;
  const IOS_MIN = 4;

  const winOffset = 0;
  const macOffset = 4;
  const iosOffset = 8;
  const andOffset = 12;

  let winCurrent = 0;
  let macCurrent = 0;
  let andCurrent = 0;
  let iosCurrent = 0;

  var winPlaceholderSet = false;
  var macPlaceholderSet = false;
  var iosPlaceholderSet = false;
  var andPlaceholderSet = false;

  while (winCurrent < WIN_MAX) {
    let i = 2 + winCurrent;
    let j = winCurrent + 1;
    let prxpassIP = SUBNET_INIT + (winOffset + i).toString();
    const wsP = WEBSOCKIFY_INIT + winOffset + i;
    const imgname = "win" + j.toString();
    const dataObj = {
      hostname: imgname,
      status: 0,
      IMG_IP: prxpassIP,
      wsProxy: wsP,
      userNumber: userNum,
    };

    if (!winPlaceholderSet) {
      shell.exec(
        "./runContWin.sh " +
          dataObj.IMG_IP +
          " " +
          dataObj.wsProxy +
          " " +
          dataObj.hostname +
          " user" +
          userNum
      );
      console.log(
        "starting user" +
          userNum +
          " @ " +
          dataObj.IMG_IP +
          ":" +
          dataObj.wsProxy
      );
      shell.exec("./startWebsockify.sh " + userNum + " " + dataObj.wsProxy);
      winPlaceholderSet = true;
      dataObj.status = 1;
      containersArray.push(dataObj);
    } else {
      containersArray.push(dataObj);
    }

    winCurrent++;
    i++;
    j++;
    userNum++;
  }

  while (andCurrent < AND_MAX) {
    let i = 2 + andCurrent;
    let j = andCurrent + 1;
    let prxpassIP = SUBNET_INIT + (andOffset + i).toString();
    const wsP = WEBSOCKIFY_INIT + andOffset + i;
    const imgname = "android" + j.toString();
    const dataObj = {
      hostname: imgname,
      status: 0,
      IMG_IP: prxpassIP,
      wsProxy: wsP,
      userNumber: userNum,
    };

    if (!andPlaceholderSet) {
      shell.exec(
        "./runContAndroid.sh " +
          dataObj.IMG_IP +
          " " +
          dataObj.wsProxy +
          " " +
          dataObj.hostname +
          " user" +
          userNum
      );
      console.log(
        "starting user" +
          userNum +
          " @ " +
          dataObj.IMG_IP +
          ":" +
          dataObj.wsProxy
      );
      shell.exec("./startWebsockify.sh " + userNum + " " + dataObj.wsProxy);
      andPlaceholderSet = true;
      dataObj.status = 1;
      containersArray.push(dataObj);
    } else {
      containersArray.push(dataObj);
    }

    andCurrent++;
    i++;
    j++;
    userNum++;
  }

  while (macCurrent < MAC_MAX) {
    let i = 2 + macCurrent;
    let j = macCurrent + 1;
    let prxpassIP = SUBNET_INIT + (macOffset + i).toString();
    const wsP = WEBSOCKIFY_INIT + i;
    const imgname = "mac" + j.toString();
    const dataObj = {
      hostname: imgname,
      status: 0,
      IMG_IP: prxpassIP,
      wsProxy: wsP,
      userNumber: userNum,
    };
    containersArray.push(dataObj);
    macCurrent++;
    i++;
    j++;
    userNum++;
  }

  while (iosCurrent < IOS_MAX) {
    let i = 2 + iosCurrent;
    let j = iosCurrent + 1;
    let prxpassIP = SUBNET_INIT + (iosOffset + i).toString();
    const wsP = WEBSOCKIFY_INIT + iosOffset + i;
    const imgname = "ios" + j.toString();
    const dataObj = {
      hostname: imgname,
      status: 0,
      IMG_IP: prxpassIP,
      wsProxy: wsP,
      userNumber: userNum,
    };
    containersArray.push(dataObj);
    iosCurrent++;
    i++;
    j++;
    userNum++;
  }
});

/*


 containersArray.forEach((obj) => {
    for (const key in obj) {
      console.log(`${key}: ${obj[key]}`);
    }
    console.log("\n");
  });
sudo docker run -d --net  mynet123 --ip 172.18.0.$2 -p 680$2:6901 --hostname win$1  --name user$1 win36


*/
