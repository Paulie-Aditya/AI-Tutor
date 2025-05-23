import os
import google.generativeai as genai
from dotenv import load_dotenv

load_dotenv()
genai.configure(api_key=os.environ.get("GEMINI_API_KEY"))


class BaseAgent:
    def __init__(self, name: str, instructions: str):
        self.name = name
        self.instructions = instructions
        self.model = genai.GenerativeModel('gemini-2.0-flash')
    
    def respond(self, query: str)-> str:
        try:
            response = self.model.generate_content(f"{self.instructions}\nUser: {query}")
            return response.text
        except Exception as e:
            return f"Agent {self.name} failed: {str(e)}"