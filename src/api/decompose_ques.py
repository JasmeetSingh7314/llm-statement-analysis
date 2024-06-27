import json

from typing import List
from pydantic import BaseModel,Field, ValidationError
from extract_statements import BankStatement,client


class Question(BaseModel):
    id: int = Field(..., description="A unique identifier for the question")
    query: str = Field(..., description="The question decomposited as much as possible")
    subquestions: List[int] = Field(
        default_factory=list,
        description="The subquestions that this question is composed of",
    )


class QueryPlan(BaseModel):
    root_question: str = Field(..., description="The root question that the user asked")
    plan: List[Question] = Field(
        ..., description="The plan to answer the root question and its subquestions"
    )

def decompose_questions(question:str):
   
    response= client.chat.completions.create(
        model="claude-3-haiku-20240307",
        max_tokens=4096,
        response_model=QueryPlan,
        messages=[
            {
                "role": "system",
                "content": "You are a query understanding system capable of decomposing a question into subquestions.",
            },
            {
                "role": "user",
                "content": f'The ultimate aim is to provide the exact citation for a specific bank statement from the given text document.Identify the transaction with fields:{question} in the text document give a summarised view.Give the heading under which the transaction is found.Give a summarised version for the transaction and confirm it.',
            },
        ],
    ) 
    print(response)
    try:
        return response
    except ValidationError as e:
        print("Validation error:", e.json())
        raise e
    

