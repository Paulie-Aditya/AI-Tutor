# physics_agent.py
from .base_agent import BaseAgent
from backend.tools.constants import PHYSICS_CONSTANTS

class PhysicsAgent(BaseAgent):
    def __init__(self):
        super().__init__("PhysicsAgent", "You are a physics expert. Explain physics concepts and constants.")

    def respond(self, query: str) -> str:
        for key in PHYSICS_CONSTANTS:
            if key in query.lower():
                return f"{key.title()} = {PHYSICS_CONSTANTS[key]}"
        return super().respond(query)
