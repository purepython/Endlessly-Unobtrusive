var Endless = Class.create({});

// Change this if you want. Checks every quarter second:
Endless.delay = 0.25;

Endless.finished = false;

// Main loop.
Endless.loop = function() {
  // Check if our element is on screen.
  
  if (isOnScreen(Endless.element)) {
    if (Endless.is_loading == false) {
      Endless.is_loading = true;
      Endless.page++;
      new Ajax.Request(Endless.url, {
            method: 'get',
            parameters: 'page=' + Endless.page,
            onLoading: function() { Endless.loading(true); },
            onComplete: function() { 
              Endless.loading(false); 
              Endless.is_loading = false;
              Endless.element.writeAttribute('data-page', Endless.page);
            },
          });
    }
  }

  // Start over.
  if (!Endless.finished)
    Endless.loop.delay(Endless.delay);
}
Endless.setup = function() {
  endless = $$('[data-endless]');
  
  // No elements with data-endless attributes.
  if (endless.length == 0)
    return;

  Endless.element = endless.first();
  Endless.url = Endless.element.getAttribute('data-endless');
  if (Endless.element.hasAttribute('data-page'))
    Endless.page = parseInt(Endless.element.getAttribute('data-page'));
  else
    Endless.page = 1;

  if (Endless.element.hasAttribute('data-method'))
    Endless.method = Endless.element.getAttribute('data-method');
  else
    Endless.method = 'get';

  loadings = $$('[data-endless] > .loading');
  if (loadings.length > 0)
    Endless.loading_element = loadings.first();
  Endless.loading(false);
  Endless.element.show();
  Endless.is_loading = false;
  Endless.loop.delay(Endless.delay);
}
Endless.loading = function(toggle) {
  if (Endless.loading_element) { 
    if (toggle) {
      Endless.loading_element.setOpacity(0);
      Endless.loading_element.blindDown({ afterFinish: function() { Endless.loading_element.appear() } });
    }
    else {
      Endless.loading_element.fade({ from: 1, to: 0.00001, afterFinish: function() { Endless.loading_element.blindUp(); }});
    }
  }
}

function isOnScreen(elem) {
  //First check if elem is hidden through css as this is not very costly:
  if(elem.getStyle('display') == 'none' || elem.getStyle('visibility') == 'hidden' ){
    //elem is set through CSS stylesheet or inline to invisible
    return false;
  }
  //Now check for the elem being outside of the viewport
  var elemOffset = elem.viewportOffset();
  if(elemOffset.left < 0 || elemOffset.top < 0){ 
    //elem is left of or above viewport
    return false;
  }
  var vp = document.viewport.getDimensions();
  if(elemOffset.left + elem.getWidth() > vp.width || elemOffset.top + elem.getHeight() > vp.height){ 
    //elem is below or right of vp
    return false;
  }
  //Now check for elements positioned on top:
  //TODO: build check for this using prototype...
  //Neither of these was true, so the elem was visible:
  return true;
}

document.observe('dom:loaded', Endless.setup);
