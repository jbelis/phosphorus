var http = require('http');

global.XMLHttpRequest = MockXMLHttpRequest;
global.window = global;
global.document = new MockElement;


function MockXMLHttpRequest() {}

MockXMLHttpRequest.prototype.open = function(method, url) {
  if (method !== 'GET' || !/^proxy\.php\?u=/.test(url)) throw new Error;
  http.get(decodeURIComponent(url.slice(12)), function(err, data) {
    if (err || !data) this.onerror();
    else this.onload();
  }.bind(this));
};


document.createElement = function() {
  return new MockElement;
};
document.createTextNode = function() {
  return new MockTextNode;
};


function MockElement() {
  this.style = {};
}

MockElement.prototype.appendChild = function(child) {
  child.parentNode = this;
};

MockElement.prototype.addEventListener = nothing;

MockElement.prototype.getContext = function() {
  return new MockContext;
};


function MockTextNode() {
}


function MockContext() {}

MockContext.prototype.arc = nothing;
MockContext.prototype.arcTo = nothing;
MockContext.prototype.beginPath = nothing;
MockContext.prototype.bezierCurveTo = nothing;
MockContext.prototype.clearRect = nothing;
MockContext.prototype.clip = nothing;
MockContext.prototype.closePath = nothing;
// MockContext.prototype.createImageData
// MockContext.prototype.createLinearGradient
// MockContext.prototype.createPattern
// MockContext.prototype.createRadialGradient
MockContext.prototype.drawImage = nothing;
MockContext.prototype.drawCustomFocusRing = nothing;
MockContext.prototype.drawSystemFocusRing = nothing;
MockContext.prototype.fill = nothing;
MockContext.prototype.fillRect = nothing;
MockContext.prototype.fillText = nothing;
// MockContext.prototype.getImageData
// MockContext.prototype.getLineDash
MockContext.prototype.isPointInPath = no;
MockContext.prototype.isPointInStroke = no;
MockContext.prototype.lineTo = nothing;
MockContext.prototype.measureText = function() {
  return {width: 0};
};
MockContext.prototype.moveTo = nothing;
MockContext.prototype.putImageData = nothing;
MockContext.prototype.quadraticCurveTo = nothing;
MockContext.prototype.rect = nothing;
MockContext.prototype.restore = nothing;
MockContext.prototype.rotate = nothing;
MockContext.prototype.save = nothing;
MockContext.prototype.scale = nothing;
MockContext.prototype.scrollPathIntoView = nothing;
MockContext.prototype.setLineDash = nothing;
MockContext.prototype.setTransform = nothing;
MockContext.prototype.stroke = nothing;
MockContext.prototype.strokeRect = nothing;
MockContext.prototype.strokeText = nothing;
MockContext.prototype.transform = nothing;
MockContext.prototype.translate = nothing;


function nothing() {}
function no() {
  return false;
}
