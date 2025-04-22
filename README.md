🎬 CineNiche
CineNiche is a niche movie streaming platform built with ASP.NET Core and React, designed to deliver personalized movie recommendations using machine learning (collaborative + content-based filtering). The app features full movie and user management tools and is deployed using Azure services for a modern, scalable experience.

🚀 Key Features
🎞️ Movie Experience
View all movies with filters for genre, type, and release year

Full-text search and sorting functionality

Movie Details page with full metadata and poster image

🎛️ Admin Functionality
Add / Edit / Delete movies with image upload to Azure Blob Storage

User Management dashboard to view all users, edit roles (Admin / AuthenticatedCustomer), and delete users

Role-based access protection for admin tools

🔐 Identity & Security
Email-based login with optional 2FA

Roles: Admin, AuthenticatedCustomer

Custom 6-digit token-based 2FA

Email via SMTP or dummy console logger

Custom claims principal adds roles and email to user identity

🧠 Machine Learning
Collaborative Filtering: recommends movies based on user watch behavior

Content-Based Filtering: recommends movies by matching genre/type preferences

⚙️ Tech Stack

Layer	Stack
Frontend	React (TypeScript), React Router
Backend	ASP.NET Core Web API + Identity
Database	Azure SQL Database
Storage	Azure Blob Storage
Auth	ASP.NET Identity + 2FA + Roles
Hosting	Azure Static Web Apps + Azure App Service
ML Engine	Python-based model (REST call to model service, details TBD)
📂 Project Structure
plaintext
Copy
Edit
/backend
├── Program.cs                     → Configures Identity, services, seeding, etc.
├── RegisterController.cs         → Handles registration and 2FA verification
├── SmtpEmailSender.cs            → Sends real 2FA/confirmation emails via SMTP
├── DummyEmailSender.cs           → Dev-mode email logger
├── NumericTwoFactorTokenProvider.cs → Custom numeric 2FA token
├── CustomUserClaimsPrincipalFactory.cs → Adds role/email to auth cookie

/frontend
├── RegisterPage.tsx              → Handles user registration flow
├── LoginPage.tsx                 → Login with 2FA redirect
├── Verify2FA.tsx                 → 2FA token verification UI
├── Movie CRUD & Admin Pages      → Manage movies, posters, users (admin-only)
📸 Screenshots
Coming Soon: Upload your visuals here for:

✅ Registration Flow

🔐 Login + 2FA Verification

🧾 Movie CRUD pages

📊 ML Recommendation Output

🧑‍💼 User Role Manager

🚀 Getting Started
Backend Setup
bash
Copy
Edit
cd backend
dotnet restore
dotnet run
Configure appsettings.json or environment secrets with:

SQL Connection

SMTP Credentials

Azure Blob Storage Keys

Frontend Setup
bash
Copy
Edit
cd frontend
npm install
npm run dev
Ensure proxy or CORS setup points to your backend (https://localhost:5000 or deployed API endpoint)

🔐 Default Users

Role	Email	Password
Admin	admin@rootkit.com	Admin123!
AuthenticatedCustomer	user@rootkit.com	Superpurplefresh!
🌐 Deployment (Azure)
Frontend: Hosted via Azure Static Web Apps

Backend: Deployed on Azure App Service

Database: Azure SQL DB

Image Storage: Azure Blob Storage (linked via cleaned movie titles)

