interface Response {
  // If a property is not known, it can be left out
  school?: string; // eg. University of Michigan, University of Waterloo
  name?: string; // eg. John Doe, Jane Smith
  year?: string; // eg. Sophomore, Senior, Graduate
  major?: string; // eg. Computer Science
  background: string; // optimize for embedding search: remove punctuation, keep keywords, remove other people's names, only keep relevant information
  interests: string; // optimize for embedding search: remove punctuation, keep keywords, remove other people's names, only keep relevant information
}
