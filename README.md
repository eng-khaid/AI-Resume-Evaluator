AI Resume Evaluator
An AI-powered web application that evaluates resumes against job descriptions using OpenAI's language models. The system helps job seekers understand how well their resumes match a target position by analyzing qualifications, skills, and experience, then providing detailed feedback and recommendations.

Project Overview
AI Resume Evaluator was developed to simplify the resume screening process and provide users with intelligent feedback before applying for jobs. The application allows users to upload a PDF resume, enter a job description, and receive a comprehensive AI-generated evaluation.

The system extracts text from the uploaded resume, compares it with the job requirements, and generates insights including strengths, missing skills, overall suitability, and improvement recommendations.

Features
Authentication & Security
User Registration
User Login
JWT Authentication
Protected Routes
Role-Based Access Control
Resume Evaluation
PDF Resume Upload
Automatic Resume Text Extraction
Job Description Analysis
AI-Powered Resume Assessment
Detailed Evaluation Results
Administration
View Registered Users
Manage User Roles
Delete User Accounts
Admin-Only Access Controls
Data Management
Persistent SQLite Database
Secure User Information Storage
Database-Driven Authentication
Technologies Used
Frontend
React
React Router
Axios
Context API
JavaScript
HTML
CSS
Backend
FastAPI
SQLModel
SQLite
JWT Authentication
OpenAI API
PyPDF
Python
System Workflow
The user registers a new account or logs in.
The user uploads a PDF resume.
The user enters a target job description.
The system extracts text from the uploaded resume.
Resume content and job requirements are processed by OpenAI.
The AI generates a detailed evaluation report.
Results are displayed to the user through the web interface.
Architecture
The application follows a full-stack architecture consisting of:

React frontend for user interaction.
FastAPI backend for business logic and API endpoints.
SQLite database for user management and persistence.
OpenAI integration for intelligent resume evaluation.
PDF processing module for extracting resume content.
Skills Demonstrated
Full-Stack Web Development
REST API Development
Database Design
Authentication & Authorization
AI Integration
PDF Processing
State Management
Error Handling
Software Architecture
Version Control with Git & GitHub
Future Enhancements
Resume scoring dashboard
OCR support for scanned resumes
Advanced analytics and visual reports
Multiple resume comparisons
Cloud deployment with AWS
Enhanced AI recommendations
Author
Developed as a full-stack AI-powered web application demonstrating modern software engineering practices, backend development, frontend development, database integration, authentication systems, and artificial intelligence integration.
