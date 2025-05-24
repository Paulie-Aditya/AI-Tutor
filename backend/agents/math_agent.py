from .base_agent import BaseAgent
from tools.calculator import safe_eval

class MathAgent(BaseAgent):
    def __init__(self):
        # super().__init__("MathAgent", "You are a math expert. You will be given queries and your task is to break them down into simple arithmetic equations such that they can be calculated by a calculator. DO NOT respond with anything else, only the arithmetic equation.")
        super().__init__("MathAgent", "You are a math expert. Help solve math problems and equations.")
    def respond(self, query: str) -> str:
        # Math agent needs to be worked upon, gemini is not good
        return super().respond(query)
