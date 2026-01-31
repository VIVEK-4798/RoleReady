# 📊 Readiness Report / Export Specification

## Overview

This document defines the **Readiness Report** feature — a **proof & presentation** feature that compiles everything RoleReady knows about a user into a single, defensible, shareable report.

**Feature Goal:** Generate a structured snapshot of readiness data for external presentation.

**Core Question Answered:**
> "Everything RoleReady knows about me — in one defensible report."

---

## 🎯 Why This Feature Matters

### Not a Growth Feature — A Presentation Feature

This is extremely powerful for:
- **Interviews** — "Here's my verified skill readiness for this role"
- **Mentor Reviews** — "Here's what I've accomplished since our last session"
- **Project Evaluation** — "Here's the skill map behind my project work"
- **Viva / Demo** — "Here's a defensible snapshot of my readiness journey"

### The Key Question It Answers

> "Can this be shared?"  
> "How do you present this insight?"  
> "How would a student show this to someone else?"

A readiness report answers all of that **without adding new logic**.

---

## 📋 Simple Data Flow Explanation

### How Report Generation Works (Step by Step)

```
┌─────────────────────────────────────────────────────────────────┐
│                   REPORT DATA FLOW                               │
└─────────────────────────────────────────────────────────────────┘

  User clicks "Export Report" on /readiness or /report page
                          ↓
  ┌─────────────────────────────────────────────────────────────┐
  │  1. REPORT ASSEMBLY (reportService.js)                      │
  │     - Fetches user profile (name, target role)              │
  │     - Fetches latest readiness score                        │
  │     - Fetches skill breakdown (met vs missing)              │
  │     - Fetches validation summary                            │
  │     - Fetches roadmap priorities                            │
  │     - Fetches readiness history                             │
  └─────────────────────────────────────────────────────────────┘
                          ↓
  ┌─────────────────────────────────────────────────────────────┐
  │  2. NO RECALCULATION — Just Assembly                        │
  │     - Reads existing data from DB                           │
  │     - Does NOT trigger readiness recalculation              │
  │     - Does NOT generate new roadmap                         │
  │     - Pure snapshot of current state                        │
  └─────────────────────────────────────────────────────────────┘
                          ↓
  ┌─────────────────────────────────────────────────────────────┐
  │  3. FORMAT & EXPORT                                         │
  │     - Option A: PDF export (professional, static)           │
  │     - Option B: Printable HTML view (Print to PDF)          │
  │     - Returns structured report object to frontend          │
  └─────────────────────────────────────────────────────────────┘
                          ↓
  ┌─────────────────────────────────────────────────────────────┐
  │  4. FRONTEND DISPLAYS (/report page)                        │
  │     - Renders report in printable format                    │
  │     - Export button for PDF download                        │
  │     - Clean, professional layout                            │
  └─────────────────────────────────────────────────────────────┘
```

---

## 🔒 LOCKED PRINCIPLES (NON-NEGOTIABLE)

These rules **cannot be violated** in any implementation step:

```
┌─────────────────────────────────────────────────────────────────┐
│                    REPORT CORE PRINCIPLES                        │
├─────────────────────────────────────────────────────────────────┤
│  1. Report is a SNAPSHOT — never recalculates                   │
│  2. Report uses ONLY existing data — no new computations        │
│  3. Report is READ-ONLY — no modifications possible             │
│  4. Report is STATIC — represents state at generation time      │
│  5. Report is DEFENSIBLE — every data point is traceable        │
└─────────────────────────────────────────────────────────────────┘
```

**Why These Rules?**
- Snapshot = can be verified against DB state at that time
- Existing data only = no hidden calculations that can't be explained
- Read-only = report integrity preserved
- Static = can be compared across time periods
- Defensible = every number has a source

---

## 📦 Report Scope (LOCKED)

### What IS Included

| Section | Data Source | Description |
|---------|-------------|-------------|
| User Info | `user`, `profile_info` | Name, email, target role |
| Readiness Score | `readiness_scores` | Latest score, percentage, calculated_at |
| Status Label | Derived from score | Not Ready / Developing / Ready / Excellent |
| Skill Breakdown | `readiness_score_breakdown` | Met vs Missing skills with weights |
| Validation Summary | `user_skills` | Self / Resume / Mentor validated counts |
| Roadmap Priorities | `roadmap_items` | HIGH / MEDIUM / LOW priority counts |
| Readiness History | `readiness_scores` | Last N entries (default: 5) |

