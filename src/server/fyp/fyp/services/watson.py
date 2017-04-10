import json
from watson_developer_cloud import AlchemyLanguageV1
import sys
import nltk

# print(json.dumps(alchemy_language.combined(url=r"./docs/inaugural_address_obama_2009.txt"
# , extract='entities,keywords',  sentiment=True, max_items=100),indent=2))
def get_entities(corpus):
    return alchemy_language.combined(text=str(corpus),extract='entities',sentiment=True,max_items=100)

def get_keywords(corpus):
    return alchemy_language.combined(text=str(corpus),extract='keywords',sentiment=True,max_items=100)
