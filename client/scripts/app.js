


var app = {
  init: function(){
    $(document).ready(function(){
      app.fetch();
      $('#refresh').on('click', function(event){
        $('#chats').children().remove();
        app.fetch();
      });
      $('#submit').on('click', function() {
        app.send();
      });
    });
  },

  fetch: function(){

    $.ajax(
    {
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'GET',
      data: {"order":"-updatedAt"},
      success: function(info) {

        var data = info.results;
        var rooms = {};

        data.forEach( function(datum){
          if(rooms[datum.roomname] !== undefined) {
            rooms[datum.roomname].push(datum);
          } else {
            rooms[datum.roomname] = [];
            rooms[datum.roomname].push(datum);
          }
          datum.text = xssFilters.inHTMLData(datum.text);
          datum.username = xssFilters.inHTMLData(datum.username);
          var $chatDiv = `<div chat><div class="username">${datum.username}</div><div class="createdAt">${datum.createdAt}</div><div class="text">${datum.text}</div></div>`

          $("#chats").append(`<div chat><div class="username">${datum.username}</div>
            <div class="createdAt">${datum.createdAt}</div>
            <div class="text">${datum.text}</div></div>`);
        });

        for(var key in rooms){
          $('select').append(`<option value ="${key}">${key}</option>`);
        }
      }
    });
  },

  send: function(packet){
           
    var dataPacket = packet || {
      roomname: $option.val(),
      text: $form[0].value,
      username: username
    };
    var username = window.location.search.split("=")[1];
    var $form = $('input');
    var $option = $('select');
    $.ajax({
      url: 'https://api.parse.com/1/classes/chatterbox',
      type: 'POST',
      data: JSON.stringify(dataPacket),
      success: function(){
        console.log("Posted!");
      }
    })
  }
};

app.init();