### What IS NOT Included

```
❌ No AI-generated recommendations
❌ No new calculations or derivations
❌ No comparison with other users
❌ No future projections
❌ No Word/Excel/CSV exports (PDF only for v1)
```

---

## 🗃️ Report Data Structure

### API Response: `GET /api/report/:user_id`

```javascript
{
  success: true,
  generated_at: "2026-01-31T10:30:00.000Z",
  report: {
    // ═══════════════════════════════════════════════════════════
    // SECTION 1: User Information
    // ═══════════════════════════════════════════════════════════
    user: {
      user_id: 13,
      name: "John Doe",
      email: "john@example.com",
      target_role: {
        category_id: 5,
        category_name: "Frontend Developer"
      }
    },

    // ═══════════════════════════════════════════════════════════
    // SECTION 2: Current Readiness
    // ═══════════════════════════════════════════════════════════
    readiness: {
      readiness_id: 57,
      score: 72,
      max_score: 100,
      percentage: 72,
      status_label: "Developing",      // Not Ready | Developing | Ready | Excellent
      status_color: "warning",         // danger | warning | success | primary
      calculated_at: "2026-01-30T14:22:00.000Z"
    },

    // ═══════════════════════════════════════════════════════════
    // SECTION 3: Skill Breakdown
    // ═══════════════════════════════════════════════════════════
    skill_breakdown: {
      total_skills: 10,
      met_count: 7,
      missing_count: 3,
      met_skills: [
        { skill_id: 1, skill_name: "JavaScript", weight: 10, source: "validated", is_validated: true },
        { skill_id: 2, skill_name: "React", weight: 8, source: "self", is_validated: false },
        // ...
      ],
      missing_skills: [
        { skill_id: 5, skill_name: "TypeScript", weight: 5, importance: "required" },
        // ...
      ]
    },

    // ═══════════════════════════════════════════════════════════
    // SECTION 4: Validation Summary
    // ═══════════════════════════════════════════════════════════
    validation: {
      total_skills: 7,
      self_claimed: 2,
      resume_parsed: 2,
      mentor_validated: 3,
      pending_validation: 1,
      rejected: 0
    },

    // ═══════════════════════════════════════════════════════════
    // SECTION 5: Roadmap Priorities
    // ═══════════════════════════════════════════════════════════
    roadmap: {
      roadmap_id: 12,
      total_items: 6,
      by_priority: {
        high: 2,
        medium: 3,
        low: 1
      },
      high_priority_items: [
        { skill_name: "TypeScript", reason: "Required skill missing", category: "required_gap" },
        { skill_name: "Testing", reason: "Required skill missing", category: "required_gap" }
      ]
    },

    // ═══════════════════════════════════════════════════════════
    // SECTION 6: Readiness History
    // ═══════════════════════════════════════════════════════════
    history: [
      { readiness_id: 57, score: 72, percentage: 72, calculated_at: "2026-01-30T14:22:00.000Z" },
      { readiness_id: 52, score: 65, percentage: 65, calculated_at: "2026-01-28T10:15:00.000Z" },
      { readiness_id: 48, score: 58, percentage: 58, calculated_at: "2026-01-25T09:00:00.000Z" },
      // ...last 5 entries
    ]
  }
}
```

---

## 🏷️ Status Labels (Readiness Tiers)

| Score Range | Label | Color | Description |
|-------------|-------|-------|-------------|
| 0-39% | Not Ready | `danger` (red) | Major skill gaps to address |
| 40-69% | Developing | `warning` (yellow) | Making progress, key gaps remain |
| 70-89% | Ready | `success` (green) | Meets most requirements |
| 90-100% | Excellent | `primary` (blue) | Exceeds expectations |

```javascript
function getStatusLabel(percentage) {
  if (percentage < 40) return { label: "Not Ready", color: "danger" };
  if (percentage < 70) return { label: "Developing", color: "warning" };
  if (percentage < 90) return { label: "Ready", color: "success" };
  return { label: "Excellent", color: "primary" };
}
```

---

## 🔧 Implementation Steps

### STEP 1: Backend Service (`reportService.js`)

