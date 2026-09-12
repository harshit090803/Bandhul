```text
README.md
```

with:

````md
# Bandhul Gotra

A collaborative digital family archive and genealogy platform for preserving the history, relationships, stories, and legacy of the Bandhul Gotra family.

The project is designed to grow across generations while keeping historical family information simple to record. A family member does not need to know exact birth or death dates, biographies, or other details to create a valid genealogical record.

---

## Overview

Bandhul Gotra is a family genealogy website where registered family members can collaboratively build and maintain a shared family archive.

The system separates:

- **User accounts** — people who can log into the website
- **Person records** — genealogical records representing family members, including ancestors who never had an account

This distinction allows the archive to represent historical generations even when very little information is known about them.

For example, a deceased ancestor can simply be recorded as:

```text
Ram Prasad Bandhul
Status: Deceased

Relationship:
Father of Harish Bandhul
````

No date of birth or date of death is required.

---

# Goals

The primary goals of Bandhul Gotra are:

1. Preserve the Bandhul family lineage.

2. Digitally record family members across generations.

3. Represent relationships between family members.

4. Allow all registered family members to contribute.

5. Preserve the history of changes made to the archive.

6. Avoid requiring information that the family does not know.

7. Provide an interactive family tree.

8. Eventually provide relationship discovery such as:

   > "How am I related to this person?"

9. Preserve family photographs, biographies, and historical information.

10. Create a long-term digital family archive for future generations.

---

# Core Philosophy

## Names and relationships come first

Historical genealogy is often incomplete.

For older generations, the family may only know:

* Name
* Approximate identity
* Parent
* Spouse
* Child
* Life status

Therefore, the application does **not** force users to provide complete biographies or exact dates.

Optional information can be added later when it becomes available.

---

# Technology Stack

## Frontend

* Next.js
* React
* TypeScript
* Tailwind CSS

## Authentication

* Supabase Auth
* Email/password authentication
* Email confirmation
* Password recovery

## Database

* Supabase PostgreSQL

## Genealogy Visualization

* React Flow
* `@xyflow/react`

## Deployment

Planned deployment can use platforms such as:

* Vercel
* Supabase

---

# Project Structure

```text
bandhul/
│
├── app/
│   │
│   ├── api/
│   │   ├── people/
│   │   │   └── route.ts
│   │   │
│   │   └── relationships/
│   │       └── route.ts
│   │
│   ├── login/
│   │   └── page.tsx
│   │
│   ├── signup/
│   │   └── page.tsx
│   │
│   ├── forgot-password/
│   │   └── page.tsx
│   │
│   ├── update-password/
│   │   └── page.tsx
│   │
│   ├── logout/
│   │   └── page.tsx
│   │
│   ├── tree/
│   │   └── page.tsx
│   │
│   ├── people/
│   │   ├── page.tsx
│   │   └── [id]/
│   │       └── page.tsx
│   │
│   └── dashboard/
│       ├── page.tsx
│       │
│       ├── family/
│       │   ├── page.tsx
│       │   ├── add/
│       │   │   └── page.tsx
│       │   │
│       │   ├── add-member/
│       │   │   └── page.tsx
│       │   │
│       │   └── [id]/
│       │       └── page.tsx
│       │
│       └── contributions/
│           └── page.tsx
│
├── components/
│   │
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   ├── SignupForm.tsx
│   │   ├── ForgotPasswordForm.tsx
│   │   └── LogoutButton.tsx
│   │
│   ├── family/
│   │   ├── FamilyTree.tsx
│   │   ├── TreeNode.tsx
│   │   ├── PersonCard.tsx
│   │   ├── PersonForm.tsx
│   │   ├── RelationshipForm.tsx
│   │   └── FamilySearch.tsx
│   │
│   ├── layout/
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navbar.tsx
│   │
│   └── ui/
│       ├── Button.tsx
│       ├── Input.tsx
│       └── Modal.tsx
│
├── lib/
│   ├── auth.ts
│   ├── people.ts
│   ├── relationships.ts
│   │
│   └── supabase/
│       ├── client.ts
│       └── server.ts
│
├── types/
│   ├── genealogy.ts
│   └── database.ts
│
├── supabase/
│   ├── schema.sql
│   └── seed.sql
│
├── public/
│
├── proxy.ts
├── globals.css
├── .env.local
├── .env.local.example
└── README.md
```

---

# Database Architecture

The database is built around six primary tables.

```text
people
profiles
person_accounts
relationships
contact_info
contributions
```

---

## 1. people

Stores genealogical information about a person.

Important fields include:

```text
id
first_name
middle_name
last_name
gender
life_status
date_of_birth
date_of_death
birth_place
death_place
occupation
biography
photo_url
is_deleted
created_by
updated_by
created_at
updated_at
```

### Life Status

The `life_status` field supports:

```text
ALIVE
DECEASED
UNKNOWN
```

It is intentionally independent from the date fields.

Therefore:

```text
life_status = DECEASED
date_of_death = NULL
```

is completely valid.

This is important for historical ancestors where the family knows the person is deceased but does not know the exact date of death.

---

# 2. profiles

Stores information associated with a website user.

```text
id
display_name
email
created_at
updated_at
```

The `id` corresponds to the Supabase Auth user.

A profile is automatically created when a new authentication user is registered.

---

# 3. person_accounts

Connects a website account to a genealogical person.

Conceptually:

```text
Auth User
    │
    ▼
