# Role Selection & Change Impact System

## 📋 Overview

This feature handles **what happens when a user chooses or changes their target role**. It's the final piece that connects admin-defined roles to user experience.

**Key Principle**: User intent matters - no auto-calculations, clear impact warnings.

---

## 🎯 Core Rules

1. **ONE active target role at a time** per user
2. **Switching roles does NOT delete history** - past readiness data preserved
3. **Role change creates new context** - roadmap cleared, readiness needs recalculation
4. **User controls the action** - explicit confirmation required

---

## 🗄️ Database

### Modified Table: `profile_info`

| New Column | Type | Purpose |
|------------|------|---------|
| `target_role_set_at` | TIMESTAMP | When user selected current role |
| `target_role_set_by` | ENUM('self','admin') | Who set it |

### New Table: `role_change_history`

| Column | Type | Purpose |
|--------|------|---------|
| `id` | INT | Primary key |
| `user_id` | INT | Who changed |
| `previous_role_id` | INT | Old role (nullable) |
| `new_role_id` | INT | New role |
| `changed_at` | TIMESTAMP | When changed |
| `changed_by` | ENUM | 'self' or 'admin' |
| `readiness_score_at_change` | FLOAT | Last score before change |

---

## 🔌 API Endpoints

**Base**: `/api/role-selection`

| Method | Endpoint | Purpose |
|--------|----------|---------|
| GET | `/target-role/:user_id` | Get current target role with details |
| GET | `/available-roles` | Get all active roles to choose from |
| POST | `/change-role` | Change user's target role |
| GET | `/role-history/:user_id` | View past role changes |
| GET | `/role-readiness-snapshot/:user_id/:role_id` | View old readiness for past role |
| GET | `/impact-preview/:user_id/:new_role_id` | Preview impact before switching |

---

## 🎨 Frontend Components

### TargetRoleCard (User Dashboard)

**Location**: User Dashboard (`/dashboard/db-dashboard`) - Displayed at the top of the main dashboard page

**Features**:
- Shows current target role name & description
- Displays total skills required for the role
- Shows last readiness check date
- Shows when role was selected
- "Change Role" or "Select Role" button opens selection modal

**Important Notes**:
- This card appears on the **main user dashboard**, NOT in settings
- Settings may be disabled for regular users, so dashboard placement ensures visibility
- Description and skills count come from the `categories` table (requires admin benchmark migration)

### Role Selection Modal

**Flow**:
1. User clicks "Change Role" or "Select Role"
2. Modal shows all active roles with:
   - Role name & description
   - Total skills count
   - Required skills count
   - "Current" badge if already selected

3. User clicks on a role card to select it
4. Confirmation modal appears

### Confirmation Modal (Impact Warning)

**Shows**:
- ⚠️ Impact warning banner (what will reset)
- Current role info (name, last score)
- New role info (name, skills, estimated match %)
- Previous attempt info (if user tried this role before)

**Buttons**: Cancel | Confirm & Switch

---

## 🔄 What Happens on Role Change

1. **History recorded** → Entry added to `role_change_history`
2. **Profile updated** → `target_category_id` and `target_role_set_at` changed
3. **Roadmap cleared** → Old roadmap deleted (new one generated on demand)
4. **Toast prompt** → User asked to recalculate readiness with link to readiness page
5. **NO auto-calculation** → User must explicitly trigger it

---

## 📊 Role-Specific Readiness Context

- Dashboard card shows: **"Target Role: [Role Name]"**
- Readiness page shows context for selected role
- All readiness queries filter by `category_id`
- History is role-specific
- No global readiness number exists

---

## 🛡️ Safeguards

- Cannot select inactive roles
- Same role selection = no-op (no duplicate history)
- Previous readiness data never deleted
- Clear impact warning before any change
- Role description and skills count require Admin Benchmark Migration to be run first

---

## 📁 Files Created/Modified

| File | Purpose |
|------|---------|
| `backend/migrations/role_selection_system.sql` | DB schema changes (adds tracking fields) |
| `backend/service/roleSelectionService.js` | API endpoints (6 endpoints) |
| `backend/server.js` | Service registration |
| `src/components/role-selection/TargetRoleCard.jsx` | UI component with modals |
| `src/components/dashboard/dashboard/db-dashboard/index.jsx` | Added card to user dashboard |

---

## ⚙️ Setup Instructions

### 1. Run Admin Benchmark Migration FIRST
```sql
SOURCE backend/migrations/admin_benchmark_management.sql;
```
This adds the `description` column to `categories` table.

### 2. Run Role Selection Migration
```sql
SOURCE backend/migrations/role_selection_system.sql;
```
This adds role tracking fields and history table.

### 3. Verify
- Log in as a user
- Go to Dashboard (`/dashboard/db-dashboard`)
- You should see the Target Role card at the top
- Click "Select Role" if no role chosen yet

---

## 🐛 Troubleshooting

**Issue**: Description and skills count not showing

**Solution**: 
1. Make sure admin benchmark migration is run (adds `description` to categories)
2. Make sure admin has added descriptions to roles (via Admin → Readiness Config → Roles)
3. Make sure skills are assigned to the role (via Admin → Readiness Config → Benchmarks)

**Issue**: Card not visible on dashboard

**Solution**: Check that you're on the user dashboard (`/dashboard/db-dashboard`), not admin or settings page

---

## ✅ Summary

This system ensures that when a user switches roles:
- They understand the impact beforehand
- Their history is preserved
- The readiness context updates cleanly
- No confusing auto-calculations happen

**Result**: Clear, transparent role management that builds user trust.
