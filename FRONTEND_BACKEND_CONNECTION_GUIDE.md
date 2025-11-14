# 🔌 Staylio Frontend-Backend Connection Guide

## Overview
This document explains exactly how the Staylio frontend (React) connects to the backend (Spring Boot) and fetches data from the MySQL database.

---

## 📁 Architecture Overview

```
Frontend (React)
    ↓
Service Layer (API Calls)
    ↓
Backend API (Spring Boot)
    ↓
Database (MySQL)
```

---

## 🔑 Key Connection Points

### 1. **Base API URL Configuration**

All services connect to the backend at: **`http://localhost:8081/api`**

This is defined in three service files:

#### **`staylio/src/services/authService.js`**
```javascript
const API_BASE_URL = 'http://localhost:8081/api/users';
```

#### **`staylio/src/services/hotelService.js`**
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

#### **`staylio/src/services/bookingService.js`**
```javascript
const API_BASE_URL = 'http://localhost:8081/api';
```

---

## 🏨 How Hotels Are Fetched from Database

### **Step 1: Component Requests Hotels**

**File:** `staylio/src/pages/HotelsPage.jsx` (Line ~120)

```javascript
useEffect(() => {
  const fetchHotels = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch from API
      const response = await fetch('http://localhost:8081/api/hotels');
      if (response.ok) {
        const data = await response.json();
        setHotels(data);
        setFilteredHotels(data);
      }
    } catch (err) {
      console.error('Error fetching hotels:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  fetchHotels();
}, []);
```

### **Step 2: Backend API Endpoint**

**File:** `staylio-backend/src/main/java/com/staylio/backend/Controllers/HotelController.java`

```java
@RestController
@RequestMapping("/api/hotels")
@CrossOrigin(origins = "*")
public class HotelController {
    
    @Autowired
    private HotelService hotelService;
    
    // GET all hotels
    @GetMapping
    public ResponseEntity<List<Hotel>> getAllHotels() {
        List<Hotel> hotels = hotelService.getAllHotels();
        return ResponseEntity.ok(hotels);
    }
}
```

### **Step 3: Service Layer**

**File:** `staylio-backend/src/main/java/com/staylio/backend/Service/HotelService.java`

```java
@Service
public class HotelService {
    
    @Autowired
    private HotelRepository hotelRepository;
    
    public List<Hotel> getAllHotels() {
        return hotelRepository.findAll();
    }
}
```

### **Step 4: Database Access**

**File:** `staylio-backend/src/main/java/com/staylio/backend/Repo/HotelRepository.java`

```java
@Repository
public interface HotelRepository extends JpaRepository<Hotel, Long> {
    // JPA automatically provides findAll() method
    // This queries: SELECT * FROM hotels
}
```

### **Step 5: Database Table**

**MySQL Database:** `staylio_db`
**Table:** `hotels`

```sql
SELECT * FROM hotels;
-- Returns all hotel records with columns:
-- id, name, city, price, rating, reviews, image, description, etc.
```

---

## 👤 How Users Are Fetched from Database

### **Step 1: User Login Request**

**File:** `staylio/src/services/authService.js`

```javascript
async login(credentials) {
  try {
    // Step 1: Authenticate user
    const response = await fetch(`${API_BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: credentials.email,
        password: credentials.password,
      }),
    });

    if (!response.ok) {
      throw new Error('Login failed');
    }

    // Step 2: Get user details after successful login
    const userResponse = await fetch(
      `${API_BASE_URL}/email/${encodeURIComponent(credentials.email)}`
    );
    
    if (userResponse.ok) {
      const user = await userResponse.json();
      
      // Step 3: Store user session in localStorage
      localStorage.setItem('staylio_user', JSON.stringify(user));
      
      return { success: true, user };
    }
  } catch (error) {
    throw new Error(error.message);
  }
}
```

### **Step 2: Backend Login Endpoint**

**File:** `staylio-backend/src/main/java/com/staylio/backend/Controllers/UserController.java`

```java
@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {
    
    @Autowired
    private UserService userService;
    
    // POST /api/users/login
    @PostMapping("/login")
    public ResponseEntity<String> login(@RequestBody LoginRequest request) {
        boolean isValid = userService.authenticateUser(
            request.getEmail(), 
            request.getPassword()
        );
        
        if (isValid) {
            return ResponseEntity.ok("Login successful");
        } else {
            return ResponseEntity.status(401).body("Invalid credentials");
        }
    }
    
    // GET /api/users/email/{email}
    @GetMapping("/email/{email}")
    public ResponseEntity<User> getUserByEmail(@PathVariable String email) {
        User user = userService.getUserByEmail(email);
        return ResponseEntity.ok(user);
    }
}
```

### **Step 3: User Service Layer**

**File:** `staylio-backend/src/main/java/com/staylio/backend/Service/UserService.java`

```java
@Service
public class UserService {
    
