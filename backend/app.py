import os
from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse
from werkzeug.security import generate_password_hash, check_password_hash
from werkzeug.utils import secure_filename
from datetime import datetime, timedelta
import jwt
from functools import wraps
from flask import url_for

# Initialize Flask app
app = Flask(__name__)
CORS(app)
api = Api(app)
app.config['STATIC_FOLDER'] = 'static'
app.config['UPLOAD_FOLDER'] = os.path.join(app.config['STATIC_FOLDER'], 'uploads')
# Configure SQLite database
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///appstore.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = 'your-secret-key-here'  # Change this in production

UPLOAD_FOLDER = 'uploads'
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

# Initialize database
db = SQLAlchemy(app)

file_upload_parser = reqparse.RequestParser()
file_upload_parser.add_argument('files', type=reqparse.FileStorage, location='files', required=True)
file_upload_parser.add_argument('images', type=reqparse.FileStorage, location='images', required=True)

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
    files = db.Column(db.String(255), nullable=False)
    file_url = db.Column(db.String(255), nullable=False)  # New field
    image_name = db.Column(db.String(255), nullable=False)
    description = db.Column(db.Text, nullable=False)
    price = db.Column(db.Float, nullable=False)
    image_url = db.Column(db.String(255))
    category = db.Column(db.String(50))
    seller_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    version = db.Column(db.String(50), nullable=False)
    license = db.Column(db.String(100), nullable=False)
    oncodash_version = db.Column(db.String(20), nullable=True)

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
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        if 'Authorization' in request.headers:
            auth_header = request.headers['Authorization']
            token = auth_header.split(' ')[1] if len(auth_header.split(' ')) > 1 else None

        if not token:
            return jsonify({'message': 'Token is missing!'}), 401

        try:
            data = jwt.decode(token, app.config['SECRET_KEY'], algorithms=['HS256'])
            current_user = User.query.filter_by(id=data['sub']).first()
        except jwt.ExpiredSignatureError:
            return jsonify({'message': 'Token has expired!'}), 401
        except jwt.InvalidTokenError:
            return jsonify({'message': 'Invalid token!'}), 401

        return f(current_user, *args, **kwargs)

    return decorated

