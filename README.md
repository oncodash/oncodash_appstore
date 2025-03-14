# Oncodash App Store

Requirements: Python 3.10+, Node.js & npm - [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating)

Follow these steps:

```sh
# Step 1: Clone the repository using the project's Git URL.
git clone git@github.com:oncodash/oncodash_appstore.git
cd oncodash_appstore

# Step 2: Install backend dependencies and run the backend.
cd backend
python -m venv backend
source backend/bin/activate
pip install -r requirements.txt
python app.py

# Step 3: Install the necessary dependencies for frontend.
cd ../frontend
npm i

# Step 4: Start the development server with auto-reloading and an instant preview.
npm run dev
navigate to http://localhost:port (port number will be displayed in the terminal)
```

## Technologies used

- Python
- Flask
- SQLite
- Vite
- TypeScript
- React
- shadcn-ui
- Tailwind CSS
