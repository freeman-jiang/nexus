<img width="1494" alt="image" src="https://github.com/freeman-jiang/nexus/assets/56516912/b8487775-27ab-430f-a0ad-5df827655b36">

# Nexus - 3D semantic graph of hacker interests

[Nexus](https://nexusgraph.vercel.app/) is a data visualization of hacker interests at TreeHacks, Hack the North, and Calhacks.

### Quickstart 
```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```

We use [Together AI](https://www.together.ai/) for inferencing and embeddings.
Create a **.env** with

```sh
# https://api.together.xyz/settings/api-keys
TOGETHER_API_KEY="<your_api_key>"
```

Create a file called **messages-htn-calhacks.json** containing the scraped data.
```json
[
  {
    "Time": "1:47 PM",
    "Name": "John Doe",
    "String": "Hello everyone! My name is John and I'm a X year student from Y university. My background is in Z and I'm looking for ..."
  },
  ...
]
```

Run **main.py** then **build_graph.py**. Your graph will be in **graphData.json**