class FileStorage(Resource):
    @app.route('/api/user', methods=['GET'])
    @token_required
    def get_user_info(current_user):
        return jsonify({
            'id': current_user.id,
            'name': current_user.name,
            'email': current_user.email,
            'created_at': current_user.created_at.isoformat()
        }), 200

    @app.route('/api/user/change-password', methods=['POST'])
    @token_required
    def change_password(current_user):
        data = request.get_json()
        if not check_password_hash(current_user.password, data['current_password']):
            return jsonify({'message': 'Current password is incorrect'}), 400

        current_user.password = generate_password_hash(data['new_password'])
        db.session.commit()
        return jsonify({'message': 'Password changed successfully'}), 200

    @app.route('/api/user/products', methods=['GET'])
    @token_required
    def get_user_products(current_user):
        products = Product.query.filter_by(seller_id=current_user.id).all()
        result = []
        for product in products:
            result.append({
                'id': product.id,
                'title': product.title,
                'description': product.description,
                #'price': product.price,
                'files': product.files,
                'file_url': product.file_url,
                'image_url': product.image_url,
                'category': product.category,
                'created_at': product.created_at.isoformat()
            })
        return jsonify(result), 200
    @app.route('/api/auth/register', methods=['POST'])
    def register(*args):
        data = request.get_json()
        
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'User already exists'}), 409
        
        hashed_password = generate_password_hash(data['password'])
        new_user = User(
            name=data['name'],
            email=data['email'],
            password=hashed_password
        )
        
        db.session.add(new_user)
        db.session.commit()
        
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
    def login(*args):
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
    def forgot_password(*args):
        data = request.get_json()
        
        user = User.query.filter_by(email=data['email']).first()
        
        if not user:
            return jsonify({'message': 'Password reset instructions sent if email exists'}), 200
        
        # In a real app, you would send a password reset email here
        
        return jsonify({'message': 'Password reset instructions sent if email exists'}), 200

    @app.route('/api/products', methods=['GET'])
    def get_products(*args):
        products = Product.query.all()

        result = []
        for product in products:
            seller = User.query.get(product.seller_id)
            result.append({
                'id': product.id,
                'title': product.title,
                'description': product.description,
                #'price': product.price,
                'files': product.files,
                'file_url': product.file_url,  # New field
                'image_url': [product.image_url],
                'category': product.category,
                'seller': {
                    'id': seller.id,
                    'name': seller.name,
                },
                'createdAt': product.created_at.isoformat(),
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
            #'price': product.price,
            'files': product.files,
            'file_url': product.file_url,  # New field
            'image_url': product.image_url,
            'category': product.category,
            'version': product.version,
            'license': product.license,
            'oncodash_version': product.oncodash_version,
            'seller': {
                'id': seller.id,
                'name': seller.name
            },
            'createdAt': product.created_at.isoformat()
        }), 200

    @app.route('/api/products', methods=['POST'])
    @token_required
    def create_product(current_user):
        data = request.form
        if 'files' not in request.files:
            return {'error': 'No file part'}, 400
        file = request.files['files']
        image = request.files.get('images')  # Image is optional

        if file.filename == '':
            return {'error': 'No selected file'}, 400

        if file:
            filename = secure_filename(file.filename)
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)

            # Create the file_url pointing to the uploads folder
            file_url = url_for('static', filename=f'uploads/{filename}', _external=True)

            # Save image if provided
            image_filename = None
            image_url = None
            if image and image.filename != '':
                image_filename = secure_filename(image.filename)
                image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
                image.save(image_path)
                image_url = url_for('static', filename=f'uploads/{image_filename}', _external=True)

        new_product = Product(
            title=data['title'],
            description=data['description'],
            price=float(0.0),#float(data['price']),
            files=filename,
            file_url=file_url,
            image_name=image_filename or '',
            image_url=image_url or '',
            category=data.get('category', ''),
            version=data['version'],
            license=data['license'],
            seller_id=current_user.id,
            oncodash_version=data['oncodash_version']
        )

        db.session.add(new_product)
        db.session.commit()

        return {
            'message': 'Product created successfully',
            'product': {
                'id': new_product.id,
                'title': new_product.title,
                'description': new_product.description,
                #'price': new_product.price,
                'files': new_product.files,
                'file_url': new_product.file_url,
                'image_name': new_product.image_name,
                'image_url': new_product.image_url,
                'category': new_product.category,
                'version': new_product.version,
                'oncodash_version': new_product.oncodash_version,
                'license': new_product.license,
                'seller': {
                    'id': current_user.id,
                    'name': current_user.name
                },
                'created_at': new_product.created_at.isoformat()
            }
        }, 201

    @app.route('/api/products/<int:id>', methods=['PUT'])
    @token_required
    def update_product(current_user, id):
        product = Product.query.get_or_404(id)

        if product.seller_id != current_user.id:
            return jsonify({'message': 'Unauthorized'}), 403

        data = request.get_json()

        product.title = data.get('title', product.title)
        product.description = data.get('description', product.description)
        #product.price = data.get('price', product.price)
        product.image_url = data.get('image_url', product.image_url)
        product.category = data.get('category', product.category)
        product.version = data.get('version', product.version)
        product.license = data.get('license', product.license)
        product.oncodash_version = data.get('oncodash_version', product.oncodash_version)

        db.session.commit()

        return jsonify({
            'message': 'Product updated successfully',
            'product': {
                'id': product.id,
                'title': product.title,
                'description': product.description,
                #'price': product.price,
                'files': product.files,
                'file_url': product.file_url,
                'image_name': product.image_name,
                'image_url': product.image_url,
                'category': product.category,
                'version': product.version,
                'license': product.license,
                'seller': {
                    'id': current_user.id,
                    'name': current_user.name
                },
                'created_at': product.created_at.isoformat(),
                'oncodash_version': product.oncodash_version
            }
        }), 200

    @app.route('/api/products/<int:id>', methods=['DELETE'])
    @token_required
    def delete_product(current_user, id):
        product = Product.query.get_or_404(id)

        if product.seller_id != current_user.id:
            return jsonify({'message': 'Unauthorized'}), 403

        db.session.delete(product)
        db.session.commit()

        return jsonify({'message': 'Product deleted successfully'}), 200

# Add routes
api.add_resource(FileStorage, 
    '/api/auth/register', 
    '/api/auth/login', 
    '/api/auth/forgot-password',
    '/api/products', 
    '/api/products/<int:id>'
)

if __name__ == '__main__':
    app.run(debug=False)