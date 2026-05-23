# PayFlow — Production-Grade Payment Ledger & Transaction Engine

PayFlow is a high-performance, resilient fintech backend engineering platform designed to handle multi-party transactions with zero data loss. Built entirely using the **MERN Stack**, the platform implements rigorous corporate standards for data consistency, idempotency, role-based security, and audit observability.

## 🏗️ Project Architecture & Layout
The project enforces a highly decoupled, strict separation of concerns using the **Repository-Service-Controller** architectural pattern to ensure modularity and comprehensive unit testability.


PayFlow/ (Project Root)
├── Frontend/               # React.js client architecture (Upcoming)
├── Backend/                # Node.js / Express Core Transaction Engine
│   ├── config/             # Database connection profiles
│   ├── controller/         # HTTP request orchestration and response termination
│   ├── errors/             # Custom structural operational system exceptions
│   ├── middleware/         # Security guards, request interceptors, and validators
│   ├── model/              # MongoDB/Mongoose database entity definitions
│   ├── repositories/       # Abstraction layer over raw database queries
│   ├── routes/             # REST resource endpoint declarations
│   ├── services/           # Decoupled business rules and hashing modules
│   ├── utils/              # Utility helpers (JWT tokens, wrappers)
│   ├── app.js              # Application bootstrapper & global pipeline manager
│   └── .env                # Protected environmental variables (Git ignored)
└── .gitignore              # Multi-module protection rules





## 🚀 (Day 1)
- **Modular Framework Setup**: Configured a centralized Express pipeline tracking incoming telemetry via global `logger` and `reqinfo` interceptors.
- **Robust Exception Boundaries**: Formulated an architectural `AppError` base structure managed globally by an exclusive error interceptor to handle unhandled breaks and validation failures gracefully.
- **Repository-Service Abstraction**: Completely isolated data persistence queries away from the execution layer using clean repository layers.
- **Secure Authentication & Hashing**: Implemented cryptographically sound user registration and login pathways, utilizing explicit `bcrypt` multi-round salt hashing completely within isolated service containers.
- **Role-Based Access Control (RBAC)**: Formulated strict gateway decorators (`auth`, `restrictTo`) protecting endpoints based on administrative clearings (`MERCHANT`, `ADMIN`, `AUDITOR`).
- **Joi Request Schemas**: Installed pre-controller interceptors validating structure payloads natively to catch bad data signatures before hitting system databases.


## 🏦 The Financial Engine Core Principle: Double-Entry Bookkeeping
Unlike basic applications that simply increment or decrement a single balance field, PayFlow treats balance adjustment as an immutable balance transfer. 
* Every financial transaction requires at least two lines: a **Debit** (positive entry) and a **Credit** (negative entry).
* The core invariant rule enforced at the database layer via pre-save hooks is: $\sum \text{Debits} + \sum \text{Credits} = 0$.
* Money can never be created or destroyed within the ecosystem; it can only safely migrate between verified financial pools (`ASSET`, `LIABILITY`, etc.).

## 🚀 (Day2)
- **Double-Entry Schema Layout (Day 2)**: Initialized explicit `Account` and `Transaction` data architectures protecting system balance ledger lines from un-audited alterations.
- **Repository Abstraction Layer (Day 2)**: Formulated clean, standalone `accountRepository` and `transactionRepository` layers capable of handling advanced atomic `$inc` actions and pipeline session bubbles.
- **Modular Framework Setup (Day 1)**: Configured a centralized Express pipeline tracking incoming telemetry via global logger and request info interceptors.
- **Robust Exception Boundaries (Day 1)**: Formulated an architectural `AppError` base structure managed globally by an exclusive error interceptor to handle validation failures gracefully.
- **Secure Authentication & Hashing (Day 1)**: Implemented credential verification paths using cryptographically sound `bcrypt` hashing algorithms.
- **Role-Based Access Control (Day 1)**: Formulated strict gateway decorators (`auth`, `restrictTo`) protecting sensitive user resources based on roles (`MERCHANT`, `ADMIN`, `AUDITOR`).






## 📅 Roadmap Blueprint
- [x] Day 1: System Architecture, Clean Authentication Core, and RBAC Guarding.
- [x] Day 2: Double-Entry Ledger Bookkeeping Models, Zero-Sum Pre-Saves, and Repository Setup.
- [ ] Day 3: Full Ledger Revision & MongoDB ACID Transaction Services (`session.startTransaction`).
- [ ] Day 4: Idempotence Middleware Protection via unique request fingerprinting keys.
- [ ] Day 5: Multi-Account Real-Time Balance Verification Aggregations.
- [ ] Day 6: Webhook Callback Simulations & Exponential Decay Backoffs.