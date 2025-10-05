#!/usr/bin/env python3
"""
Test script to demonstrate the caching functionality of the Harmony API
"""

import requests
import time
import json

API_BASE = "http://localhost:8000"
TOKEN = "bumbumbakudan"  # Default token from the API

def test_caching():
    """Test the caching functionality"""
    print("🧪 Testing Harmony API Caching System")
    print("=" * 50)
    
    # Test request data
    request_data = {
        "start_time": "2023-12-30T22:30:00",
        "end_time": "2023-12-30T22:45:00",
        "bbox": [-150, -40, 14, 65],
        "variable": "product/vertical_column",
        "plot_type": "map"
    }
    
    headers = {
        "Authorization": f"Bearer {TOKEN}",
        "Content-Type": "application/json"
    }
    
    print("1. Making first request (should be slow - no cache)")
    start_time = time.time()
    
    try:
        response1 = requests.post(
            f"{API_BASE}/tempo/visualize",
            json=request_data,
            headers=headers,
            timeout=60
        )
        first_request_time = time.time() - start_time
        
        if response1.status_code == 200:
            print(f"✅ First request completed in {first_request_time:.2f} seconds")
        else:
            print(f"❌ First request failed: {response1.status_code}")
            print(response1.text)
            return
            
    except requests.exceptions.RequestException as e:
        print(f"❌ First request failed: {e}")
        return
    
    print("\n2. Making identical request (should be fast - from cache)")
    start_time = time.time()
    
    try:
        response2 = requests.post(
            f"{API_BASE}/tempo/visualize",
            json=request_data,
            headers=headers,
            timeout=10
        )
        second_request_time = time.time() - start_time
        
        if response2.status_code == 200:
            print(f"✅ Second request completed in {second_request_time:.2f} seconds")
        else:
            print(f"❌ Second request failed: {response2.status_code}")
            print(response2.text)
            return
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Second request failed: {e}")
        return
    
    print("\n3. Checking cache status")
    try:
        cache_response = requests.get(
            f"{API_BASE}/cache/status",
            headers=headers
        )
        
        if cache_response.status_code == 200:
            cache_data = cache_response.json()
            print(f"📊 Cache Status:")
            print(f"   - Cache size: {cache_data['cache_size']}")
            print(f"   - Active items: {cache_data['active_items']}")
            print(f"   - Expired items: {cache_data['expired_items']}")
            print(f"   - Max size: {cache_data['max_size']}")
            print(f"   - TTL: {cache_data['ttl_seconds']} seconds")
        else:
            print(f"❌ Cache status request failed: {cache_response.status_code}")
            
    except requests.exceptions.RequestException as e:
        print(f"❌ Cache status request failed: {e}")
    
    # Calculate speedup
    if first_request_time > 0 and second_request_time > 0:
        speedup = first_request_time / second_request_time
        print(f"\n🚀 Performance Improvement:")
        print(f"   - First request: {first_request_time:.2f}s")
        print(f"   - Second request: {second_request_time:.2f}s")
        print(f"   - Speedup: {speedup:.1f}x faster!")
        
        if speedup > 5:
            print("🎉 Excellent! Caching is working perfectly!")
        elif speedup > 2:
            print("✅ Good! Caching is working well!")
        else:
            print("⚠️  Caching might not be working as expected")

if __name__ == "__main__":
    test_caching()
