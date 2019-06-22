function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var setupWs = function(wsId) {
  const url = 'ws://localhost:8081/'
  const connection = new WebSocket(url);
  
  connection.onopen = () => {
    connection.send('setup:'+ wsId); 
  }
  
  connection.onerror = (error) => {
    console.log(`WebSocket error: ${error}`)
  }
  
  connection.onmessage = (e) => {

    var response = JSON.parse(e.data);

    if(response.action == 'preview') {
      $('.content-root').html(response.data);
    }
    if(response.action == 'setActive') {
      if(response.data.isActive === "true") {
        $("[data-yuzu='"+ response.data.path +"']").css("border", "5px solid red");
      }
      else {
        $("[data-yuzu='"+ response.data.path +"']").css("border", "0");
      }
    }

  }
  
  window.onbeforeunload = function(event) {
    connection.close();
  };
}

var addIframe = function(wsId) {

  var iframe = document.createElement("IFRAME");
  iframe.setAttribute("style", "position: fixed; width:40%; min-width: 9.625rem; max-width: 40rem; height: 100%; bottom: 0; left: 0; z-index: 10000;");
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("scrolling", "0");
  iframe.setAttribute("src", src="/index.html?wsId="+ wsId);

  document.getElementsByTagName("body")[0].appendChild(iframe);

}

var wsId = randomIntFromInterval(100000, 999999);
setupWs(wsId);
addIframe(wsId);