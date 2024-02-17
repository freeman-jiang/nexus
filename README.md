Use venv with Python 3.11.7

Put in .env

```sh
# https://api.together.xyz/settings/api-keys
TOGETHER_API_KEY="<your_api_key>"
```

```sh
python3 -m venv .venv
source .venv/bin/activate
pip install -r requirements.txt
```
