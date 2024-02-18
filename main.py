
import json
import os
import time

import chromadb
import dotenv
import together

from extract import extract_person

dotenv.load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
if not TOGETHER_API_KEY:
    raise ValueError("TOGETHER_API_KEY is not set")

together.api_key = TOGETHER_API_KEY


name = "Ahmed Bakr"
msg = """Hey everyone! I’m a CS major at Minerva University. I’m looking for a team interested in one of the education and sustainability tracks. I have founded an Ed-Tech Startup which focused on the mental wellness sector and worked with many startups with crazy ideas in the education and sustainability fields so I’m in with any cool ideas in those tracks especially if it’s something with ML/AI.
Here’s my LinkedIn to connect too:
https://www.linkedin.com/in/a7medbakrr?"""
res = extract_person(name, msg)


chroma_client = chromadb.Client()

# Load a JSON array from tree-messages.json
with open("tree-messages.json", "r") as f:
    tree_messages = json.loads(f.read())

for i, message in enumerate(tree_messages[:3]):
    # Extract the name and message from the message
    name = message["Name"]
    msg = message["String"]
    # Extract the person
    person = extract_person(name, msg)
    print(person)

    # sleep every 5 iterations
    if i % 5 == 0:
        time.sleep(0.5)

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
