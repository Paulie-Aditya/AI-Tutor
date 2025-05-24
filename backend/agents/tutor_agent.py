from .math_agent import MathAgent
from .physics_agent import PhysicsAgent
from .chemistry_agent import ChemistryAgent
from .history_agent import HistoryAgent
from .base_agent import BaseAgent
import json

# MAX_TOKENS_APPROX = 5000 * 4  # ~4 chars per token (safe estimate)
MAX_MESSAGES = 10

class TutorAgent(BaseAgent):
    def __init__(self):
        super().__init__("TutorAgent", """
            You are a subject classifier for a multi-agent tutor system. Given a student query, your job is to identify the appropriate subject agent that should handle it.

            Available agents:
            - MathAgent: Arithmetic, algebra, calculus, equations, statistics.
            - PhysicsAgent: Force, motion, energy, mass, velocity, Newton's laws.
            - ChemistryAgent: Atoms, molecules, reactions, periodic table, acids and bases.
            - HistoryAgent: Historical events, timelines, famous leaders, ancient civilizations.

            Respond in the following JSON format:
            {
                "subject": "MathAgent" | "PhysicsAgent" | ChemistryAgent | HistoryAgent | "Unknown",
                "reason": "<short explanation>"
            }
        """)
        self.math_agent = MathAgent()
        self.physics_agent = PhysicsAgent()
        self.chemistry_agent = ChemistryAgent()
        self.history_agent = HistoryAgent()

    def route(self, messages: list[dict]) -> dict:
        # Trim message history to fit under token and message limit
        trimmed_messages = self._trim_messages(messages)

        # Extract latest question from user
        user_query = ""
        for msg in reversed(trimmed_messages):
            if msg["role"] == "user":
                user_query = msg["content"]
                break

        if not user_query:
            return {
                "agent": "Unknown",
                "response": "No user question found in the message history.",
                "reason": "Missing user query."
            }

        # Send classification request
        classification_prompt = trimmed_messages + [
            {
                "role": "user",
                "content": f"""Classify the following query (Keep in mind the previous messages as well):
                Query: {user_query}

                Respond in this JSON format:
                {{
                    "subject": "MathAgent" | "PhysicsAgent" | ChemistryAgent | HistoryAgent | "Unknown",
                    "reason": "<short explanation>"
                }}
                """
            }
        ]

        try:
            raw_response = super().respond(classification_prompt)
            raw_response = raw_response.strip("```json ").lstrip().rstrip().rstrip("```")
            data = json.loads(raw_response)

            subject = data.get("subject", "Unknown")
            reason = data.get("reason", "No reason provided.")

            if subject == "MathAgent":
                result = self.math_agent.respond(reason + user_query)
            elif subject == "PhysicsAgent":
                result = self.physics_agent.respond(reason + user_query)
            elif subject == "ChemistryAgent":
                result = self.chemistry_agent.respond(reason + user_query)
            elif subject == "HistoryAgent":
                result = self.history_agent.respond(reason + user_query)    
            else:
                result = BaseAgent("BaseAgent", "This question is out of scope/not related to subjects, respond accordingly and stay on topic itself and try not to explain/expand on it too much. Politely ask them to stay on topic and show what all agents you have. (Math, Physics, History, Chemistry), Do respond politely to greetings and just try to steer the conversation in the right direction if user is going offtopic.").respond(user_query)
                # result = "This question is out of scope for me, please try another question."

            return {
                "agent": subject,
                "response": result,
                "reason": reason
            }

        except Exception as e:
            return {
                "agent": "Unknown",
                "response": f"Classification failed. Error: {str(e)}",
                "reason": "Gemini classification failed."
            }

    def _trim_messages(self, messages):
        # First limit by message count
        if len(messages) > MAX_MESSAGES:
            messages = messages[-MAX_MESSAGES:]

        # Then limit by token size approximation
        # total_chars = sum(len(m["content"]) for m in messages)
        # while total_chars > MAX_TOKENS_APPROX and len(messages) > 1:
        #     messages.pop(0)
        #     total_chars = sum(len(m["content"]) for m in messages)

        return messages
