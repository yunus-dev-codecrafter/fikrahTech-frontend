# Backend Requirements for School & Subscription Management Overhaul

## 1. Database Schema Changes

### New Table: `school_subscriptions`

```sql
CREATE TABLE school_subscriptions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    school_id INT NOT NULL,
    plan_id INT NOT NULL,
    start_date DATE NOT NULL,
    expiry_date DATE NOT NULL,
    status ENUM('active', 'expired', 'cancelled') DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (school_id) REFERENCES schools(id) ON DELETE CASCADE,
    FOREIGN KEY (plan_id) REFERENCES subscription_plans(id) ON DELETE CASCADE,
    INDEX idx_school_id (school_id),
    INDEX idx_expiry_date (expiry_date)
);
```

### Existing Table Updates

#### `schools` table - Ensure these columns exist:
```sql
ALTER TABLE schools 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS address TEXT,
ADD COLUMN IF NOT EXISTS city VARCHAR(100),
ADD COLUMN IF NOT EXISTS state VARCHAR(100),
ADD COLUMN IF NOT EXISTS country VARCHAR(100),
ADD COLUMN IF NOT EXISTS is_blocked BOOLEAN DEFAULT FALSE;
```

#### `subscription_plans` table - Ensure this table exists:
```sql
CREATE TABLE IF NOT EXISTS subscription_plans (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    duration_months INT NOT NULL,
    max_students INT NOT NULL,
    features JSON NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

---

## 2. API Endpoints Required

### School Management Endpoints

#### GET `/admin/schools`
- **Description**: Fetch all registered schools
- **Response**: Array of school objects
- **Authentication**: Required (Super Admin)

#### GET `/admin/schools/:id`
- **Description**: Fetch detailed information for a specific school
- **Params**: `id` (school ID)
- **Response**: Single school object with all details
- **Authentication**: Required (Super Admin)

#### PUT `/admin/schools/:id`
- **Description**: Update school information
- **Params**: `id` (school ID)
- **Body**: 
  ```json
  {
    "name": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "current_session": "string",
    "current_term": "string",
    "is_blocked": boolean
  }
  ```
- **Response**: Updated school object
- **Authentication**: Required (Super Admin)

#### PATCH `/admin/schools/:id/block`
- **Description**: Toggle school block status
- **Params**: `id` (school ID)
- **Body**: 
  ```json
  {
    "is_blocked": boolean
  }
  ```
- **Response**: Updated school object
- **Authentication**: Required (Super Admin)

#### DELETE `/admin/schools/:id`
- **Description**: Delete a school (cascade delete all related data)
- **Params**: `id` (school ID)
- **Response**: Success message
- **Authentication**: Required (Super Admin)

---

### Subscription Plan Endpoints

#### GET `/admin/plans`
- **Description**: Fetch all subscription plans
- **Response**: Array of plan objects
- **Authentication**: Required (Super Admin)

#### POST `/admin/plans`
- **Description**: Create a new subscription plan
- **Body**:
  ```json
  {
    "name": "string",
    "price": number,
    "duration_months": number,
    "max_students": number,
    "features": ["string", "string"]
  }
  ```
- **Response**: Created plan object
- **Authentication**: Required (Super Admin)

#### PUT `/admin/plans/:id`
- **Description**: Update a subscription plan
- **Params**: `id` (plan ID)
- **Body**: Same as POST
- **Response**: Updated plan object
- **Authentication**: Required (Super Admin)

#### DELETE `/admin/plans/:id`
- **Description**: Delete a subscription plan
- **Params**: `id` (plan ID)
- **Response**: Success message
- **Authentication**: Required (Super Admin)

---

### School Subscription Endpoints

#### GET `/admin/school-subscriptions`
- **Description**: Fetch all school subscriptions with school and plan details
- **Response**: Array of subscription objects with nested school and plan info
- **Authentication**: Required (Super Admin)

#### POST `/admin/school-subscriptions`
- **Description**: Assign a subscription plan to a school
- **Body**:
  ```json
  {
    "school_id": number,
    "plan_id": number,
    "start_date": "YYYY-MM-DD",
    "expiry_date": "YYYY-MM-DD"
  }
  ```
- **Response**: Created subscription object
- **Authentication**: Required (Super Admin)

#### PUT `/admin/school-subscriptions/:id`
- **Description**: Update a school subscription (renew/extend)
- **Params**: `id` (subscription ID)
- **Body**:
  ```json
  {
    "expiry_date": "YYYY-MM-DD",
    "status": "active|expired|cancelled"
  }
  ```
- **Response**: Updated subscription object
- **Authentication**: Required (Super Admin)

#### DELETE `/admin/school-subscriptions/:id`
- **Description**: Cancel/delete a school subscription
- **Params**: `id` (subscription ID)
- **Response**: Success message
- **Authentication**: Required (Super Admin)

---

## 3. Login Controller Updates (Gatekeeper Logic)

### Login Flow Enhancement

Before issuing a JWT token in the login controller, implement the following checks:

#### Step 1: Check School Block Status
```javascript
// After validating user credentials
const school = await getSchoolById(user.school_id);

