const NODE_COLOR = 0x059669;
const NODE_SIZE = 15;
const NODE_HOVER_COLOR = 0xffe213;
const NODE_CONNECTION_COLOR = 0xe37622;
const LINK_FROM_COLOR = 0x732196;
const LINK_TO_COLOR = 0x82a8f5;
const LINK_CONNECTION_FROM_COLOR = 0xffffff;
const LINK_CONNECTION_TO_COLOR = 0xffe213;
const SPRING_LENGTH = 110;
const SPRING_COEFF = 0.00111;
const GRAVITY = -42;
const THETA = 0.8;
const DRAG_COEFF = 0.154;
const TIME_STEP = 3;

var createSettingsView = require("config.pixel");
var query = require("query-string").parse(window.location.search.substring(1));
var graph = getGraphFromQueryString(query);
var renderGraph = require("ngraph.pixel");
// var addCurrentNodeSettings = require("./nodeSettings.js");
var THREE = require("three");
var createLayout = require("pixel.layout");

const layout = createLayout(graph);

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
renderer.focus();

// var settingsView = createSettingsView(renderer);
// var gui = settingsView.gui();

// var nodeSettings = addCurrentNodeSettings(gui, renderer);

renderer.on("nodehover", showNodeDetails);
renderer.on("nodeclick", resetNodeDetails);

function showNodeDetails(node) {
  if (!node) return;

  // nodeSettings.setUI(node);
  resetNodeDetails();

  var nodeUI = renderer.getNode(node.id);
  nodeUI.color = NODE_HOVER_COLOR;

  if (graph.getLinks(node.id)) {
    graph.getLinks(node.id).forEach(function (link) {
      var toNode = link.toId === node.id ? link.fromId : link.toId;
      var toNodeUI = renderer.getNode(toNode);
      toNodeUI.color = NODE_CONNECTION_COLOR;

      var linkUI = renderer.getLink(link.id);
      linkUI.fromColor = LINK_CONNECTION_FROM_COLOR;
      linkUI.toColor = LINK_CONNECTION_TO_COLOR;
    });
  }
  showNodePanel(node);
}

function resetNodeDetails() {
  graph.forEachNode(function (node) {
    var nodeUI = renderer.getNode(node.id);
    nodeUI.color = NODE_COLOR;
  });
  graph.forEachLink(function (link) {
    var linkUI = renderer.getLink(link.id);
    linkUI.fromColor = LINK_FROM_COLOR;
    linkUI.toColor = LINK_TO_COLOR;
  });

  if (document.getElementById("nodePanel")) {
    document.getElementById("nodePanel").remove();
  }

  showInitialNodePanel();
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

  const json = query.treehacks
    ? require("../treehacksData.json")
    : require("../graphData.json");

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
  panel.style.maxHeight = "65%";
  panel.style.overflowY = "auto";
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
    panel.innerHTML += `<p>Potential connections: ${
      graph.getLinks(node.id).length
    }</p>`;
    panel.innerHTML += `<h3>Top match:</h3>`;
    var topMatch = document.createElement("div");
    topMatch.style.display = "flex";
    topMatch.style.flexDirection = "column";
    topMatch.style.gap = "5px";
    topMatch.style.marginBottom = "10px";
    var link = graph.getLinks(node.id)[0];
    var toNode = link.toId === node.id ? link.fromId : link.toId;
    var toNodeData = graph.getNode(toNode).data;
    topMatch.innerHTML = `<strong>${toNodeData.name}</strong>`;
    topMatch.addEventListener("click", function () {
      showNodeDetails(graph.getNode(toNode));
    });
    panel.appendChild(topMatch);
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
  footer.style.fontSize = "11px";
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
  footer.style.left = "120px";
  footer.style.color = "grey";
  footer.style.padding = "10px";
  footer.style.marginLeft = "20px";
  footer.style.fontFamily = "Lucida Grande, sans-serif";
  footer.style.fontSize = "11px";
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
  footer.style.fontSize = "11px";
  footer.innerHTML =
    "<p>Made with love at TreeHacks&nbsp; <a target='_blank' rel='noopener noreferrer' href='https://treehacks.com'><img src='favicon.ico' width='15px' height='15px'></a></p>";

  const location = query.treehacks ? "index.html" : "index.html?treehacks=true";

  footer.innerHTML += `<button onclick="window.location.href='${location}'">Toggle graph</button>`;
  document.body.appendChild(footer);
}

function searchByNameOrSchool(nodes, query) {
  const resultIds = nodes
    .filter((node) => {
      const nameMatch = node.data.name
        .toLowerCase()
        .includes(query.toLowerCase());
      const schoolMatch = node.data.school
        .toLowerCase()
        .includes(query.toLowerCase());
      //   const interestMatch = node.data.interests
      //     .toLowerCase()
      //     .includes(query.toLowerCase());
      return nameMatch || schoolMatch;
    })
    .map((node) => node.id);

  return resultIds;
}

