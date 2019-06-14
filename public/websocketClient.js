const url = 'ws://localhost:8081/'
const connection = new WebSocket(url);
var id = '25287289'

connection.onopen = () => {
  connection.send('setup:'+ id); 
}

connection.onerror = (error) => {
  console.log(`WebSocket error: ${error}`)
}

connection.onmessage = (e) => {
  $('.content-root').html(e.data);
}

window.onbeforeunload = function(event) {
  connection.close();
};