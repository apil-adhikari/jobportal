```
📁 src
│
├── 📁 config                # App-wide configs (env, DB, third-party, etc.)
│   ├── db.js
│   ├── cloudinary.js
│   └── dotenv.js
│
├── 📁 controllers           # Handles HTTP requests/responses only
│   ├── auth.controller.js
│   ├── user.controller.js
│   ├── company.controller.js
│   └── job.controller.js
│
├── 📁 services              # Core business logic (calls repositories)
│   ├── auth.service.js
│   ├── user.service.js
│   ├── company.service.js
│   └── job.service.js
│
├── 📁 repositories          # All direct database queries (like Prisma, Mongoose)
│   ├── user.repo.js
│   ├── job.repo.js
│   └── company.repo.js
│
├── 📁 models                # Mongoose or Prisma schema definitions
│   ├── user.model.js
│   ├── job.model.js
│   └── company.model.js
│
├── 📁 routes                # All route definitions
│   ├── auth.routes.js
│   ├── user.routes.js
│   ├── company.routes.js
│   ├── job.routes.js
│   └── index.js             # Combines all routers
│
├── 📁 middlewares           # Reusable Express middlewares
│   ├── auth.middleware.js
│   ├── error.middleware.js
│   └── validation.middleware.js
│
├── 📁 utils                 # Helpers, formatters, common logic
│   ├── token.util.js
│   ├── password.util.js
│   └── slug.util.js
│
├── 📁 validators            # Zod / Joi / Yup schema definitions
│   ├── auth.validator.js
│   └── user.validator.js
│
├── 📁 constants             # App-wide enums, status codes, roles
│   ├── roles.js
│   └── jobTypes.js
│
├── 📁 dtos                  # Data Transfer Objects (optional, for shaping req/res)
│   ├── user.dto.js
│   └── job.dto.js
│
├── 📁 errors                # Custom error classes
│   ├── ApiError.js
│   └── NotFoundError.js
│
├── 📁 tests                 # Unit/integration tests
│   └── auth.test.js
│
├── 📁 uploads               # Temporary storage (for multer, if needed)
│
├── app.js                  # App setup (Express, routes, middleware)
├── server.js               # Entry point (listens to port)
└── .env
```

## Folder Structure for Job

```

├── controllers/
│   └── job.controller.js
├── services/
│   └── job.service.js
├── repositories/
│   └── job.repository.js
├── models/
│   └── job.model.js
├── middlewares/
│   └── error.middleware.js
│   └── notFound.middleware.js
├── routes/
│   └── job.routes.js
├── utils/
│   └── ApiError.js
│   └── catchAsync.js
├── app.js
└── server.js

```
