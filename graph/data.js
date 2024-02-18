const nodes = [
  {
    id: "1",
    data: {
      name: "John Doe",
      interests: ["AI", "Blockchain"],
      school: "University of Waterloo",
    },
  },
  {
    id: "2",
    data: {
      name: "Jane Doe",
      interests: ["Backend"],
      school: "Stanford University",
    },
  },
  {
    id: "3",
    data: {
      name: "James Doe",
      interests: ["iOS", "Frontend"],
      school: "MIT",
    },
  },
  {
    id: "4",
    data: {
      name: "Jill Doe",
      interests: ["Design", "Entrepreneurship"],
      school: "UC Berkeley",
    },
  },
  {
    id: "5",
    data: {
      name: "Jack Doe",
      interests: ["Data Science"],
      school: "Stanford University",
    },
  },
  {
    id: "6",
    data: {
      name: "Jenny Doe",
      interests: ["Design", "Frontend"],
      school: "University of Waterloo",
    },
  },
  {
    id: "7",
    data: {
      name: "Jared Doe",
      interests: ["Backend", "Blockchain"],
      school: "UC Berkeley",
    },
  },
  {
    id: "8",
    data: {
      name: "Jasmine Doe",
      interests: ["iOS", "Data Science"],
      school: "MIT",
    },
  },
  {
    id: "9",
    data: {
      name: "Jasper Doe",
      interests: ["AI", "Entrepreneurship"],
      school: "University of Waterloo",
    },
  },
];

const links = [
  { source: "1", target: "2" },
  { source: "1", target: "3" },
  { source: "1", target: "4" },
  { source: "1", target: "5" },
  { source: "1", target: "6" },
  { source: "1", target: "7" },
  { source: "1", target: "8" },
  { source: "1", target: "9" },
];

module.exports = {
  nodes,
  links,
};
