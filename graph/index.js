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

renderer.on("nodehover", showNodeDetails);

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

  const json = require("../graphData.json");

  // Extract the "nodes" and "links" from the JSON file
  var nodes = json.nodes;
  var links = json.links;

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

function showInitialNodePanel() {
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
  panel.innerHTML = "<h2>Hover over a node to see more details</h2>";
  document.body.appendChild(panel);
}

function leftInstructions() {
  var footer = document.createElement("div");
  footer.style.position = "absolute";
  footer.style.bottom = "0";
  footer.style.left = "0";
  footer.style.color = "grey";
  footer.style.padding = "10px";
  footer.style.marginLeft = "20px";
  footer.style.fontFamily = "Lucida Grande, sans-serif";
  footer.innerHTML =
    "<p>W: Move forward</p>" +
    "<p>S: Move backward</p>" +
    "<p>A: Move left</p>" +
    "<p>D: Move right</p>" +
    "<p>R: Move up</p>" +
    "<p>F: Move down</p>";
  document.body.appendChild(footer);
}

function rightInstructions() {
  var footer = document.createElement("div");
  footer.style.position = "absolute";
  footer.style.bottom = "0";
  footer.style.left = "200px";
  footer.style.color = "grey";
  footer.style.padding = "10px";
  footer.style.marginLeft = "20px";
  footer.style.fontFamily = "Lucida Grande, sans-serif";
  footer.innerHTML =
    "<p>Q: Turn clockwise</p>" +
    "<p>E: Turn counter-clockwise</p>" +
    "<p>&uarr;: Rotate up</p>" +
    "<p>&darr;: Rotate down</p>" +
    "<p>&larr;: Rotate left</p>" +
    "<p>&rarr;: Rotate right</p>";
  document.body.appendChild(footer);
}

function leftFooter() {
  leftInstructions();
  rightInstructions();
}

function rightFooter() {
  var footer = document.createElement("div");
  footer.style.position = "absolute";
  footer.style.bottom = "0";
  footer.style.right = "0";
  footer.style.color = "grey";
  footer.style.padding = "10px";
  footer.style.marginRight = "20px";
  footer.style.fontFamily = "Lucida Grande, sans-serif";
  footer.innerHTML =
    "<p>Made with love at TreeHacks&nbsp; <a target='_blank' rel='noopener noreferrer' href='https://treehacks.com'><img src='favicon.ico' width='15px' height='15px'></a></p>";
  document.body.appendChild(footer);
}

showInitialNodePanel();
leftFooter();
rightFooter();
