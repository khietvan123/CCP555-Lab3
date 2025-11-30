POST http://localhost:8080/v1/fragments
Content-Type: text/plain

[BasicAuth]
admin:password

`Hello S3!`

HTTP/1.1 201
[Captures]
url: header "Location"

GET {{url}}

[BasicAuth]
admin:password

HTTP/1.1 200

[Asserts]
body == "Hello S3!"

DELETE {{url}}

[BasicAuth]
admin:password

HTTP/1.1 200

GET {{url}}

[BasicAuth]
admin:password

HTTP/1.1 404
