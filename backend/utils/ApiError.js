/**
 * This is a custom error class in JavaScript, specifically designed to handle errors that occur in an API (Application Programming Interface). It extends the built-in Error class, which is a fundamental part of JavaScript's error-handling mechanism.
 * - `extends Error`: This is the key part. It means ApiError is a subclass of the native Error class. By extending Error, ApiError automatically inherits its properties and methods, such as message, name, and the ability to be used with `try...catch` blocks.
 * - `constructor(message, statusCode)`
    The `constructor` is a special method that is called when you create a new instance of the `ApiError` class (e.g., n`ew ApiError(...)`).

        It takes two arguments:
        - `message`: A string that describes the error. This is the standard message that you would see with any error.

        - `statusCode`: A number representing the `HTTP status code` associated with the error (e.g., `404 for Not Found`, `401 for Unauthorized`, `500 for Internal Server Error`). This is a crucial piece of information for an API, as it tells the client what kind of response to expect.

 * - `Error.captureStackTrace(this, this.constructor);`
        - This is an advanced feature primarily used in Node.js for creating clean and accurate stack traces.

        - `Error.captureStackTrace()` modifies the this object (the ApiError instance) to include a stack property.

        - The second argument, `this.constructor`, tells Node.js to exclude the `ApiError` constructor call from the stack trace. This makes the stack trace more helpful and readable, as it points to where the error was created, not to the internal workings of the ApiError class itself.
 
 */

class ApiError extends Error {
  // Inherit ApiError from Error class

  constructor(message, statusCode) {
    console.log('In ApiError Class Constructor');
    super(message);

    this.statusCode = statusCode;

    Error.captureStackTrace(this, this.constructor);
  }
}

export default ApiError;
