
import json
import os
import re
from typing import List
import instructor
from instructor import Instructor
from anthropic import Anthropic
from pydantic import BaseModel,Field, ValidationError, ValidationInfo, model_validator, validator
from enum import Enum
from dotenv import load_dotenv

load_dotenv()


client = instructor.from_anthropic(Anthropic(api_key=os.getenv('ANTHROPIC_API_KEY')))



class CreditOrDebit(str,Enum):
  """Class defining type of transaction item: deposit or withdrawal"""
  credit = 'credit'
  debit = 'debit' 


class DescriptionType(str,Enum):
    """Type of the transaction based on the description"""
    asset = "asset"
    liability = "liability"
    equity = "equity" 
    revenue = "revenue" 
    expense = "expense" 
    fee='fee'


class BankStatement(BaseModel):
    """Class representing line items in a bank statement"""
    date: str
    amount: float
    description: str = Field(..., description="The exact description as given in the bank statement. Do not interpret it and add it verbatim")
    vendor_name: str = Field(..., description="The name of the vendor or company present in the description")
    transaction_description: str = Field(..., description="Summary of the description about the whole transaction ")
    credit_or_debit: CreditOrDebit=Field(...,description="Correctly assign one of the predefined card type.")
    description_label:DescriptionType=Field(...,description='Correctly assign one of the predefined description types')

    statement_No:int=Field(...,description=f'For the {description} give its position take the first line in the data as index 1 and then increment till you reach {description} return the total ')

    @validator('credit_or_debit', pre=True)
    def validate_credit_or_debit(cls, v):
        if v not in CreditOrDebit.__members__:
            raise ValueError(f"Invalid credit_or_debit value: {v}")
        return CreditOrDebit(v)

    @validator('description_label', pre=True)
    def validate_description_label(cls, v):
        if v not in DescriptionType.__members__:
            raise ValueError(f"Invalid description_label value: {v}")
        return DescriptionType(v)



class BankStatements(BaseModel):
    """Class representing bank statement items and list of all items in bank statement class"""
    checking_account_beginning_balance: float
    bankstatement: List[BankStatement]





def extract_bank_statements(data) -> BankStatement:
    
    response= client.messages.create(
        model="claude-3-haiku-20240307",
        max_tokens=4096,
        response_model=BankStatements,
        messages=[
        { "role": "system",
          "content": "The following is bank statement that need to be reconciled in the correct response model list by the transactions.",
        },
        {
          "role": "user",
          "content": f"Extract the required values such as the name of the field:{data['name']} and the value of the Field:{data['description']} and the its data type :{data['data_type']}  correctly from the following information: {data['file']} ONLY SELECT THE STATEMENTS WITH THE SAME VALUE AS {data['description']}",
        },
        ],
    )

    try:
        return response
    except ValidationError as e:
        print("Validation error:", e.json())
        raise e



