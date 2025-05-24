from .base_agent import BaseAgent

class HistoryAgent(BaseAgent):
    def __init__(self):
        super().__init__("HistoryAgent", "You are a history expert. Help solve history problems and get back accurate information citing reliable resources.")
    def respond(self, query: str) -> str:
        return super().respond(query)
