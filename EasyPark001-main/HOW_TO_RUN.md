# How to Run EasyPark Website - Step by Step Guide

## Prerequisites

Before starting, make sure you have:
- **Node.js** installed (version 18 or higher)
- **npm** (comes with Node.js)
- A web browser (Chrome, Firefox, Safari, or Edge)

### Check if Node.js is installed:
Open your terminal and run:
```bash
node --version
npm --version
```

If you see version numbers, you're good! If not, download Node.js from [nodejs.org](https://nodejs.org/)

---

## Step-by-Step Instructions

### Step 1: Open Terminal/Command Prompt

- **Mac/Linux**: Open Terminal
- **Windows**: Open Command Prompt or PowerShell

### Step 2: Navigate to Project Folder

Navigate to your EasyPark project folder:
```bash
cd "/Users/devashishitankar/Documents/Myprojects /website/Hackathon - EasyPark "
```

**Note**: Make sure you're in the correct directory. You should see files like `package.json`, `client`, and `server` folders.

### Step 3: Install Dependencies (First Time Only)

If this is your first time running the project, install all dependencies:
```bash
npm install
```

This will install dependencies for both frontend and backend. Wait for it to complete (may take 1-2 minutes).

### Step 4: Start the Frontend Server

Run this command to start the React development server:
```bash
npm run dev
```

**OR** if you want to run it from the client folder directly:
```bash
npm run dev --workspace client
```

### Step 5: Wait for Server to Start

You should see output like this:
```
  VITE v5.x.x  ready in xxx ms

  ➜  Local:   http://localhost:5173/
  ➜  Network: use --host to expose
```

**Note the port number** - it's usually `5173`, but could be different if that port is busy.

### Step 6: Open in Browser

1. **Copy the URL** from the terminal (usually `http://localhost:5173`)
2. **Open your web browser** (Chrome, Firefox, Safari, etc.)
3. **Paste the URL** in the address bar and press Enter

The EasyPark website should now load! 🎉

---

## Optional: Running Backend Server

If you want to use the backend API (for storing data):

### Step 1: Install MongoDB

**Option A: Local MongoDB**
```bash
# macOS (using Homebrew)
brew install mongodb-community
brew services start mongodb-community
```

**Option B: MongoDB Atlas (Cloud)**
- Sign up at [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
- Create a free cluster
- Get connection string

### Step 2: Configure Environment

Create/edit `server/.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/easypark
JWT_SECRET=your_secret_key
FRONTEND_URL=http://localhost:5173
```

### Step 3: Seed Database (Optional)

Populate with sample data:
```bash
npm run seed
```

### Step 4: Start Backend Server

Open a **new terminal window** and run:
```bash
npm run server
```

You should see:
```
🚀 Server running on port 5000
📍 API: http://localhost:5000/api
```

---

## Quick Start (Summary)

**For Frontend Only:**
```bash
# 1. Navigate to project
cd "/Users/devashishitankar/Documents/Myprojects /website/Hackathon - EasyPark "

# 2. Install (first time only)
npm install

# 3. Start server
npm run dev

# 4. Open browser
# Go to http://localhost:5173
```

---

## Troubleshooting

### Port Already in Use
If you see "port 5173 already in use":
- Close other applications using that port
- Or the server will automatically use the next available port

### Dependencies Not Found
If you see "module not found" errors:
```bash
npm install
```

### Website Not Loading
1. Check if the server is running (look at terminal)
2. Make sure you're using the correct URL from terminal
3. Try refreshing the browser (Ctrl+R or Cmd+R)
4. Check browser console for errors (F12)

### Node.js Not Found
If you see "node: command not found":
- Install Node.js from [nodejs.org](https://nodejs.org/)
- Restart your terminal after installation

### Permission Errors (Mac/Linux)
If you see permission errors:
```bash
sudo npm install
```

---

## Stopping the Server

To stop the development server:
- Press `Ctrl + C` in the terminal where the server is running
- Or close the terminal window

---

## Development Tips

1. **Keep Terminal Open**: Don't close the terminal while the server is running
2. **Auto-Reload**: The website automatically refreshes when you save changes
3. **Two Terminals**: If running both frontend and backend, use two separate terminal windows
4. **Check Console**: Use browser DevTools (F12) to see any errors

---

## File Structure

```
EasyPark/
├── client/          # Frontend (React)
│   └── src/        # Source code
├── server/         # Backend (Node.js)
└── package.json    # Project configuration
```

---

## Need Help?

- Check terminal output for error messages
- Make sure Node.js is installed correctly
- Verify you're in the correct directory
- Check if ports 5173 (frontend) or 5000 (backend) are available

---

## Next Steps After Opening

Once the website is open:
1. Try the **dark/light mode toggle** (top right)
2. Search for parking locations
3. Click "Find Parking Near Me" to test location
4. Browse parking details
5. Try booking a slot

Enjoy using EasyPark! 🚗✨

