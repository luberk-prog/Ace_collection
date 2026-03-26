import os
import json
from flask import Flask, jsonify, request, send_from_directory
from flask_cors import CORS

app = Flask(__name__, static_folder='.')
CORS(app)

# Ensure data directory exists
DATA_DIR = os.path.join(os.getcwd(), 'data')
if not os.path.exists(DATA_DIR):
    os.makedirs(DATA_DIR)

PRODUCTS_FILE = os.path.join(DATA_DIR, 'products.json')
ORDERS_FILE = os.path.join(DATA_DIR, 'orders.json')

# Helper to load products
def load_products():
    if not os.path.exists(PRODUCTS_FILE):
        return []
    with open(PRODUCTS_FILE, 'r') as f:
        return json.load(f)

# Helper to save orders
def save_order(order_data):
    orders = []
    if os.path.exists(ORDERS_FILE):
        with open(ORDERS_FILE, 'r') as f:
            try:
                orders = json.load(f)
            except json.JSONDecodeError:
                orders = []
    
    orders.append(order_data)
    with open(ORDERS_FILE, 'w') as f:
        json.dump(orders, f, indent=2)

# --- API Endpoints ---

@app.route('/api/products', methods=['GET'])
def get_products():
    return jsonify(load_products())

@app.route('/api/orders', methods=['POST'])
def create_order():
    order_data = request.json
    if not order_data:
        return jsonify({"error": "No order data provided"}), 400
    
    # Save to orders.json for persistence
    save_order(order_data)
    
    print(f"New Order Received: {order_data.get('customer_name')}")
    return jsonify({"message": "Order received successfully", "status": "success"}), 201

# --- Static File Serving ---

@app.route('/')
def index():
    return send_from_directory('.', 'index.html')

@app.route('/<path:path>')
def static_proxy(path):
    return send_from_directory('.', path)

if __name__ == '__main__':
    print("ACE_COLLECTION Backend starting on http://localhost:5000")
    app.run(debug=True, port=5000)
