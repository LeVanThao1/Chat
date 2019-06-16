$('.chat-box').hide();
$('box').hide();
const token = localStorage.getItem('token');
console.log(token);
const socket = io('http://localhost:3000?token='+token);
socket.on('error', function (err) {
    console.log(err);
});

socket.on('messages', function (data) {
    switch (data.action) {
        case 'RECEIVE':
            // console.log(data.message);
            $('.list').append('<div class="message"><p>' + data.message.content +  '</p></div>');
            return;
        case 'RECEIVE_TYPING':
            // console.log('typing');
            $('#typing').remove();
            $('.list').append('<div class="message"><p>' + '...' +  '</p></div>');
            return;
        case 'RECEIVE_DONE_TYPING':
            // console.log('done-typing');
            $('#typing').remove();
            return;
        case 'GETMS':
            // console.log(data);
            for(const message of data.messages) {
                // console.log(item.content);
                // console.log(data.user);
                // console.log(message.author);
                if(message.author._id === data.user._id) {
                    $('.list').append('<div class="message me"><p>' + message.content +  '</p></div>');    
                }
                else {
                    $('.list').append('<div class="message"><p>' + message.content +  '</p></div>');
                }
            }
            $('#group1').off('click');
            return;
        default:
            return;
    }
});
// socket.on('messages', function (data) {
//     $('.list').append(`<div class="message"> ${data} </div>`);
// });
$('#group1').click(function() {
    socket.emit('messages', { action: 'GET' }, function(err, callback) {
        if (err) {
            console.log(err);
          return alert('Oops, something went wrong!');
        }
      });
      $('.chat-box').show();
      $('box').show();
});
$('#btn-send').click(function () {
    const message = $('#send').val().trim();
    if (message) {
        socket.emit('messages',{ action: 'SEND', message }, function (err, response) {
            if (err) {
                return alert(err);
            }
            $('.list').append(`<div class="message me"><p> ${message} </p></div>`);
            $('#send').val('');
        });
    }
});
$('#send').on('keyup', function(e) {
    const message = $('#send').val().trim();
    const keycode = (event.keyCode ? event.keyCode : event.which);
    if (keycode === 13) { 
      socket.emit('messages', { action: 'SEND', message }, function(err, callback) {
        if (err) {
          alert('Oops, something went wrong!');
          return;
        }
      });
      $('.list').append(`<div class="message me"><p> ${message} </p></div>`);
      $('#send').val('');
    }
  });