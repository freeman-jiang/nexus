import os
from typing import Optional

import dotenv
import together
from pydantic import BaseModel, ValidationError
from tenacity import (retry, stop_after_attempt, wait_random,
                      wait_random_exponential)

model = "mistralai/Mixtral-8x7B-Instruct-v0.1"


class Person(BaseModel):
    school: str
    major: str
    background: str
    name: str
    interests: str


@retry(wait=wait_random_exponential(min=1, max=60), stop=stop_after_attempt(5))
def extract_person(name: str, msg: str) -> Person:
    print(f"Extracting person: {name}")
    prompt = f"""Given the following intro message:

Name: "{name}"
Message: "{msg}"
Please extract the following properties for this person.
interface Response {{
  // If a property is not known, put empty string
  school: string; // eg. University of Michigan, University of Waterloo
  name: string; // eg. John Doe, Jane Smith
  major: string; // eg. Computer Science
  background: string; // optimize for embedding search, remove punctuation, keep keywords, remove people's names, only keep relevant information. remove emojis.
  interests: string; // optimize for embedding search: remove punctuation, keep keywords, remove other people's names, only keep relevant information
}}

Please return your answer in the form of a JSON object conforming to the Typescript interface definition ONLY. DO NOT change the format of the JSON object. Make sure to include school, name, major, background, interests. DO NOT include any other information in your response. DO NOT include links. Your response:
"""

    for _ in range(5):  # Retry up to 5 times
        try:
            generation = together.Complete.create(
                max_tokens=256,
                stop=["\n\n"],
                temperature=0.5,
                top_k=10,
                prompt=prompt,
                model=model
            )

            raw_json = generation['output']['choices'][0]['text']
            # Extract the {} from the string
            raw_json = raw_json[raw_json.find("{"): raw_json.rfind("}") + 1]

            person = Person.model_validate_json(raw_json)
            person.name = name
            return person
        except ValidationError:
            print(f"Validation error, retrying generation: {raw_json}")
            continue  # If validation error occurs, retry the generation

    raise Exception("Failed to generate valid person after 3 attempts")
