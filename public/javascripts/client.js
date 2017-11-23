var userSelf = {};
var toOneId;
$(function () {
    $('#myModal').modal({
        //backdrop: 'static',
        keyboard: false
    });
    Messenger.options = {
        extraClasses: 'messenger-fixed messenger-on-bottom messenger-on-right',
        theme: 'flat'
    };

    $('.popover-dismiss').popover('show');

    //login
    $('#btn-setName').click(function () {
        var name = $('#username').val();
        if (checkUser(name)) {
            $('#username').val('');
            alert('Nickname already exists or can not be empty!');
        } else {
            var imgList = ["/images/1.jpg", "/images/2.jpg", "/images/3.jpg", "/images/4.jpg", "/images/5.jpg"];
            var randomNum = Math.floor(Math.random() * 5);
            //random user
            var img = imgList[randomNum];
            //package user
            var dataObj = {
                name: name,
                img: img
            };
            //send user info to server
            socket.emit('login', dataObj);
            //hide login modal
            $('#myModal').modal('hide');
            $('#username').val('');
            $('#msg').focus();
        }
    });

    //send to all
    $('#sendMsg').click(function () {
        var msg = $('#msg').val();
        if (msg == '') {
            alert('Please enter the message content!');
            return;
        }
        var from = userSelf;
        var msgObj = {
            from: from,
            msg: msg,
            sendTime: formatDate()
        };
        socket.emit('toAll', msgObj);
        addMsgFromUser(msgObj, true);
        $('#msg').val('');
    });

    //send image to all
    $('#sendImage').change(function () {
        if (this.files.length != 0) {
            var file = this.files[0];
            reader = new FileReader();
            if (!reader) {
                alert("!your browser doesn\'t support fileReader");
                return;
            }
            reader.onload = function (e) {
                //console.log(e.target.result);
                var msgObj = {
                    from: userSelf,
                    img: e.target.result,
                    sendTime: formatDate()
                };
                socket.emit('sendImageToALL', msgObj);
                addImgFromUser(msgObj, true);
            };
            reader.readAsDataURL(file);
        }
    });

    //send to one
    $('#btn_toOne').click(function () {
        var msg = $('#input_msgToOne').val();
        if (msg == '') {
            return;
        }
        var msgObj = {
            from: userSelf,
            to: toOneId,
            msg: msg,
            sendTime: formatDate()
        };
        socket.emit('toOne', msgObj);
        $('#setMsgToOne').modal('hide');
        $('#input_msgToOne').val('');
    })
});

//add message in UI
function addImgFromUser(msgObj, isSelf) {
    var msgType = isSelf ? "message-reply" : "message-receive";
    var msgHtml = $('<div><div class="text-center" style="color: #aaa">' + msgObj.sendTime + '</div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
    msgHtml.addClass(msgType);
    msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src', msgObj.from.img);
    msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title', msgObj.from.name);
    msgHtml.children('.message-info').children('.message-content-box').children('.message-content').html("<img src='" + msgObj.img + "'>");
    $('.msg-content').append(msgHtml);
    //滚动条一直在最底
    $(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

//add message in UI
function addMsgFromUser(msgObj, isSelf) {
    var msgType = isSelf ? "message-reply" : "message-receive";
    var msgHtml = $('<div><div class="text-center" style="color: #aaa">' + msgObj.sendTime + '</div><div class="message-info"><div class="user-info"><img src="/images/1.jpg" class="user-avatar img-thumbnail"></div><div class="message-content-box"><div class="arrow"></div><div class="message-content">test</div></div></div></div>');
    msgHtml.addClass(msgType);
    msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('src', msgObj.from.img);
    msgHtml.children('.message-info').children('.user-info').children('.user-avatar').attr('title', msgObj.from.name);
    msgHtml.children('.message-info').children('.message-content-box').children('.message-content').text(msgObj.msg);
    $('.msg-content').append(msgHtml);
    //滚动条一直在最底
    $(".msg-content").scrollTop($(".msg-content")[0].scrollHeight);
}

//add msg from system in UI
function addMsgFromSys(msg) {
    $.scojs_message(msg, $.scojs_message.TYPE_OK);
}

//check is the username exist.
function checkUser(name) {
    var haveName = false;
    $(".user-content").children('ul').children('li').each(function () {
        if (name == $(this).find('span').text()) {
            haveName = true;
        }
    });
    return haveName;
}
function showSetMsgToOne(name, id) {
    $('#setMsgToOne').modal();
    $('#myModalLabel1').text("Send to " + name);
    toOneId = id;
}
//add user in UI
function addUser(userList) {
    var parentUl = $('.user-content').children('ul');
    var cloneLi = parentUl.children('li:first').clone();
    parentUl.html('');
    parentUl.append(cloneLi);
    for (var i in userList) {
        var cloneLi = parentUl.children('li:first').clone();
        cloneLi.children('a').attr('href', "javascript:showSetMsgToOne('" + userList[i].name + "','" + userList[i].id + "');");
        cloneLi.children('a').children('img').attr('src', userList[i].img);
        cloneLi.children('a').children('span').text(userList[i].name);
        cloneLi.show();
        parentUl.append(cloneLi);
    }
}

//send message enter function
function keywordsMsg(e) {
    var event1 = e || window.event;
    if (event1.keyCode == 13) {
        $('#sendMsg').click();
    }
}

//set name enter function
function keywordsName(e) {
    var event1 = e || window.event;
    if (event1.keyCode == 13) {
        $('#btn-setName').click();
    }
}
//send to one enter function
function keywordsName1(e) {
    var event1 = e || window.event;
    if (event1.keyCode == 13) {
        $('#btn_toOne').click();
    }
}

//online sound tip
function onlineSound() {
    document.getElementById('audio').src = 'music/online.mp3';
    document.getElementById('audio').play();
}

//receive msg sound tip
function receiveSound() {
    document.getElementById('audio').src = 'music/receive.mp3';
    document.getElementById('audio').play();
}

function formatDate(pattern) {
    var returnValue = pattern || "yyyy-MM-dd HH:mm:ss";
    var format = {
        "y+": new Date().getFullYear(), //年份
        "M+": new Date().getMonth() + 1, //月份
        "d+": new Date().getDate(), //日
        "H+": new Date().getHours(), //24小时制
        "m+": new Date().getMinutes(), //分钟
        "s+": new Date().getSeconds(), //秒
        "S": new Date().getMilliseconds(), //毫秒
        "h+": (new Date().getHours() % 12), //12小时制
        "q+": Math.floor((new Date().getMonth() + 3) / 3), //季度
        "W": new Array('日', '一', '二', '三', '四', '五', '六')[new Date().getDay()], //星期几/周几
        "A": (new Date().getHours() / 12) <= 1 ? "AM" : "PM",
        "a": (new Date().getHours() / 12) <= 1 ? "am" : "pm"
    };
    /*遍历正则式pattern类型对象构建returnValue对象*/
    for (var key in format) {
        var regExp = new RegExp("(" + key + ")");
        if (regExp.test(returnValue)) {
            var zero = "";
            for (var i = 0; i < RegExp.$1.length; i++) {
                zero += "0";
            }
            var replacement = RegExp.$1.length == 1 ? format[key] : (zero + format[key]).substring((("" + format[key]).length));
            returnValue = returnValue.replace(RegExp.$1, replacement);
        }
    }
    return returnValue;
}