    @Autowired
    private UserRepository userRepository;
    
    public boolean authenticateUser(String email, String password) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            String hashedPassword = hashPassword(password);
            return user.getPassword().equals(hashedPassword);
        }
        return false;
    }
    
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
    
    private String hashPassword(String password) {
        // SHA-256 hashing implementation
        // ...
    }
}
```

### **Step 4: User Repository**

**File:** `staylio-backend/src/main/java/com/staylio/backend/Repo/UserRepository.java`

```java
@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    
    // Custom query method
    User findByEmail(String email);
    // JPA translates this to: SELECT * FROM users WHERE email = ?
    
    boolean existsByEmail(String email);
    // JPA translates this to: SELECT COUNT(*) FROM users WHERE email = ?
}
```

### **Step 5: Database Query**

**MySQL Database:** `staylio_db`
**Table:** `users`

```sql
-- When user logs in with email: john@example.com
SELECT * FROM users WHERE email = 'john@example.com';

-- Returns user record:
-- id, firstName, lastName, email, password (hashed), phone, createdAt, updatedAt
```

---

## 📊 Complete Data Flow Examples

### **Example 1: Fetching Hotels**

```
1. User opens HotelsPage
   ↓
2. React useEffect() triggers
   ↓
3. fetch('http://localhost:8081/api/hotels')
   ↓
4. Backend: HotelController.getAllHotels()
   ↓
5. Backend: HotelService.getAllHotels()
   ↓
6. Backend: HotelRepository.findAll()
   ↓
7. MySQL: SELECT * FROM hotels
   ↓
8. Data flows back through layers
   ↓
9. React: setHotels(data) updates state
   ↓
10. UI renders hotel cards
```

### **Example 2: User Registration**

```
1. User fills registration form
   ↓
2. authService.register(userData)
   ↓
3. POST http://localhost:8081/api/users/register
   ↓
4. Backend: UserController.register()
   ↓
5. Backend: UserService.registerUser()
   ↓
6. Backend: Hash password with SHA-256
   ↓
7. Backend: UserRepository.save(user)
   ↓
8. MySQL: INSERT INTO users (firstName, lastName, email, password, phone)
   ↓
9. Success response sent back
   ↓
10. Frontend: Show success message
```

### **Example 3: Creating a Booking**

```
1. User clicks "Book Now" (authenticated)
   ↓
2. BookingModal opens with form
   ↓
3. User fills booking details
   ↓
4. bookingService.createBooking(bookingData)
   ↓
5. POST http://localhost:8081/api/bookings
   ↓
6. Backend: BookingController.createBooking()
   ↓
7. Backend: BookingService.createBooking()
   ↓
8. Backend: Generate booking reference
   ↓
9. Backend: BookingRepository.save(booking)
   ↓
10. MySQL: INSERT INTO bookings (userId, hotelId, guestName, checkInDate, ...)
   ↓
11. Success response with booking reference
   ↓
