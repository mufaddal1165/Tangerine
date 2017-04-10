import json
import nltk
import os
# from nltk.collocations import BigramCollocationFinder,BigramAssocMeasures,TrigramAssocMeasures,TrigramCollocationFinder
import services.refinery as refinery
# from nltk.tokenize import word_tokenize
import itertools
from nltk.corpus import stopwords as stopwords
from nltk.probability import FreqDist
from time import time
import pandas as pd
from sklearn.feature_extraction.text import CountVectorizer
import csv
import numpy
import services.watson as watson
import subprocess

# def get_collocations(doc):
#     bigram_measures = BigramAssocMeasures()
#     trigram_measures = TrigramAssocMeasures()
#     tokenized = word_tokenize(doc)
#     bigram_finder = BigramCollocationFinder.from_words(tokenized)
#     trigram_finder = TrigramCollocationFinder.from_words(tokenized)
#     return (bigram_finder.nbest(bigram_measures.pmi,5),trigram_finder.nbest(trigram_measures.pmi,5))

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
        # print(docs_with_entity)
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

def generate_word_cloud(query):
    p=subprocess.Popen(['node',os.path.join(os.path.dirname(__file__),os.path.join('node-scraper','scraper-cli')),'-s 2017-04-01','-u 2017-04-09','-q %s'%query,'-f %s.jsonl'%query,'-l 1000'])
    p.wait()
    stopset=set(stopwords.words('english'))
    t0 = time()
    # data  sample.jsonl is obtained through scraper
    corpus = refinery.get_clean_tweets(os.path.join(os.path.dirname(__file__),os.path.join('node-scraper','tweets','%s.jsonl-0'%query)))
    print("time to read corpus %s"%(time()-t0))
    vectorizer = CountVectorizer(stop_words = stopset)
    tdm = vectorizer.fit_transform(corpus)
    df = pd.DataFrame(tdm.toarray().transpose(),index = vectorizer.get_feature_names())
    df.to_csv(path_or_buf='tdm.csv', sep=",", na_rep='', float_format=None, columns=None, header=True, index=True, index_label=None, mode='w', encoding=None, compression=None, quoting=None, quotechar='"', line_terminator='\n', chunksize=None, tupleize_cols=False, date_format=None, doublequote=True, escapechar=None, decimal='.')


    # """ results are generated usind sample.jsonl file. The script which sends request is this 
    # results = watson.get_entities(corpus)
    results_path = os.path.join(os.path.dirname(__file__),os.pardir)
    # with open(os.path.join(results_path,'repositories/watson_results/results_sample.json'),mode='w') as fp:
    #     json.dump(results,fp)
    # fp.close()

    # """
    with open(os.path.join(results_path,'repositories/watson_results/results_sample.json'), mode='r',encoding="utf8") as fp:
        obj = json.load(fp)
    fp.close()

    results_json = []
    word_cloud_path = os.path.join(os.path.dirname(__file__),os.pardir)
    # file word_cloud / word_cloud_trial contains the josnl which can be rendered into a word cloud
    with open(os.path.join(word_cloud_path,'repositories/word_clouds/word_cloud_trial.jsonl'),mode='w') as fp:
        entities = obj['entities']
        for entity in entities:
            if int(entity['count']) > 0:
                ent = entity['text']
                # print(entity['count']," : ",ent)
                if " " in ent:
                    tmp = []
                    for comp in ent.split(" "):
                        tmp.append((get_assoc(df,comp,corpus)))
                    entity['assoc'] = tmp
                else:
                    entity['assoc'] = get_assoc(df,ent,corpus)
                results_json.append(entity)
                json.dump(entity, fp)
                fp.write('\n')
    fp.close()
    # print("results are here",results_json)
    return results_json
    # print(get_assoc(df, 'thursday',corpus))
