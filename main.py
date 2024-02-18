import json
import os
import time
from importlib import metadata
from typing import Sequence

import dotenv
import together

import chromadb
from chromadb import Documents, EmbeddingFunction, Embeddings
from extract import Person, extract_person

dotenv.load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
if not TOGETHER_API_KEY:
    raise ValueError("TOGETHER_API_KEY is not set")

together.api_key = TOGETHER_API_KEY
client = together.Together()


class CustomTogetherEmbeddingFn(EmbeddingFunction):
    def __call__(self, input: Documents) -> Embeddings:
        return get_embeddings(input)


def get_embeddings(texts: list[str]) -> list[Sequence[float]]:
    texts = [text.replace("\n", " ") for text in texts]
    outputs = client.embeddings.create(
        input=texts, model="togethercomputer/m2-bert-80M-2k-retrieval")
    return [outputs.data[i].embedding for i in range(len(texts))]


chroma_client = chromadb.PersistentClient(path="chromadb")


collection = chroma_client.get_or_create_collection(
    name="background_embeddings", embedding_function=CustomTogetherEmbeddingFn())


# Load a JSON array from tree-messages.json
with open("tree-messages.json", "r") as f:
    tree_messages = json.loads(f.read())

all_extracted: list[Person] = []

for i, message in enumerate(tree_messages):
    if len(message["String"]) < 150:
        print(f"Skipping message {i}, too short.")
        continue
    # Extract the name and message from the message
    name = message["Name"]
    msg = message["String"]

    # If person already exists in the database, skip
    ident = f"{name}_{i}"
    existing = collection.get(ids=[ident], include=["metadatas"])
    if existing["ids"]:
        metadata = existing["metadatas"][0]
        person = Person(
            background=metadata['background'],
            interests=metadata['interests'],
            major=metadata['major'] if 'major' in metadata else "",
            name=metadata['name'] if 'name' in metadata else "",
            school=metadata['school'] if 'school' in metadata else ""
        )
        all_extracted.append(person)
        print(f"Skipping {ident}, already exists.")
        continue

    # Extract the person
    person = extract_person(name, msg)
    all_extracted.append(person)

    # sleep every 5 iterations
    time.sleep(1)

    collection.upsert(
        ids=[ident],
        documents=[person.background +
                   " . Interests: " + person.interests],
        metadatas=[{"name": name, "school": str(person.school),
                   "interests": person.interests, "background": person.background}]
    )

    print(
        f"\nEmbedded person {i}: {person.name} ({person.school})",)
    print(person)

    time.sleep(1)

# Write the extracted people to a file
with open("people.json", "w") as f:
    f.write(json.dumps([person.model_dump()
            for person in all_extracted], indent=2))

#     print(person)


# collection = chroma_client.create_collection(name="my_collection")


# collection.add(
#     documents=["This is a document",
#                "This is another document",
#                "I am currently a student (MBA) at Carnegie Mellon. My undergrad major is Computer Science. I worked for 4 years as a software engineer (full stack dev ). Participated in various hackathons such as RedHacks by Cornell, NASA Space App Challenge, and HackPrinceton. Very interested in AR/VR-related technology. I am very excited to create something great! Looking forward to creating something new in the healthcare or sustainability track.",  # 3: VR healthcare
#                "I'm a current senior at Berkeley studying CS. My main technical passions are computer vision, ML, AR/VR, but I'm excited about solving all types of problems. My most fluent languages are Python, Java, and C++. I have a good amount of experience with full stack development across a couple different frameworks.",  # 4: ML, AR/VR
#                "I have experience working in all sorts of technology stacks from frontend, backend, and also have experience working with LLM, and machine learning. I'm thinking about make a cool mobile app for the entertainment track.",  # 5: LLM, ML
#                ],
#     ids=["1", "2", "3", "4", "5"]
# )


# results = collection.query(
#     query_texts=[
#         "LLM experience"],
#     n_results=2
# )

# print(results)


results = collection.query(
    query_texts=[
        "I'm a current senior at Berkeley studying CS. My main technical passions are computer vision, ML, AR/VR, but I'm excited about solving all types of problems. My most fluent languages are Python, Java, and C++. I have a good amount of experience with full stack development across a couple different frameworks."],
    n_results=10
)

print(results)
