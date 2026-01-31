# Admin Benchmark & Role Management System

## 📋 Overview

This system gives **admin users complete control** over how the RoleReady platform evaluates student readiness for different job roles. Admins define the "truth" - what skills are needed, which roles exist, and how important each skill is. The system then evaluates students against these admin-defined rules.

**Core Principle**: 
- ✅ **Admins define the truth** (roles, skills, benchmarks)
- ✅ **The engine evaluates** students against that truth
- ❌ **Admins CANNOT** edit user skills or override validation
- ❌ **Admins CANNOT** change readiness scores directly

---

## 🎯 What Can Admins Do?

### 1. **Manage Roles** (Job Categories)
Admins can create and manage different job roles like "Software Developer", "Data Analyst", "UI/UX Designer", etc.

**Features**:
- Create new roles with descriptions
- Edit role names and descriptions
- Activate/deactivate roles (hide from students)
- See how many students are targeting each role
- See how many skills are required for each role

**Example**: Admin creates a new role called "Machine Learning Engineer" with description "Focus on AI and data science"

---

### 2. **Manage Skills** (Master Skills List)
Admins maintain a centralized list of all skills that can be assigned to roles.

**Features**:
- Create new skills (e.g., "Python Programming", "React.js", "Public Speaking")
- Organize skills by domain (Technical, Soft Skills, Tools, etc.)
- Edit skill names and descriptions
- Activate/deactivate skills globally
- Search and filter skills by domain or name

**Example**: Admin adds a new skill "TensorFlow" under domain "Machine Learning"

---

### 3. **Manage Benchmarks** (Assign Skills to Roles)
This is the **heart of the system**. Admins decide which skills are needed for which roles, and how important each skill is.

**Features**:
- Select a role and see all skills assigned to it
- Add new skills to a role
- Set **Importance** for each skill:
  - **Required**: Student MUST have this skill to be "Ready"
  - **Optional**: Nice to have, improves readiness score but not mandatory
- Set **Weight** for each skill (numeric value):
  - Higher weight = more impact on readiness score
  - Example: Python might have weight 5, while Git has weight 2
- Remove skills from roles
- Activate/deactivate skill assignments

**Example**: For "Software Developer" role:
- Python (Required, Weight: 5)
- JavaScript (Required, Weight: 5)
- Git (Optional, Weight: 2)
- Communication (Optional, Weight: 3)

---

## 🗄️ Database Tables

### 1. **`categories`** Table (Stores Roles)

| Column | Type | Description |
|--------|------|-------------|
| `category_id` | INT | Unique ID for each role |
| `category_name` | VARCHAR | Name of the role (e.g., "Software Developer") |
| `category_color_class` | VARCHAR | Color theme for UI display |
| `description` | TEXT | Detailed description of the role |
| `is_active` | BOOLEAN | Is this role currently active? (TRUE/FALSE) |
| `updated_by` | INT | ID of admin who last updated this |
| `updated_at` | TIMESTAMP | When was this last updated |

**Example Row**:
```
category_id: 1
category_name: "Software Developer"
description: "Build web and mobile applications"
is_active: TRUE
```

---

### 2. **`skills`** Table (Master Skills List)

| Column | Type | Description |
|--------|------|-------------|
| `skill_id` | INT | Unique ID for each skill |
| `name` | VARCHAR | Name of the skill (e.g., "Python Programming") |
| `normalized_name` | VARCHAR | Lowercase version for searching |
| `domain` | VARCHAR | Category like "Technical", "Soft Skills", "Tools" |
| `is_active` | BOOLEAN | Is this skill currently active? |
| `updated_by` | INT | ID of admin who last updated this |
| `updated_at` | TIMESTAMP | When was this last updated |

**Example Row**:
```
skill_id: 42
name: "React.js"
normalized_name: "react.js"
domain: "Frontend Development"
is_active: TRUE
```

---

### 3. **`category_skills`** Table (Benchmarks - Links Skills to Roles)

This is the **most important table**. It connects skills to roles and defines how each skill is evaluated.

