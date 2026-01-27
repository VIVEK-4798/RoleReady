# 📄 Resume → Skill Sync Specification

## Overview

This document defines the **locked rules** for the Resume → Skill Sync feature before any implementation begins.

**Feature Goal:** Extract skills from a user's resume and let them **confirm** before skills affect readiness.

---

## 🔒 STEP 1: Resume Ingestion Rules (LOCKED)

These rules are **non-negotiable** and must be enforced in all implementation steps.

### Rule 1: Resume Upload is OPTIONAL, Not Required

```
✅ User CAN upload a resume
✅ User CAN skip resume upload entirely
✅ User CAN delete their resume at any time
❌ Resume is NOT required for readiness calculation
❌ Resume is NOT required for profile completion
```

**Implementation Note:** No UI element should mark resume as "required". Readiness calculation works without resume skills.

---

### Rule 2: Resume NEVER Directly Modifies Readiness

```
✅ Resume is processed to EXTRACT skills
✅ Extracted skills go to a STAGING area (pending confirmation)
❌ Extracted skills do NOT automatically become user_skills
❌ Extracted skills do NOT affect readiness until confirmed
❌ No "auto-sync" or "auto-import" feature
```

**Database Implication:** 
- New table: `resume_extracted_skills` (staging table)
- Skills stay here until user confirms → then move to `user_skills`

---

### Rule 3: Resume Only SUGGESTS Skills

```
✅ Show extracted skills as "suggestions" or "recommendations"
✅ User sees: "We found these skills in your resume"
✅ User can review each skill before accepting
❌ No automatic skill addition
❌ No hidden skill insertion
```

**UX Implication:**
- After upload, show a review modal/page
- Each skill has Accept/Reject action
- Bulk accept/reject is allowed, but with explicit user action

---

### Rule 4: User Must CONFIRM Before Skills Are Added

```
✅ User explicitly clicks "Confirm" or "Add Selected Skills"
✅ Clear visual distinction: Pending Skills vs Confirmed Skills
✅ User can review and modify before final confirmation
❌ No silent skill addition in background
❌ No "skills added" toast without user action
```

**Flow:**
1. Upload resume → Extract skills → Show pending list
2. User reviews → Selects skills to add → Clicks "Confirm"
3. Selected skills → Inserted into `user_skills` with `source = 'resume'`
4. Readiness can now include these skills

---

### Rule 5: Resume Skills Are Marked with `source = 'resume'`

```
✅ All skills from resume have source = 'resume' in user_skills
✅ This source is tracked separately from 'self' and 'validated'
✅ UI can show "X skills from resume" badge
❌ Cannot be changed to 'validated' without actual validation
❌ Cannot be confused with 'self' (manually added)
```

**Already Implemented:**
- Readiness engine already filters by `source IN ('self', 'resume', 'validated')`
- Context endpoint already shows `user_skills_by_source.resume`
- Readiness page already displays "from resume" badge

---

## 📊 Current State Analysis

### What Already Exists

| Component | Status | Location |
|-----------|--------|----------|
| Resume upload endpoint | ✅ Exists | `POST /api/profile/upload-resume` |
| Resume storage | ✅ Exists | `uploads/resumes/` folder |
| Resume filename in DB | ✅ Exists | `profile_info.resume_file` |
| Resume UI in profile | ✅ Exists | `ResumePopupPage.jsx` |
| `source = 'resume'` recognition | ✅ Exists | Readiness engine queries |
| Resume badge in UI | ✅ Exists | Readiness page context section |

### What Needs to Be Built

| Component | Priority | Notes |
|-----------|----------|-------|
| Resume text extraction | High | Parse PDF/DOCX to text |
| Skill matching algorithm | High | Match text against `skills` table |
| `resume_extracted_skills` table | High | Staging table for pending skills |
| Review UI | High | Show extracted skills, allow confirm/reject |
| Confirm endpoint | High | Move from staging to `user_skills` |
| Re-extraction trigger | Medium | Allow re-processing existing resume |

---

## 🗄️ Database Schema (Proposed)

### New Table: `resume_extracted_skills`

```sql
CREATE TABLE resume_extracted_skills (
  extraction_id INT AUTO_INCREMENT PRIMARY KEY,
  user_id INT NOT NULL,
  skill_id INT NOT NULL,
  skill_name VARCHAR(255) NOT NULL,        -- Denormalized for display
  confidence VARCHAR(20) DEFAULT 'medium', -- 'high', 'medium', 'low'
  match_context TEXT,                      -- Where in resume it was found
  status ENUM('pending', 'accepted', 'rejected') DEFAULT 'pending',
  extracted_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP NULL,
  
  FOREIGN KEY (user_id) REFERENCES users(user_id) ON DELETE CASCADE,
  FOREIGN KEY (skill_id) REFERENCES skills(skill_id) ON DELETE CASCADE,
  
  UNIQUE KEY unique_user_skill (user_id, skill_id)
);
```

### Index for Performance

```sql
CREATE INDEX idx_resume_extracted_user_status 
ON resume_extracted_skills(user_id, status);
```

---

## 🔄 Data Flow Diagram

