# math_agent.py
from .base_agent import BaseAgent
from backend.tools.calculator import safe_eval

class MathAgent(BaseAgent):
    def __init__(self):
        super().__init__("MathAgent", "You are a math expert. Help solve math problems and equations.")

    def respond(self, query: str) -> str:
        if any(op in query for op in ["+", "-", "*", "/", "^"]):
            return safe_eval(query)
        return super().respond(query)
