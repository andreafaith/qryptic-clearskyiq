#!/usr/bin/env python3
"""
Simple test script to verify the Harmony API is working correctly
"""

import requests
import json

def test_api():
    print("🧪 Testing Harmony API")
    print("=" * 40)
    
    # Test health endpoint
    print("1. Testing health endpoint...")
    try:
        response = requests.get('http://localhost:8000/health')
        if response.status_code == 200:
            data = response.json()
            print(f"✅ Health check passed: {data['status']}")
        else:
            print(f"❌ Health check failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Health check error: {e}")
        return
    
    # Test single visualization
    print("\n2. Testing single visualization...")
    test_data = {
        'start_time': '2023-12-30T22:30:00',
        'end_time': '2023-12-30T22:45:00',
        'bbox': [-150, -40, 14, 65],
        'variable': 'product/vertical_column',
        'plot_type': 'map',
        'collection_id': 'C2930730944-LARC_CLOUD'
    }
    
    try:
        response = requests.post('http://localhost:8000/tempo/visualize', 
                               json=test_data,
                               headers={'Authorization': 'Bearer bumbumbakudan'})
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data and 'image_base64' in data['data']:
                img_size = len(data['data']['image_base64'])
                print(f"✅ Single visualization successful: {img_size} bytes ({img_size/1024:.1f} KB)")
            else:
                print(f"❌ Single visualization failed: {data.get('message', 'Unknown error')}")
        else:
            print(f"❌ Single visualization error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ Single visualization error: {e}")
    
    # Test all three visualizations
    print("\n3. Testing all three visualizations...")
    test_data['plot_type'] = 'all_three'
    
    try:
        response = requests.post('http://localhost:8000/tempo/visualize/all', 
                               json=test_data,
                               headers={'Authorization': 'Bearer bumbumbakudan'})
        
        if response.status_code == 200:
            data = response.json()
            if data.get('success') and 'data' in data and 'visualizations' in data['data']:
                visualizations = data['data']['visualizations']
                print(f"✅ All three visualizations successful: {len(visualizations)} plots")
                
                for plot_type, viz in visualizations.items():
                    if viz.get('success') and viz.get('image_base64'):
                        img_size = len(viz['image_base64'])
                        print(f"  ✅ {plot_type}: {img_size} bytes ({img_size/1024:.1f} KB)")
                    else:
                        print(f"  ❌ {plot_type}: Failed - {viz.get('error', 'Unknown error')}")
            else:
                print(f"❌ All three visualizations failed: {data.get('message', 'Unknown error')}")
        else:
            print(f"❌ All three visualizations error: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"❌ All three visualizations error: {e}")
    
    print("\n🎉 API testing completed!")

if __name__ == "__main__":
    test_api()
