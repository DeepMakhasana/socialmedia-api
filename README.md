# Social media [Backend]

This project make while lerning Backend technology (nodejs, expressjs and mongoDB).

## Social media API Documentation

Welcome to the documentation for Social media. This API allows you to create user account, user can follow anther user, also create post and like and comment feature.

### Base URL

The base URL for all API endpoints is: https://social-media-backend-nkz6.onrender.com/api/v1/

# Endpoints for User

## 1. GET /account
Retrieve a data of login user.

### Request:

* Method: GET
* Endpoint: /account
* Headers:
  Content-Type: application/json

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "user": {
        "_id": "645f3523d603e9428cf160da",
        "name": "Deep Makhsana",
        "userName": "deep_patel_1310",
        "email": "deepmakhasana1013@gmail.com",
        "phoneNumber": 7043449597,
        "password": "$2b$10$DoLtC4TWs353RKzNMV3OI.MFY3.ZEME2gNpxBKfh29M39W3TTQ25i",
        "bio": " ",
        "profileImage": "default-profile-image.png",
        "link": [],
        "accountType": "public",
        "post": [],
        "follower": [],
        "following": [],
        "createdAt": "2023-05-13T06:58:43.931Z",
        "updatedAt": "2023-05-13T06:58:43.931Z",
        "__v": 0
    }
}
```

## 2. GET /account/{userName}
Retrieve a data of particular user.

### Request:

* Method: GET
* Endpoint: /account/deep_patel_1310
* Headers:
  Content-Type: application/json

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "user": {
        "_id": "645f3523d603e9428cf160da",
        "name": "Deep Makhsana",
        "userName": "deep_patel_1310",
        "email": "deepmakhasana1013@gmail.com",
        "phoneNumber": 7043449597,
        "password": "$2b$10$DoLtC4TWs353RKzNMV3OI.MFY3.ZEME2gNpxBKfh29M39W3TTQ25i",
        "bio": " ",
        "profileImage": "default-profile-image.png",
        "link": [],
        "accountType": "public",
        "post": [],
        "follower": [],
        "following": [],
        "createdAt": "2023-05-13T06:58:43.931Z",
        "updatedAt": "2023-05-13T06:58:43.931Z",
        "__v": 0
    }
}
```

## 3. POST /account/register
Create a user.

### Request:

* Method: POST
* Endpoint: /account/register
* Headers:
  Content-Type: application/json

### Request Body:

* name  (string, required) 
* userName  (string, required) 
* email  (string, required) 
* phoneNumber  (Number, required) 
* password  (string, required)

```
{
    "name": Heet,
    "userName": "Heet_Manavadriya"
    "email": "heetmanavadriya@gmail.com"
    "phoneNumber": 9807654312
    "password": "test@user"
}
```

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Register Successfully..."
}
```


## 4. POST /account/login
Login a user.

### Request:

* Method: POST
* Endpoint: /account/login
* Headers:
  Content-Type: application/json

### Request Body:

* email  (string, required) 
* password  (string, required)

```
{
    "email": "heetmanavadriya@gmail.com"
    "password": "test@user"
}
```

### Response:

* Status Code: 200 OK
* Body:

```
{
    {
    "success": true,
    "message": "Login Successfully.",
    "user": {
        "_id": "645f3523d603e9428cf160da",
        "name": Heet,
        "userName": "Heet_Manavadriya"
        "email": "heetmanavadriya@gmail.com"
        "phoneNumber": 9807654312
        "accountType": "public"
    }
}
}
```


## 5. PUT /account
Update a user detail.

### Request:

* Method: PUT
* Endpoint: /account
* Headers:
  Content-Type: application/json

### Request Body:

* name  (string) 
* userName  (string) 
* bio (string)
* link (string)
* accountType (string) - public/private
Any one is required.

```
{
    "name": "Heet Manavadriya",
    "userName": "Heet_Manavadriya_111"
    "bio": "I am a good boy."
    "link": "goodboy.com"
}
```

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Account Update successfully."
}
```

## 5. PATCH /account/profile-image
Update a user profile image.

### Request:

* Method: PATCH
* Endpoint: /account/profile-image
* Headers:
  Content-Type: application/json

### Request Body:

* profileImage  (file, require) 

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Profile Image update successfully."
}
```

## 6. PUT /account/follow/{antherFriendId}
Update a user profile image.

### Request:

* Method: PATCH
* Endpoint: /account/follow/64464d649c2f68d906b4edce
* Headers:
  Content-Type: application/json
  
### Path Parameters:

id (string, required) - The ID of anther person.

### Response:

* Status Code: 200 OK
* Body:

If user is not follow this person then response:
```
{
    "success": true,
    "message": "User followed.",
    "myId": "645f3523d603e9428cf160da",
    "followerId": "64464d649c2f68d906b4edce"
}
```

If user is already follow this person then response:
```
{
    "success": true,
    "message": "User unfollowed.",
    "myId": "645f3523d603e9428cf160da",
    "followerId": "64464d649c2f68d906b4edce"
}
```

## 7. DELETE /account
Delete login user account.

### Request:

* Method: DELETE
* Endpoint: /account
* Headers:
  Content-Type: application/json

### Response:

* Status Code: 200 OK
* Body:

If user is not follow this person then response:
```
{
    "success": true,
    "message": "Account delete successfully."
}
```



# Endpoints for Post

## 1. GET /post
Retrieve a post which created by follower and following.

### Request:

* Method: GET
* Endpoint: /post
* Headers:
  Content-Type: application/json

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Posts Fetch successfully.",
    "FollowerAndFollowing": [
        "645f3523d603e9428cf160da",
        "641982e24a600b005ecd2cff"
    ],
    "posts": [
        {
            "_id": "641983194a600b005ecd2d02",
            "caption": "Post created by Ansh Gor.",
            "location": "Rajkot",
            "postImage": "1679393561238-923539721-condiment.jpg",
            "createdBy": "641982e24a600b005ecd2cff",
            "like": [
                "641982e24a600b005ecd2cff",
                "641942071397d190415d7d1a"
            ],
            "comment": [],
            "createdAt": "2023-03-21T10:12:41.250Z",
            "updatedAt": "2023-03-21T11:30:47.643Z",
            "__v": 8
        }
    ]
}
```

