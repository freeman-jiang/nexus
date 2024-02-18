var createGraph = require("ngraph.graph");
var g = createGraph();

var nodes = require("../data.js").nodes;
var links = require("../data.js").links;

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

var searchQuery = "Waterloo";
var matchingIds = searchByNameOrSchool(nodes, searchQuery);
console.log(matchingIds);
