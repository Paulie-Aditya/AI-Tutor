from .base_agent import BaseAgent
from tools.constants import PHYSICS_CONSTANTS
import difflib

class PhysicsAgent(BaseAgent):
    def __init__(self):
        super().__init__("PhysicsAgent", "You are a physics expert. Explain physical constants and physics concepts.")

    def get_constant_info(self, query: str):
        query = query.lower()
        all_keys = list(PHYSICS_CONSTANTS.keys())
        match = difflib.get_close_matches(query, all_keys, n=1, cutoff=0.6)

        if match:
            key = match[0]
            const = PHYSICS_CONSTANTS[key]
            return (
                f"**{key.title()}**\n"
                f"- Symbol: `{const['symbol']}`\n"
                f"- Value: `{const['value']} {const['unit']}`\n"
                f"- Description: {const['description']}"
            )
        return None

    def respond(self, query: str) -> str:
        const_info = self.get_constant_info(query)
        if const_info:
            return const_info
        return super().respond(query)
