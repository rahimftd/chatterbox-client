var app = {
  server: 'https://api.parse.com/1/classes/messages',
  maxMessageNumber: 10
};

app.init = function() {
  $('#main').find('.username').on('click', this.addFriend);
  $('.message-area').on('submit', this.handleSubmit);
  $('.refresh-messages').on('click', this.fetch);
  $('#roomSelect').change(this.filterByRoom);
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
      $('#message-input').attr('placeholder', 'Enter message here...').val('');
      app.fetch();
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
      app.getRooms(data);
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
  var text = app.escapeHTML(message.text);
  var username = app.escapeHTML(message.username);
  var roomname = app.escapeHTML(message.roomname || 'Lobby');
  var node = '<div class="display-message panel-info panel' + roomname + '"><div class="username panel-heading"> <h4 class="panel-title">@' + username + '</h4></div><div class="message-text panel-body"><p>' + text + '</p></div></div>';
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
  var room = $('#new-room').val() === '' ? $('#roomSelect').val() : $('#new-room').val();
  var username = app.getUrlParameter('username');
  var message = app.createMessageObject(text, room, username);
  app.send(message);
};
app.displayMessages = function(data) {
  var messages = data.results;
  app.clearMessages();
  for (var i = app.maxMessageNumber - 1; i >= 0; i--) {
    app.addMessage(messages[i]);
  }
};
app.createMessageObject = function(text, room, username) {
  var obj = {
    username: username,
    text: text,
    roomname: room
  };
  return obj;
};

app.escapeHTML = function(string) {
  var entityMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&#39;',
    '/': '&#x2F;'
  };
  return String(string).replace(/[&<>"'\/]/g, function (s) {
    return entityMap[s];
  });
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
app.getRooms = function(data) {
  var messages = data.results;
  var rooms = [];
  for (var i = 0; i < messages.length; i++) {
    var room = messages[i].roomname || 'Lobby';
    if (rooms.indexOf(room) === -1) {
      rooms.push(room);
    }
  }
  $('#roomSelect').empty();
  for (var i = 0; i < rooms.length; i++) {
    app.addRoom(rooms[i]);
  }
  $('#roomSelect').append('<option value="Add New Room">Add New Room</option>');
};
app.filterByRoom = function(roomName) {
  var room = $('#roomSelect').val();
  if (room === 'Add New Room') {
    $('#new-room').toggle();
  } else {
    var $displayRooms = $('.' + room);
    console.log($displayRooms);
    $('#chats .display-message').hide();
    $displayRooms.show();
  }
};

app.init();