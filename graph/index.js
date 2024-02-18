var createSettingsView = require("config.pixel");
var query = require("query-string").parse(window.location.search.substring(1));
var graph = getGraphFromQueryString(query);
var renderGraph = require("ngraph.pixel");
var addCurrentNodeSettings = require("./nodeSettings.js");

var renderer = renderGraph(graph);
var settingsView = createSettingsView(renderer);
var gui = settingsView.gui();

var nodeSettings = addCurrentNodeSettings(gui, renderer);

renderer.on("nodeclick", showNodeDetails);

function showNodeDetails(node) {
  var nodeUI = renderer.getNode(node.id);
  nodeSettings.setUI(nodeUI);
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
