#!/bin/bash

echo "Starting Math Buddy App..."
echo "Server running at: http://localhost:8000"
echo "Open this URL in your browser to use the app"
echo ""
echo "Press Ctrl+C to stop the server"
echo ""

python3 -m http.server 8000
