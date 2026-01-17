#!/bin/bash

echo "Installing Mobile Touchpad Controller..."
echo

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "ERROR: Node.js is not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    echo
    exit 1
fi

echo "Node.js found!"
echo "Installing dependencies..."
echo

npm install

if [ $? -ne 0 ]; then
    echo "ERROR: Failed to install dependencies!"
    exit 1
fi

echo
echo "✅ Installation complete!"
echo
echo "To start the server, run:"
echo "  npm start"
echo
echo "Then open http://localhost:3000/controller in your browser"
echo