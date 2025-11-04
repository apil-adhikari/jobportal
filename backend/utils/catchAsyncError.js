// Catch Asynchronous Errors using Higher Order function(it is a function that returns another function)

/**
 * This is a common and very useful pattern in Express.js applications to simplify error handling for asynchronous functions. It's often referred to as a "Higher-Order Function" because it's a function that returns another function.

Let's break it down step-by-step:

1. export const catchAsyncError = (fn) => ...
export const catchAsyncError: Defines and exports a constant variable named catchAsyncError.

(fn) => ...: This function takes a single argument, fn. This fn is expected to be an asynchronous Express route handler, which has the signature (req, res, next).

2. ... => (req, res, next) => { ... }
The function catchAsyncError doesn't run the route handler directly. Instead, it returns a new function.

This new function is the actual middleware or route handler that Express will use. It takes the standard Express arguments: req (request), res (response), and next (the next middleware function).

3. fn(req, res, next)
Inside the returned function, we call the original asynchronous route handler (fn) that was passed in.

We pass it the req, res, and next arguments that Express provided to our new function.

Because fn is an async function, calling it returns a Promise.

4. .catch(next)
This is the most important part. We attach a .catch() block directly to the Promise returned by fn.

If the async function fn completes successfully, the promise resolves and nothing happens here. The response is sent by the function itself (e.g., res.status(200).json(...)).

If an error occurs inside the async function fn (e.g., a database query fails, or an ApiError is thrown), the promise is rejected.

The .catch() block catches this rejection.

We pass next as the argument to .catch(). When a promise is rejected, .catch() calls its callback with the error object. By passing next, we are effectively calling next(error), which passes the error to the next error-handling middleware in the Express stack.

In Simple Terms:
In Express.js, when you use a regular (synchronous) route handler, if an error is thrown, Express catches it and automatically forwards it to your error-handling middleware.

JavaScript

app.get('/sync-route', (req, res, next) => {
    // If an error is thrown here...
    throw new Error('Something went wrong!');
    // ...Express will automatically call next(error) for you.
    });
    However, this doesn't work for async functions. If an error is thrown in an async function, it's trapped inside the Promise and doesn't get passed to Express's error handler. You would have to manually use a try...catch block in every single async route handler:
    
    JavaScript
    
    // Without `catchAsyncError`
    app.get('/my-route', async (req, res, next) => {
        try {
            const user = await User.findById(req.params.id);
            res.json(user);
            } catch (err) {
                // You have to manually call next(err) in every route
                next(err);
                }
                });
This leads to a lot of repetitive, boilerplate code.

The catchAsyncError function solves this problem by wrapping your async route handler and automatically adding the .catch(next) part for you.

How to use it:
Instead of:

JavaScript

app.get('/users/:id', async (req, res, next) => { ... });
You would use it like this:

JavaScript

import { catchAsyncError } from './utils/catchAsyncError.js'; // Assuming this is where it's located

// The route handler function
const getUser = async (req, res, next) => {
    const user = await User.findById(req.params.id);
    if (!user) {
        return next(new ApiError('User not found', 404));
        }
        res.json({ success: true, data: user });
        };
        
        // Use the wrapper
        app.get('/users/:id', catchAsyncError(getUser));
        Now, any error (including thrown ApiErrors or database connection errors) that occurs inside the getUser function will be automatically passed to next(), which then triggers your global error-handling middleware. This keeps your route handlers clean and focused on the business logic.
        */

const catchAsyncError = (fn) => (req, res, next) => {
  //   fn(req, res, next).catch(next);
  fn(req, res, next).catch((err) => next(err));
};

export default catchAsyncError;
