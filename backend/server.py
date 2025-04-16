from flask import Flask, request, jsonify
from flask_cors import CORS
import mysql.connector
import bcrypt 
import pandas as pd
import joblib
import os

# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}}, supports_credentials=True)

# Load the Machine Learning Model
model = joblib.load("C:\\Users\\HP\\Documents\\saree_demand_model.pkl")

# Database connection function
def get_db_connection():
    return mysql.connector.connect(
        host=os.getenv("DB_HOST", "localhost"),
        user=os.getenv("DB_USER", "root"),
        password=os.getenv("DB_PASS", "imal"),
        database=os.getenv("DB_NAME", "mp")
    )

# Prediction Route
@app.route('/predict', methods=['POST'])
def predict():
    try:
        file = request.files['file']
        data = pd.read_csv(file)

        # Extract features from the uploaded file
        data['Date'] = pd.to_datetime(data['Date'])
        data['Month'] = data['Date'].dt.month
        data['Day'] = data['Date'].dt.day
        data['Year'] = data['Date'].dt.year

        def get_season(month):
            if month in [12, 1, 2]:
                return 'Winter'
            elif month in [3, 4, 5]:
                return 'Spring'
            elif month in [6, 7, 8]:
                return 'Summer'
            else:
                return 'Fall'

        data['Season'] = data['Month'].apply(get_season)
        data = pd.get_dummies(data, columns=['Season'], drop_first=True)

        # Ensure the dataset includes all required columns
        required_columns = ['Month', 'Day', 'Year', 'Season_Spring', 'Season_Summer', 'Season_Winter']
        for col in required_columns:
            if col not in data.columns:
                data[col] = 0  # Add missing columns with default value 0

        features = data[required_columns]
        predictions = model.predict(features)

        return jsonify({'predictions': predictions.tolist()})
    except Exception as e:
        return jsonify({'error': str(e)}), 500

# Signup Route (Register User)
@app.route('/signup', methods=['POST'])
def signup():
    try:
        data = request.json
        name = data['name']
        email = data['email']
        password = data['pswd'].encode('utf-8')

        # Hash the password before storing it
        hashed_pw = bcrypt.hashpw(password, bcrypt.gensalt()).decode('utf-8')

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("INSERT INTO user (email, name, pswd) VALUES (%s, %s, %s)", 
                       (email, name, hashed_pw))
        conn.commit()
        cursor.close()
        conn.close()

        return jsonify({"message": "User registered successfully!"}), 201
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 400

# Login Route (Verify User)
@app.route('/login', methods=['POST'])
def login():
    try:
        data = request.json
        email = data['email']
        password = data['pswd'].encode('utf-8')

        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        cursor.execute("SELECT * FROM user WHERE LOWER(email) = LOWER(%s)", (email,))
        user = cursor.fetchone()

        cursor.close()
        conn.close()

        if not user:
            return jsonify({"error": "User not found"}), 404

        # Verify password
        if bcrypt.checkpw(password, user['pswd'].encode()):
            return jsonify({
                "message": "Login successful!", 
                "user": {"user_id": user["user_id"], "name": user["name"], "email": user["email"]}
            }), 200
        else:
            return jsonify({"error": "Invalid password"}), 401

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500
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
        return jsonify({"error": str(err)}), 500

# Fetch stock Summary
@app.route('/stock-summary', methods=['GET'])
def stock_summary():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Fetch total stock count
        cursor.execute("SELECT SUM(current_stock) AS total_stock FROM stock")
        total_stock = cursor.fetchone()['total_stock']

        # Fetch saree type with the lowest stock
        cursor.execute("SELECT saree_type FROM stock ORDER BY current_stock ASC LIMIT 1")
        min_stock_saree = cursor.fetchone()['saree_type']

        cursor.close()
        conn.close()

        return jsonify({
            "total_stock": total_stock,
            "low_stock_alert": min_stock_saree
        })

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# Fetch Saree Types
@app.route("/saree-types", methods=["GET"])
def get_saree_types():
    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)
        cursor.execute("SELECT DISTINCT saree_type FROM stock")
        saree_types = [row["saree_type"] for row in cursor.fetchall()]
        cursor.close()
        conn.close()
        return jsonify(saree_types)
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

# Fetch Sales and Stock Data for Selected Saree Type
@app.route("/sales-stock", methods=["GET"])
def get_sales_stock():
    try:
        saree_type = request.args.get("sareeType")
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        # Get sales data for current day
        cursor.execute(
            "SELECT SUM(quantity_sold) AS total_sold, SUM(total_sales) AS total_revenue "
            "FROM sales WHERE sale_date = CURDATE() AND saree_type = %s", (saree_type,))
        sales_data = cursor.fetchone()

        # Get current stock
        cursor.execute("SELECT current_stock FROM stock WHERE saree_type = %s", (saree_type,))
        stock_data = cursor.fetchone()

        cursor.close()
        conn.close()

        return jsonify({
            "sareeType": saree_type,
            "totalSold": sales_data["total_sold"] if sales_data["total_sold"] else 0,
            "totalRevenue": sales_data["total_revenue"] if sales_data["total_revenue"] else 0.0,
            "currentStock": stock_data["current_stock"] if stock_data else 0
        })
    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

@app.route('/sales-trend', methods=['GET'])
def get_sales_trend():
    saree_type = request.args.get('sareeType')
    
    if not saree_type:
        return jsonify({"error": "sareeType parameter is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
            SELECT DATE_FORMAT(sale_date, '%Y-%m') AS month, 
                   SUM(quantity_sold) AS total_sold
            FROM sales 
            WHERE saree_type = %s
            GROUP BY DATE_FORMAT(sale_date, '%Y-%m')
            ORDER BY DATE_FORMAT(sale_date, '%Y-%m');
        """
        cursor.execute(query, (saree_type,))
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(result)

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500

@app.route("/api/weekly-sales", methods=["GET"])
def get_weekly_sales():
    saree_type = request.args.get('sareeType')
    if not saree_type:
        return jsonify({"error": "sareeType parameter is required"}), 400

    try:
        conn = get_db_connection()
        cursor = conn.cursor(dictionary=True)

        query = """
        SELECT WEEK(sale_date) AS week, saree_type, SUM(quantity_sold) AS total_sold
        FROM sales 
        WHERE saree_type = %s
        GROUP BY week, saree_type 
        ORDER BY week ASC
        LIMIT 7
        """
        cursor.execute(query, (saree_type,))  # Ensure correct tuple syntax
        result = cursor.fetchall()

        cursor.close()
        conn.close()

        return jsonify(result)

    except mysql.connector.Error as err:
        return jsonify({"error": str(err)}), 500


# Run Flask App
if __name__ == '__main__':
    app.run(debug=True, port=5000, host="0.0.0.0")  # Allow access from any device
