import json
import nltk
from nltk.collocations import BigramCollocationFinder,BigramAssocMeasures,TrigramAssocMeasures,TrigramCollocationFinder
import refinery
from nltk.tokenize import word_tokenize
import itertools
from nltk.corpus import stopwords as stopwords
from nltk.probability import FreqDist
from time import time
from matplotlib import pyplot as plt
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import csv
import numpy
import watson

def get_collocations(doc):
    bigram_measures = BigramAssocMeasures()
    trigram_measures = TrigramAssocMeasures()
    tokenized = word_tokenize(doc)
    bigram_finder = BigramCollocationFinder.from_words(tokenized)
    trigram_finder = TrigramCollocationFinder.from_words(tokenized)
    return (bigram_finder.nbest(bigram_measures.pmi,5),trigram_finder.nbest(trigram_measures.pmi,5))

def get_assoc(df,entity,corpus):
    """
    gets associations of every entity and saves them in a dictionary 'assos_list'
    watson.get_keywords() send request to watson.
    df is a dataframe containing term document matrix. 
    df.xs gives a vector in which each element represent the number of times an entity occurs in a document
    a sub-vector containing non-zero values is filtered. 
    """
    assoc_list = []
    try:
        docs_vector = df.xs(entity)
        docs_with_entity = docs_vector.nonzero()
        print(docs_with_entity)
        str_docs_with_entity = ""
        for doc in docs_with_entity[0]:
            str_docs_with_entity += ". "+corpus[doc]
        api_response = watson.get_keywords(str_docs_with_entity)
        if api_response['status'] == "OK":
            keywords = api_response['keywords']
            for keywordObj in keywords:
                assoc_list.append({"word":keywordObj['text'],"sentiment":keywordObj['sentiment']})

    except Exception as e:
        print(e)
    return assoc_list

stopset=set(stopwords.words('english'))
t0 = time()
# data  sample.jsonl is obtained through scraper
corpus = refinery.get_clean_tweets(r'../data/sample.jsonl')
print("time to read corpus %s"%(time()-t0))
vectorizer = CountVectorizer(stop_words = stopset)
tdm = vectorizer.fit_transform(corpus)
df = pd.DataFrame(tdm.toarray().transpose(),index = vectorizer.get_feature_names())
df.to_csv(path_or_buf='tdm.csv', sep=",", na_rep='', float_format=None, columns=None, header=True, index=True, index_label=None, mode='w', encoding=None, compression=None, quoting=None, quotechar='"', line_terminator='\n', chunksize=None, tupleize_cols=False, date_format=None, doublequote=True, escapechar=None, decimal='.')

""" results are generated usind sample.jsonl file. The script which sends request is this 
   results = watson.get_entities(corpus)
    with open('../watson_results/results_sample.json',mode='w') as fp:
        json.dump(results,fp)
    fp.close()

"""
with open('../watson_results/results_sample.json', mode='r') as fp:
    obj = json.load(fp)
fp.close()

# file word_cloud / word_cloud_trial contains the josnl which can be rendered into a word cloud
with open('../watson_results/word_cloud_trial.jsonl',mode='w') as fp:

    entities = obj['entities']
    for entity in entities[:2]:
        if int(entity['count']) > 0:
            ent = entity['text']
            print(entity['count']," : ",ent)
            if " " in ent:
                tmp = []
                for comp in ent.split(" "):
                    tmp.append((get_assoc(df,comp,corpus)))
                entity['assoc'] = tmp
            else:
                entity['assoc'] = get_assoc(df,ent,corpus)
            json.dump(entity, fp)
            fp.write('\n')
fp.close()

# print(get_assoc(df, 'thursday',corpus))
