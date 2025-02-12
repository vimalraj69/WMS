from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt  # Secure password hashing

app = Flask(__name__)
CORS(app)

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="imal",
        database="mp"
    )

# Signup Route (Register User)
@app.route('/signup', methods=['POST'])
def signup():
    data = request.json
    name = data['name']
    email = data['email']
    password = data['pswd'].encode('utf-8')  # Convert to bytes

    # Hash the password before storing it
    hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt())

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("INSERT INTO user (email, name, pswd) VALUES (%s, %s, %s)", 
                       (email, name, hashed_pw))
        conn.commit()
        cursor.close()
        conn.close()
        return jsonify({"message": "User registered successfully!"}), 201
    except mysql.connector.Error as err:
        print("MySQL Error:", err)  
        return jsonify({"error": str(err)}), 400
     

# Login Route (Verify User)
@app.route('/login', methods=['POST'])
def login():
    data = request.json
    email = data['email']
    password = data['pswd'].encode('utf-8')  # Convert to bytes

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM user WHERE LOWER(email) = LOWER(%s)", (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Verify password
        if bcrypt.checkpw(password, user['pswd'].encode('utf-8')):  # Convert stored hash to bytes
            return jsonify({
                "message": "Login successful!", 
                "user": {"user_id": user["user_id"], "name": user["name"], "email": user["email"]}
            }), 200
        else:
            return jsonify({"error": "Invalid password"}), 401

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({"error": str(err)}), 500


# Fetch Financial Summary
@app.route('/financial-summary', methods=['GET'])
def get_financial_summary():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM financial_summary LIMIT 1")
        data = cursor.fetchone()

        cursor.close()
        conn.close()
        return jsonify(data)

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({"error": str(err)}), 500


# Fetch Sales Data
@app.route('/sales-data', methods=['GET'])
def get_sales_data():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM sales_data")
        data = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(data)

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({"error": str(err)}), 500


# Fetch Recent Orders
@app.route('/recent-orders', methods=['GET'])
def get_recent_orders():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM recent_orders ORDER BY order_date DESC LIMIT 10")
        data = cursor.fetchall()

        cursor.close()
        conn.close()
        return jsonify(data)

    except mysql.connector.Error as err:
        print("MySQL Error:", err)
        return jsonify({"error": str(err)}), 500


if __name__ == '__main__':
    app.run(debug=True, port=5000)
