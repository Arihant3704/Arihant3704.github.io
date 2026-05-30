#!/usr/bin/env python3
import os
import re
import sys
from http.server import SimpleHTTPRequestHandler, test

class RangeRequestHandler(SimpleHTTPRequestHandler):
    """
    A SimpleHTTPRequestHandler subclass that supports HTTP Range Requests (206 Partial Content),
    allowing HTML5 video players to seek properly during local testing.
    """
    def send_head(self):
        path = self.translate_path(self.path)
        if os.path.isdir(path):
            return super().send_head()
        
        ctype = self.guess_type(path)
        try:
            f = open(path, 'rb')
        except OSError:
            self.send_error(404, "File not found")
            return None
        
        range_header = self.headers.get('Range')
        if not range_header:
            return super().send_head()
            
        match = re.match(r'bytes=(\d+)-(\d*)', range_header)
        if not match:
            return super().send_head()
            
        start, end = match.groups()
        try:
            start = int(start)
            fs = os.fstat(f.fileno())
            file_len = fs.st_size
            if end:
                end = int(end)
            else:
                end = file_len - 1
                
            if start >= file_len:
                self.send_error(416, "Requested range not satisfiable")
                f.close()
                return None
                
            self.send_response(206)
            self.send_header('Content-Type', ctype)
            self.send_header('Accept-Ranges', 'bytes')
            self.send_header('Content-Range', f'bytes {start}-{end}/{file_len}')
            self.send_header('Content-Length', str(end - start + 1))
            self.end_headers()
            
            f.seek(start)
            return f
        except Exception:
            f.close()
            return super().send_head()

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8001
    print(f"Starting Range-Supporting HTTP Server on port {port}...")
    test(HandlerClass=RangeRequestHandler, port=port, bind='127.0.0.1')
