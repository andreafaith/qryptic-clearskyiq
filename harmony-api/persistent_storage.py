"""
Persistent Storage Module for Harmony API
Handles persistent caching and data storage for VPS deployment
"""

import os
import json
import pickle
import sqlite3
from datetime import datetime, timedelta
from typing import Dict, Any, Optional
import threading
import hashlib
import logging

class PersistentCache:
    """Persistent cache with SQLite backend for VPS deployment"""
    
    def __init__(self, cache_dir: str = "/app/cache", max_size: int = 1000, ttl_hours: int = 24):
        self.cache_dir = cache_dir
        self.max_size = max_size
        self.ttl_hours = ttl_hours
        self.db_path = os.path.join(cache_dir, "cache.db")
        self.lock = threading.RLock()
        
        # Ensure cache directory exists
        os.makedirs(cache_dir, exist_ok=True)
        
        # Initialize database
        self._init_database()
        
        # Cleanup expired entries on startup
        self._cleanup_expired()
    
    def _init_database(self):
        """Initialize SQLite database for cache storage"""
        with sqlite3.connect(self.db_path) as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS cache (
                    key TEXT PRIMARY KEY,
                    value BLOB,
                    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
                    access_count INTEGER DEFAULT 0,
                    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP
                )
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_created_at ON cache(created_at)
            """)
            conn.execute("""
                CREATE INDEX IF NOT EXISTS idx_last_accessed ON cache(last_accessed)
            """)
    
    def _generate_key(self, data: Dict[str, Any]) -> str:
        """Generate cache key from request data"""
        key_string = json.dumps(data, sort_keys=True)
        return hashlib.md5(key_string.encode()).hexdigest()
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    cursor = conn.execute(
                        "SELECT value, created_at FROM cache WHERE key = ?", (key,)
                    )
                    row = cursor.fetchone()
                    
                    if row:
                        value, created_at = row
                        created_time = datetime.fromisoformat(created_at)
                        
                        # Check if expired
                        if datetime.now() - created_time > timedelta(hours=self.ttl_hours):
                            self.delete(key)
                            return None
                        
                        # Update access statistics
                        conn.execute(
                            "UPDATE cache SET access_count = access_count + 1, last_accessed = CURRENT_TIMESTAMP WHERE key = ?",
                            (key,)
                        )
                        
                        return pickle.loads(value)
                    return None
            except Exception as e:
                logging.error(f"Error getting cache key {key}: {e}")
                return None
    
    def set(self, key: str, value: Any) -> bool:
        """Set value in cache"""
        with self.lock:
            try:
                # Check cache size and evict if necessary
                self._evict_if_needed()
                
                with sqlite3.connect(self.db_path) as conn:
                    conn.execute(
                        "INSERT OR REPLACE INTO cache (key, value) VALUES (?, ?)",
                        (key, pickle.dumps(value))
                    )
                return True
            except Exception as e:
                logging.error(f"Error setting cache key {key}: {e}")
                return False
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    conn.execute("DELETE FROM cache WHERE key = ?", (key,))
                return True
            except Exception as e:
                logging.error(f"Error deleting cache key {key}: {e}")
                return False
    
    def _evict_if_needed(self):
        """Evict least recently used items if cache is full"""
        with sqlite3.connect(self.db_path) as conn:
            cursor = conn.execute("SELECT COUNT(*) FROM cache")
            count = cursor.fetchone()[0]
            
            if count >= self.max_size:
                # Delete least recently used items
                cursor = conn.execute(
                    "SELECT key FROM cache ORDER BY last_accessed ASC LIMIT ?",
                    (count - self.max_size + 10,)  # Delete a few extra to avoid frequent evictions
                )
                keys_to_delete = [row[0] for row in cursor.fetchall()]
                
                for key in keys_to_delete:
                    conn.execute("DELETE FROM cache WHERE key = ?", (key,))
    
    def _cleanup_expired(self):
        """Remove expired entries from cache"""
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    cutoff_time = datetime.now() - timedelta(hours=self.ttl_hours)
                    conn.execute(
                        "DELETE FROM cache WHERE created_at < ?",
                        (cutoff_time.isoformat(),)
                    )
            except Exception as e:
                logging.error(f"Error cleaning up expired cache: {e}")
    
    def clear(self) -> bool:
        """Clear all cache entries"""
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    conn.execute("DELETE FROM cache")
                return True
            except Exception as e:
                logging.error(f"Error clearing cache: {e}")
                return False
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        with self.lock:
            try:
                with sqlite3.connect(self.db_path) as conn:
                    cursor = conn.execute("SELECT COUNT(*) FROM cache")
                    total_entries = cursor.fetchone()[0]
                    
                    cursor = conn.execute("SELECT SUM(access_count) FROM cache")
                    total_accesses = cursor.fetchone()[0] or 0
                    
                    cursor = conn.execute("SELECT AVG(access_count) FROM cache")
                    avg_accesses = cursor.fetchone()[0] or 0
                    
                    # Get oldest and newest entries
                    cursor = conn.execute("SELECT MIN(created_at), MAX(created_at) FROM cache")
                    oldest, newest = cursor.fetchone()
                    
                    return {
                        "total_entries": total_entries,
                        "max_size": self.max_size,
                        "total_accesses": total_accesses,
                        "avg_accesses": round(avg_accesses, 2),
                        "oldest_entry": oldest,
                        "newest_entry": newest,
                        "cache_dir": self.cache_dir,
                        "db_size_mb": os.path.getsize(self.db_path) / (1024 * 1024) if os.path.exists(self.db_path) else 0
                    }
            except Exception as e:
                logging.error(f"Error getting cache stats: {e}")
                return {"error": str(e)}

class DataStorage:
    """Persistent data storage for processed queries and visualizations"""
    
    def __init__(self, data_dir: str = "/app/data"):
        self.data_dir = data_dir
        self.lock = threading.RLock()
        
        # Ensure data directory exists
        os.makedirs(data_dir, exist_ok=True)
        
        # Create subdirectories
        self.visualizations_dir = os.path.join(data_dir, "visualizations")
        self.queries_dir = os.path.join(data_dir, "queries")
        self.metadata_dir = os.path.join(data_dir, "metadata")
        
        for dir_path in [self.visualizations_dir, self.queries_dir, self.metadata_dir]:
            os.makedirs(dir_path, exist_ok=True)
    
    def save_visualization(self, job_id: str, plot_type: str, image_data: bytes, metadata: Dict[str, Any]) -> str:
        """Save visualization image and metadata"""
        with self.lock:
            try:
                # Save image
                image_path = os.path.join(self.visualizations_dir, f"{job_id}_{plot_type}.png")
                with open(image_path, 'wb') as f:
                    f.write(image_data)
                
                # Save metadata
                metadata_path = os.path.join(self.metadata_dir, f"{job_id}_{plot_type}.json")
                with open(metadata_path, 'w') as f:
                    json.dump(metadata, f, indent=2)
                
                return image_path
            except Exception as e:
                logging.error(f"Error saving visualization {job_id}_{plot_type}: {e}")
                return None
    
    def load_visualization(self, job_id: str, plot_type: str) -> Optional[bytes]:
        """Load visualization image"""
        with self.lock:
            try:
                image_path = os.path.join(self.visualizations_dir, f"{job_id}_{plot_type}.png")
                if os.path.exists(image_path):
                    with open(image_path, 'rb') as f:
                        return f.read()
                return None
            except Exception as e:
                logging.error(f"Error loading visualization {job_id}_{plot_type}: {e}")
                return None
    
    def save_query_result(self, query_hash: str, result: Dict[str, Any]) -> str:
        """Save query result for future reference"""
        with self.lock:
            try:
                query_path = os.path.join(self.queries_dir, f"{query_hash}.json")
                with open(query_path, 'w') as f:
                    json.dump(result, f, indent=2)
                return query_path
            except Exception as e:
                logging.error(f"Error saving query result {query_hash}: {e}")
                return None
    
    def load_query_result(self, query_hash: str) -> Optional[Dict[str, Any]]:
        """Load query result"""
        with self.lock:
            try:
                query_path = os.path.join(self.queries_dir, f"{query_hash}.json")
                if os.path.exists(query_path):
                    with open(query_path, 'r') as f:
                        return json.load(f)
                return None
            except Exception as e:
                logging.error(f"Error loading query result {query_hash}: {e}")
                return None
    
    def cleanup_old_data(self, days: int = 30):
        """Clean up data older than specified days"""
        with self.lock:
            try:
                cutoff_time = datetime.now() - timedelta(days=days)
                
                for directory in [self.visualizations_dir, self.queries_dir, self.metadata_dir]:
                    for filename in os.listdir(directory):
                        file_path = os.path.join(directory, filename)
                        if os.path.isfile(file_path):
                            file_time = datetime.fromtimestamp(os.path.getmtime(file_path))
                            if file_time < cutoff_time:
                                os.remove(file_path)
                                logging.info(f"Cleaned up old file: {file_path}")
            except Exception as e:
                logging.error(f"Error cleaning up old data: {e}")
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics"""
        with self.lock:
            try:
                stats = {
                    "total_files": 0,
                    "total_size_mb": 0,
                    "visualizations": 0,
                    "queries": 0,
                    "metadata": 0
                }
                
                for directory, key in [
                    (self.visualizations_dir, "visualizations"),
                    (self.queries_dir, "queries"),
                    (self.metadata_dir, "metadata")
                ]:
                    if os.path.exists(directory):
                        files = os.listdir(directory)
                        stats[key] = len(files)
                        stats["total_files"] += len(files)
                        
                        for filename in files:
                            file_path = os.path.join(directory, filename)
                            if os.path.isfile(file_path):
                                stats["total_size_mb"] += os.path.getsize(file_path)
                
                stats["total_size_mb"] = round(stats["total_size_mb"] / (1024 * 1024), 2)
                return stats
            except Exception as e:
                logging.error(f"Error getting storage stats: {e}")
                return {"error": str(e)}

# Global instances
persistent_cache = PersistentCache()
data_storage = DataStorage()
