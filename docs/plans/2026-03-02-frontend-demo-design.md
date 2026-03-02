# Frontend Demo App - Design Document

## Overview

Build a pure frontend demo application for the Customer Sales Management System (客户销售管理系统) to showcase all system features to clients. The demo covers all 4 roles (Sales, Support, Manager, Admin) with interactive mock data and bilingual (Chinese/English) support.

## Decisions

| Decision | Choice | Rationale |
|---|---|---|
| Architecture | Single SPA with mock login + role switcher | Balances realism (login page) with demo convenience (quick role switching) |
| Tech Stack | React 19 + TypeScript + Vite 6 | Modern, fast DX, wide ecosystem |
| UI Library | shadcn/ui + Tailwind CSS 4 | Highly customizable, modern design, production-grade look |
| State Management | Zustand | Lightweight, simple API, no boilerplate |
| Data Layer | Static mock data + Zustand stores | No backend needed; operations trigger frontend state changes (reset on refresh) |
| i18n | react-i18next | Mature, supports instant language switching |
| Charts | Recharts | React-native charting, works well with shadcn/ui aesthetic |
| Icons | Lucide React | Default icon set for shadcn/ui |
| Routing | React Router v7 | Standard routing, supports role-based route guards |

## Architecture

### Project Structure

```
src/
├── components/           # Shared components
│   ├── layout/           # AppLayout, Sidebar, Header, Breadcrumb
│   ├── ui/               # shadcn/ui components
│   ├── data-table/       # Reusable DataTable with sorting/filtering
│   ├── detail-drawer/    # Reusable detail side drawer
│   └── common/           # StatusBadge, PriorityTag, RoleBadge, etc.
├── pages/                # Page components organized by module
│   ├── login/            # LoginPage (role selection cards)
│   ├── dashboard/        # SalesDashboard, SupportDashboard, ManagerDashboard, AdminDashboard
│   ├── client/           # PublicPool, Clients, MyClients, ClientDetail
│   ├── task/             # MyTasks, TaskPool, AllTasks, TaskDetail
│   ├── ticket/           # MyTickets, AllTickets, TicketDetail
│   ├── ib/               # MyIBDeals, PendingApproval, AllIBDeals, IBDealDetail
│   ├── communication/    # CommunicationCenter (3-column layout)
│   ├── team/             # TeamMembers, Groups
│   ├── automation/       # AutomationRules, RuleDetail
│   ├── performance/      # MyPerformance, TeamPerformance
│   ├── user/             # UserList
│   ├── role/             # RoleList
│   ├── settings/         # SystemSettings
│   ├── monitoring/       # SystemMonitoring
│   └── profile/          # UserProfile
├── data/                 # Mock data files
│   ├── users.ts
│   ├── clients.ts
│   ├── tasks.ts
│   ├── tickets.ts
│   ├── ib-deals.ts
│   ├── automation-rules.ts
│   ├── communications.ts
│   ├── notifications.ts
│   ├── teams.ts
│   └── performance.ts
├── store/                # Zustand stores
│   ├── auth-store.ts
│   ├── client-store.ts
│   ├── task-store.ts
│   ├── ticket-store.ts
│   ├── ib-store.ts
│   ├── team-store.ts
│   ├── automation-store.ts
│   └── notification-store.ts
├── i18n/                 # Internationalization
│   ├── index.ts
│   ├── en/               # English translations
│   └── zh/               # Chinese translations
├── hooks/                # Custom hooks
│   ├── use-role.ts       # Current role helpers
│   └── use-permission.ts # Permission checking
├── lib/                  # Utilities
│   ├── utils.ts
│   ├── permissions.ts    # Role-based permission config (per PRD 4.9)
│   ├── menu-config.ts    # Menu structure (per PRD 4.10)
│   └── constants.ts      # Enums, status definitions
└── types/                # TypeScript types
    ├── client.ts
    ├── task.ts
    ├── ticket.ts
    ├── ib-deal.ts
    ├── user.ts
    └── common.ts
```

### Role Switching Mechanism

