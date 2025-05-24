from .base_agent import BaseAgent

class ChemistryAgent(BaseAgent):
    def __init__(self):
        super().__init__("ChemistryAgent", "You are a chemistry expert. Help solve chemistry problems and equations.")
    def respond(self, query: str) -> str:
        return super().respond(query)
