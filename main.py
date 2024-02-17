import chromadb

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
