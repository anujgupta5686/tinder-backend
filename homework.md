- Create a repository
- Initialize the repository
- node_modules, package.json, package.lock.json.
- Install express
- create a server
- listen to port 3000
- write request handler for /test, /hello
- install nodemon and update scripts inside package.json
- what are dependencies
- what is use of the "-g" while npm install
- Difference between caret and tilde (^ VS ~)

////Next Day work

- Initialize git
- gitignore
- create a remote repository on github
- push code in the remote repository
- play with routes and route extensions. ex. /hello, /test, /, hello/2, /xyz
- Install Postman Apps and make a workspace/collection > tes API call
- Make logic to handle GET. POST, DELETE, PATCH, PUT calls and test them on postman
- Explore Routing and use of ?, +, (), \* in the routing.
- Use of regex in routing /a/ /.\*fly$/
- how to reading query params in the routes
- Reading the dynamic routes.

- Multiple Route handler - play with the code
- next()
- next function and error along with res.send();
  app.use("route",rH,[rH1,rH2],rH3);
- Difference between app.all() and app.use()
- What is middleware and why do we need it?
- Write a dummy auth middleware for the admin
- Write a dummy auth middleware for the all user routes, except /user/login
- Error handling using app.use("/", (err, req, res, next) => {
  if (err) {
  res.status(500).send("Something went wrong");
  }
  });

- Create a free cluster on mongodb official website (MongoDB Atlas)
- Install mongoose library
- Connect you application to the database "Connection-url"/devTinder
  Call the connectDB function and connect to database before starting application on specific PORT.
  - Create the userSchema and user Model
- Create POST /signup API to add daat to the database
- Push some documents using API call from postman
- Make sure when make API then wrap all code inside the try catch block. It's very easy to detect any error during the data insertion.
- Error handling using try catch
- JS Object vs JSON (Difference)
  Add the express.json middleware to your app
  Make your signup API dynamic to receive data from the postman/end user
- Make your signup API dynamic to receive data from the end user.
- User.findOne() with Duplicate email IDs, which object returned.
- API - Get user by Email ID
- API - Feed API - GET/feed - get all the users from the database.
- Get user By ID.
- Difference Between PUT and PATCH
- API - Update a user
- Explore the Mongoose Documents for Model methods.
- What are option in a model.findOneAndUpdate method, Explore more about it.
- API - Update the user with email ID.
- Explore schema types options from the documentation
- Add required, unique, lowercase, minLength, trim.
- Add default value.
- Create custorm validate function
  for gender.
- Improve the DB schema - PUT all appropiate validations on each field un schema.
- Add timestamp to the user Schema
- Add API level validation on PATCH and PUT Request and Signup Post API.
- Add API validation for each field.
- Data Sanitization - Add API validation for each.
- Install Joi Library and use Email,Password and URL validation.

- Validate data in signup API
- Install bcrypt package
- create a password hash using bcrypt.hash and save the user with encrypted password.
- Create Login API.
- Compare password and throw errors of email or password is invalid.
- install cookie-parcer.
- install jsonwebtoken.
- Create GET /user API and check if you get the cookie back [res.user=decode] in auth.js
- In login API, After email and password validation, create a JWT token and send it to user.
- read the cookies inside the user api and find the looged in.
- write auth middleware
- Add the user auth middlware in user api and send connection requestion.
- Set the expiry of JWT token and cookies to 7 days.
- Create userSchema methods to getJWT()
- create userSchema methods to validatePassword(passwordInputByUser);

- Explore tinder APIs
- Create a list all API you can think of in Dev Tinder
- Group multiple router under repective routers.
- Create POST Logout /logout API and tested
- Create PATCH /profile/edit
- Forget Password API.
- Validate all data in every HTTP Methods.
- Create Connection Request Schema.
- Send connection request API
- Proper validation of data.
- Think about all corner cases.
- $or query $and query - https://www.mongodb.com/docs/manual/reference/operator/query/eq/
- Read About of Schema.pre("save", function(){...});

- Read more about index in mongodb
- Why do we need index in DB?
- What is the advantages and disadvantages creating index.
- Read the this article about compond index - https://www.mongodb.com/docs/manual/core/indexes/index-types/index-compound/

- Write code with proper validation for POST /request/review/:status/:requestId
- Thought process - POST vs GET
- read about ref and populate https://www.geeksforgeeks.org/mongoose-populate-method/ - and
  https://mongoosejs.com/docs/populate.html
- Create GET /user/requests/receive with all the checks.
- Create GET /user/connections

- Logic fro GET /feed
- Explore the $nin , $and , $ne and other query operators.
- Pagination


Rough Work
- skip(0), limit(10)
/feed?page=1&limit=10 => 1-10 .skip(0) & limit(10)
/feed?page=2&limit=10 => 11-20 .skip(10) & limit(10)
/feed?page=3&limit=10 => 21-30 .skip(20) & limit(10)

pageSkip=(page-1)*limit;