1. **Login Page**: Shows 4 role cards (Sales, Support, Manager, Admin). Click to enter as that role.
2. **Header Role Switcher**: Dropdown in top bar allows instant role switching without going back to login.
3. **State Update**: On role switch, `authStore` updates current user/role → sidebar menu re-renders → redirect to role's Dashboard.

### Route Guards

- Routes filtered by role permissions (per PRD 4.10 menu matrix)
- Unauthorized routes redirect to Dashboard
- No actual authentication - purely role-based visibility

## Mock Data Design

### Data Volumes

| Entity | Count | Coverage |
|---|---|---|
| Users | 8-10 | 2-3 per role, with varied languages/regions/skills |
| Clients | 30-40 | All 8 statuses, some with IB info, varied countries/languages |
| Tasks | 20-25 | All 9 types, all 5 statuses, varied priorities |
| Tickets | 15-20 | CRM sync + internal, all categories, all statuses |
| IB Deals | 6-8 | All 5 statuses, with approval history |
| Automation Rules | 5-6 | Matches PRD examples (sections 2.7) |
| Communications | 20-30 | Multi-channel conversations |
| Notifications | 10-15 | Varied scenarios |
| Groups | 3-4 | China Sales, IB Support, KYC Expert, etc. |

### Data Relationships

- Each client assigned to a specific Sales user
- Tasks/Tickets linked to clients and assignees
- IB Deals linked to clients and creating Sales
- Communication records linked to clients and handlers
- Groups contain user members

## Interactive Operations

Operations that trigger frontend state changes (reset on page refresh):

| Operation | Module | Effect |
|---|---|---|
| Claim Client | Client (Public Pool) | Move client from pool to My Clients, set assignee |
| Release Client | Client (My Clients) | Return client to pool, clear assignee |
| Claim Task | Task (Task Pool) | Move task to My Tasks, set assignee |
| Change Task Status | Task | Update status: Pending → In Progress → Completed/Failed/No Response |
| Return Task | Task | Send back to Task Pool, clear assignee |
| Change Ticket Status | Ticket | Update status through the flow |
| Escalate Ticket | Ticket | Open escalation form, set status to On Hold |
| Create Task | Task | Open form dialog, add new task to list |
| Create Ticket | Ticket | Open form dialog, add new ticket to list |
| Create IB Deal | IB | Open form dialog, add to pending approval |
| Approve/Reject IB | IB | Manager action, update IB deal status |
| Toggle Automation Rule | Automation | Enable/disable rule |
| Switch Role | Auth | Change current role, update menu/dashboard |
| Switch Language | Auth | Toggle Chinese/English, all UI text updates instantly |
| Toggle User Status | User | Active/Busy/Offline status indicator change |
| Send Message | Communication | Add message to conversation (visual only) |

## Page Designs

### Login Page

- Centered card with system logo and name
- 4 role selection cards in a grid (icon + role name + brief description)
- Language toggle (top-right)
- Clean, branded appearance

### App Layout

- **Header (64px)**: Logo | Breadcrumb | Global Search (decorative) | Language Switch | Notification Bell (with badge) | Role Switcher Dropdown | User Avatar + Name + Status Dot
- **Sidebar (240px, collapsible to 64px)**: Dynamic menu per role (PRD 4.10), icons + text, expandable sub-menus, active state highlight
- **Main Content**: Fills remaining space, with page title and content

### Dashboard Pages (4 variants)

Each per PRD 2.13:
- **Sales**: 4 stat cards (Pending Tasks, In Progress Tasks, Completed Today, My Clients) with clickable navigation
- **Support**: 4 stat cards (Open Tickets, In Progress Tickets, Resolved Today, Pending Conversations)
- **Manager**: 6 stat cards + Client Lifecycle Distribution pie chart + Team Performance Overview (Sales + Support metrics)
- **Admin**: 4 stat cards (Total Users, Active Rules, Event Consumption Status, Dead Letter Queue)

### Client Module

- **Public Pool**: DataTable with columns (Name, Country, Language, Created, Tags) + Claim button per row + Import dialog + Create dialog + Advanced filters (country, language)
- **Clients**: DataTable (Name, Status, Country, Phone*, Email*, Balance, Assigned To) + Search
- **My Clients**: DataTable + Release button per row
- **Client Detail**: Full info card + Tabs (Related Tasks, Related Tickets, Communication Records) + Data masking for Support role (phone/email with "View Full" button)

