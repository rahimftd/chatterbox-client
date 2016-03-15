var app = {
  server: 'https://api.parse.com/1/classes/messages',
  maxMessageNumber: 10
};

app.init = function() {
  $('#main').find('.username').on('click', this.addFriend);
  $('.message-area').on('submit', this.handleSubmit);
  $('.refresh-messages').on('click', this.fetch);
  this.fetch();
};
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'POST',
    data: JSON.stringify(message),
    contentType: 'application/json',
    success: function (data) {
      console.log('chatterbox: Message sent');
      $('#message-input').val('Enter message here...');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
app.fetch = function() {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: this.server,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.displayMessages(data);
      return true;
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to fetch messages', data);
      return false;
    }
  });
};
app.clearMessages = function() {
  $('#chats').empty();
};
app.addMessage = function(message) {
  var text = encodeURIComponent(message.text);
  var username = message.username;
  var roomname = message.roomname;
  var node = '<div class="display-message">' + '<div class="username"> <h4>Username: ' + username + '</h4></div> <div class="message-text"><p>' + text + '</p></div>' + roomname + '</div>';
  $('#chats').append(node);
};
app.addRoom = function(roomName) {
  var node = '<option value="' + roomName + '">' + roomName + '</option>';
  $('#roomSelect').append(node);
};
app.addFriend = function(friend) {
  return true;
};
// Runs whenever the click handler is clicked
app.handleSubmit = function(event) {
  event.preventDefault();
  var text = $('#message-input').val();
  var room = $('#roomSelect').val();
  var username = app.getUrlParameter('username');
  var message = app.createMessageObject(text, room, username);
  app.send(message);
};
app.displayMessages = function(data) {
  var messages = data.results;
  for (var i = 0; i < app.maxMessageNumber; i++) {
    app.addMessage(messages[i]);
  }
  console.log(messages);
};
app.createMessageObject = function(text, room, username) {
  var obj = {
    username: username,
    text: text,
    roomname: room
  };
  return obj;
};

app.getUrlParameter = function (sParam) {
  var sPageURL = decodeURIComponent(window.location.search.substring(1));
  var sURLVariables = sPageURL.split('&');
  var sParameterName;

  for (var i = 0; i < sURLVariables.length; i++) {
    sParameterName = sURLVariables[i].split('=');

    if (sParameterName[0] === sParam) {
      return sParameterName[1] === undefined ? true : sParameterName[1];
    }
  }
};

app.init();