if (school.is_blocked) {
  return res.status(403).json({
    success: false,
    message: 'Your school account has been blocked. Please contact the administrator.'
  });
}
```

#### Step 2: Check Subscription Expiry
```javascript
// Check if school has an active subscription
const activeSubscription = await getActiveSubscription(user.school_id);

if (!activeSubscription) {
  return res.status(403).json({
    success: false,
    message: 'No active subscription found. Please contact your school administrator.'
  });
}

const today = new Date();
const expiryDate = new Date(activeSubscription.expiry_date);

if (today > expiryDate) {
  // Update subscription status to expired
  await updateSubscriptionStatus(activeSubscription.id, 'expired');
  
  return res.status(403).json({
    success: false,
    message: 'Your subscription has expired. Please renew to continue using the system.'
  });
}
```

#### Step 3: Issue JWT Token (if all checks pass)
```javascript
// Only if both checks pass
const token = jwt.sign(
  { 
    userId: user.id, 
    schoolId: user.school_id,
    role: user.role 
  },
  process.env.JWT_SECRET,
  { expiresIn: '24h' }
);

return res.json({
  success: true,
  token,
  user: {
    id: user.id,
    email: user.email,
    name: user.name,
    schoolId: user.school_id,
    role: user.role
  }
});
```

---

## 4. Helper Functions Required

### Database Query Functions

```javascript
// Get school by ID with subscription info
async function getSchoolById(schoolId) {
  return await db.query(
    'SELECT * FROM schools WHERE id = ?',
    [schoolId]
  );
}

// Get active subscription for a school
async function getActiveSubscription(schoolId) {
  return await db.query(
    `SELECT ss.*, sp.name as plan_name, sp.price, sp.features 
     FROM school_subscriptions ss
     JOIN subscription_plans sp ON ss.plan_id = sp.id
     WHERE ss.school_id = ? AND ss.status = 'active'
     ORDER BY ss.expiry_date DESC
     LIMIT 1`,
    [schoolId]
  );
}

// Update subscription status
async function updateSubscriptionStatus(subscriptionId, status) {
  return await db.query(
    'UPDATE school_subscriptions SET status = ? WHERE id = ?',
    [status, subscriptionId]
  );
}
```

---

## 5. Error Response Format

All API endpoints should return consistent error responses:

```json
{
  "success": false,
  "message": "Clear error message describing the issue",
  "error": "Detailed error for debugging (optional)"
}
```

### Common Error Messages

- **School Blocked**: "Your school account has been blocked. Please contact the administrator."
- **Subscription Expired**: "Your subscription has expired. Please renew to continue using the system."
- **No Subscription**: "No active subscription found. Please contact your school administrator."
- **Unauthorized**: "You do not have permission to perform this action."

---

## 6. Middleware Requirements

### Authentication Middleware
- Verify JWT token
- Check user role (Super Admin for admin endpoints)
- Attach user info to request object

### Subscription Check Middleware (Optional)
- Can be applied to protected routes to check subscription status
- Automatically redirect or block access if subscription is expired

---

## 7. Testing Checklist

- [ ] School block status prevents login
- [ ] Expired subscription prevents login
- [ ] No subscription prevents login
- [ ] Active subscription allows login
- [ ] Block toggle updates school status immediately
- [ ] Subscription assignment calculates correct expiry date
- [ ] Subscription status updates to expired automatically
- [ ] School deletion cascades to subscriptions
- [ ] Plan deletion prevents orphaned subscriptions

---

## 8. Security Considerations

1. **SQL Injection Prevention**: Use parameterized queries for all database operations
2. **JWT Secret**: Store in environment variables, never commit to code
3. **Rate Limiting**: Implement on login endpoints to prevent brute force attacks
4. **Input Validation**: Validate all incoming data against expected formats
5. **Authorization**: Ensure only Super Admin can access admin endpoints
6. **Audit Logging**: Log all admin actions (block/unblock, subscription changes)

---

## 9. Deployment Notes

1. Run database migration scripts to create new tables
2. Update existing tables with new columns
3. Set up environment variables for JWT secret
4. Test all new endpoints before deploying to production
5. Monitor subscription expiry dates and implement renewal reminders
