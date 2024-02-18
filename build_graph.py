import chromadb

chroma_client = chromadb.PersistentClient(path="chromadb")

collection = chroma_client.get_collection(name="background_embeddings")


print(collection)


# Get all embeddings
result = collection.get(ids=None,  include=["metadatas", "embeddings"])

all_embeddings = result["embeddings"]

# Calculate the pairwise distances between all embeddings