## 2. GET /post/{postId}
Retrieve a particular post.

### Request:

* Method: GET
* Endpoint: /post/{postId}
* Headers:
  Content-Type: application/json

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "post fetch successfully.",
    "post": {
        "_id": "641983194a600b005ecd2d02",
        "caption": "Post created by Ansh Gor.",
        "location": "Rajkot",
        "postImage": "1679393561238-923539721-condiment.jpg",
        "createdBy": "641982e24a600b005ecd2cff",
        "like": [
            "641982e24a600b005ecd2cff",
            "641942071397d190415d7d1a"
        ],
        "comment": [],
        "createdAt": "2023-03-21T10:12:41.250Z",
        "updatedAt": "2023-03-21T11:30:47.643Z",
        "__v": 8
    }
}
```

## 3. POST /post
Create a post.

### Request:

* Method: POST
* Endpoint: /post
* Headers:
  Content-Type: application/json

### Request Body:

* caption  (string, required) 
* location  (string, required) 
* postImage  (file, required) 

```
{
    "caption": "Caption test",
    "location": "Rajkot"
    "postImage": "xyz.jpg"
}
```

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Post Upload successfully.",
    "post": {
        "caption": "Post created by Deep Makhasana.",
        "location": "Rajkot",
        "postImage": "1683975059819-123636240-photo (1).jpg",
        "createdBy": "645f3523d603e9428cf160da",
        "like": [],
        "_id": "645f6b935a2812c8ed9a36da",
        "comment": [],
        "createdAt": "2023-05-13T10:50:59.827Z",
        "updatedAt": "2023-05-13T10:50:59.827Z",
        "__v": 0
    }
}
```


## 4. PUT /post/comment/{postId}
Comment on post.

### Request:

* Method: PUT
* Endpoint: /post/comment/645f6b935a2812c8ed9a36da
* Headers:
  Content-Type: application/json

### Request Body:

* comment  (string, required) 

```
{
    "comment": "comment by Deep Mkakhasana"
}
```

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Comment Upload successfully.",
    "post": {
        "postId": "645f6b935a2812c8ed9a36da",
        "commentBy": "645f3523d603e9428cf160da"
    }
}
```


## 5. PUT /post/{postId}
Update a post detail.

### Request:

* Method: PUT
* Endpoint: /post/645f6b935a2812c8ed9a36da
* Headers:
  Content-Type: application/json
  
### Path Parameters:

postId (string, required) - The ID of post.

### Request Body:

* caption  (string) 
* location  (string) 
Any one is required.

```
{
    "caption": "created by @deepmakhasana",
    "location": "Vapi"
}
```

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "Post Update Successfully.",
    "post": "645f6b935a2812c8ed9a36da"
}
```

## 6. PUT /post/like/{postId}
Do like on post.

### Request:

* Method: PUT
* Endpoint: /post/like/645f6b935a2812c8ed9a36da
* Headers:
  Content-Type: application/json

### Path Parameters:

postId (string, required) - The ID of post.

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "like",
    "postId": "645f6b935a2812c8ed9a36da"
}
```

## 7. DELETE /post/comment/{postId}/{commentId}
Delete comment from post.

### Request:

* Method: DELETE
* Endpoint: /account/follow/64464d649c2f68d906b4edce
* Headers:
  Content-Type: application/json
  
### Path Parameters:

postId (string, required) - The ID of post.
commentId (string, required) - The ID of comment.

### Response:

* Status Code: 200 OK
* Body:

```
{
    "success": true,
    "message": "comment delete successfully by owner."
}
```

## 8. DELETE /post/{postId}
Delete post.

### Request:

* Method: DELETE
* Endpoint: /post/645f6b935a2812c8ed9a36da
* Headers:
  Content-Type: application/json

### Response:

* Status Code: 200 OK
* Body:

If user is not follow this person then response:
```
{
    "success": true,
    "message": "Post Delete Successfully.",
    "post": "645f6b935a2812c8ed9a36da"
}
```

## Getting Started in Local System

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to run this site
* [Node js](https://nodejs.org/en/download) - Node.js is an open-source, cross-platform JavaScript runtime environment.
* [NPM](https://sourceforge.net/projects/npm.mirror/) - Node package manager


### Clone project

1. Clone the repository: Use the git clone command followed by the repository URL. For example:

```
git clone https://github.com/DeepMakhasana/socialmedia_webapp.git
```

2. Change to the cloned project directory: Once the cloning process is complete, navigate into the newly created project directory:

```
cd socialmedia_webapp
```

3. Install project dependencies: Most Node.js projects have dependencies listed in a package.json file. Use the following command to install these dependencies:

```
npm install
```

4. Run the Node.js project: Depending on the project, there may be different commands to start it. Commonly, you can find an entry point file, such as index.js or app.js. Use the following command to run the project:

```
npm run dev
```

That's it! You should now have cloned and successfully run the Node.js project from GitHub on your local machine.

### Thank you for visiting...
