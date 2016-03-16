var app = {
  server: 'https://api.parse.com/1/classes/messages',
  maxMessageNumber: 10,
  messageObject: {},
  currentRoom: 'Lobby',
  friends: []
};

app.init = function() {
  // $('#main').find('.username').on('click', this.addFriend);
  $('.message-area').on('submit', this.handleSubmit);
  $('.refresh-messages').on('click', this.fetch);
  $('.show-friends').click(this.filterByFriends);
  $('#roomSelect').change(function() {
    app.currentRoom = $(this).val();
    app.filterByRoom();
  });
  this.fetch();
};
app.send = function(message) {
  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server,
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
app.fetch = function(targetRoom) {
  if (targetRoom) {
    targetRoom = encodeURIComponent(targetRoom);
    var query = '?where%3D%7B%22roomname%22%3A%22' + targetRoom + '%22%7D';
  } else {
    var query = '';
  }

  $.ajax({
    // This is the url you should use to communicate with the parse API server.
    url: app.server + query,
    type: 'GET',
    contentType: 'application/json',
    success: function (data) {
      app.messageObject = data;
      app.filterByRoom();
      app.getRooms(data.results);
      console.log(data);
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
  if (app.friends.indexOf(username) !== -1) {
    var node = '<div class="display-message panel-primary panel' + roomname + '"><div class="panel-heading"> <h4 class="username panel-title">@' + username + '</h4></div><div class="message-text panel-body"><p>' + text + '</p></div></div>';
  } else {
    var node = '<div class="display-message panel-info panel' + roomname + '"><div class="panel-heading"> <h4 class="username panel-title">@' + username + '</h4></div><div class="message-text panel-body"><p>' + text + '</p></div></div>';
  }
  $('#chats').append(node);
};

app.addRoom = function(roomName) {
  var escapedRoom = app.escapeHTML(roomName);
  var node = '<option value="' + escapedRoom + '">' + escapedRoom + '</option>';
  $('#roomSelect').append(node);
};

app.addFriend = function(friend) {
  if (app.friends.indexOf(friend) === -1) {
    app.friends.push(friend);
  }
  app.fetch();
  return true;
};
// Runs whenever the click handler is clicked
app.handleSubmit = function(event) {
  event.preventDefault();
  var text = $('#message-input').val();
  var room = $('#new-room').val() || $('#roomSelect').val();
  var username = app.getUrlParameter('username');
  var message = app.createMessageObject(text, room, username);
  app.currentRoom = room;
  app.send(message);
  $('#new-room').slideUp(500).val('').attr('placeholder', 'Enter new room name...');
};

app.displayMessages = function(data) {
  var messages = data;
  app.clearMessages();
  if (messages === undefined) {
    $('#chats').text('<h4>No messages in this room</h4>');
  } else {
    for (var i = Math.min(app.maxMessageNumber - 1, messages.length - 1); i >= 0; i--) {
      app.addMessage(messages[i]);
    }
  }
  $('.username').on('click', function(event) {
    app.addFriend($(this).text().slice(1));
  });
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
  var messages = data;
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
  $('#roomSelect').val(app.currentRoom);
};

app.filterByRoom = function() {
  var room = app.currentRoom;
  var filteredMessageObject = [];
  if (room === 'Add New Room') {
    $('#new-room').slideDown(500);
  } else if (room === 'Lobby') {
    app.displayMessages(app.messageObject.results);
    $('.room-name').text(app.currentRoom);
  } else {
    for (var i = 0; i < app.messageObject.results.length; i++) {
      if (app.messageObject.results[i]['roomname'] === room) {
        filteredMessageObject.push(app.messageObject.results[i]);
      }
    }
    $('.room-name').text(app.currentRoom);
    app.displayMessages(filteredMessageObject);
  }
};

app.filterByFriends = function() {
  var filteredMessageObject = [];
  for (var i = 0; i < app.messageObject.results.length; i++) {
    if (app.friends.indexOf(app.messageObject.results[i]['username']) !== -1) {
      filteredMessageObject.push(app.messageObject.results[i]);
    }
  }
  $('.room-name').text('Friends');
  app.displayMessages(filteredMessageObject);
};

app.init();