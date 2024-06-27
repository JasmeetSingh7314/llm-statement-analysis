import json
from extract_statements import BankStatement
import re
from typing import List


from pydantic import BaseModel,Field, ValidationError, ValidationInfo, model_validator

from extract_statements import client

class Fact(BaseModel):
    fact: str = Field(...)
    substring_quote: List[str] = Field(...)

    @model_validator(mode="after")
    def validate_sources(self, info: ValidationInfo) -> "Fact":
        text_chunks = info.context.get("text_chunk", None)
        spans = list(self.get_spans(text_chunks))
        self.substring_quote = [text_chunks[span[0] : span[1]] for span in spans]
        return self

    def get_spans(self, context):
        for quote in self.substring_quote:
            yield from self._get_span(quote, context)

    def _get_span(self, quote, context):
        for match in re.finditer(re.escape(quote), context):
            yield match.span()

class QuestionAnswer(BaseModel):
    question: str = Field(...)
    answer: List[Fact] = Field(...)

    @model_validator(mode="after")
    def validate_sources(self) -> "QuestionAnswer":
        self.answer = [fact for fact in self.answer if len(fact.substring_quote) > 0]
        return self

def ask_ai(question:str, context: str) -> QuestionAnswer:
   

    # problem=f'Does this Transaction \n {question.description} \n exist in the above text?'
    response= client.chat.completions.create(
        model="claude-3-haiku-20240307",
        max_tokens=4096,
        temperature=0,
        response_model=QuestionAnswer,
        messages=[
            {
                "role": "system",
                "content": "You are a world class algorithm to answer questions with correct and exact citations.Give the exact response to every question also each question MUST have a single answer",
            },
            {"role": "user", "content": f"{context}"},
            {"role": "assistant", "content": "Please provide the question."},
            {"role": "user", "content": f"Question:{question}"}
        ],
        validation_context={"text_chunk": context},
    )
    print(response)
    try:
        return response
    except ValidationError as e:
        print("Validation error:", e.json())
        raise e
    

# def ask_ai(question:str, context: str) -> QuestionAnswer:
   

#     # problem=f'Does this Transaction \n {question.description} \n exist in the above text?'
#     response= client.chat.completions.create(
#         model="claude-3-haiku-20240307",
#         max_tokens=4096,
#         temperature=0,
#         response_model=QuestionAnswer,
#         messages=[
#             {
#                 "role": "system",
#                 "content": "You are a world class algorithm to answer questions with correct and exact citations.Give the exact response to every question also each question MUST have a single answer",
#             },
#             {"role": "user", "content": f"{context}"},
#             {"role": "assistant", "content": "Please provide the question."},
#             {"role": "user", "content": f"Question:{question}"}
#         ],
#         validation_context={"text_chunk": context},
#     )
#     print(response)
#     try:
#         return response
#     except ValidationError as e:
#         print("Validation error:", e.json())
#         raise e