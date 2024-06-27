import json
from pprint import pprint
from dotenv import load_dotenv
from flask import Flask,request
from flask_cors import CORS
from waitress import serve
from flask_restful import reqparse, Api, Resource
from extract_statements import extract_bank_statements
from citations import ask_ai
from decompose_ques import decompose_questions

load_dotenv()
app=Flask(__name__)

api=Api(app)
CORS(app)



parser = reqparse.RequestParser()
parser.add_argument('data')



@app.route("/")
def hello():
  return "Hello World!"


class getOCR(Resource):
  def post(self):
    content_type=request.headers.get('Content-Type')
    if(content_type=='application/json'):
      res_json=request.json

      bank_statements=extract_bank_statements(res_json)
      bank_statements_dict=bank_statements.model_dump()
      
      print(json.dumps(bank_statements_dict,indent=4))
      return json.dumps(bank_statements_dict)
    
    else:
      print('Content type is not supported!!')

api.add_resource(getOCR,'/api/ocr')
# class get_question(Resource):
#   def post(self):
#     content_type=request.headers.get('Content-Type')
#     if(content_type=='application/json'):
#       res_json=request.json
#       questions_list=[]
#       bankstatements=res_json['data']
         
#       for bank_statement in bankstatements['bankstatement']:
#         questions=decompose_questions(bank_statement)
#         # pprint(questions.model_dump_json(indent=4))
#         questions_list.append(questions.model_dump())
#       print("The list of citations are:",questions_list)
      
#       result={
#         "questions":questions_list
#       }

#       return json.dumps(result)
# api.add_resource(get_question,'/api/questions')

class getCitations(Resource):
  def post(self):
    content_type=request.headers.get('Content-Type')
    if(content_type=='application/json'):
      res_json=request.json
      
      citations_list=[]
      bankstatements=res_json['data']
      
      
      for bank_statement in bankstatements['bankstatement']:
        questions=decompose_questions(bank_statement)
        # pprint(questions.model_dump_json(indent=4))
        for question in questions.plan:
           citations=ask_ai(json.dumps(question.model_dump()),res_json['text'])
           citations_list.append(citations.model_dump())
      print("The list of citations are:",citations_list)
      
      result={
        "citations":citations_list
      }

      print(json.dumps(result,indent=4))

      return json.dumps(result)


api.add_resource(getCitations,'/api/citations')

if __name__=='__main__':
  serve(app, host='0.0.0.0', port=4000,threads=4,channel_timeout=300000)