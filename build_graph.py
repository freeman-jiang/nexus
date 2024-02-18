import json

from pydantic import BaseModel, RootModel

import chromadb

chroma_client = chromadb.PersistentClient(path="chromadb")

collection = chroma_client.get_collection(name="background_embeddings")


print(collection)

# Define the model for the nested "data" part


class NodeData(BaseModel):
    name: str
    interests: str
    school: str


class Node(BaseModel):
    id: str
    data: NodeData


class Link(BaseModel):
    source: str
    target: str


# Get all embeddings
results = collection.get(ids=None,  include=["metadatas", "embeddings"])
if results["embeddings"] is None or results["metadatas"] is None:
    raise ValueError("No embeddings found in the collection")

nodes: list[Node] = []
links: list[Link] = []

# For each embedding, find the 5 nearest neighbors

for i, embedding in enumerate(results["embeddings"]):

    # Get the 5 nearest neighbors to the embedding
    self_id = results["ids"][i]
    self_name = results["metadatas"][i]["name"]
    query = collection.query(
        n_results=50,
        query_embeddings=[embedding],
        include=["metadatas", "distances"],
        where={
            "name": {
                "$ne": self_name,
            }
        }
    )

    nearest_ids = query["ids"][0]

    if not query["distances"]:
        raise ValueError("No distances found in the query")
    distances = query["distances"][0]

    name = str(results["metadatas"][i]["name"])
    source_id = results["ids"][i]
    # Add the node to the list of nodes
    new_node = Node(
        id=source_id,
        data=NodeData(
            name=name,
            interests="",
            school="",
        )
    )
    # Add the node to the list of nodes
    nodes.append(new_node)

    for i, distance in enumerate(distances):
        # Append only if the distance is less than 8
        if distance < 8:
            links.append(
                Link(
                    source=source_id,
                    target=nearest_ids[i]
                )
            )


print(nodes)
print(links)

# Dump to graphData.json
with open("graphData.json", "w") as f:
    json.dump({"nodes": [n.model_dump() for n in nodes],
               "links": [l.model_dump() for l in links]}, f)
