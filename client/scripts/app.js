


var app = {

  server: 'https://api.parse.com/1/classes/chatterbox',

  friends: {},

  init () {
    $(document).ready(() => {


      app.fetch();
      $('#refresh').on('click', (event) => {
        app.fetch();
      });
      $('input[type="submit"]').on('click', () => {
        app.handleSubmit();
      });
      $('div').on('click', '.username', (event) => {
        var user = event.target.innerText.toString();
        app.addFriend(user);
      });
      $('#roomSelect').change( (event) => {
        var selectedRoom = event.target.value;
        app.selectRoom(selectedRoom);
      });
      $('#create').on('click', (event) => {
        var $newChatRoom = $('#newChatRoom').val();
        app.postNewRoom($newChatRoom);
        app.selectRoom($newChatRoom);
        app.fetch();
        
        //$(`#roomSelect ${$newChatRoom}`);

        // app.goToRoom($newChatRoom);
      });

      setInterval(app.fetch, 3000);
    });
  },

  fetch () {
    $.ajax(
    {
      url: app.server,
      type: 'GET',
      data: {"order":"-updatedAt"},
      success: (info) => {

        var data = info.results;
        var rooms = {};
        var currentRoom = $('option').filter(":selected").val();
        app.clearMessages();
 
        $('#roomSelect').append(`<option value ="allRooms">All rooms</option>`);

        data.forEach( (datum) => {
          datum.roomname = xssFilters.inHTMLData(datum.roomname);
          if(rooms[datum.roomname] !== undefined) {
            rooms[datum.roomname].push(datum);
          } else {
            rooms[datum.roomname] = [];
            rooms[datum.roomname].push(datum);
          }
          app.addMessage(datum);
        });

        for(var key in rooms){
          app.addRoom(key);
        }
        app.selectRoom(currentRoom);

        var availableRooms = $('#roomSelect').children();

        _.each(availableRooms, function(room){
          if(room.value === currentRoom){
            room.selected = true;
          }else{
            room.selected = false;
          }
        });
      }
    });
  },

  send (packet) {
    var username = window.location.search.split("=")[1];
    var $form = $('#message');
    var $option = $('select');
           
    var dataPacket = packet || {
      roomname: $option.val(),
      text: $form[0].value,
      username: username
    };

    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(dataPacket),
      success: () => {
        console.log("Posted!");
      }
    })
  },

  clearMessages () {
    $('#chats').children().remove();
    $('#roomSelect').children().remove();
  },

  addMessage (datum) {
    datum.text = xssFilters.inHTMLData(datum.text);
    datum.username = xssFilters.inHTMLData(datum.username);
    datum.roomname = xssFilters.inHTMLData(datum.roomname);
    var chatFront = `<div class="chat`;
    if(app.friends[datum.username]){
      chatFront += ` friend`;
    }
    var $chatDiv = chatFront + ` ${datum.roomname}">
      <div class="username">${datum.username}</div>
      <div class="createdAt">${datum.createdAt}</div>
      <div class="text">${datum.text}</div></div>`;
    $("#chats").append($chatDiv);
  },
  
  addRoom (roomname) {
    roomname = xssFilters.inHTMLData(roomname);
    $('#roomSelect').append(`<option value ="${roomname}">${roomname}</option>`);
  },

  addFriend (name) {
    app.friends[name] = 1;
  },

  handleSubmit (packet) {
    app.send(packet);
    app.fetch();
  },

  selectRoom (roomname) {
    if(roomname === "allRooms"){
      $('#chats').children().show();
    }else{
      var $allChats = $('#chats').children();
      var filteredChats = _.filter($allChats, (chat) => {
        return chat.classList[1] === roomname;
      });
      $('#chats').children().hide();
      filteredChats.forEach((item) => {
        $(item).show();
      });
    }
    //app.fetch();
  },

  postNewRoom (roomname) {           
    
    var dataPacket = {
      roomname: roomname.split(" ").join(""),
      username: window.location.search.split("=")[1],
      text: `There's some weird shit happening in ${roomname}!`
    };
    $.ajax({
      url: app.server,
      type: 'POST',
      data: JSON.stringify(dataPacket),
      success: () => {
        console.log("Posted!");
      }
    });
    app.addRoom(dataPacket.roomname);
    app.selectRoom(dataPacket.roomname);
    app.goToRoom(dataPacket.roomname);
  },

  goToRoom (roomname) {
    roomname = roomname.split(" ").join("");

    var availableRooms = $('#roomSelect').children();

    _.each(availableRooms, function(room){
      if(room.value === roomname){
        room.selected = true;
        console.log(room);
      }else{
        room.selected = false;
      }
    });
  }

};

app.init();
