```
┌──────────────────┐
│  User uploads    │
│  resume (PDF)    │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Extract text    │
│  from PDF/DOCX   │
└────────┬─────────┘
         │
         ▼
┌──────────────────┐
│  Match against   │
│  skills table    │
│  (category-aware)│
└────────┬─────────┘
         │
         ▼
┌──────────────────────────────────┐
│  resume_extracted_skills         │
│  (status = 'pending')            │
│  ⚠️ NOT in user_skills yet       │
│  ⚠️ NOT affecting readiness      │
└────────────────┬─────────────────┘
                 │
                 ▼
┌──────────────────────────────────┐
│  User reviews in UI              │
│  ✓ Accept  ✗ Reject              │
└────────────────┬─────────────────┘
                 │
                 ▼ (on Confirm)
┌──────────────────────────────────┐
│  user_skills                     │
│  (source = 'resume')             │
│  ✅ NOW affects readiness        │
└──────────────────────────────────┘
```

---

## 🚫 Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad |
|--------------|--------------|
| Auto-adding skills on upload | Breaks Rule 3 & 4 - no user confirmation |
| Overwriting existing skills | User may have manually set levels |
| Using ML confidence scores as final | Users don't trust black boxes |
| Hiding "from resume" source | Breaks transparency/trust |
| Requiring resume for readiness | Some users prefer manual entry |

---

## ✅ Success Criteria for This Feature

1. **Zero skills added without explicit user action**
2. **Clear "pending" vs "confirmed" states**
3. **Resume skills tracked separately (`source = 'resume'`)**
4. **User can re-process resume to get new suggestions**
5. **Rejected skills don't reappear on re-process**
6. **Existing manual skills are never overwritten**

---

## 📋 Implementation Steps

- [x] **STEP 1:** Define resume ingestion rules ✅ (This document)
- [x] **STEP 2:** Create resume storage (minimal) ✅
  - Created `resumes` table with: user_id, file_path, uploaded_at, parsed_text
  - Updated upload endpoint to use new table
  - Frontend shows "Resume uploaded on [date]"
- [x] **STEP 3:** Resume parsing (rule-based, simple) ✅
  - Created `resume_skill_suggestions` table (staging)
  - PDF text extraction via `pdf-parse` (v2 API with PDFParse class)
  - DOCX text extraction via `mammoth`
  - Rule-based skill matching (binary: found/not found)
  - Endpoints: `/parse`, `/suggestions/:user_id`, `/status/:user_id`
- [x] **STEP 4:** Skill suggestion review UI ✅
  - Created SkillSuggestionsReview component
  - Checkbox list with all unchecked by default
  - User explicitly selects skills to add
  - "Add Selected Skills" confirms and moves to user_skills
  - Endpoints: `/confirm`, `/reject-all`
- [x] **STEP 5:** Commit confirmed skills to profile ✅
  - Insert into `user_skills` with `source = 'resume'`
  - Uses `ON DUPLICATE KEY UPDATE` to NOT delete existing skills
  - Timestamped via `reviewed_at`
  - After confirm: prompt "New skills added. Recalculate readiness?"
  - Do NOT auto-recalculate - user explicitly chooses
  - Navigate to `/dashboard/readiness` with `recalculate: true` state
- [x] **STEP 6:** Integrate with existing readiness flow ✅
  - Readiness page detects `recalculate: true` navigation state
  - Auto-triggers recalculation with `force: true` (bypasses cooldown)
  - Shows contextual toast: "Recalculating with your new resume skills..."
  - Uses 100% existing readiness engine - no new calculation logic
  - Success message indicates "Resume skills included!"
  - Dashboard automatically reflects updated score

---

## 🎉 Feature Complete!

The Resume → Skill Sync feature is now fully implemented:

```
┌─────────────────────────────────────────────────────────────────┐
│                    COMPLETE USER FLOW                           │
├─────────────────────────────────────────────────────────────────┤
│  1. User uploads resume (PDF/DOCX)                              │
│  2. Clicks "Scan Resume for Skills"                             │
│  3. System extracts text and matches against skills table       │
│  4. User sees checkboxes with found skills (all unchecked)      │
│  5. User selects skills they want to add                        │
│  6. Clicks "Add X Skills"                                       │
│  7. Skills inserted into user_skills with source='resume'       │
│  8. Prompt: "Recalculate Readiness?"                            │
│  9. User clicks "Recalculate Readiness"                         │
│  10. Navigates to readiness page, auto-triggers calculation     │
│  11. New readiness score saved (includes resume skills)         │
│  12. Dashboard updates with new score                           │
└─────────────────────────────────────────────────────────────────┘

Key Principles Enforced:
✅ User is in control, system assists
✅ Resume NEVER directly modifies readiness
✅ All skills require explicit user confirmation
✅ Resume skills tracked with source='resume'
✅ 100% reuse of existing readiness calculation engine
```

---

## 📝 Notes

- This feature uses **rule-based matching**, not ML/NLP
- Matching is done against existing `skills` table
- Category-aware: only match skills relevant to user's target role
- Confidence is based on exact vs partial match, not AI scores

---

*Document created: Step 1 of Resume → Skill Sync feature*
*Last updated: January 2026*
