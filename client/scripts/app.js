


var app = {

  server: 'https://api.parse.com/1/classes/chatterbox',

  init () {
    $(document).ready(() => {
      app.fetch();
      $('#refresh').on('click', (event) => {
        $('#chats').children().remove();
        app.fetch();
      });
      $('#send .submit').on('submit', () => {
        app.handleSubmit();
      });
      $('div').on('click', '.username', (event) => {
        var user = event.target.innerText.toString();
        app.addFriend(user);
      });
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

        data.forEach( (datum) => {
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
      }
    });
  },

  send (packet) {
    var username = window.location.search.split("=")[1];
    var $form = $('input');
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
  },

  addMessage (datum) {
    datum.text = xssFilters.inHTMLData(datum.text);
    datum.username = xssFilters.inHTMLData(datum.username);
    var $chatDiv = `<div chat><div class="username">${datum.username}</div><div class="createdAt">${datum.createdAt}</div><div class="text">${datum.text}</div></div>`

    $("#chats").append(`<div chat><div class="username">${datum.username}</div>
    <div class="createdAt">${datum.createdAt}</div>
    <div class="text">${datum.text}</div></div>`);
  },
  
  addRoom (roomname) {
    roomname = xssFilters.inHTMLData(roomname);
    $('#roomSelect').append(`<option value ="${roomname}">${roomname}</option>`);
  },

  addFriend (name) {
    console.log(name);
  },

  handleSubmit (packet) {
    app.send(packet);
    console.log('submit');
  }
};

app.init();
