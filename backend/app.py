from flask import Flask, jsonify, request
from dotenv import load_dotenv
from agents.tutor_agent import TutorAgent
from flask_cors import CORS

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})

load_dotenv()


@app.route("/",methods=["GET"])
def hello():
    return {"message":"hello world"}

@app.route("/ask", methods=["GET"])
def ask_question():
    data = request.args
    question = data.get("question")
    return jsonify(TutorAgent().route(question))


if __name__ == "__main__":
    app.run(debug=True)