```javascript
/**
 * Report Generation Service
 * 
 * RULE: Never recalculates — only assembles existing data
 */

// GET /api/report/:user_id
// GET /api/report/:user_id/readiness/:readiness_id (specific snapshot)
```

**Functions:**
- `generateReadinessReport(user_id, readiness_id)` — Main assembly function
- `getStatusLabel(percentage)` — Convert score to status
- `fetchReportData(user_id)` — Aggregate all data sources

### STEP 2: Frontend Page (`/report`)

```
/src/pages/report/index.jsx
```

**Components:**
- `ReportHeader` — User info + generation timestamp
- `ReportReadinessSection` — Score + status badge
- `ReportSkillBreakdown` — Met vs Missing table
- `ReportValidationSummary` — Validation stats
- `ReportRoadmapPriorities` — Priority distribution
- `ReportHistory` — Timeline/table of past scores
- `ReportExportButton` — PDF download trigger

### STEP 3: PDF Export

**Approach: HTML-to-PDF (Client-side)**

Using libraries like:
- `html2pdf.js` — Simple, no server dependency
- `jspdf` + `html2canvas` — More control

```javascript
const exportToPDF = () => {
  const reportElement = document.getElementById('readiness-report');
  html2pdf()
    .from(reportElement)
    .save(`readiness-report-${user.name}-${new Date().toISOString().split('T')[0]}.pdf`);
};
```

---

## 🎨 Report Layout (Print-Friendly)

```
┌─────────────────────────────────────────────────────────────────┐
│                    ROLEREADY READINESS REPORT                    │
│                    Generated: Jan 31, 2026                       │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  👤 USER INFORMATION                                             │
│  ─────────────────────                                          │
│  Name: John Doe                                                  │
│  Email: john@example.com                                         │
│  Target Role: Frontend Developer                                 │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📊 READINESS SCORE                                              │
│  ─────────────────────                                          │
│                                                                  │
│     ┌────────────────────────────────────────┐                  │
│     │              72%                       │                  │
│     │           DEVELOPING                   │                  │
│     └────────────────────────────────────────┘                  │
│                                                                  │
│  Last calculated: Jan 30, 2026 at 2:22 PM                       │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ✅ SKILLS MET (7 of 10)                                         │
│  ─────────────────────                                          │
│  ✓ JavaScript (10 pts) — Mentor Validated                       │
│  ✓ React (8 pts) — Self-claimed                                 │
│  ✓ HTML (5 pts) — Resume Parsed                                 │
│  ...                                                             │
│                                                                  │
│  ❌ SKILLS MISSING (3 of 10)                                     │
│  ─────────────────────                                          │
│  ✗ TypeScript (5 pts) — Required                                │
│  ✗ Testing (4 pts) — Required                                   │
│  ✗ GraphQL (3 pts) — Optional                                   │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🔐 VALIDATION SUMMARY                                           │
│  ─────────────────────                                          │
│  Self-claimed:      2 skills                                     │
│  Resume-parsed:     2 skills                                     │
│  Mentor-validated:  3 skills ✓                                  │
│  Pending review:    1 skill                                      │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  🎯 ROADMAP PRIORITIES                                           │
│  ─────────────────────                                          │
│  🔥 High Priority:   2 items                                     │
│  📈 Medium Priority: 3 items                                     │
│  📋 Low Priority:    1 item                                      │
│                                                                  │
│  Top Focus Areas:                                                │
│  1. TypeScript — Required skill missing                         │
│  2. Testing — Required skill missing                            │
│                                                                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  📈 READINESS HISTORY                                            │
│  ─────────────────────                                          │
│  Jan 30: 72% ████████████████░░░░░░░░                           │
│  Jan 28: 65% ██████████████░░░░░░░░░░                           │
│  Jan 25: 58% ████████████░░░░░░░░░░░░                           │
│  Jan 20: 45% █████████░░░░░░░░░░░░░░░                           │
│  Jan 15: 32% ██████░░░░░░░░░░░░░░░░░░                           │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
│                                                                  │
│  Report generated by RoleReady • roleready.com                  │
│  This report reflects data as of the generation timestamp.      │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📁 File Structure

```
backend/
  service/
    reportService.js          # NEW: Report assembly service

