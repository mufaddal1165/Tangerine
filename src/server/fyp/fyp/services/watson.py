import json
from watson_developer_cloud import AlchemyLanguageV1
import sys
import nltk

alchemy_language = AlchemyLanguageV1(api_key="f53bb91c5c1199aa4d7f811348600fea99e4297e")
# print(json.dumps(alchemy_language.combined(url=r"./docs/inaugural_address_obama_2009.txt"
# , extract='entities,keywords',  sentiment=True, max_items=100),indent=2))
def get_entities(corpus):
    return alchemy_language.combined(text=str(corpus),extract='entities',sentiment=True,max_items=100)

def get_keywords(corpus):
    return alchemy_language.combined(text=str(corpus),extract='keywords',sentiment=True,max_items=100)
