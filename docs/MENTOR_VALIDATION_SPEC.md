# 🎓 Mentor Validation Specification

## Overview

This document defines the **locked rules** for the Mentor Validation feature before any implementation begins.

**Feature Goal:** Allow mentors to validate user skills, adding a credibility layer that users cannot self-assign.

**Why This Matters:**
- Skills from `self` and `resume` are user-controlled
- Interviewers will ask: "How do you prevent skill inflation?"
- Mentor validation answers this cleanly with third-party verification

---

## 🔒 STEP 1: Mentor Scope (LOCKED)

These rules are **non-negotiable** and must be enforced in all implementation steps.

### Core Principle: Mentors are VALIDATORS, not ADVISORS

```
┌─────────────────────────────────────────────────────────────────┐
│                    MENTOR ROLE DEFINITION                        │
├─────────────────────────────────────────────────────────────────┤
│  Mentors VALIDATE skills. They do not teach, advise, or chat.   │
│  Think of them as "skill auditors" - they verify claims.        │
└─────────────────────────────────────────────────────────────────┘
```

---

### ✅ What Mentors CAN Do

| Action | Description | Why Allowed |
|--------|-------------|-------------|
| **View readiness breakdown** | See user's skills, levels, and readiness score | Need context to validate |
| **Validate individual skills** | Mark a skill as "validated" | Core function |
| **Reject individual skills** | Mark a skill as "rejected" (with reason) | Core function |
| **Add structured comments** | Short, predefined feedback on skills | Provides actionable context |
| **See skill source** | Know if skill is from `self`, `resume`, or previous validation | Helps assess credibility |

---

### ❌ What Mentors CANNOT Do

| Action | Why Blocked |
|--------|-------------|
| **Edit readiness scores directly** | Scores come from engine calculation only |
| **Add new skills to user profile** | Only user can add skills (self-sovereignty) |
| **Remove skills from user profile** | Only user can remove skills |
| **Change skill levels** | Levels are user-set; mentor just validates or rejects |
| **Chat freely with users** | Not a messaging platform; keeps scope focused |
| **Override the readiness engine** | Engine is source of truth |
| **Validate their own skills** | Conflict of interest |
| **See user's personal info** | Privacy: only see skills and readiness |

---

### 🛡️ System Integrity Rules

```
Rule 1: Mentor validation is ADDITIVE
────────────────────────────────────────
- Validating a skill changes source from 'self'/'resume' → 'validated'
- This UPGRADES the skill's credibility
- It does NOT change the skill level or readiness weight
- Engine treats 'validated' skills same as 'self'/'resume' for calculation

Rule 2: Mentor rejection is FLAGGING
────────────────────────────────────────
- Rejecting a skill adds a 'rejected' flag
- Skill remains in user_skills (user can still claim it)
- UI shows rejection with reason
- User can request re-validation or remove skill
- Engine may optionally weight rejected skills lower (future)

Rule 3: One mentor per validation
────────────────────────────────────────
- Each skill validation is tied to ONE mentor
- Multiple mentors cannot validate same skill (no stacking)
- New validation replaces old validation (with audit trail)

Rule 4: Validation is time-stamped
────────────────────────────────────────
- All validations have timestamp
- Validations may expire (configurable, e.g., 1 year)
- Expired validations revert to previous source
```

---

## 📊 Skill Source Hierarchy

After mentor validation, skill sources have a trust hierarchy:

```
┌─────────────────────────────────────────────────────────────────┐
│                    SKILL SOURCE TRUST LEVELS                     │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│   🥇 validated    - Third-party verified (mentor approved)      │
│   🥈 resume       - Document-backed (extracted from resume)     │
│   🥉 self         - Self-declared (user added manually)         │
│   ⚠️  rejected    - Disputed by mentor (flagged, not removed)   │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

**UI Implications:**
- Validated skills show a verification badge ✓
- Rejected skills show a warning indicator ⚠️
- Users can filter/sort by validation status

---

## 🚫 Anti-Patterns to Avoid

| Anti-Pattern | Why It's Bad |
|--------------|--------------|
| Letting mentors "grade" skills | Mentors validate existence, not proficiency |
| Free-form chat | Scope creep, moderation nightmare |
| Mentor marketplace | Not a gig platform, keeps it professional |
| Automatic skill addition | User sovereignty violation |
| Anonymous validation | Accountability matters |
| Pay-to-validate | Integrity corruption |

---

## ✅ Success Criteria for This Feature

1. **Mentors can only validate/reject, nothing else**
2. **User profile remains user-controlled**
3. **Validation status is visible in UI**
4. **Audit trail for all validations**
5. **No chat, no marketplace, no social features**
6. **Readiness engine unchanged (validated = valid source)**

---

## 📋 Implementation Steps

- [x] **STEP 1:** Lock mentor scope ✅ (This document)
  - Mentors are validators, not advisors
  - Can: view breakdown, validate/reject skills, add structured comments
  - Cannot: edit scores, add/remove skills, chat, override engine
  - System integrity rules defined
- [ ] **STEP 2:** Database schema for validations
- [ ] **STEP 3:** Mentor-user connection model
- [ ] **STEP 4:** Validation request flow
- [ ] **STEP 5:** Mentor validation UI
- [ ] **STEP 6:** User-side validation display
- [ ] **STEP 7:** Integration with readiness context

---

## 📝 Open Questions (To Resolve in Later Steps)

1. **How do users find/request mentors?** (invite-only? browse? referral?)
2. **What qualifies someone as a mentor?** (experience? certification?)
3. **How many skills can a mentor validate at once?** (batch or one-by-one?)
4. **Should rejected skills affect readiness calculation?** (weight reduction?)
5. **Validation expiry period?** (1 year? never?)

---

## 🔗 Related Documents

- [Resume Skill Sync Spec](./RESUME_SKILL_SYNC_SPEC.md) - How resume skills flow into the system
- Readiness Engine - How scores are calculated (source agnostic)

---

*Document created: STEP 1 of Mentor Validation feature*
*Last updated: January 2026*
