# 🎬 CineNiche

**CineNiche** is a niche movie streaming platform built with ASP.NET Core and React, designed to deliver personalized movie recommendations using machine learning (collaborative + content-based filtering). The app features full movie and user management tools and is deployed using Azure services for a modern, scalable experience.

---

## 🚀 Key Features

### 🎞️ Movie Experience
- View all movies with filters for genre, type, and release year
- Full-text search and sorting functionality
- Movie Details page with full metadata and poster image

### 🎛️ Admin Functionality
- Add / Edit / Delete movies with image upload to Azure Blob Storage
- User Management dashboard to view all users, edit roles (Admin / AuthenticatedCustomer), and delete users
- Role-based access protection for admin tools

### 🔐 Identity & Security
- Using Microsoft.Identity Framework hosted in Azure DB
- Email-based registration with optional 2FA (Coming soon)
- Roles: `Admin`, `AuthenticatedCustomer`
- Custom 6-digit token-based 2FA (Coming Soon)
- Email via SMTP or dummy console logger
- Custom claims principal adds roles and email to user identity

### 🧠 Machine Learning
- **Collaborative Filtering**: recommends movies based on user watch behavior
- **Content-Based Filtering**: recommends movies by matching genre/type preferences

---

## ⚙️ Tech Stack

| Layer        | Stack |
|--------------|-------|
| Frontend     | React (TypeScript), React Router |
| Backend      | ASP.NET Core Web API + Identity |
| Database     | Azure SQL Database |
| Storage      | Azure Blob Storage |
| Auth         | ASP.NET Identity + 2FA + Roles |
| Hosting      | Azure Static Web Apps + Azure App Service |
| ML Engine    | Python-based model (REST call to model service, details TBD) |