12. Frontend: Show confirmation with reference number
```

---

## 🔐 Authentication Flow

### **How Authentication Works**

1. **User Login:**
   ```javascript
   // Frontend stores user in localStorage
   localStorage.setItem('staylio_user', JSON.stringify(user));
   ```

2. **Checking Authentication:**
   ```javascript
   // AuthContext checks localStorage
   const user = localStorage.getItem('staylio_user');
   const isAuthenticated = !!user;
   ```

3. **Protected API Calls:**
   ```javascript
   // bookingService.js adds user headers
   getAuthHeaders() {
     const user = localStorage.getItem('staylio_user');
     return {
       'Content-Type': 'application/json',
       'X-User-ID': JSON.parse(user).id
     };
   }
   ```

---

## 🛠️ Service Layer Details

### **1. authService.js**

**Purpose:** Handle user authentication and registration

**Key Methods:**
- `register(userData)` → POST `/api/users/register`
- `login(credentials)` → POST `/api/users/login`
- `logout()` → Clear localStorage
- `getCurrentUser()` → Get user from localStorage
- `checkEmailExists(email)` → GET `/api/users/exists/email/{email}`

### **2. hotelService.js**

**Purpose:** Fetch hotel data from backend

**Key Methods:**
- `getAllHotels()` → GET `/api/hotels`
- `getHotelById(id)` → GET `/api/hotels/{id}`
- `getFeaturedHotels()` → GET first 6 hotels
- `searchHotels(params)` → GET `/api/hotels/search?...`

### **3. bookingService.js**

**Purpose:** Manage hotel bookings

**Key Methods:**
- `createBooking(data)` → POST `/api/bookings`
- `getUserBookings(userId)` → GET `/api/bookings/user/{userId}`
- `getBookingById(id)` → GET `/api/bookings/{id}`
- `cancelBooking(id)` → PATCH `/api/bookings/{id}/cancel`
- `checkAvailability(...)` → GET `/api/bookings/availability`

---

## 📡 API Endpoints Summary

### **User Management**
```
POST   /api/users/register          - Register new user
POST   /api/users/login             - Authenticate user
GET    /api/users/email/{email}     - Get user by email
GET    /api/users/exists/email/{email} - Check if email exists
GET    /api/users                   - Get all users
GET    /api/users/{id}              - Get user by ID
PUT    /api/users/{id}              - Update user
DELETE /api/users/{id}              - Delete user
```

### **Hotel Management**
```
GET    /api/hotels                  - Get all hotels
GET    /api/hotels/{id}             - Get hotel by ID
POST   /api/hotels                  - Create hotel (admin)
PUT    /api/hotels/{id}             - Update hotel (admin)
DELETE /api/hotels/{id}             - Delete hotel (admin)
```

### **Booking Management**
```
POST   /api/bookings                - Create booking
GET    /api/bookings/user/{userId}  - Get user's bookings
GET    /api/bookings/{id}           - Get booking by ID
GET    /api/bookings/reference/{ref} - Get booking by reference
PUT    /api/bookings/{id}           - Update booking
PATCH  /api/bookings/{id}/cancel    - Cancel booking
GET    /api/bookings/availability   - Check availability
```

---

## 🔍 How to Trace a Request

### **Example: Tracing "Get All Hotels"**

1. **Open Browser DevTools** (F12)
2. **Go to Network Tab**
3. **Visit** `http://localhost:3000/hotels`
4. **Look for Request:**
   ```
   Request URL: http://localhost:8081/api/hotels
   Request Method: GET
   Status Code: 200 OK
   ```
5. **Check Response:**
   ```json
   [
     {
       "id": 1,
       "name": "Grand Palace Hotel",
       "city": "Mumbai",
       "price": 8500,
       "rating": 4.8,
       ...
     }
   ]
   ```

### **Backend Logs**

When the request hits the backend, you'll see in Spring Boot console:
```
Hibernate: select * from hotels
```

---

## 🚨 Common Connection Issues

### **Issue 1: CORS Error**
```
Access to fetch at 'http://localhost:8081/api/hotels' from origin 
'http://localhost:3000' has been blocked by CORS policy
```

**Solution:** Backend has `@CrossOrigin(origins = "*")` on controllers

### **Issue 2: Connection Refused**
```
Failed to fetch: TypeError: Failed to fetch
```

**Solution:** Ensure backend is running on port 8081
```bash
cd staylio-backend
./mvnw spring-boot:run
```

### **Issue 3: 404 Not Found**
```
GET http://localhost:8081/api/hotels 404 (Not Found)
```

**Solution:** Check if endpoint exists in HotelController

---

## ✅ Verification Checklist

To verify frontend-backend connection:

1. ✅ **Backend Running:** `http://localhost:8081` accessible
2. ✅ **Database Connected:** Check Spring Boot logs for "HikariPool"
3. ✅ **Frontend Running:** `http://localhost:3000` accessible
4. ✅ **API Responding:** Test `http://localhost:8081/api/hotels` in browser
5. ✅ **Data Flowing:** Hotels appear on frontend
6. ✅ **Authentication Working:** Can register and login
7. ✅ **Bookings Working:** Can create bookings when logged in

---

## 📝 Summary

**Frontend → Backend Connection:**
- Frontend uses `fetch()` API to make HTTP requests
- Service layer (`authService`, `hotelService`, `bookingService`) handles all API calls
- Base URL: `http://localhost:8081/api`
- Data format: JSON
- Authentication: localStorage-based session management

**Backend → Database Connection:**
- Spring Boot uses JPA/Hibernate
- Repository pattern for database access
- MySQL database: `staylio_db`
- Automatic SQL query generation
- Connection configured in `application.properties`

**Complete Flow:**
```
React Component → Service Layer → Backend Controller → 
Service Layer → Repository → MySQL Database → 
Response flows back through same layers
```

---

**🎉 This is how Staylio frontend connects to backend and fetches data from the database!**
