# Database API
The goal of this challenge is make a [RESTful][REST] API which connects to a SQLite database.

The database only contains one table called "challenges", which consist out of the following columns; 
 - Id (int, auto increment)
 - Name (string)
 - Description (string)
 - Date (timestamp)

The API will have 4 options for managing challenges;
 - GET, which gets a challenge based on its id
 - DELETE, deletes a challenge based on its id
 - POST, creates a new challenge and returns its id
 - PUT, updates a challenge based on its id

To protect against any unauthorized access, all endpoints will be protected with HMAC authorisation of which the secret (key) will be "challenge-database-api"

## Specifications
 - All API endpoints will be the following: "/api/challenge/[Id]", where [Id] is optional
 - The database used should be SQLite, the file should be [database.db](./sql/database.db)
 - Any data in the body, either request or response, should be JSON
 - The hash that should be used for the HMAC authentication is SHA256 
 - In the case of an invalid HMAC digests there should be a 401 Unauthorized returned
 - The HMAC message should be the endpoint combined with the HTTP verb (GET/POST/PUT/DELETE) seperated by a semicolon(;) e.g. "/api/challenge/;GET"

Other specifications can be found in JS format under the [spec](./spec) folder

## Extra
In [Answer.md](./Answer.md) explain how you could improve the current authorisation to make it more secure (assuming they key is shared in a secure manner, disregarding its length).

If you suggest an alternative method (non HMAC), please also answer the above question.

## Information
 - [HMAC (rfc2104)][HMAC]
 - [REST]

[REST]:https://en.wikipedia.org/wiki/Representational_state_transfer
[HMAC]:https://tools.ietf.org/html/rfc2104