function updateNodePosition(nodeId) {
  // Example function to get the most up-to-date position of a node
  var nodeUI = renderer.getNode(nodeId);
  if (!nodeUI) return null; // Node not found

  // Assuming 'layout' is your layout engine that has the latest node positions
  var updatedPosition = layout.getNodePosition(nodeId);

  // Update the nodeUI's position if necessary
  // This step depends on whether your rendering library allows direct position updates
  nodeUI.position.x = updatedPosition.x;
  nodeUI.position.y = updatedPosition.y;
  nodeUI.position.z = updatedPosition.z; // If your layout is 3D

  return updatedPosition;
}

function focusOnNode(nodeId) {
  var position = updateNodePosition(nodeId);
}

function showSearchBar() {
  if (document.getElementById("searchBarContainer")) {
    document.getElementById("searchBarContainer").remove();
  }

  const json = require("../graphData.json");
  var nodes = json.nodes;

  var searchBarContainer = document.createElement("div");
  searchBarContainer.id = "searchBarContainer";
  searchBarContainer.style.position = "absolute";
  searchBarContainer.style.top = "20px";
  searchBarContainer.style.right = "20px";
  searchBarContainer.style.background = "rgba(255, 255, 255, 0.2)";
  searchBarContainer.style.borderRadius = "12px";
  searchBarContainer.style.border = "1px solid rgba(255, 255, 255, 0.18)";
  searchBarContainer.style.backdropFilter = "blur(5px)";
  searchBarContainer.style.padding = "20px";
  searchBarContainer.style.width = "300px";
  searchBarContainer.style.boxSizing = "border-box";
  searchBarContainer.style.fontFamily = "'Lucida Grande', sans-serif";
  searchBarContainer.style.display = "flex";
  searchBarContainer.style.flexDirection = "column";
  searchBarContainer.style.gap = "10px";

  var input = document.createElement("input");
  input.style.padding = "10px";
  input.style.borderRadius = "8px";
  input.style.border = "none";
  input.style.background = "rgba(255, 255, 255, 0.2)";
  input.style.borderRadius = "12px";
  input.style.border = "1px solid rgba(255, 255, 255, 0.18)";
  input.style.backdropFilter = "blur(5px)";

  var button = document.createElement("button");
  button.textContent = "Search";
  button.style.padding = "10px";
  button.style.borderRadius = "8px";
  button.style.border = "none";
  button.style.cursor = "pointer";
  button.style.background = "rgba(255, 255, 255, 0.4)";

  var resultsContainer = document.createElement("div");
  resultsContainer.id = "resultsContainer";
  resultsContainer.style.maxHeight = "150px";
  resultsContainer.style.overflowY = "auto";
  resultsContainer.style.marginTop = "10px";
  resultsContainer.style.display = "flex";
  resultsContainer.style.flexDirection = "column";
  resultsContainer.style.gap = "5px";
  resultsContainer.style.color = "white";

  searchBarContainer.appendChild(input);
  searchBarContainer.appendChild(button);
  searchBarContainer.appendChild(resultsContainer);

  document.body.appendChild(searchBarContainer);

  button.addEventListener("click", function () {
    resultsContainer.innerHTML = "";

    var query = input.value ? input.value : "Matthew";
    var matchingIndexes = searchByNameOrSchool(nodes, query);

    matchingIndexes.forEach((index) => {
      var node = nodes.find((node) => node.id === index);
      if (node) {
        var result = document.createElement("div");
        result.innerHTML = `<strong>${node.data.name}</strong><br>${node.data.school}<br>`;
        resultsContainer.appendChild(result);

        result.addEventListener("click", function () {
          var nodePosition = layout.getNodePosition
            ? layout.getNodePosition(node.id)
            : { x: 0, y: 0, z: 0 };
          focusOnNode(node.id);
          showNodeDetails(node);
          console.log(renderer.camera());
          console.log(nodePosition);
        });
      }
    });

    if (matchingIndexes.length === 0) {
      resultsContainer.innerHTML = "<div>No results found</div>";
    }
  });
}

function intersect(from, to, r) {
  var dx = from.x - to.x;
  var dy = from.y - to.y;
  var dz = from.z - to.z;
  var r1 = Math.sqrt(dx * dx + dy * dy + dz * dz);
  var teta = Math.acos(dz / r1);
  var phi = Math.atan2(dy, dx);

  return {
    x: r * Math.sin(teta) * Math.cos(phi) + to.x,
    y: r * Math.sin(teta) * Math.sin(phi) + to.y,
    z: r * Math.cos(teta) + to.z,
  };
}

function flyTo(camera, to, radius) {
  // if (!to || to.x === undefined || to.y === undefined || to.z === undefined) {
  //   console.error('Invalid target position:', to);
  //   return; // Exit if 'to' is not a valid object
  // }

  // var from = {
  //   x: camera.position.x,
  //   y: camera.position.y,
  //   z: camera.position.z,
  // };

  // var cameraOffset = radius / Math.tan(Math.PI / 180.0 * camera.fov * 0.5);
  // var cameraEndPos = intersect(from, to, cameraOffset);

  // if (!cameraEndPos) {
  //   console.error('Failed to calculate camera end position.');
  //   return; // Exit if 'cameraEndPos' is undefined
  // }

  camera.position.set(0, 0, 0);
  // camera.lookAt(new THREE.Vector3(to.x, to.y, to.z));
}

showSearchBar();

showInitialNodePanel();
leftFooter();
rightFooter();
