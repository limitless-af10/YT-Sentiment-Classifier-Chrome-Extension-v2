from google_trans_new import google_translator
#from googletrans import Translator
translator = google_translator()

def translateToEnglish(comment):
    #language=translator.detect(comment)
    #if(language[0]=='en'):
        #return comment
    #else:
        #print(language[0],'-> en')
        return translator.translate(comment)

'''def translateToEnglish(comment):
    language=translator.detect(comment)
    print(language.lang)
    if(language.lang=='en'):
        return comment
    else:
        print(langauge.lang,'-> en')
        print("original:" , comment)
        return translator.translate(comment, dest='en').text'''