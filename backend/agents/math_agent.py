from .base_agent import BaseAgent
from tools.calculator import safe_eval

class MathAgent(BaseAgent):
    def __init__(self):
        super().__init__("MathAgent", "You are a math expert. You will be given queries and your task is to break them down into simple arithmetic equations such that they can be calculated by a calculator. DO NOT add anything else, only the arithmetic equation.")

    def respond(self, query: str) -> str:
        # if any(op in query for op in ["+", "-", "*", "/", "^"]):
        return safe_eval(super().respond(query))
        return super().respond(query)