| Column | Type | Description |
|--------|------|-------------|
| `id` | INT | Unique ID for this assignment |
| `category_id` | INT | Which role is this for? (Foreign key to categories) |
| `skill_id` | INT | Which skill? (Foreign key to skills) |
| `importance` | ENUM | 'required' or 'optional' |
| `weight` | FLOAT | How much this skill impacts the score (0.0 - 10.0) |
| `is_active` | BOOLEAN | Is this assignment currently active? |
| `updated_by` | INT | ID of admin who last updated this |
| `updated_at` | TIMESTAMP | When was this last updated |

**Example Row**:
```
id: 101
category_id: 1 (Software Developer)
skill_id: 42 (React.js)
importance: "required"
weight: 4.5
is_active: TRUE
```

**How It Works**:
- When a student targets "Software Developer" role
- System looks at all rows in `category_skills` where `category_id = 1` and `is_active = TRUE`
- Checks if student has each skill
- Calculates readiness score based on weights
- If any **required** skill is missing → student is "Not Ready"

---

## 🔌 Backend API Endpoints

All endpoints are under `/api/admin` and require admin authentication.

### **Roles Management** (`/api/admin/roles`)

#### 1. **GET /api/admin/roles**
Get all roles with statistics.

**Response**:
```json
{
  "success": true,
  "count": 5,
  "roles": [
    {
      "category_id": 1,
      "category_name": "Software Developer",
      "description": "Build applications",
      "is_active": true,
      "skill_count": 12,
      "required_count": 5,
      "optional_count": 7,
      "user_count": 45
    }
  ]
}
```

#### 2. **POST /api/admin/roles**
Create a new role.

**Request Body**:
```json
{
  "category_name": "AI Engineer",
  "description": "Work on artificial intelligence projects",
  "category_color_class": "blue",
  "admin_id": 1
}
```

#### 3. **PUT /api/admin/roles/:id**
Update an existing role.

**Request Body**:
```json
{
  "category_name": "Senior AI Engineer",
  "description": "Lead AI projects",
  "admin_id": 1
}
```

#### 4. **PATCH /api/admin/roles/:id/status**
Activate or deactivate a role.

**Request Body**:
```json
{
  "is_active": false,
  "admin_id": 1
}
```

---

### **Skills Management** (`/api/admin/skills`)

#### 1. **GET /api/admin/skills**
Get all skills with optional filters.

**Query Parameters**:
- `domain` - Filter by domain (e.g., "Technical")
- `status` - Filter by active status ("active" or "inactive")
- `search` - Search by skill name

**Response**:
```json
{
  "success": true,
  "count": 3,
  "skills": [
    {
      "skill_id": 42,
      "name": "React.js",
      "domain": "Frontend Development",
      "is_active": true,
      "updated_at": "2026-01-15T10:30:00Z"
    }
  ]
}
```

#### 2. **POST /api/admin/skills**
Create a new skill.

**Request Body**:
```json
{
  "name": "TensorFlow",
  "domain": "Machine Learning",
  "admin_id": 1
}
```

#### 3. **PUT /api/admin/skills/:id**
Update an existing skill.

**Request Body**:
```json
{
  "name": "TensorFlow 2.0",
  "domain": "Deep Learning",
  "admin_id": 1
}
```

#### 4. **PATCH /api/admin/skills/:id/status**
Activate or deactivate a skill.

**Request Body**:
```json
{
  "is_active": false,
  "admin_id": 1
}
```

---

### **Benchmarks Management** (`/api/admin/benchmarks`)

#### 1. **GET /api/admin/benchmarks/:role_id**
Get all skill assignments for a specific role.

**Response**:
```json
{
  "success": true,
  "benchmarks": [
    {
      "benchmark_id": 101,
      "skill_id": 42,
      "skill_name": "React.js",
      "skill_domain": "Frontend Development",
      "importance": "required",
      "weight": 4.5,
      "is_active": true
    }
  ],
  "summary": {
    "total": 12,
    "required": 5,
    "optional": 7,
    "total_weight": 45.5
  }
}
```

#### 2. **POST /api/admin/benchmarks**
Add a skill to a role.

**Request Body**:
```json
{
  "role_id": 1,
  "skill_id": 42,
  "importance": "required",
  "weight": 4.5,
  "admin_id": 1
}
```

