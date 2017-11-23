//connection to host and port
var socket = io();

//when user login or logout,system notice
socket.on('loginInfo',function(msg){
	addMsgFromSys(msg);
  Messenger().post({
    message: msg,
    showCloseButton: true
  });
});

//add user in ui
socket.on('userList',function(userList){
	//modify user count
	//modifyUserCount(userList.length);
  addUser(userList);
});

//client review user information after login
socket.on('userInfo',function(userObj){
  onlineSound();
  //should be use cookie or session
  userSelf = userObj;
  $('#spanuser').text('当前用户：'+userObj.name);
});

//review message from toAll
socket.on('toAll',function(msgObj){
  receiveSound();
  addMsgFromUser(msgObj,false);
});

//review message from toOne
socket.on('toOne',function(msgObj){
  receiveSound();
  Messenger().post({
    message: "<a style='color: #fff' href=\"javascript:showSetMsgToOne(\'"+msgObj.from.name+"\',\'"+msgObj.from.id+"\');\">"+"来自【"+msgObj.from.name + "】的消息："+ msgObj.msg+"</a>",
    showCloseButton: true
  });
});

socket.on('sendImageToALL',function(msgObj){
  receiveSound();
  addImgFromUser(msgObj,false);
});