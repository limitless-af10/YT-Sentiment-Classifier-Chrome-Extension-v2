import pandas as pd
from keras.preprocessing.sequence import pad_sequences
from nltk.tokenize import word_tokenize
import re
import numpy as np

def clean_text(data):
    
    # remove hashtags and @usernames
    data = re.sub(r"(#[\d\w\.]+)", '', data)
    data = re.sub(r"(@[\d\w\.]+)", '', data)
    
    # tekenization using nltk
    data = word_tokenize(data)
    
    return data

pd.set_option("display.max_rows", None, "display.max_columns", None)

def storeCommentsToCsv(comments):
    try:
        file_df = pd.read_csv('comments.csv',usecols=[1,2,3],header=0)
    except:
        columns = ['cid','text','emotion']
        file_df = pd.DataFrame(columns=columns)

    df=pd.DataFrame.from_dict(comments, orient='columns')
    
    try:
        file_df=file_df.append(df,ignore_index=True)
        file_df.drop_duplicates('cid', inplace=True)
    except:
        print("some error in append")

    file_df.to_csv('comments.csv', header='False')


def clean_tokenize_pad(comments, tokenizer):
    df=pd.DataFrame.from_dict(comments, orient='columns')
    Xtext=df.text
    #print(Xtext)
    text_clean=[' '.join(clean_text(text)) for text in Xtext]
    sequence_text = tokenizer.texts_to_sequences(text_clean)
    x_pad = pad_sequences(sequence_text, maxlen = 500 )
    #print(x_pad.shape)
    return x_pad

def trial(tokenizer):
    x_test = np.array(['i am unhappy'])
    x_test_sequence = tokenizer.texts_to_sequences(x_test)
    x_test_pad = pad_sequences(x_test_sequence, maxlen = 500 )
    return x_test_pad
    