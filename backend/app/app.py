import os
import uuid

from flask import Flask, request, jsonify
from flask_cors import CORS
from flask_sqlalchemy import SQLAlchemy
from flask_restful import Api, Resource, reqparse
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime, timedelta
import jwt
from functools import wraps
from flask import url_for


# Initialize Flask app
app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})
api = Api(app)
app.config['STATIC_FOLDER'] = 'static'
app.config['UPLOAD_FOLDER'] = '/app/static/uploads'
# Configure SQLite database
DB_PATH = '/app/db/appstore.db'
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{DB_PATH}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False
app.config['SECRET_KEY'] = os.environ.get('SECRET_KEY')
os.makedirs(os.path.dirname(DB_PATH), exist_ok=True)
HOST = os.environ.get('API_HOST', 'https://localhost:5000')

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

class Review(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    product_id = db.Column(db.Integer, db.ForeignKey('product.id'), nullable=False)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    rating = db.Column(db.Integer, nullable=False)
    comment = db.Column(db.Text, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    user = db.relationship('User', backref=db.backref('reviews', lazy=True))

class Product(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), nullable=False)
    files = db.Column(db.String(255), nullable=True)  # Make this nullable
    file_url = db.Column(db.String(255), nullable=True)  # Make this nullable
    external_url = db.Column(db.String(255), nullable=True)  # Add this new field
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
    reviews = db.relationship('Review', backref='product', lazy=True)

    __table_args__ = (db.UniqueConstraint('title', 'version', name='uq_title_version'),)

    @property
    def is_latest_version(self):
        latest = Product.query.filter_by(title=self.title).order_by(Product.version.desc()).first()
        return latest.id == self.id

    def to_dict(self):
        reviews = [
            {
                'id': review.id,
                'userId': review.user_id,
                'userName': review.user.name,
                'rating': review.rating,
                'comment': review.comment,
                'createdAt': review.created_at.isoformat()
            } for review in self.reviews
        ]
        review_count = len(reviews)

        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'files': self.files,
            'file_url': self.file_url,
            'external_url': self.external_url,
            'image_url': self.image_url,
            'category': self.category,
            'version': self.version,
            'license': self.license,
            'oncodash_version': self.oncodash_version,
            'seller': {
                'id': self.seller.id,
                'name': self.seller.name
            },
            'created_at': self.created_at.isoformat(),
            'reviews': reviews,
            'reviewCount': review_count
        }

# Create database tables
with app.app_context():
    db.create_all()

def get_external_url(endpoint, **values):
    return f"{HOST}{url_for(endpoint, **values)}"

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
                'files': product.files,
                'file_url': product.file_url,
                'external_url': product.external_url,
                'image_url': product.image_url,
                'version': product.version,
                'oncodash_version': product.oncodash_version,
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
    def get_products():
        products = Product.query.order_by(Product.title, Product.version.desc()).all()
        latest_products = {}
        for product in products:
            if product.title not in latest_products:
                latest_products[product.title] = product
        return jsonify([product.to_dict() for product in latest_products.values()])

    @app.route('/api/products/<int:id>', methods=['GET'])
    def get_product(id):
        product = Product.query.get_or_404(id)
        versions = Product.query.filter_by(title=product.title).order_by(Product.version.desc()).all()
        product_dict = product.to_dict()
        product_dict['versions'] = [{'id': v.id, 'version': v.version} for v in versions]
        return jsonify(product_dict)

    @app.route('/api/products', methods=['POST'])
    @token_required
    def create_product(current_user):
        data = request.form
        external_url = request.form.get('external_url')
    
        if 'files' not in request.files and not external_url:
            return {'error': 'Either a file or an external URL must be provided'}, 400

        file = request.files.get('files')
        image = request.files.get('images')
    
        file_url = None
        filename = None
    
        if file:
            original_filename, file_extension = os.path.splitext(file.filename)
            filename = str(uuid.uuid4()) + file_extension
            file_path = os.path.join(app.config['UPLOAD_FOLDER'], filename)
            file.save(file_path)
            file_url = get_external_url('static', filename=f'uploads/{filename}')

        image_filename = None
        image_url = None
        if image and image.filename != '':
            original_filename, file_extension = os.path.splitext(image.filename)
            image_filename = str(uuid.uuid4()) + file_extension
            image_path = os.path.join(app.config['UPLOAD_FOLDER'], image_filename)
            image.save(image_path)
            image_url = get_external_url('static', filename=f'uploads/{image_filename}')

        new_product = Product(
            title=data['title'],
            description=data['description'],
            price=float(0.0),
            files=filename,
            file_url=file_url,
            external_url=external_url,
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
                'files': new_product.files,
                'file_url': new_product.file_url,
                'external_url': new_product.external_url,
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

    @app.route('/api/reviews/<int:product_id>', methods=['POST'])
    @token_required
    def add_review(current_user, product_id):
        data = request.get_json()

        if not data or 'rating' not in data or 'comment' not in data:
            return jsonify({'message': 'Missing required fields'}), 400

        product = Product.query.get(product_id)
        if not product:
            return jsonify({'message': 'Product not found'}), 404

        new_review = Review(
            product_id=product_id,
            user_id=current_user.id,
            rating=data['rating'],
            comment=data['comment']
        )

        db.session.add(new_review)
        db.session.commit()

        return jsonify({
            'id': new_review.id,
            'productId': new_review.product_id,
            'userId': new_review.user_id,
            'userName': current_user.name,
            #'userAvatar': current_user.avatar,
            'rating': new_review.rating,
            'comment': new_review.comment,
            'createdAt': new_review.created_at.isoformat()
        }), 201


# Add routes
api.add_resource(FileStorage, 
    '/api/auth/register', 
    '/api/auth/login', 
    '/api/auth/forgot-password',
    '/api/products', 
    '/api/products/<int:id>',
    '/api/reviews/<int:id>'
)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)