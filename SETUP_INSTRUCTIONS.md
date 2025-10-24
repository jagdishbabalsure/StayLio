# 🚀 StayLio - Quick Setup Instructions

## 📋 Prerequisites

Before setting up StayLio , ensure you have:

- **Node.js 16+** - [Download](https://nodejs.org/)
- **Java 17+** - [Download OpenJDK](https://openjdk.org/projects/jdk/17/)
- **MySQL 8.0+** - [Download](https://dev.mysql.com/downloads/mysql/)
- **Maven 3.6+** - [Download](https://maven.apache.org/download.cgi)
- **Git** - [Download](https://git-scm.com/downloads)

## 🔧 Environment Setup

### 1. Clone the Repository
```bash
git clone https://github.com/jagdishbabalsure/StayLio.git
cd StayLio
```

### 2. Database Setup
```sql
# Connect to MySQL
mysql -u root -p

# Create database
CREATE DATABASE staylio_db;
EXIT;
```

### 3. Configure Environment Variables

#### Backend Configuration
```bash
cd staylio-backend
cp .env.example .env
```

Edit `.env` file with your database credentials:
```env
DB_URL=jdbc:mysql://localhost:3306/staylio_db
DB_USERNAME=root
DB_PASSWORD=your_mysql_password
PORT=8081
```

#### Frontend Configuration (Optional)
```bash
# Admin Dashboard
cd staylio-admin-dashboard
cp .env.example .env

# Customer Frontend
cd staylio
cp .env.example .env
```

## 🏃‍♂️ Running the Application

### 1. Start Backend (Port 8081)
```bash
cd staylio-backend
mvn clean install
mvn spring-boot:run
```

### 2. Start Admin Dashboard (Port 3001)
```bash
cd staylio-admin-dashboard
npm install
npm run dev
```

### 3. Start Customer Frontend (Port 3000)
```bash
cd staylio
npm install
npm run dev
```

## 🔑 Demo Access

### Admin Login
- URL: http://localhost:3001/login
- Email: `admin@staylio.com`
- Password: `admin123`

### Host Registration
- URL: http://localhost:3001/register
- Register as a new host and wait for admin approval

## 🌐 Application URLs

- **Customer Frontend**: http://localhost:3000
- **Admin Dashboard**: http://localhost:3001
- **Backend API**: http://localhost:8081
- **API Test**: http://localhost:8081/api/auth/test

## 🔧 Troubleshooting

### Common Issues

1. **Port already in use**: Kill the process or change ports
2. **Database connection failed**: Check MySQL service and credentials
3. **CORS errors**: Ensure backend is running on port 8081

### Getting Help

Check the comprehensive [README.md](README.md) for detailed setup instructions and troubleshooting guide.

---

**🎉 You're all set! Welcome to StayLio!**