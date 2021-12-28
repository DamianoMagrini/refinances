# Refinances

A simple Next.js + MongoDB + Redis app to manage your finances


## Libraries & technologies used

### On the frontend
- React + Next.js
- React Hot Toast for toast messages
- Tailwind CSS for styling
- Headless UI for showing accessible dialogs
- React Hook Form for form submission and validation
	- Joi for form validation
- Axios for making API requests

### On the backend
- Next.js API routes
- Joi for data validatioin
- MongoDB as a database
- Redis for storing session tokens
- UUID for generating session tokens


## Running the project

```bash
docker-compose up

# then, on another terminal instance

npm run dev
# or
yarn dev
```

You can also `npm run build` and then `npm start` instead of `npm run dev`, but you will still need to `docker-compose up`.
