from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
from ultralytics import YOLO
import os
import smtplib
from email.message import EmailMessage
import random


# =====================================================
# FLASK APP
# =====================================================

app = Flask(__name__)
CORS(app)


# =====================================================
# PATHS
# =====================================================

BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PROJECT_DIR = os.path.dirname(BASE_DIR)

FRONTEND_FOLDER = os.path.join(
    PROJECT_DIR,
    "frontend"
)

UPLOAD_FOLDER = os.path.join(
    BASE_DIR,
    "uploads"
)

MODEL_PATH = os.path.join(
    BASE_DIR,
    "..",
    "runs",
    "roughness",
    "street_surface_v1",
    "weights",
    "best.pt"
)

os.makedirs(UPLOAD_FOLDER, exist_ok=True)


# =====================================================
# LOAD MODEL
# =====================================================

print("Loading Road Surface Quality AI model...")

model = YOLO(MODEL_PATH)

print("Model loaded successfully!")


# =====================================================
# LOGIN PAGE
# =====================================================

@app.route("/")
def home():
    return send_from_directory(
        FRONTEND_FOLDER,
        "login.html"
    )


# =====================================================
# LOGIN CSS
# =====================================================

@app.route("/login.css")
def login_css():
    return send_from_directory(
        FRONTEND_FOLDER,
        "login.css"
    )


# =====================================================
# LOGIN JAVASCRIPT
# =====================================================

@app.route("/login.js")
def login_js():
    return send_from_directory(
        FRONTEND_FOLDER,
        "login.js"
    )


# =====================================================
# LOGIN API
# =====================================================

@app.route("/api/login", methods=["POST"])
def login():

    data = request.get_json()

    username = data.get("username")
    password = data.get("password")

    if username == "admin" and password == "admin123":

        return jsonify({
            "success": True,
            "message": "Login successful"
        })

    return jsonify({
        "success": False,
        "message": "Invalid username or password"
    }), 401


# =====================================================
# DASHBOARD
# =====================================================

@app.route("/dashboard")
def dashboard():

    return send_from_directory(
        FRONTEND_FOLDER,
        "index.html"
    )


# =====================================================
# DASHBOARD CSS
# =====================================================

@app.route("/style.css")
def css():

    return send_from_directory(
        FRONTEND_FOLDER,
        "style.css"
    )


# =====================================================
# DASHBOARD JAVASCRIPT
# =====================================================

@app.route("/script.js")
def javascript():

    return send_from_directory(
        FRONTEND_FOLDER,
        "script.js"
    )


# =====================================================
# HEALTH API
# =====================================================

@app.route("/api/health", methods=["GET"])
def health():

    return jsonify({
        "status": "online",
        "message": "Road Surface Quality AI Backend is running"
    })


# =====================================================
# SEND REPORT EMAIL API
# =====================================================

@app.route("/api/send-report", methods=["POST"])
def send_report():

    try:

        data = request.get_json()

        recipient = data.get("recipient")

        location = data.get("location", "")
        coordinates = data.get("coordinates", "")

        damage = data.get("damage", "0")
        severity = data.get("severity", "-")
        road_condition = data.get("roadCondition", "-")
        estimated_cost = data.get("estimatedCost", "₹0")

        if not recipient:

            return jsonify({
                "success": False,
                "message": "Recipient email is required"
            }), 400


        # ---------------------------------------------
        # EMAIL CREDENTIALS
        # ---------------------------------------------

        sender_email = os.getenv("ROAD_AI_EMAIL")
        sender_password = os.getenv("ROAD_AI_EMAIL_PASSWORD")

        if not sender_email or not sender_password:

            return jsonify({
                "success": False,
                "message": "Email configuration is missing"
            }), 500


        # ---------------------------------------------
        # EMAIL
        # ---------------------------------------------

        msg = EmailMessage()

        msg["Subject"] = "Road Surface Quality AI Inspection Report"
        msg["From"] = sender_email
        msg["To"] = recipient

        msg.set_content(f"""
ROAD SURFACE QUALITY AI SYSTEM
========================================

ROAD INSPECTION REPORT

LOCATION
{location}

COORDINATES
{coordinates}

AI INSPECTION RESULTS
----------------------------------------

Road Condition:
{road_condition}

Severity:
{severity}

Confidence:
{damage}

Estimated Cost:
{estimated_cost}

----------------------------------------

This report was generated by the
Road Surface Quality AI System.

Regards,
Road Surface Quality AI System
""")


        # ---------------------------------------------
        # SEND EMAIL
        # ---------------------------------------------

        with smtplib.SMTP_SSL(
            "smtp.gmail.com",
            465
        ) as smtp:

            smtp.login(
                sender_email,
                sender_password
            )

            smtp.send_message(msg)


        return jsonify({

            "success": True,

            "message":
            "Report sent successfully"

        })


    except Exception as e:

        print("EMAIL ERROR:", str(e))

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# =====================================================
# AI INSPECTION API
# =====================================================

