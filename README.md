# MoodSync

import openai
from openai import OpenAI

client = OpenAI(
    api_key = ""
)

response = client.responses.create(
    model="gpt-4.1",
    input="한글로 반갑게 나한테 인사해줘."
)

print(response.output_text)