### Task Module

- DataTable with columns: Type, Priority (color tag), Status (badge), Client, Assignee, Due Date (countdown, red if overdue), Created
- **Task Detail Drawer**: Basic info + Communication Log timeline + Action buttons (Complete, Failed, No Response, Return to Pool)
- **Task Pool**: Same table + Claim button
- **All Tasks** (Manager): Full table + Create Task button + Assign action

### Ticket Module

- DataTable: Source, Channel, Category, Priority, Status, Client, Assignee, Created
- **Ticket Detail**: Info section + Processing History timeline + Status action buttons + Escalate button (opens form dialog)
- Escalation form: Type (Submit to Manager / Forward to Sales), Priority, Reason (required), Notes

### IB Application Module

- **My IB Deals** (Sales): Table + Create IB Deal button
- **Pending Approval** (Manager): Table + Approve/Reject action buttons per row
- **All IB Deals** (Manager): Full table with all statuses
- **IB Detail**: Form fields display + Approval History timeline
- Create/Edit Form: Commission Rate, Commission Type, Monthly Target, Effective Date, Expiry Date, Extra Payment, Payment Frequency, Notes

### Communication Center

Three-column layout (only Support & Manager):
- **Left Column (280px)**: Channel tabs (LiveChat / WhatsApp / Email / Phone) + Conversation list (avatar, name, last message preview, unread badge, time)
- **Center Column**: Chat area with message bubbles (sent/received), timestamp dividers, input area with send button + attachment button + "Create Ticket" button
- **Right Column (320px)**: Client context panel (basic info, status, balance, recent tickets) + "View Full Client Details" link

### Team & Group

- **Team Members**: DataTable (Name, Role badge, Status dot, Languages, Regions, Task Load bar, Skills)
- **Groups**: Card grid (Group name, member count, description) + Create/Edit dialog (name, description, member multi-select)

### Automation

- **Rule List**: Table with columns (Name, Enabled toggle, Trigger Type, Conditions summary, Actions summary, Last Modified)
- **Rule Detail/Editor**: Visual condition builder (condition groups with AND/OR logic) + Action configuration panel

### Performance

- **My Performance** (Sales/Support): Metric cards (per PRD 2.8) + Trend line chart + Time range selector (Week/Month/Quarter)
- **Team Performance** (Manager): Sales metrics section + Support metrics section + Individual leaderboard table + Client Lifecycle Funnel chart + Ticket Distribution chart + Group comparison + Time range selector

### User Management (Admin)

- DataTable (Name, Username, Email, Role, Status, Languages, Regions, Max Tasks)
- CRUD dialog with full form fields per PRD 2.9

### Role Management (Admin)

- 4 preset roles listed with permission matrix table display
- Read-only for preset roles, placeholder for future custom roles

### System Settings (Admin)

- Grouped form sections: External System Integration (RabbitMQ, CRM API, MT5 API) + Communication Channels (LiveChat, WhatsApp, Email, Phone) + Notification Channels (Telegram, Teams)

### System Monitoring (Admin)

- Event consumption status cards (queue names, consumption rate, backlog)
- Dead Letter Queue table (failed messages)
- Automation execution log table

### User Profile (All Roles)

- Personal info form (avatar upload, name, email)
- Password change form
- Language preference dropdown
- Notification settings toggles (per PRD 2.12)

## i18n Strategy

- All UI text externalized to translation files
- Namespace organization: `common`, `menu`, `dashboard`, `client`, `task`, `ticket`, `ib`, `communication`, `team`, `automation`, `performance`, `user`, `settings`
- Language toggle in header and login page
- `react-i18next` with `useTranslation` hook
- Date/number formatting follows locale

## Out of Scope (for demo)

- Real API calls / backend integration
- File upload (avatar, import) - UI only, no actual upload
- Real-time messaging - static mock conversations
- Email/SMS/Phone actual sending
- Persistent data storage - all state resets on refresh
- Browser notifications
- Responsive/mobile layout (desktop-first for demo)
