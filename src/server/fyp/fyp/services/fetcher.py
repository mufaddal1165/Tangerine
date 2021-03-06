from pymongo import MongoClient
from constants import _MONGODB,_MONGOC
from pprint import pprint
from services.word_cloud import generate_word_cloud

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

def get_scatter(attr1,attr2,attr3):
    
    pipeline = [
        {
            '$project':{
                'attr1':'$%s'%attr1,
                'attr2':'$%s'%attr2,
                'attr3':'$%s'%attr3,
                '_id':0
            }
        }
    ]
    res = collection.aggregate(pipeline)
    groups = dict()
    for i,doc in enumerate(res):
        groups[i] = doc
    return groups

def get_attributes():

    att = dict()
    attr = [key for key in collection.find_one()]
    att[0] = dict(attributes=attr)
    return att

def get_word_cloud(query):
    cloud = dict()
    wordcloud = generate_word_cloud(query)
    cloud[0] = dict(cloud = wordcloud)
    return cloud