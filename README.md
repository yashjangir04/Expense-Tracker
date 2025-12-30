**Expense-Tracker**

Expense-Tracker is a MERN stack (MongoDB, Express.js, React, Node.js) expense reimbursement platform built to replace manual, error-prone approval processes with a secure, transparent, and automated system.

The application enables role-based access control, multi-level approval workflows, and real-time expense tracking for organizations.

==================================================================

TECH STACK

Frontend:

React

Axios

CSS / Tailwind CSS

Backend:

Node.js

Express.js

MongoDB

JWT (JSON Web Token) Authentication

==================================================================

FEATURES

Role-Based Authentication and Authorization

Secure user authentication using JWT

User roles: Admin, Manager, Finance, Director, Employee

Hierarchical permissions based on roles

Multi-Level Approval Workflow

Sequential approval flow:
Manager -> Finance -> Director

Escalation rules for pending approvals

Flexible approval logic supporting percentage-based approvals

Expense Management

Submit expense reimbursement requests

Support for multiple currencies

Real-time currency conversion using external exchange-rate APIs

QR-based receipt scanning for faster uploads

Transparency and Tracking

Real-time tracking of expense status

Complete approval history visible to users

==================================================================

PROJECT STRUCTURE

Expense-Tracker/
|
|-- frontend/
| |-- React application
|
|-- backend/
| |-- Node.js and Express API
|
|-- README.txt

==================================================================

INSTALLATION AND SETUP

Clone the Repository

git clone https://github.com/
yashjangir04/Expense-Tracker.git
cd Expense-Tracker

Backend Setup

cd backend
npm install
npm run dev

Frontend Setup

cd frontend
npm install
npm start

==================================================================

ENVIRONMENT VARIABLES

Create a .env file inside the backend directory with the following values:

MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret_key

==================================================================

FUTURE ENHANCEMENTS

Email and in-app notifications

Admin analytics dashboard

Advanced audit logs and reporting

Improved mobile responsiveness

==================================================================

AUTHOR

Developed by Yash
