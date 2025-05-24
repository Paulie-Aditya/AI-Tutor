from .math_agent import MathAgent
from .physics_agent import PhysicsAgent
from .base_agent import BaseAgent
import json

class TutorAgent(BaseAgent):
    def __init__(self):
        super().__init__("TutorAgent", f"""
                You are a subject classifier for a multi-agent tutor system. Given a student query, your job is to identify the appropriate subject agent that should handle it.

                Available agents:
                - MathAgent: Arithmetic, algebra, calculus, equations, statistics.
                - PhysicsAgent: Force, motion, energy, mass, velocity, Newton's laws.

                Respond in the following JSON format:
                {{
                "subject": "MathAgent" | "PhysicsAgent" | "Unknown",
                "reason": "<short explanation>"
                }}
            """)
        self.math_agent = MathAgent()
        self.physics_agent = PhysicsAgent()

    def route(self, query: str) -> dict:
        data = super().respond("Query: " + query)
        data = data.strip("```json ").lstrip().rstrip().rstrip("```")
        data = eval(data)
        try:
            subject = data.get("subject", "Unknown")
            reason = data.get("reason", "No reason provided.")

            if subject == "MathAgent":
                result = self.math_agent.respond(query)
            elif subject == "PhysicsAgent":
                result = self.physics_agent.respond(query)
            else:
                result = "This question is out of scope for me, please try another question."
                # result = super().respond(query)  # fallback to Gemini

            return {
                "agent": subject,
                "response": result,
                "reason": reason
            }
        except Exception as e:
            return {
                "agent": "Unknown",
                "response": f"Failed to classify query. Error: {str(e)}",
                "reason": "Gemini classification failed."
            }
