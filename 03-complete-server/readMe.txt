powershell:
curl -sG http://localhost:1337/products -d tag=dark | ConvertFrom-Json
curl -s http://localhost:1337/products/0ZPSX_mQ3xI
curl -X POST   http://localhost:1337/products -H "Content-type:application/json" -d '{\"description\":\"Spring Forever\",\"link\":\"https://example.com\"}'