person_accounts
    │
    ▼
Person
```

This allows the system to distinguish between:

```text
Website Account
```

and:

```text
Genealogical Person
```

An ancestor can exist in the family tree without having a website account.

---

# 4. relationships

Stores genealogical relationships.

The database intentionally stores generic relationship types:

```text
PARENT
SPOUSE
```

For example:

```text
Person A
   │
   │ PARENT
   ▼
Person B
```

The application can derive:

* Father
* Mother
* Son
* Daughter
* Child
* Parent

from the generic relationship plus the gender of the relevant person.

This keeps the database model simpler and more flexible.

---

# 5. contact_info

Stores contact information separately from core genealogy data.

Possible fields include:

```text
phone
email
address
visibility
```

Visibility can be:

```text
PRIVATE
MEMBERS
PUBLIC
```

This separation allows genealogical information to remain available without automatically exposing personal contact details.

---

# 6. contributions

Stores the history of changes made to the archive.

Supported actions include:

```text
CREATE
UPDATE
DELETE
RESTORE
LINK
```

Each contribution can contain:

```text
user_id
action
entity_type
entity_id
description
old_data
new_data
created_at
```

This provides an audit trail and makes the archive collaborative without losing accountability.

---

# Authentication

Authentication is handled by Supabase Auth.

Supported flows:

```text
Signup
   ↓
Email Confirmation
   ↓
Login
   ↓
Dashboard
```

Password recovery:

```text
Forgot Password
      ↓
Email
      ↓
Reset Link
      ↓
Update Password
      ↓
Login
```

The application uses Supabase SSR for authentication/session handling.

---

# Environment Variables

Create a `.env.local` file:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

Do not expose Supabase secret/service-role keys to the browser.

---

# Local Development

Clone the repository:

```bash
git clone <repository-url>
```

Enter the project:

```bash
cd bandhul
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

# Main Routes

## Public

```text
/
```

Homepage.

```text
/login
```

Member login.

```text
/signup
```

Create an account.

```text
/forgot-password
```

Request a password reset.

```text
/update-password
```

Set a new password.

---

# Dashboard

```text
/dashboard
```

Main member dashboard.

---

# Family Archive

```text
/dashboard/family
```

Browse family members.

```text
/dashboard/family/add
```

Create the logged-in user's own family profile.

```text
/dashboard/family/add-member
```

Add any family member to the archive.

```text
/dashboard/family/[id]
```

Individual family member profile.

---

# Family Tree

```text
/tree
```

Interactive family tree.

The tree is generated from database records:

```text
people
   +
relationships
   ↓
Family Tree
```

The tree supports:

* Pan
* Zoom
* Dragging
* Node selection
* Relationship visualization
* Mini-map
* Parent/child connections
* Spouse connections

---

# Contributions

```text
/dashboard/contributions
```

Displays the current user's contribution history.

Examples:

```text
Created Family Member
Updated Family Member
Linked Family Profile
Added Relationship
```

---

# Contribution Model

Bandhul Gotra uses a collaborative contribution model.

There is no central approval queue.

Registered family members can contribute to the archive.

However, changes are recorded in the contribution history.

This provides:

```text
Freedom to contribute
+
Accountability
+
Historical record
```

---

# Soft Deletion

Family records should not normally be permanently deleted.

Instead:

```text
is_deleted = true
```

is used.

This allows records to be restored later and prevents accidental destruction of historical genealogy.

---

# Family Tree Philosophy

The tree should never depend on hardcoded family data.

Incorrect:

```tsx
const family = [
  {
    name: "Person A",
  },
  {
    name: "Person B",
  },
];
```

Correct:

```text
Supabase
   ↓
people
   ↓
relationships
   ↓
Tree
```

The database is the source of truth.

---

