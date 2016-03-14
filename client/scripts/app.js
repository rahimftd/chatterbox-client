var app = {
  server: 'https://api.parse.com/1/classes/messages'
};

app.init = function() {
  $('#main').find('.username').on('click', this.addFriend);
  $('#send .submit').on('submit', this.handleSubmit);
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
      console.log('chatterbox: Message sent');
    },
    error: function (data) {
      // See: https://developer.mozilla.org/en-US/docs/Web/API/console.error
      console.error('chatterbox: Failed to send message', data);
    }
  });
};
app.clearMessages = function() {
  $('#chats').empty();
};
app.addMessage = function(message) {
  var node = '<div class="display-message">' + '<div class="username">' + message.username + '</div>' + message.text + message.roomname + '</div>';
  $('#chats').append(node);
};
app.addRoom = function(roomName) {
  var node = '<li class="' + roomName + ' room-name">' + roomName + '</li>';
  $('#roomSelect').append(node);
};
app.addFriend = function(friend) {
  return true;
};
app.handleSubmit = function() {
  return true;
};