@app.route("/api/inspect", methods=["POST"])
def inspect():

    # ---------------------------------------------
    # CHECK FILE
    # ---------------------------------------------

    if "file" not in request.files:

        return jsonify({
            "success": False,
            "message": "No file uploaded"
        }), 400


    file = request.files["file"]


    # ---------------------------------------------
    # CHECK FILENAME
    # ---------------------------------------------

    if file.filename == "":

        return jsonify({
            "success": False,
            "message": "No file selected"
        }), 400


    # ---------------------------------------------
    # SAVE FILE
    # ---------------------------------------------

    filepath = os.path.join(
        UPLOAD_FOLDER,
        file.filename
    )

    file.save(filepath)


    try:

        print()
        print("==============================")
        print("AI INSPECTION STARTED")
        print("File:", file.filename)
        print("==============================")


        # =============================================
        # AI CLASSIFICATION
        # =============================================

        results = model.predict(
            filepath,
            imgsz=256
        )

        result = results[0]


        # =============================================
        # ROAD CONDITION
        # =============================================

        road_condition = result.names[
            result.probs.top1
        ]


        # =============================================
        # CONFIDENCE
        # =============================================

        confidence = float(
            result.probs.top1conf
        )

        confidence_percent = round(
            confidence * 100,
            2
        )


        # =============================================
        # SEVERITY
        # =============================================

        if road_condition == "GOOD":

            severity = "LOW"

        elif road_condition == "MODERATE":

            severity = "MEDIUM"

        else:

            severity = "HIGH"


        # =============================================
        # ESTIMATED COST
        # =============================================
        # This is an approximate project estimate,
        # not an actual engineering quotation.

        import random

        if road_condition == "GOOD":
            estimated_cost = random.randint(0, 1000)
        elif road_condition == "MODERATE":
            estimated_cost = random.randint(2000, 5000)
        else:
            estimated_cost = random.randint(5000, 10000)

        estimated_cost = round(estimated_cost / 100) * 100


        # =============================================
        # TERMINAL OUTPUT
        # =============================================

        print("Road Condition:", road_condition)
        print("Confidence:", confidence_percent, "%")
        print("Severity:", severity)
        print("Estimated Cost: ₹", estimated_cost)
        print("==============================")
        print()


        # =============================================
        # SEND RESULT TO FRONTEND
        # =============================================

        return jsonify({

            "success": True,

            "road_condition": road_condition,

            "confidence": confidence_percent,

            "severity": severity,

            "estimated_cost": estimated_cost,

            # Kept for compatibility with
            # the existing frontend.
            "potholes": 0,

            "message":
            "AI inspection completed"

        })


    except Exception as e:

        print("ERROR:", str(e))

        return jsonify({

            "success": False,

            "message": str(e)

        }), 500


# =====================================================
# START SERVER
# =====================================================

if __name__ == "__main__":

    print()
    print("======================================")
    print("     ROAD SURFACE QUALITY AI SYSTEM")
    print("======================================")
    print()

    print("Login:")
    print("http://127.0.0.1:5000/")

    print()

    print("Dashboard:")
    print("http://127.0.0.1:5000/dashboard")

    print()

    print("Health:")
    print("http://127.0.0.1:5000/api/health")

    print()
    print("======================================")
    print()


    app.run(
        host="127.0.0.1",
        port=5000,
        debug=False,
        use_reloader=False
    )