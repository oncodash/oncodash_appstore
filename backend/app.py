
from flask import Flask, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_cors import CORS
import jwt
from datetime import datetime, timedelta
import os
from werkzeug.security import generate_password_hash, check_password_hash

# Initialize Flask app
app = Flask(__name__)
CORS(app)

# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///softswap.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production

# Initialize database
db = SQLAlchemy(app)

# Define User model
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    email = db.Column(db.String(100), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    products = db.relationship('Product', backref='seller', lazy=True)

# Define Product model
class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(50))
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

# Create database tables
with app.app_context():
    db.create_all()

# Helper functions
def generate_token(user_id):
    payload = {
        'exp': datetime.utcnow() + timedelta(days=1),
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    return jwt.encode(
        payload,
        app.config.get('SECRET_KEY'),
        algorithm='HS256'
    )

def token_required(f):
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(' ')[1] if len(auth_header.split(' ')) > 1 else None
        
        if not token:
            return jsonify({'message': 'Token is missing!'}), 401
        
        try:
            data = jwt.decode(token, app.config.get('SECRET_KEY'), algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['sub']).first()
        except:
            return jsonify({'message': 'Token is invalid!'}), 401
            
        return f(current_user, *args, **kwargs)
    
    decorated.__name__ = f.__name__
    return decorated

# Auth Routes
@app.route('/api/auth/register', methods=['POST'])
def register():
    data = request.get_json()
    
    # Check if user already exists
    if User.query.filter_by(email=data['email']).first():
        return jsonify({'message': 'User already exists'}), 409
    
    # Create new user
    hashed_password = generate_password_hash(data['password'])
    new_user = User(
        name=data['name'],
        email=data['email'],
        password=hashed_password
    )
    
    db.session.add(new_user)
    db.session.commit()
    
    # Generate token
    token = generate_token(new_user.id)
    
    return jsonify({
        'message': 'User created successfully',
        'token': token,
        'user': {
            'id': new_user.id,
            'name': new_user.name,
            'email': new_user.email
        }
    }), 201

@app.route('/api/auth/login', methods=['POST'])
def login():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user or not check_password_hash(user.password, data['password']):
        return jsonify({'message': 'Invalid credentials'}), 401
    
    token = generate_token(user.id)
    
    return jsonify({
        'message': 'Login successful',
        'token': token,
        'user': {
            'id': user.id,
            'name': user.name,
            'email': user.email
        }
    }), 200

@app.route('/api/auth/forgot-password', methods=['POST'])
def forgot_password():
    data = request.get_json()
    
    user = User.query.filter_by(email=data['email']).first()
    
    if not user:
        # Don't reveal whether user exists or not for security reasons
        return jsonify({'message': 'Password reset instructions sent if email exists'}), 200
    
    # In a real app, you would send a password reset email here
    # For this example, we'll just return a success message
    
    return jsonify({'message': 'Password reset instructions sent if email exists'}), 200

# Product Routes
@app.route('/api/products', methods=['GET'])
def get_products():
    products = Product.query.all()
    
    result = []
    for product in products:
        seller = User.query.get(product.seller_id)
        result.append({
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'imageUrl': product.image_url,
            'category': product.category,
            'seller': {
                'id': seller.id,
                'name': seller.name
            },
            'createdAt': product.created_at.isoformat()
        })
    
    return jsonify(result), 200

@app.route('/api/products/<int:id>', methods=['GET'])
def get_product(id):
    product = Product.query.get_or_404(id)
    seller = User.query.get(product.seller_id)
    
    return jsonify({
        'id': product.id,
        'title': product.title,
        'description': product.description,
        'price': product.price,
        'imageUrl': product.image_url,
        'category': product.category,
        'seller': {
            'id': seller.id,
            'name': seller.name
        },
        'createdAt': product.created_at.isoformat()
    }), 200

@app.route('/api/products', methods=['POST'])
@token_required
def create_product(current_user):
    data = request.get_json()
    
    new_product = Product(
        title=data['title'],
        description=data['description'],
        price=data['price'],
        image_url=data.get('imageUrl', ''),
        category=data.get('category', ''),
        seller_id=current_user.id
    )
    
    db.session.add(new_product)
    db.session.commit()
    
    return jsonify({
        'message': 'Product created successfully',
        'product': {
            'id': new_product.id,
            'title': new_product.title,
            'description': new_product.description,
            'price': new_product.price,
            'imageUrl': new_product.image_url,
            'category': new_product.category,
            'seller': {
                'id': current_user.id,
                'name': current_user.name
            },
            'createdAt': new_product.created_at.isoformat()
        }
    }), 201

@app.route('/api/products/<int:id>', methods=['PUT'])
@token_required
def update_product(current_user, id):
    product = Product.query.get_or_404(id)
    
    # Check if the current user is the owner of the product
    if product.seller_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    data = request.get_json()
    
    product.title = data.get('title', product.title)
    product.description = data.get('description', product.description)
    product.price = data.get('price', product.price)
    product.image_url = data.get('imageUrl', product.image_url)
    product.category = data.get('category', product.category)
    
    db.session.commit()
    
    return jsonify({
        'message': 'Product updated successfully',
        'product': {
            'id': product.id,
            'title': product.title,
            'description': product.description,
            'price': product.price,
            'imageUrl': product.image_url,
            'category': product.category,
            'seller': {
                'id': current_user.id,
                'name': current_user.name
            },
            'createdAt': product.created_at.isoformat()
        }
    }), 200

@app.route('/api/products/<int:id>', methods=['DELETE'])
@token_required
def delete_product(current_user, id):
    product = Product.query.get_or_404(id)
    
    # Check if the current user is the owner of the product
    if product.seller_id != current_user.id:
        return jsonify({'message': 'Unauthorized'}), 403
    
    db.session.delete(product)
    db.session.commit()
    
    return jsonify({'message': 'Product deleted successfully'}), 200

if __name__ == '__main__':
    app.run(debug=True)
