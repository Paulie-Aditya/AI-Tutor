from flask import Flask, jsonify, request
from dotenv import load_dotenv
from agents.tutor_agent import TutorAgent
from flask_cors import CORS


app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})
tutor_agent = TutorAgent()

load_dotenv()


@app.route("/",methods=["GET"])
def hello():
    return {"message":"hello world"}

@app.route("/api/chat", methods=["POST"])
def chat():
    # will have to introduce chat id based messages retrieval, since frontend might not be able to send in all messages from frontend 
    try:
        data = request.get_json()
        messages = data.get("messages",[])

        if not messages:
            return jsonify({"error": "Missing messages"}), 400

        response = tutor_agent.route(messages)
        messages.append({
            "role": "assistant",
            "content": response.get("response", "")
        })
        return jsonify(response)

    except Exception as e:
        return jsonify({"error": f"Server error: {str(e)}"}), 500
    
# @app.route("/ask", methods=["GET"])
# def ask_question():
#     data = request.args
#     question = data.get("question")
#     return jsonify(TutorAgent().route(question))

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({"status": "ok", "message": "Tutor system is healthy."}), 200

@app.route("/api/agents", methods=["GET"])
def agent_status():
    return jsonify({
        "available_agents": ["TutorAgent", "MathAgent", "PhysicsAgent", "ChemistryAgent", "HistoryAgent"],
        "status": "all agents loaded"
    })

if __name__ == "__main__":
    app.run(debug=True)