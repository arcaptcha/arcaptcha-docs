!(function () {
  var i = window.GOFTINO_WIDGET_ID,
    a = window,
    d = document;
  if (!i) {
    return;
  }
  function g() {
    var g = d.createElement("script"),
      s = "https://www.goftino.com/widget/" + i,
      l = localStorage.getItem("goftino_" + i);
    g.async = !0;
    g.src = l ? s + "?o=" + l : s;
    d.getElementsByTagName("head")[0].appendChild(g);
  }
  "complete" === d.readyState
    ? g()
    : a.attachEvent
      ? a.attachEvent("onload", g)
      : a.addEventListener("load", g, !1);
})();
