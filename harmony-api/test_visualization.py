#!/usr/bin/env python3
"""
Test script for Harmony API visualization endpoints
This script demonstrates how to use the visualization API
"""

import requests
import json
import base64
from datetime import datetime, timedelta

# API configuration
API_BASE_URL = "http://localhost:8000"
AUTH_TOKEN = "bumbumbakudan"

def test_visualization_api():
    """Test the visualization API endpoints"""
    
    headers = {
        "Authorization": f"Bearer {AUTH_TOKEN}",
        "Content-Type": "application/json"
    }
    
    print("🚀 Testing Harmony API Visualization Endpoints")
    print("=" * 50)
    
    # Test 1: Health check
    print("\n1. Testing health check...")
    response = requests.get(f"{API_BASE_URL}/health")
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test 2: Get collections
    print("\n2. Testing collections endpoint...")
    response = requests.get(f"{API_BASE_URL}/tempo/collections", headers=headers)
    print(f"Status: {response.status_code}")
    print(f"Response: {response.json()}")
    
    # Test 3: Create map visualization (without credentials - will fail gracefully)
    print("\n3. Testing map visualization...")
    visualization_request = {
        "start_time": "2023-12-30T22:30:00",
        "end_time": "2023-12-30T22:45:00",
        "bbox": [-115, 35, -95, 45],
        "plot_type": "map",
        "variables": ["product/vertical_column"],
        "collection_id": "C2930730944-LARC_CLOUD"
    }
    
    response = requests.post(
        f"{API_BASE_URL}/tempo/visualize", 
        headers=headers,
        json=visualization_request
    )
    print(f"Status: {response.status_code}")
    result = response.json()
    print(f"Success: {result.get('success', False)}")
    print(f"Message: {result.get('message', 'No message')}")
    
    if result.get('success') and 'image_base64' in result.get('data', {}):
        print("✅ Image generated successfully!")
        print(f"Plot type: {result['data'].get('plot_type')}")
        print(f"Variable: {result['data'].get('variable')}")
        print(f"Files processed: {result['data'].get('files_processed')}")
        
        # Save the image
        img_data = result['data']['image_base64']
        with open('tempo_visualization.png', 'wb') as f:
            f.write(base64.b64decode(img_data))
        print("💾 Image saved as 'tempo_visualization.png'")
    else:
        print("❌ Visualization failed - likely due to missing NASA credentials")
        print("   Set EARTHDATA_USERNAME and EARTHDATA_PASSWORD in .env file")
    
    # Test 4: Test different plot types
    plot_types = ["zonal_mean", "contour"]
    for plot_type in plot_types:
        print(f"\n4. Testing {plot_type} visualization...")
        visualization_request["plot_type"] = plot_type
        
        response = requests.post(
            f"{API_BASE_URL}/tempo/visualize", 
            headers=headers,
            json=visualization_request
        )
        print(f"Status: {response.status_code}")
        result = response.json()
        print(f"Success: {result.get('success', False)}")
        print(f"Message: {result.get('message', 'No message')}")

if __name__ == "__main__":
    test_visualization_api()

