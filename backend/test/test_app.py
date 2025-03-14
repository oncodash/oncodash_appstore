import unittest
import json
import io
import logging
from app import app, db, User, Product

# Set up logging
logging.basicConfig(level=logging.DEBUG)
logger = logging.getLogger(__name__)

class FlaskTestCase(unittest.TestCase):

    def setUp(self):
        logger.debug("Setting up test environment")
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///test.db'
        app.config['UPLOAD_FOLDER'] = 'uploads'
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
        logger.info("Test database and client set up")

    def tearDown(self):
        logger.debug("Tearing down test environment")
        with app.app_context():
            db.session.remove()
            db.drop_all()
        logger.info("Test database torn down")

    def test_register(self):
        logger.debug("Starting test_register")
        response = self.app.post('/api/auth/register',
                                 data=json.dumps({
                                     'name': 'Test User',
                                     'email': 'test@example.com',
                                     'password': 'testpassword'
                                 }),
                                 content_type='application/json')
        logger.debug(f"Register response: status={response.status_code}, data={response.data}")
        self.assertEqual(response.status_code, 201)
        data = json.loads(response.data)
        self.assertIn('token', data)
        self.assertIn('user', data)
        logger.debug("test_register completed")

    def test_login(self):
        logger.debug("Starting test_login")
        # First register a user
        register_response = self.app.post('/api/auth/register',
                      data=json.dumps({
                          'name': 'Test User',
                          'email': 'test@example.com',
                          'password': 'testpassword'
                      }),
                      content_type='application/json')
        logger.debug(f"Register response: status={register_response.status_code}, data={register_response.data}")

        # Then try to login
        login_response = self.app.post('/api/auth/login',
                                 data=json.dumps({
                                     'email': 'test@example.com',
                                     'password': 'testpassword'
                                 }),
                                 content_type='application/json')
        logger.debug(f"Login response: status={login_response.status_code}, data={login_response.data}")
        self.assertEqual(login_response.status_code, 200)
        data = json.loads(login_response.data)
        self.assertIn('token', data)
        self.assertIn('user', data)
        logger.debug("test_login completed")

    def test_get_products(self):
        logger.debug("Starting test_get_products")
        response = self.app.get('/api/products')
        logger.debug(f"Get products response: status={response.status_code}, data={response.data}")
        self.assertEqual(response.status_code, 200)
        data = json.loads(response.data)
        self.assertIsInstance(data, list)
        logger.debug("test_get_products completed")

    def test_create_product_with_files(self):
        logger.debug("Starting test_create_product_with_files")
        # First register and login to get a token
        register_response = self.app.post('/api/auth/register',
                                          data=json.dumps({
                                              'name': 'Test User',
                                              'email': 'test@example.com',
                                              'password': 'testpassword'
                                          }),
                                          content_type='application/json')
        logger.debug(f"Register response: status={register_response.status_code}, data={register_response.data}")

        if register_response.status_code != 201:
            logger.error(f"Registration failed: {register_response.data}")
            self.fail("Registration failed")

        login_response = self.app.post('/api/auth/login',
                                       data=json.dumps({
                                           'email': 'test@example.com',
                                           'password': 'testpassword'
                                       }),
                                       content_type='application/json')
        logger.debug(f"Login response: status={login_response.status_code}, data={login_response.data}")

        if login_response.status_code != 200:
            logger.error(f"Login failed: {login_response.data}")
            self.fail("Login failed")

        token = json.loads(login_response.data)['token']
        logger.info("Successfully logged in and obtained token")

        # Create file-like objects for our test files
        test_file = io.BytesIO(b"This is a test file content")
        test_image = io.BytesIO(b"This is a test image content")

        # Then create a product with files
        data = {
            'title': 'Test Product',
            'description': 'This is a test product',
            'price': '99.99',
            'category': 'test',
            'tags': json.dumps(['tag1', 'tag2']),
            'files': (test_file, 'test_file.txt'),
            'images': (test_image, 'test_image.jpg')
        }

        logger.debug(f"Sending product creation request with data: {data}")

        response = self.app.post('/api/products',
                                 data=data,
                                 headers={'Authorization': f'Bearer {token}'},
                                 content_type='multipart/form-data')

        logger.debug(f"Product creation response: status={response.status_code}, data={response.data}")

        if response.status_code != 201:
            logger.error(f"Product creation failed: {response.data}")
            self.fail(f"Product creation failed with status {response.status_code}: {response.data}")

        self.assertEqual(response.status_code, 201)

        try:
            data = json.loads(response.data)
        except json.JSONDecodeError:
            logger.error(f"Failed to decode JSON response: {response.data}")
            self.fail("Response is not valid JSON")

        self.assertIn('product', data, "Response does not contain 'product' key")
        self.assertEqual(data['product']['title'], 'Test Product', "Product title does not match")
        self.assertIn('files', data['product'], "Product does not contain 'files' key")
        self.assertIn('image_name', data['product'], "Product does not contain 'images' key")
        self.assertIn('image_url', data['product'], "Product does not contain 'images' key")

        logger.info("Product creation test completed successfully")

if __name__ == '__main__':
    unittest.main()