# Adding Historical Ancestors

Historical family members do not need complete information.

For example:

```text
Name:
Ram Prasad Bandhul

Life Status:
Deceased

Date of Birth:
Unknown

Date of Death:
Unknown

Birth Place:
Unknown

Biography:
Unknown
```

This is still a valid family record.

Once a relationship is added:

```text
Ram Prasad Bandhul
        │
      PARENT
        │
   Harish Bandhul
```

the ancestor becomes part of the lineage.

Additional information can be added later.

---

# UI / Design Language

The website follows a family-archive / heritage aesthetic.

Primary colors:

```text
Deep Maroon
#641F2B

Dark Brown
#321D1D

Antique Gold
#B08A45

Ivory
#FFFDF8

Parchment
#F7F3EB

Muted Brown
#746B63
```

The visual language uses:

* Serif headings
* Ivory backgrounds
* Maroon accents
* Antique gold details
* Thin borders
* Rounded cards
* Subtle shadows
* Heritage-inspired decorative elements
* Glass/translucent panels for authentication pages

---

# Planned Photography

The final visual design will incorporate family photographs.

Planned usage:

```text
Ghorikitta photograph
        ↓
Homepage / major background
```

Authentication pages may use a softened/darkened version.

Family tree pages may use a darker or blurred version so that genealogical information remains readable.

A Kuldevi photograph/emblem may be used as a separate heritage section rather than as a full-page background.

---

# Planned Features

## Relationship Builder

Users will be able to create relationships such as:

```text
Father of
Mother of
Child of
Spouse of
```

Internally these will map to:

```text
PARENT
SPOUSE
```

---

## Person Profiles

Each family member will eventually have a detailed profile containing:

```text
Name
Photo
Life Status
Birth Information
Death Information
Occupation
Biography
Parents
Spouse
Children
Other Relationships
```

All optional historical fields remain optional.

---

## Relationship Finder

A future feature will answer:

```text
How am I related to this person?
```

For example:

```text
You
 ↓
Father
 ↓
Grandfather
 ↓
Brother
 ↓
Son
 ↓
Person X
```

The application will calculate the relationship path from the graph stored in PostgreSQL.

---

## Search

Users will eventually be able to search:

```text
Name
Generation
Family branch
Relationship
```

---

## Photos

Future versions will support uploading photographs for family members.

---

## Biography and Family Stories

Family members will be able to preserve:

* Stories
* Memories
* Historical events
* Occupations
* Places lived
* Family traditions
* Other notes

---

## Contact Information

Members may optionally add contact information with privacy controls.

---

## Internal Messaging

A future version may allow registered family members to communicate within the archive.

---

## Archive Activity

A future global activity page can display contributions made by all family members.

Example:

```text
Harshit added Ram Prasad Bandhul
2 hours ago

Papa updated Harish Bandhul
Yesterday

Ankit added a spouse relationship
3 days ago
```

---

# Development Roadmap

Current development direction:

```text
[x] Project setup
[x] Supabase setup
[x] Authentication
[x] Signup
[x] Login
[x] Password recovery
[x] User profiles
[x] Person model
[x] Life status
[x] Family archive page
[x] Add family member page
[x] Contributions page
[x] Initial family tree visualization
[ ] Relationship builder
[ ] Individual person profile
[ ] Family tree relationship layout improvements
[ ] Search
[ ] Relationship finder
[ ] Photo uploads
[ ] Contact information UI
[ ] Global archive activity
[ ] Messaging
[ ] Final heritage photography integration
[ ] Production deployment
```

---

# Important Design Principles

### 1. Never hardcode genealogy

All family data must come from the database.

### 2. Don't force unknown information

Unknown historical information should remain optional.

### 3. Account ≠ Person

A person can exist without having a website account.

### 4. Relationships are first-class data

Genealogy is fundamentally a graph of people and relationships.

### 5. Preserve history

Changes should be attributable and recoverable.

### 6. Prefer soft deletion

Historical family information should not be permanently destroyed accidentally.

### 7. Privacy matters

Personal contact information should have explicit visibility controls.

---

# Current Status

Bandhul Gotra is currently under active development.

The core foundation is in place:

```text
Authentication
        ↓
User Profile
        ↓
Person Records
        ↓
Family Archive
        ↓
Family Tree
        ↓
Contributions
```

The next major development milestone is the **Relationship Builder**, which will connect Person records and turn the current interactive tree canvas into a fully functional genealogical graph.

---

# License

This project is currently a private family archive project.

License and repository access policy will be determined before public release.

---

# Bandhul Gotra

> **Our family. Our story. Our legacy.**