var method = "GET";
var url = "https://api.ipify.org/?format=json";
var shouldBeAsync = false;
httpGet();
function httpGet() {
  // Xml Request
  var xmlHttp = new XMLHttpRequest();
  xmlHttp.open("GET", url, false); // false for synchronous request
  xmlHttp.send(null);
  let ip = JSON.parse(xmlHttp.responseText);
  localStorage.setItem("ipAddress", ip.ip);
  return xmlHttp.responseText;
}