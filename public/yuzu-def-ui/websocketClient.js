var container = document.createElement("DIV"),
    iframe = document.createElement("IFRAME"),
    resizeHandle = document.createElement("DIV"),
    stylesheetLink  = document.createElement('LINK');
    closeButton  = document.createElement('BUTTON'),
    closeButtonInnerHTML = '<span class="yuzu-overlay__close__icon"></span><span class="yuzu-overlay__close__text">Close</span>',
    openButton  = document.createElement('BUTTON'),
    openButtonInnerHTML = '<span class="yuzu-overlay__open__icon"></span><span class="yuzu-overlay__open__text">Dev Tools</span>',
    toggleClass = 'yuzu-overlay--is-open',
    alignRightClass = 'yuzu-overlay--dock-right',
    overlayCookieName = 'yuzu-overlay-user-settings',
    isDragging = false,
    newOverlayWidth = 0,
    overlayResizeInertiaPx = 10;

var defaultOverlayUserSettings= {
  isOpen: false,
  overlayWidth: 300,
  isDockedRight: false
};

var userSettings = {};

function randomIntFromInterval(min,max) // min and max included
{
    return Math.floor(Math.random()*(max-min+1)+min);
}

var setupWs = function(wsId) {
  const url = 'ws://localhost:8081/'
  const connection = new WebSocket(url);
  
  connection.onopen = function() {
    connection.send('setup:'+ wsId); 
  }
  
  connection.onerror = function(error) {
    console.log('WebSocket error: ' + error);
  }
  
  connection.onmessage = function(e) {

    var response = JSON.parse(e.data);

    if(response.action == 'preview') {
      document.querySelector('.content-root').innerHTML = response.data;
    }
    if(response.action == 'setActive') {
      var block = document.querySelector("[data-yuzu='"+ response.data.path +"']");

      if(response.data.isActive === "true") {
        block.style.border = "5px solid red";
      }
      else {
        block.style.removeProperty('border');
      }
    }
  }
  
  window.onbeforeunload = function(event) {
    connection.close();
    createCookie(overlayCookieName, JSON.stringify(userSettings), 365);
  };
};

var createCookie = function (name, value, expires, path) {
  var cookieString = name + "=" + value + "; ";
    expiryDate= '';

  if(typeof expires === 'number') {
    expiryDate = this.getDaysFromNow(expires);
    cookieString += 'expires=' + expiryDate + '; ';
  }
  
  cookieString += path == undefined ? 'path=/' : 'path=' + path;
  document.cookie = cookieString;
};

var checkCookies = function (name) {
  var nameEQ = name + "=";
  var cookieArray = document.cookie.split(';');

  for (var i = 0; i < cookieArray.length; i++) {
    var c = cookieArray[i];

    // Remove spaces
    while (c.charAt(0) == ' ') {
      c = c.substring(1, c.length);
    }

    // If cookie found
    if (c.indexOf(nameEQ) === 0) {
      return c.substring(nameEQ.length, c.length);
    } 
  }
  return null;
};

var getDaysFromNow = function(days) {
  var date = new Date();
  date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));				
  return date.toGMTString();
};

var toggleOverlay = function(e) {
  container.classList.toggle(toggleClass);
  userSettings.isOpen = !userSettings.isOpen;
};

var yuzuMouseMoveEvent = function(e) {
  newOverlayWidth = userSettings.isDockedRight ? window.innerWidth - e.clientX : e.clientX;

  if(isDragging || Math.abs(userSettings.overlayWidth - newOverlayWidth) > overlayResizeInertiaPx) {
    isDragging = true;
    container.classList.add('yuzu-overlay--is-dragging');
    container.style.width = newOverlayWidth + 'px';
  }
};

var addResizeEvents = function() {
  resizeHandle.addEventListener('mousedown', function(e) {
    document.addEventListener('mousemove', yuzuMouseMoveEvent);
  });
  document.addEventListener('mouseup', function(e){
    if(isDragging) {
      document.removeEventListener('mousemove', yuzuMouseMoveEvent);
      container.classList.remove('yuzu-overlay--is-dragging');
      userSettings.overlayWidth = newOverlayWidth;
      isDragging = false;
    }
  });
};

var addOverlayRepositionEvents = function() {
  resizeHandle.addEventListener('dblclick', function (e) {
    container.classList.toggle(alignRightClass);
    userSettings.isDockedRight = !userSettings.isDockedRight;
  });
};

var addOverlayToggleEvents = function() {
  openButton.addEventListener('click', toggleOverlay);
  closeButton.addEventListener('click', toggleOverlay);
};

var setupHTML = function() {
  stylesheetLink.rel  = 'stylesheet';
  stylesheetLink.type = 'text/css';
  stylesheetLink.href = '/yuzu-def-ui/overlay.css';
  
  container.classList.add('yuzu-overlay');
  container.style.width = userSettings.overlayWidth + 'px';
  if(userSettings.isOpen) {
    container.classList.add(toggleClass);
  }
  if(userSettings.isDockedRight) {
    container.classList.add(alignRightClass);
  }

  resizeHandle.classList.add('yuzu-overlay__resize-handle');
  resizeHandle.setAttribute('title', 'Double click to switch between left/right alignment');

  openButton.classList.add('yuzu-overlay__open');
  openButton.innerHTML = openButtonInnerHTML;

  closeButton.classList.add('yuzu-overlay__close');
  closeButton.innerHTML = closeButtonInnerHTML;

  iframe.classList.add('yuzu-overlay__content');
  iframe.setAttribute("frameborder", "0");
  iframe.setAttribute("scrolling", "0");
  iframe.setAttribute("src", src="/yuzu-def-ui/index.html?wsId="+ wsId);
}

var initialiseSettings = function() {
  var cookieSettings = checkCookies(overlayCookieName);

  if(cookieSettings) {
    userSettings = JSON.parse(cookieSettings);
  }
  else {
    createCookie(overlayCookieName, JSON.stringify(defaultOverlayUserSettings), 365);
    userSettings = defaultOverlayUserSettings;
  }
};

var addIframe = function(wsId) {
  initialiseSettings();
  setupHTML();

  container.appendChild(iframe);
  container.appendChild(resizeHandle);
  container.appendChild(stylesheetLink);
  container.appendChild(closeButton);
  container.appendChild(openButton);
  document.getElementsByTagName("body")[0].appendChild(container);

  addResizeEvents();
  addOverlayToggleEvents();
  addOverlayRepositionEvents();
}

var wsId = randomIntFromInterval(100000, 999999);
setupWs(wsId);
addIframe(wsId);