from flask import Flask, jsonify, request
from dotenv import load_dotenv

app = Flask(__name__)
load_dotenv()

@app.route("/",methods=["GET"])
def hello():
    return {"message":"hello world"}

@app.route("/ask", methods=["GET"])
def ask_question():
    data = request.args
    question = data.get("question")
    

if __name__ == "__main__":
    app.run(debug=True)