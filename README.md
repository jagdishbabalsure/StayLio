# 🏨 StayLio - Hotel & Host Management System

StayLio is a comprehensive hotel and host management system that provides separate dashboards for administrators and hosts. The platform enables seamless host registration, admin approval workflows, and complete hotel management capabilities with a modern, responsive user interface.

## 📋 Table of Contents

- [Overview](#overview)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Environment Setup](#environment-setup)
- [Installation & Setup](#installation--setup)
- [Database Setup](#database-setup)
- [Running the Application](#running-the-application)
- [System Workflow](#system-workflow)
- [API Endpoints](#api-endpoints)
- [Demo Credentials](#demo-credentials)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

StayLio consists of three main components:

1. **Customer Frontend** - Public-facing website for hotel browsing and booking
2. **Admin/Host Dashboard** - Management interface for administrators and approved hosts
3. **Backend API** - RESTful API server handling all business logic and data management

### Key Features

- 🔐 **Role-based Authentication** - Separate access for admins and hosts
- 👥 **Host Registration & Approval** - Complete workflow from registration to approval
- 🏨 **Hotel Management** - Full CRUD operations for hotel listings
- 📊 **Admin Dashboard** - Comprehensive management interface
- 📱 **Responsive Design** - Mobile-friendly interface across all platforms
- 🔄 **Real-time Updates** - Live status updates and notifications

## 🛠 Technologies Used

### Frontend Technologies
- **React 18.2+** - Modern React with hooks and functional components
- **Vite 4.4+** - Fast build tool and development server
- **Tailwind CSS 3.4** - Utility-first CSS framework
- **React Router DOM 6.8+** - Client-side routing
- **Axios 1.6** - HTTP client for API communication
- **Lucide React 0.263** - Modern icon library
- **ESLint** - Code linting and formatting

### Backend Technologies
- **Spring Boot 3.5.6** - Java-based backend framework
- **Java 17** - Programming language
- **Spring Data JPA** - Data persistence layer
- **MySQL 8** - Relational database
- **Maven** - Dependency management and build tool
- **Hibernate** - ORM framework
- **Spring Web** - RESTful web services

### Development Tools
- **Git** - Version control
- **IntelliJ IDEA / VS Code** - IDE support
- **Postman** - API testing (optional)

## 📁 Project Structure

```
StayLio/
├── 📁 staylio/                          # Customer Frontend (React)
│   ├── 📁 src/
│   │   ├── 📁 components/               # Reusable UI components
│   │   ├── 📁 pages/                    # Page components
│   │   ├── 📁 services/                 # API service layer
│   │   ├── 📁 contexts/                 # React contexts
│   │   └── 📄 App.jsx                   # Main app component
│   ├── 📄 package.json                  # Frontend dependencies
│   └── 📄 vite.config.js               # Vite configuration
│
├── 📁 staylio-admin-dashboard/          # Admin/Host Dashboard (React)
│   ├── 📁 src/
│   │   ├── 📁 components/               # Dashboard components
│   │   │   ├── 📄 HostRegistration.jsx  # Host registration form
│   │   │   ├── 📄 Login.jsx             # Login component
│   │   │   └── 📄 Layout.jsx            # Dashboard layout
│   │   ├── 📁 pages/                    # Dashboard pages
│   │   │   ├── 📄 Dashboard.jsx         # Main dashboard
│   │   │   ├── 📄 HostsManagement.jsx   # Host approval management
│   │   │   └── 📄 HotelsManagement.jsx  # Hotel management
│   │   ├── 📁 services/                 # API services
│   │   └── 📁 contexts/                 # Authentication context
│   └── 📄 package.json                  # Dashboard dependencies
│
├── 📁 staylio-backend/                  # Backend API (Spring Boot)
│   ├── 📁 src/main/java/com/staylio/backend/
│   │   ├── 📁 Controllers/              # REST controllers
│   │   │   ├── 📄 AuthController.java   # Authentication endpoints
│   │   │   ├── 📄 AdminController.java  # Admin management
│   │   │   ├── 📄 HostController.java   # Host management
│   │   │   └── 📄 HotelController.java  # Hotel management
│   │   ├── 📁 model/                    # JPA entities
│   │   │   ├── 📄 Host.java             # Host entity
│   │   │   ├── 📄 Hotel.java            # Hotel entity
│   │   │   └── 📄 User.java             # User entity
│   │   ├── 📁 Service/                  # Business logic layer
│   │   ├── 📁 Repo/                     # JPA repositories
│   │   └── 📁 config/                   # Configuration classes
│   ├── 📁 src/main/resources/
│   │   └── 📄 application.properties    # Application configuration
│   └── 📄 pom.xml                       # Maven dependencies
│
├── 📄 README.md                         # This file
├── 📄 STARTUP_GUIDE.md                  # Detailed startup instructions
├── 📄 IMPLEMENTATION_SUMMARY.md         # Implementation details
└── 📄 PROJECT_STRUCTURE_CLEAN.md       # Clean project structure guide
```

## ⚡ Prerequisites

Before setting up the project, ensure you have the following installed:

### Required Software
- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Java 17+** - [Download OpenJDK](https://openjdk.org/projects/jdk/17/)
- **MySQL 8.0+** - [Download here](https://dev.mysql.com/downloads/mysql/)
- **Maven 3.6+** - [Download here](https://maven.apache.org/download.cgi)
- **Git** - [Download here](https://git-scm.com/downloads)

### Verify Installation
```bash
# Check Node.js version
node --version

# Check Java version
java --version

# Check Maven version
mvn --version

# Check MySQL version
mysql --version

# Check Git version
git --version
```

## 🔧 Environment Setup

### 1. Database Configuration

Create a MySQL database for the project:

```sql
-- Connect to MySQL as root
mysql -u root -p

-- Create database
CREATE DATABASE staylio_db;

-- Create user (optional - you can use root)
CREATE USER 'staylio_user'@'localhost' IDENTIFIED BY 'your_password';
GRANT ALL PRIVILEGES ON staylio_db.* TO 'staylio_user'@'localhost';
FLUSH PRIVILEGES;

-- Exit MySQL
EXIT;
```

### 2. Backend Configuration

Update the database configuration in `staylio-backend/src/main/resources/application.properties`:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/staylio_db
spring.datasource.username=root
spring.datasource.password=your_mysql_password

# Server Configuration
server.port=8081

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQL8Dialect
```

### 3. Frontend Configuration

The frontend applications are configured to connect to:
- **Backend API**: `http://localhost:8081`
- **Customer Frontend**: `http://localhost:3000`
- **Admin Dashboard**: `http://localhost:3001`

No additional environment configuration is required for the frontend applications.

## 🚀 Installation & Setup

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/staylio.git
cd staylio
```

### 2. Backend Setup

```bash
# Navigate to backend directory
cd staylio-backend

# Install dependencies and build
mvn clean install

# Run the application
mvn spring-boot:run
```

**Expected Output:**
```
Started StaylioBackendApplication in X.XXX seconds
Tomcat started on port(s): 8081 (http)
Staylio Backend is Running.....
```

### 3. Admin Dashboard Setup

```bash
# Navigate to admin dashboard directory
cd staylio-admin-dashboard

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
Local:   http://localhost:3001/
Network: use --host to expose
```

### 4. Customer Frontend Setup

```bash
# Navigate to customer frontend directory
cd staylio

# Install dependencies
npm install

# Start development server
npm run dev
```

**Expected Output:**
```
Local:   http://localhost:3000/
Network: use --host to expose
```

## 🗄️ Database Setup

### Automatic Table Creation

The application uses Hibernate with `ddl-auto=update`, which means:

1. **First Run**: All tables will be automatically created
2. **Subsequent Runs**: Tables will be updated if entity changes are detected
3. **Data Persistence**: Existing data will be preserved

### Database Tables Created

The following tables will be automatically created:

- `hosts` - Host information and registration data
- `hotels` - Hotel listings and details
- `users` - General user accounts
- `admins` - Administrator accounts
- `booking_attributes` - Booking-related data

### Manual Database Verification

```sql
-- Connect to MySQL
mysql -u root -p

-- Use the database
USE staylio_db;

-- Show all tables
SHOW TABLES;

-- Check hosts table structure
DESCRIBE hosts;
```

## 🎮 Running the Application

### Start All Services

1. **Start Backend** (Port 8081):
   ```bash
   cd staylio-backend
   mvn spring-boot:run
   ```

2. **Start Admin Dashboard** (Port 3001):
   ```bash
   cd staylio-admin-dashboard
   npm run dev
   ```

3. **Start Customer Frontend** (Port 3000):
   ```bash
   cd staylio
   npm run dev
   ```

### Access the Applications

- **Customer Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:8081
- **API Test Endpoint**: http://localhost:8081/api/auth/test

## 🔄 System Workflow

### Complete Host Registration & Approval Flow

1. **Host Registration**
   - Navigate to: `http://localhost:3001/register`
   - Fill out registration form with business details
   - Submit application (status: `PENDING_APPROVAL`)

2. **Admin Review**
   - Admin logs in: `http://localhost:3001/login`
   - Navigate to "Hosts Management"
   - Review pending applications
   - Approve or reject with reason

3. **Host Access**
   - Approved hosts can login at: `http://localhost:3001/login`
   - Access host dashboard and hotel management
   - Manage hotel listings and bookings

4. **Hotel Management**
   - Approved hosts can add/edit/delete hotels
   - Hotels appear on customer frontend
   - Real-time updates across platforms

## 🔌 API Endpoints

### Authentication Endpoints

```http
# Host Registration
POST /api/auth/signup-host
Content-Type: application/json

{
  "ownerName": "John Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "password": "securepass123",
  "companyName": "Doe Hotels Ltd",
  "businessAddress": "123 Business St, City, State 12345"
}

# Host/Admin Login
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}

# Test Connectivity
GET /api/auth/test
```

### Admin Management Endpoints

```http
# Get Pending Hosts
GET /api/admin/hosts/pending

# Approve Host
PUT /api/admin/hosts/{hostId}/approve

# Reject Host
PUT /api/admin/hosts/{hostId}/reject
Content-Type: application/json

{
  "reason": "Incomplete documentation"
}
```

### Hotel Management Endpoints

```http
# Get All Hotels
GET /api/hotels

# Create Hotel
POST /api/hotels
Content-Type: application/json

# Update Hotel
PUT /api/hotels/{hotelId}

# Delete Hotel
DELETE /api/hotels/{hotelId}
```

## 🔑 Demo Credentials

### Admin Access
```
Email: admin@staylio.com
Password: admin123
```

### Test Host Registration
Use the registration form at `/register` to create test host accounts.

## 🔧 Troubleshooting

### Common Issues & Solutions

#### 1. Backend Won't Start

**Error**: `Port 8081 already in use`
```bash
# Find process using port 8081
netstat -ano | findstr :8081

# Kill the process (Windows)
taskkill /PID <PID> /F

# Kill the process (Mac/Linux)
kill -9 <PID>
```

**Error**: `Database connection failed`
```bash
# Check MySQL service status
# Windows: services.msc -> MySQL
# Mac: brew services list | grep mysql
# Linux: systemctl status mysql

# Verify database exists
mysql -u root -p -e "SHOW DATABASES;"
```

#### 2. Frontend Issues

**Error**: `CORS policy error`
- Ensure backend is running on port 8081
- Clear browser cache and restart

**Error**: `Module not found`
```bash
# Clear node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 3. Database Issues

**Error**: `Table doesn't exist`
- Ensure `spring.jpa.hibernate.ddl-auto=update` in application.properties
- Restart backend to trigger table creation

**Error**: `Access denied for user`
- Verify MySQL credentials in application.properties
- Check user permissions in MySQL

#### 4. Port Conflicts

**Default Ports:**
- Backend: 8081
- Admin Dashboard: 3001
- Customer Frontend: 3000

**Change Ports:**
```bash
# Backend: Update server.port in application.properties
# Frontend: Use --port flag
npm run dev -- --port 3002
```

### Getting Help

1. **Check Logs**: Look at console output for error messages
2. **Verify Services**: Ensure all services are running on correct ports
3. **Test API**: Use the test endpoint `/api/auth/test`
4. **Database Check**: Verify database connection and table creation

## 🤝 Contributing

We welcome contributions to StayLio! Please follow these guidelines:

### Development Workflow

1. **Fork the Repository**
   ```bash
   git fork https://github.com/your-username/staylio.git
   ```

2. **Create Feature Branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation as needed

4. **Test Your Changes**
   ```bash
   # Test backend
   cd staylio-backend
   mvn test

   # Test frontend
   cd staylio-admin-dashboard
   npm run lint

   cd staylio
   npm run lint
   ```

5. **Submit Pull Request**
   - Provide clear description of changes
   - Include screenshots for UI changes
   - Reference any related issues

### Code Style Guidelines

- **Backend**: Follow Java naming conventions and Spring Boot best practices
- **Frontend**: Use ESLint configuration and React best practices
- **Database**: Use descriptive column names and proper indexing
- **Documentation**: Update README and inline comments for significant changes

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Support

For support and questions:

- **Documentation**: Check the `/docs` folder for detailed guides
- **Issues**: Create an issue on GitHub for bug reports
- **Discussions**: Use GitHub Discussions for questions and ideas

---

**🎉 Happy Coding! Welcome to StayLio!**

*Built with ❤️ using React, Spring Boot, and MySQL*