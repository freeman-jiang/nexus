const NODE_COLOR = 0x059669;
const NODE_SIZE = 15;
const NODE_HOVER_COLOR = 0xffe213;
const NODE_CONNECTION_COLOR = 0xe33f22;
const LINK_FROM_COLOR = 0x732196;
const LINK_TO_COLOR = 0x5f5858;
const LINK_CONNECTION_FROM_COLOR = 0xffffff;
const LINK_CONNECTION_TO_COLOR = 0x333333;
const SPRING_LENGTH = 110;
const SPRING_COEFF = 0.00111;
const GRAVITY = -42;
const THETA = 0.8;
const DRAG_COEFF = 0.154;
const TIME_STEP = 4;

var createSettingsView = require("config.pixel");
var query = require("query-string").parse(window.location.search.substring(1));
var graph = getGraphFromQueryString(query);
var renderGraph = require("ngraph.pixel");
var addCurrentNodeSettings = require("./nodeSettings.js");

var renderer = renderGraph(graph, {
  node: () => {
    return {
      color: NODE_COLOR,
      size: NODE_SIZE,
    };
  },
  link: () => {
    return {
      fromColor: LINK_FROM_COLOR,
      toColor: LINK_TO_COLOR,
    };
  },
});

var simulator = renderer.layout().simulator;
simulator.springLength(SPRING_LENGTH);
simulator.springCoeff(SPRING_COEFF);
simulator.gravity(GRAVITY);
simulator.theta(THETA);
simulator.dragCoeff(DRAG_COEFF);
simulator.timeStep(TIME_STEP);
// renderer.focus();

var settingsView = createSettingsView(renderer);
var gui = settingsView.gui();

var nodeSettings = addCurrentNodeSettings(gui, renderer);

renderer.on("nodehover", showNodeDetails);

function showNodeDetails(node) {
  nodeSettings.setUI(node);
  if (!node) return;

  graph.forEachNode(function (node) {
    var nodeUI = renderer.getNode(node.id);
    nodeUI.color = NODE_COLOR;
  });
  graph.forEachLink(function (link) {
    var linkUI = renderer.getLink(link.id);
    linkUI.fromColor = LINK_FROM_COLOR;
    linkUI.toColor = LINK_TO_COLOR;
  });
  var nodeUI = renderer.getNode(node.id);
  nodeUI.color = NODE_HOVER_COLOR;
  graph.getLinks(node.id).forEach(function (link) {
    var toNode = link.toId === node.id ? link.fromId : link.toId;
    var toNodeUI = renderer.getNode(toNode);
    toNodeUI.color = NODE_CONNECTION_COLOR;
    var linkUI = renderer.getLink(link.id);
    linkUI.fromColor = LINK_CONNECTION_FROM_COLOR;
    linkUI.toColor = LINK_CONNECTION_TO_COLOR;
  });
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
  if (node.data.major) {
    panel.innerHTML += "<h3>Major: " + node.data.major + "</h3>";
  }

  if (node.data.interests) {
    panel.innerHTML += `<p>Interests: ${node.data.interests}</p>`;
  }

  if (node.data.background) {
    panel.innerHTML += `<p>Background: ${node.data.background}</p>`;
  }
  if (graph.getLinks(node.id)) {
    panel.innerHTML += `<p>Connections: ${graph.getLinks(node.id).length}</p>`;
  }

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
