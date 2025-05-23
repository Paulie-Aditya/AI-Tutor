# calculator.py
import math

def safe_eval(expr: str) -> str:
    try:
        allowed_names = {
            k: v for k, v in math.__dict__.items() if not k.startswith("__")
        }
        return str(eval(expr, {"__builtins__": None}, allowed_names))
    except Exception as e:
        return f"Calculation error: {str(e)}"
