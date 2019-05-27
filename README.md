# To-do web app
**[codingtodo.com](codingtodo.com)**

## To do list
Stores tasks in the localStorage as a stringified JSON object, when needed the string is parsed to back to JSON.

## Backend
The app supports user registration & authentication for either and admin user, or a regular user. Admins can add, edit and delete(paranoid) blogs.

When adding a blog, the admin can type and see the live processed markdown to the right of the `textarea`.

Regular users will be able to add multiple projects to manage task lists.

Blog title is used as the url slug.
Blog topic is used as the css class (appended with a `-bg`).

Authentication is done with a JWT stored in the users cookies and checked with middleware on protected routes.

## Blog
Added by admin, author defaults to me.

Blogs are published immediately (currently), and there's also a note of when the article was last updated. Publish date & updated dates use the database columns `createdAt` and `updatedAt`.

When reading an article, all the headings are put into an array and sorted by their distance from the top (to ensure the order makes sense to the user). A sidebar is then created to allow the user to easily scroll through.

## Server
The site is served via NGINX reverse proxy, and the app is run with pm2. The VPS is Ubuntu 18.04 from DigitalOcean.
