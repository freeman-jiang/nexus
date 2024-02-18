var createSettingsView = require("config.pixel");
var query = require("query-string").parse(window.location.search.substring(1));
var graph = getGraphFromQueryString(query);
var renderGraph = require("ngraph.pixel");
// var addCurrentNodeSettings = require("./nodeSettings.js");

var renderer = renderGraph(graph, {
  node: createNodeUI,
});
// var settingsView = createSettingsView(renderer);
// var gui = settingsView.gui();

// var nodeSettings = addCurrentNodeSettings(gui, renderer);

renderer.on("nodeclick", showNodeDetails);

function showNodeDetails(node) {
  // nodeSettings.setUI(nodeUI);

  graph.forEachNode(function (node) {
    var nodeUI = renderer.getNode(node.id);
    nodeUI.color = 0x4fb389;
    nodeUI.size = 20;
  });
  var nodeUI = renderer.getNode(node.id);
  nodeUI.color = 0xffe213;
  nodeUI.size = 30;
  showNodePanel(node);
}

function getGraphFromQueryString(query) {
  var graphGenerators = require("ngraph.generators");
  var createGraph = graphGenerators[query.graph] || graphGenerators.grid;
  return query.graph
    ? createGraph(getNumber(query.n), getNumber(query.m), getNumber(query.k))
    : populateGraph();
}

function getNumber(string, defaultValue) {
  var number = parseFloat(string);
  return typeof number === "number" && !isNaN(number)
    ? number
    : defaultValue || 10;
}

function populateGraph() {
  var createGraph = require("ngraph.graph");
  var g = createGraph();

  var nodes = require("./data.js").nodes;
  var links = require("./data.js").links;

  nodes.forEach(function (node) {
    g.addNode(node.id, node.data);
  });
  links.forEach(function (link) {
    g.addLink(link.source, link.target);
  });

  return g;
}

function createNodeUI(node) {
  return {
    color: 0x4fb389,
    size: 20,
  };
}

function showNodePanel(node) {
  if (document.getElementById("nodePanel")) {
    document.getElementById("nodePanel").remove();
  }
  var panel = document.createElement("div");
  panel.style.position = "absolute";
  panel.style.top = "0";
  panel.style.left = "0";
  panel.style.color = "white";
  panel.style.padding = "10px";
  panel.style.marginLeft = "20px";
  panel.style.width = "300px";
  panel.style.fontFamily = "Lucida Grande, sans-serif";
  panel.id = "nodePanel";
  panel.innerHTML = "<h1>" + node.data.name + "</h1>";
  panel.innerHTML += "<h2>" + node.data.school + "</h2>";
  panel.innerHTML += "<p>" + node.data.interests.join(", ") + "</p>";
  document.body.appendChild(panel);
}
