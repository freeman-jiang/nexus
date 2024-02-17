import os

import chromadb
import dotenv
import together

dotenv.load_dotenv()
TOGETHER_API_KEY = os.getenv("TOGETHER_API_KEY")
if not TOGETHER_API_KEY:
    raise ValueError("TOGETHER_API_KEY is not set")

together.api_key = TOGETHER_API_KEY
model_list = together.Models.list()
model = "Qwen/Qwen1.5-72B"

# print([model["name"] for model in model_list])

test_name = ""
test_msg = """"""

prompt = f"""
 Given the following intro message:

Name: "{test_name}"
Message: "{test_msg}"


Please extract the following properties for this person.

interface Response {{
  // If a property is not known, it can be left out
  school?: string; // eg. University of Michigan, University of Waterloo
  name?: string; // eg. John Doe, Jane Smith
  year?: string; // eg. Sophomore, Senior, Graduate
  major?: string; // eg. Computer Science
  background: string; // optimize for embedding search, remove punctuation, keep keywords, remove people's names, only keep relevant information. remove emojis.
  interests: string; // optimize for embedding search: remove punctuation, keep keywords, remove other people's names, only keep relevant information
}}

Please return your answer in the form of a JSON object conforming to the Typescript interface definition ONLY. Do not output anything else.
"""

print(prompt)

generation = together.Complete.create(
    max_tokens=256,
    stop=["\n\n"],
    temperature=0.5,
    top_k=10,
    prompt=prompt,
    model=model
)

text = generation['output']['choices'][0]['text']
print(text)


exit(0)


chroma_client = chromadb.Client()


collection = chroma_client.create_collection(name="my_collection")


collection.add(
    documents=["This is a document",
               "This is another document",
               "I am currently a student (MBA) at Carnegie Mellon. My undergrad major is Computer Science. I worked for 4 years as a software engineer (full stack dev ). Participated in various hackathons such as RedHacks by Cornell, NASA Space App Challenge, and HackPrinceton. Very interested in AR/VR-related technology. I am very excited to create something great! Looking forward to creating something new in the healthcare or sustainability track.",  # 3: VR healthcare
               "I'm a current senior at Berkeley studying CS. My main technical passions are computer vision, ML, AR/VR, but I'm excited about solving all types of problems. My most fluent languages are Python, Java, and C++. I have a good amount of experience with full stack development across a couple different frameworks.",  # 4: ML, AR/VR
               "I have experience working in all sorts of technology stacks from frontend, backend, and also have experience working with LLM, and machine learning. I'm thinking about make a cool mobile app for the entertainment track.",  # 5: LLM, ML
               ],
    ids=["1", "2", "3", "4", "5"]
)


results = collection.query(
    query_texts=[
        "LLM experience"],
    n_results=2
)

print(results)
