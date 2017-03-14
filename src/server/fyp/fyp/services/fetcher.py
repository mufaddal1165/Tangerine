from pymongo import MongoClient
from constants import _MONGODB,_MONGOC
from pprint import pprint
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

def count_group_by_attr(attr1,attr2):
    groups = dict()
    pipeline = [
        {
        '$group':{
            '_id':{
                'x':"$%s"%attr1,
                'y' : "$%s"%attr2
            },
            'count':{
                '$sum':1
            }
        }
    },
    {
        '$group':{
            '_id':'$_id.x',
            'children':{'$addToSet':{
                'attr':'$_id.y',
                'count' :{'$sum':'$count'}
            }
            }
        }
    },
    {
        '$unwind':'$children'
    },
    {
        '$sort' :{'children.attr':-1}
    },
    {
        '$group':{'_id':'$_id','children':{'$push':'$children'}}
    }
    ]
    res = collection.aggregate(pipeline)
    k = 0
    j = 0
    attr_k = ''
    attr_j = ''
    data = list()
    for i,doc in enumerate(res):
        groups[i] = doc    
    return groups
