from flask import Flask, render_template, request, make_response, Response, jsonify
import time
import pandas as pd
import scrapev2
import data
import json
from nltk.tokenize import word_tokenize
from keras.models import load_model
from keras.preprocessing.text import tokenizer_from_json
import numpy as np
from tensorflow import keras


#----------------------------------------------------------------------------#
# App Config.
#----------------------------------------------------------------------------#

app = Flask(__name__)

encoding = {
    'joy': 0,
    'fear': 1,
    'anger': 2,
    'sadness': 3,
    'neutral': 4
}

#predictor = load_model('biLSTM_LSTM_w2v_dr35_.h5')
predictor = keras.models.load_model('biLSTM_LSTM_w2v_dr35_.h5')

with open('tokenizer.json') as f:
    data1 = json.load(f)
    tokenizer = tokenizer_from_json(data1)

def predict(comments):
    result=predictor.predict(comments)
    #print(result)
    val=(np.argmax(result,axis=1))
    #print(val)
    return val

    #print(x_test_pad.shape)
    #val=(np.argmax(predictor.predict(x_test_pad)))
    #print(list(encoding.keys())[list(encoding.values()).index(val)])

@app.route('/')
def home():
    '''index function of flask application'''
    return 'Index Function'

@app.route('/get_data/', methods=['POST', 'GET'])
def _get_data():
    
    '''receives YT video URL from the client and calls comment scrapper if applicable
       after which appropriate functions are invoked to compute or query for, sentiment
       classification results and return them ''' 

    print('get data function invoked')
    urlReceived = (request.get_data())
    url=urlReceived.decode("utf-8")
    #print(url)
    rec=json.loads(url)
    urlString=rec['info']
    translate=rec['translate']
    #print(urlString)

    comments=scrapev2.getAndDisplayComments(urlString,Translate=translate)
    #data.storeCommentsToCsv(comments)

    #print("...",comments,"....")

    if comments==[]:
        message="No Comments Found"
        jres={"msg" : message}
        response = make_response(jres)
        response.headers.add('Access-Control-Allow-Origin', '*')
        return response

    if translate==True:
        message="Result (Translate ON)"
    else:
        message="Result"
    
    processed=data.clean_tokenize_pad(comments, tokenizer)
    final_res=predict(processed)

    res_count=np.bincount(final_res,minlength=5)
    #print(res_count)

    jres={"joy" : int(res_count[0]), "fear" : int(res_count[1]), "anger": int(res_count[2]), "sadness": int(res_count[3]), "neutral" : int(res_count[4]),"msg":message}
    print(jres)
    response = make_response(jres)
    response.headers.add('Access-Control-Allow-Origin', '*')

    print(type(response))
    
    return response

        