src/
  pages/
    report/
      index.jsx               # NEW: Report page
  components/
    report/
      ReportHeader.jsx        # User info section
      ReportReadiness.jsx     # Score + status
      ReportSkillBreakdown.jsx # Skills table
      ReportValidation.jsx    # Validation stats
      ReportRoadmap.jsx       # Priority distribution
      ReportHistory.jsx       # Historical scores
      ReportExportButton.jsx  # PDF export button
```

---

## 🧪 Test Scenarios

### Happy Path
1. User has readiness score → Report generates successfully
2. Export button → PDF downloads with correct filename
3. Print button → Browser print dialog opens

### Edge Cases
1. **No readiness calculated** → Show "Calculate readiness first" message
2. **No roadmap generated** → Show "No roadmap available" in that section
3. **No validation data** → Show "No skills validated yet"
4. **First-time user** → Report shows minimal data, no history

### Error States
1. User not logged in → Redirect to login
2. Invalid user_id → 404 error
3. Database error → Generic error message

---

## 🚀 API Endpoints

### GET `/api/report/:user_id`

**Description:** Generate report for user's latest readiness

**Response:** Full report object (see Data Structure above)

### GET `/api/report/:user_id/history`

**Description:** Get readiness history for report

**Query Params:**
- `limit` (optional, default: 5) — Number of entries to return

### GET `/api/report/:user_id/readiness/:readiness_id`

**Description:** Generate report for specific readiness snapshot

**Use case:** Compare reports from different time periods

---

## ✅ Acceptance Criteria

- [x] Report displays all 6 sections with correct data
- [x] No new calculations are triggered during report generation
- [x] PDF export works in Chrome, Firefox, Safari
- [x] Report is readable when printed (proper pagination)
- [x] Status label correctly maps to score percentage
- [x] History shows last 3 readiness entries with trend
- [x] Loading states shown during data fetch
- [x] Error states handled gracefully
- [x] Mobile-responsive layout (for viewing, not printing)

---

## 🎯 STEP 4-6 IMPLEMENTATION (COMPLETED)

### STEP 4: Report Layout (6 Sections)

The report page (`/report`) now displays these sections in order:

| # | Section | Content |
|---|---------|---------|
| 1 | **Header** | Logo, User name, Target role, Generated date |
| 2 | **Readiness Summary** | Score (%), Status badge, Last calculated |
| 3 | **Skill Breakdown** | Table: Skill \| Status \| Source \| Weight \| Importance |
| 4 | **Roadmap Priorities** | High/Medium/Low counts + "Why this matters" note |
| 5 | **Progress Snapshot** | Last 3 scores with trend direction (📈/📉/➡️) |
| 6 | **Footer** | "Generated by RoleReady" + Explainability note |

**Key Features:**
- Skills displayed in TABLE format (not cards)
- Trend calculation shows improvement/decline/stable
- "Why this matters" note explains priority impact
- Explainability footer states report is rule-based and auditable

### STEP 5: Frontend Trigger (Export Buttons)

Export buttons added to:
- ✅ **Readiness page** (`/readiness`) — Green "📄 Export Report" button
- ✅ **Roadmap page** (`/roadmap`) — Green "📄 Export Report" button

Both buttons navigate to `/report` page.

### STEP 6: Guardrails & Edge Cases

| Edge Case | Handling |
|-----------|----------|
| No readiness | Shows "No Readiness Data Found" with button to calculate first |
| No roadmap | Shows "No roadmap generated yet" message in roadmap section |
| Validation pending | Shows yellow disclaimer banner with pending count |
| User not logged in | Redirects to `/login` |
| API error | Shows error state with "Try Again" button |

---

## 📁 File Structure (IMPLEMENTED)

```
backend/
  service/
    reportService.js          # ✅ Report assembly service

src/
  pages/
    report/
      index.jsx               # ✅ Report page with all 6 sections
    readiness/
      index.jsx               # ✅ Added "Export Report" button
    roadmap/
      index.jsx               # ✅ Added "Export Report" button
```

---

## 📝 Notes

**Why PDF over other formats?**
- Professional appearance for interviews
- Static/immutable for credibility
- Universal compatibility (no special software needed)
- Easy to email or submit

**Future Enhancements (NOT for v1):**
- Shareable link with expiry
- QR code verification
- Mentor signature/endorsement
- Comparison reports (before/after)