#### 3. **PUT /api/admin/benchmarks/:id**
Update importance or weight of a skill assignment.

**Request Body**:
```json
{
  "importance": "optional",
  "weight": 3.0,
  "admin_id": 1
}
```

#### 4. **PATCH /api/admin/benchmarks/:id/status**
Activate or deactivate a skill assignment.

**Request Body**:
```json
{
  "is_active": false,
  "admin_id": 1
}
```

#### 5. **DELETE /api/admin/benchmarks/:id**
Remove a skill from a role completely.

**Request Body**:
```json
{
  "admin_id": 1,
  "hard_delete": true
}
```

---

### **Validation & Utility** (`/api/admin`)

#### 1. **GET /api/admin/validate/role/:role_id**
Check if a role configuration is valid.

**Response**:
```json
{
  "success": true,
  "role_id": 1,
  "is_valid": false,
  "errors": [
    {
      "code": "NO_REQUIRED_SKILLS",
      "message": "Role has no required skills. Add at least one required skill."
    }
  ],
  "warnings": [
    {
      "code": "LOW_WEIGHT_SUM",
      "message": "Total weight is only 5.0. Consider increasing for better differentiation."
    }
  ]
}
```

**Validation Checks**:
- ❌ **Error**: Role has ZERO required skills (students will always be "ready")
- ⚠️ **Warning**: Total weight is too low (< 10) - scores won't differentiate well
- ⚠️ **Warning**: Total weight is too high (> 100) - might be overly complex
- ⚠️ **Warning**: Some skills have zero weight (they won't impact score)

#### 2. **GET /api/admin/skills/available/:role_id**
Get skills that are NOT yet assigned to this role.

**Query Parameters**:
- `search` - Search for specific skill names

**Response**:
```json
{
  "success": true,
  "count": 50,
  "skills": [
    {
      "skill_id": 99,
      "name": "Docker",
      "domain": "DevOps",
      "is_active": true
    }
  ]
}
```

#### 3. **GET /api/admin/stats**
Get overall platform statistics.

**Response**:
```json
{
  "success": true,
  "stats": {
    "total_roles": 8,
    "active_roles": 6,
    "total_skills": 150,
    "active_skills": 142,
    "total_benchmarks": 350,
    "active_benchmarks": 320
  }
}
```

---

## 🎨 Frontend Pages

### 1. **Admin Roles Page** (`/admin-dashboard/admin-roles`)

**Features**:
- Table showing all roles
- Columns: Name, Description, Skills Count, Users Count, Status, Actions
- Create/Edit modal with form
- Activate/Deactivate toggle button
- Click row to view details

**User Flow**:
1. Admin clicks "Add New Role" button
2. Modal opens with form fields (name, description, color)
3. Admin fills form and clicks "Save"
4. New role appears in table

---

### 2. **Admin Skills Page** (`/admin-dashboard/admin-skills`)

**Features**:
- Filter by domain dropdown
- Filter by status (active/inactive)
- Search bar for skill names
- Scrollable table with all skills
- Create/Edit modal with domain dropdown
- Activate/Deactivate toggle button

**User Flow**:
1. Admin searches for "React" in search bar
2. Table shows React-related skills
3. Admin clicks "Edit" on "React.js"
4. Changes domain from "Frontend" to "JavaScript"
5. Clicks "Save"

---

### 3. **Admin Benchmarks Page** (`/admin-dashboard/admin-benchmarks`)

**Features**:
- Role selector dropdown at top
- Statistics cards (Total Skills, Required, Optional, Total Weight)
- Table showing assigned skills with:
  - Skill Name
  - Domain badge
  - Importance badge (Required/Optional)
  - Weight value
  - Status toggle
  - Edit/Remove buttons
- "Add Skill to Role" button opens modal
- Validation warnings displayed if role has issues

**User Flow**:
1. Admin selects "Software Developer" from dropdown
2. Sees 12 skills currently assigned
3. Clicks "Add Skill to Role"
4. Modal opens with searchable skill list
5. Admin searches "Docker"
6. Selects "Docker" skill
7. Sets Importance to "Optional"
8. Sets Weight to 3.0
9. Clicks "Add to Role"
10. Docker now appears in the skills table

---

## 🛡️ Safeguards & Validation

The system prevents common mistakes:

### 1. **No Required Skills Error**
If a role has ZERO required skills, system shows error:
```
❌ NO_REQUIRED_SKILLS: This role has no required skills. 
Students will always be marked "Ready". Add at least one required skill.
```

### 2. **Duplicate Skill Prevention**
Cannot add the same skill twice to a role:
```
❌ Skill already assigned to this role
```

### 3. **Weight Warnings**

**Too Low**:
```
⚠️ LOW_WEIGHT_SUM: Total weight is only 5.0. 
Consider increasing for better score differentiation.
```

**Too High**:
```
⚠️ HIGH_WEIGHT_SUM: Total weight is 150.0. 
This might be too complex. Consider simplifying.
```

### 4. **Zero Weight Warning**
```
⚠️ ZERO_WEIGHT_SKILLS: 2 skills have zero weight and won't impact scores. 
Consider increasing their weight or removing them.
```

---

## 📊 How It All Works Together

### Example Scenario:

1. **Admin creates a role**:
   - Name: "Full Stack Developer"
   - Description: "Build complete web applications"

2. **Admin adds skills to the role**:
   - HTML/CSS (Required, Weight: 3)
   - JavaScript (Required, Weight: 5)
   - React.js (Required, Weight: 4)
   - Node.js (Required, Weight: 4)
   - MongoDB (Optional, Weight: 3)
   - Docker (Optional, Weight: 2)
   - Git (Required, Weight: 3)

3. **Student selects this role**:
   - System checks `category_skills` table for `category_id = X`
   - Finds 7 skills (5 required, 2 optional)
   - Total weight: 24

4. **Student has these skills**:
   - HTML/CSS ✅
   - JavaScript ✅
   - React.js ✅
   - Node.js ❌ (MISSING REQUIRED!)
   - MongoDB ✅
   - Git ✅

5. **System calculates readiness**:
   - Has 4 out of 5 required skills
   - Status: **"Not Ready"** (missing required skill: Node.js)
   - Score: 70% (18 points out of 24)
   - Roadmap suggests: "Learn Node.js immediately (Priority 1)"

---

## 🔄 Impact on Other Features

### Readiness Calculation
The readiness engine reads from `category_skills` to determine:
- Which skills to check
- Whether each skill is required or optional
- How much weight each skill carries

### Roadmap Generation
The roadmap uses benchmark data to:
- Prioritize missing required skills (Priority 1)
- Calculate time estimates based on weights
- Suggest optional skills for improvement

### Validation Process
Mentors validate student skills, but they CANNOT:
- Change skill importance (admin-defined)
- Change skill weights (admin-defined)
- Override role requirements (admin-defined)

---

## 🚀 Getting Started

### For Admins:

1. **First Time Setup**:
   - Go to "Readiness Config" in admin sidebar
   - Click "Skills" → Add all relevant skills with domains
   - Click "Roles" → Create job roles
   - Click "Benchmarks" → Assign skills to each role

2. **Regular Maintenance**:
   - Review validation warnings weekly
   - Add new skills as industry evolves
   - Update skill weights based on market demand
   - Deactivate outdated skills/roles

3. **Best Practices**:
   - Keep 3-7 required skills per role
   - Total weight should be 20-50 for good differentiation
   - Use descriptive skill names
   - Add domains to skills for organization
   - Review user count to see which roles are popular

---

## 📝 Summary

The Admin Benchmark Management System is the **control center** for RoleReady's readiness evaluation. It's built on a simple principle:

> **Admins define what "ready" means. The system evaluates students against those definitions.**

No AI magic, no black boxes - just clear, admin-defined rules that students can understand and work towards.

**Key Tables**:
- `categories` = Roles (what jobs exist)
- `skills` = Master list (what can be learned)
- `category_skills` = Benchmarks (what's needed for each role)

**Key Endpoints**:
- `/api/admin/roles` = Manage roles
- `/api/admin/skills` = Manage skills
- `/api/admin/benchmarks` = Assign skills to roles

**Key Pages**:
- Roles page = Create/edit job roles
- Skills page = Maintain skill library
- Benchmarks page = Define what makes someone "ready"
