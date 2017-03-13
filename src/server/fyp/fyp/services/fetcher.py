from pymongo import MongoClient
from constants import _MONGODB,_MONGOC

client = MongoClient()
db = client[_MONGODB]
collection = db[_MONGOC]

employees = dict()

def count_by_attr(attr):
    groups =  dict()
    pipeline = [{'$group':{'_id':'$%s'%attr,'count':{'$sum':1}}}]
    res = collection.aggregate(pipeline)
    for i,doc in enumerate(res):
        groups[i] = doc

    return groups
