POST http://localhost:8080/v1/fragments
Content-Type: application/json

[BasicAuth]
user1@email.com:password1

`{"service":"DynamoDB"}`

HTTP/1.1 201

[Captures]
fragment1_url: header "Location"

# Get fragment metadata info
GET {{fragment1_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragment.type" == "application/json"
jsonpath "$.fragment.size" == 22

# Post second fragment (markdown)
POST http://localhost:8080/v1/fragments
Content-Type: text/markdown

[BasicAuth]
user1@email.com:password1

`DynamoDB is great.`

HTTP/1.1 201

[Captures]
fragment2_url: header "Location"

# Get second fragment info
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragment.type" == "text/markdown"
jsonpath "$.fragment.size" == 18

# List fragments for user (ids only)
GET http://localhost:8080/v1/fragments
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# Delete the first fragment
DELETE {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

# Verify first fragment is gone (should be 404)
GET {{fragment1_url}}
[BasicAuth]
user1@email.com:password1

HTTP/1.1 404

# Verify second fragment still exists
GET {{fragment2_url}}/info
[BasicAuth]
user1@email.com:password1

HTTP/1.1 200

[Asserts]
jsonpath "$.fragment.type" == "text/markdown"
