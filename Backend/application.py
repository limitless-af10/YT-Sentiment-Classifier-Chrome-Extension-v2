from flask import Flask, render_template, request, make_response, Response, jsonify
import time
import pandas as pd
import scrape

#----------------------------------------------------------------------------#
# App Config.
#----------------------------------------------------------------------------#

app = Flask(__name__)

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
    urlString = urlReceived.decode("utf-8")
    print(urlString)

    #testURL= "https://www.youtube.com/watch?v=jNQXAC9IVRw"
    #scrape.getAndDisplayComments(testURL)
    
    response = make_response('Hello')
    response.headers.add('Access-Control-Allow-Origin', '*')
    
    return response

        