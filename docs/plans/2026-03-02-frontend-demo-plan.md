# Sales Management System - Frontend Demo Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build a pure frontend demo of the Customer Sales Management System covering all 4 roles, 15 modules, bilingual i18n, and interactive mock data — no backend required.

**Architecture:** Single-page React app with Vite 6 + TypeScript. Mock data hardcoded in `src/data/`, Zustand stores for state, react-i18next for Chinese/English. Login page for role selection, header for quick role switching. Sidebar menu dynamically rendered per role permissions.

**Tech Stack:** React 19, TypeScript, Vite 6, Tailwind CSS 4, shadcn/ui, Zustand, React Router v7, react-i18next, Recharts, Lucide React

**Reference:** Design doc: `docs/plans/2026-03-02-frontend-demo-design.md`, PRD: `docs/客户销售管理系统 - 产品需求文档 v3.0.md`

---

## Phase 1: Project Foundation

### Task 1: Scaffold Vite + React + TypeScript project

**Files:**
- Create: `package.json`, `vite.config.ts`, `tsconfig.json`, `tsconfig.app.json`, `tsconfig.node.json`, `index.html`, `src/main.tsx`, `src/App.tsx`, `src/vite-env.d.ts`

**Step 1: Create Vite project**

```bash
cd D:\WorkSpace\Speccapitals\sales-v3
npm create vite@latest . -- --template react-ts
```

If prompted about non-empty directory, choose to proceed (only `docs/` exists).

**Step 2: Install core dependencies**

```bash
npm install react-router-dom zustand react-i18next i18next recharts lucide-react clsx tailwind-merge class-variance-authority
```

**Step 3: Install dev dependencies**

```bash
npm install -D tailwindcss @tailwindcss/vite
```

**Step 4: Configure Tailwind CSS 4 with Vite plugin**

In `vite.config.ts`:
```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import path from 'path'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
})
```

Replace `src/index.css` with:
```css
@import "tailwindcss";
```

Add path alias to `tsconfig.app.json`:
```json
{
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

**Step 5: Clean up starter files**

Remove `src/App.css`, `src/assets/react.svg`, `public/vite.svg`. Simplify `src/App.tsx` to:
```tsx
function App() {
  return <div className="min-h-screen bg-background text-foreground">Hello Sales Demo</div>
}
export default App
```

**Step 6: Verify build**

```bash
npm run build
npm run dev
```

Verify: dev server runs at `http://localhost:5173`, page shows "Hello Sales Demo".

**Step 7: Commit**

```bash
git add -A
git commit -m "chore: scaffold Vite + React + TypeScript project with Tailwind CSS 4"
```

---

### Task 2: Setup shadcn/ui

**Files:**
- Create: `src/lib/utils.ts`, `components.json`, `src/components/ui/` (multiple files)

**Step 1: Initialize shadcn/ui**

```bash
npx shadcn@latest init
```

Choose: New York style, Zinc base color, CSS variables. This creates `components.json` and `src/lib/utils.ts`.

**Step 2: Install commonly needed shadcn/ui components**

```bash
npx shadcn@latest add button card input label select dialog sheet dropdown-menu avatar badge separator tabs table switch textarea toast tooltip popover command scroll-area
```

**Step 3: Verify build**

```bash
npm run build
```

Expected: Clean build, no errors.

**Step 4: Commit**

```bash
git add -A
git commit -m "chore: setup shadcn/ui with core components"
```

---

### Task 3: TypeScript types and constants

**Files:**
- Create: `src/types/user.ts`, `src/types/client.ts`, `src/types/task.ts`, `src/types/ticket.ts`, `src/types/ib-deal.ts`, `src/types/common.ts`
- Create: `src/lib/constants.ts`

**Step 1: Create common types** (`src/types/common.ts`)

Define shared types: `Role` ('sales' | 'support' | 'manager' | 'admin'), `Priority` ('low' | 'medium' | 'high' | 'urgent'), `Region`, `Language`.

**Step 2: Create entity types**

- `src/types/user.ts`: `User` type with all fields from PRD 2.9 (id, name, username, email, role, status, languages, regions, maxTaskCapacity, skills)
- `src/types/client.ts`: `Client` type with all fields from PRD 2.1 (id, name, country, language, phone, email, cid, walletBalance, mt5Balance, registeredAt, lastActiveAt, assignedTo, tags, ibInfo, status as ClientStatus union)
- `src/types/task.ts`: `Task` type with all fields from PRD 2.2 (id, type as TaskType union of 9 types, priority, status as TaskStatus union, clientId, createdBy, assignedTo, createdAt, dueDate, nextFollowUp, retryCount, maxRetries, communicationLogs)
- `src/types/ticket.ts`: `Ticket` type with all fields from PRD 2.3 (id, source, channel, category as TicketCategory union of 9 types, priority, status as TicketStatus union, content, clientId, createdBy, assignedTo, createdAt, crmIssueId, escalationHistory)
- `src/types/ib-deal.ts`: `IBDeal` type with all fields from PRD 2.4 (id, clientId, createdBy, commissionRate, commissionType, monthlyTarget, effectiveDate, expiryDate, extraPayment, paymentFrequency, notes, status as IBDealStatus union, approvalHistory)

**Step 3: Create constants** (`src/lib/constants.ts`)

Define all enums referenced in PRD:
- `CLIENT_STATUSES`: lead, registered, kyc_pending, kyc_rejected, kyc_approved, funded, active, dormant
- `TASK_TYPES`: kyc_followup, kyc_rejected, deposit_guidance, trade_activation, reactivation, negative_balance_resolution, withdrawal_feedback, event_notification, ib_renewal_followup
- `TASK_STATUSES`: pending, in_progress, completed, failed, no_response
- `TICKET_CATEGORIES`: general, account, ib_application, kyc, deposit, withdrawal, trading, technical, complaint
- `TICKET_STATUSES`: open, in_progress, on_hold, resolved, closed
- `IB_DEAL_STATUSES`: pending_approval, approved, rejected, active, expired
- `PRIORITIES`: low, medium, high, urgent (with colors per PRD)
- `USER_STATUSES`: active, busy, offline (with colors)
- `ROLES`: sales, support, manager, admin
- `REGIONS`: per PRD 4.1
- `LANGUAGES`: per PRD 4.3
- `CHANNELS`: livechat, whatsapp, email, phone

**Step 4: Verify build**

```bash
npm run build
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add TypeScript types and constants for all entities"
```

---

### Task 4: i18n setup

**Files:**
- Create: `src/i18n/index.ts`, `src/i18n/en/common.json`, `src/i18n/en/menu.json`, `src/i18n/zh/common.json`, `src/i18n/zh/menu.json`

**Step 1: Create i18n config** (`src/i18n/index.ts`)

```ts
import i18n from 'i18next'
import { initReactI18next } from 'react-i18next'

// Import all translation files
import enCommon from './en/common.json'
import enMenu from './en/menu.json'
import zhCommon from './zh/common.json'
import zhMenu from './zh/menu.json'

i18n.use(initReactI18next).init({
  resources: {
    en: { common: enCommon, menu: enMenu },
    zh: { common: zhCommon, menu: zhMenu },
  },
  lng: 'en',
  fallbackLng: 'en',
  defaultNS: 'common',
  interpolation: { escapeValue: false },
})

export default i18n
```

**Step 2: Create English common translations** (`src/i18n/en/common.json`)

Include: app name, roles (Sales, Support, Manager, Admin), statuses for all entities, priorities, actions (Claim, Release, Create, Edit, Delete, Approve, Reject, Escalate, Close, Complete, etc.), table headers, form labels, common UI text (Search, Filter, Save, Cancel, Submit, etc.).

**Step 3: Create English menu translations** (`src/i18n/en/menu.json`)

All menu items from PRD 4.10: Dashboard, Client (Public Pool, Clients, My Clients), Task (My Tasks, Task Pool, All Tasks), Ticket (My Tickets, All Tickets), IB (My IB Deals, Pending Approval, All IB Deals), Communication, Team (Team Members, Groups), Automation, Performance (My Performance, Team Performance), User (User List), Role (Role List), System Settings, System Monitoring, User Profile.

**Step 4: Create Chinese translations** (`src/i18n/zh/common.json`, `src/i18n/zh/menu.json`)

Mirror the English files with Chinese translations. Menu items: 首页概览, 客户 (公海池, 客户列表, 我的客户), 任务 (我的任务, 任务池, 全部任务), 工单 (我的工单, 全部工单), IB (我的IB协议, 待审批, 全部IB协议), 沟通中心, 团队 (团队成员, 分组), 自动化, 绩效 (我的绩效, 团队绩效), 用户 (用户列表), 角色 (角色列表), 系统设置, 系统监控, 个人资料.

**Step 5: Import i18n in main.tsx**

Add `import './i18n'` at the top of `src/main.tsx`.

**Step 6: Verify build**

```bash
npm run build
```

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: setup i18n with English and Chinese translations"
```

---

### Task 5: Permissions and menu configuration

**Files:**
- Create: `src/lib/permissions.ts`, `src/lib/menu-config.ts`

**Step 1: Create permission config** (`src/lib/permissions.ts`)

Encode the full permission matrix from PRD 4.9. Structure as a map: `PERMISSIONS[role][module][action] = boolean`. Cover all modules: client, task, ticket, ib, communication, team, automation, performance, user, role, settings, monitoring.

**Step 2: Create menu config** (`src/lib/menu-config.ts`)

Define the sidebar menu structure matching PRD 4.10 exactly. Each menu item has: key, icon (Lucide icon name), label (i18n key), path, children (sub-items), and `roles: Role[]` (which roles see it).

Structure:
```ts
export interface MenuItem {
  key: string
  icon: string       // Lucide icon component name
  labelKey: string   // i18n key from menu namespace
  path?: string
  children?: MenuItem[]
  roles: Role[]
}
```

Menu items (icons as suggestions):
- Dashboard (LayoutDashboard) → /dashboard — all roles
- Client (Users) → children:
  - Public Pool → /client/public-pool — sales, manager
  - Clients → /client/list — support, manager
  - My Clients → /client/my-clients — sales
- Task (ClipboardList) → children:
  - My Tasks → /task/my-tasks — sales, support, manager
  - Task Pool → /task/pool — sales, support, manager
  - All Tasks → /task/all — manager
- Ticket (Headset) → children:
  - My Tickets → /ticket/my-tickets — sales, support, manager
  - All Tickets → /ticket/all — manager
- IB (Handshake) → children:
  - My IB Deals → /ib/my-deals — sales
  - Pending Approval → /ib/pending — manager
  - All IB Deals → /ib/all — manager
- Communication (MessageSquare) → /communication — support, manager
- Team (UserCog) → children:
  - Team Members → /team/members — manager
  - Groups → /team/groups — manager
- Automation (Zap) → /automation — manager, admin
- Performance (BarChart3) → children:
  - My Performance → /performance/my — sales, support
  - Team Performance → /performance/team — manager
- User (UserCircle) → children:
  - User List → /user/list — manager, admin
- Role (Shield) → children:
  - Role List → /role/list — admin
- System Settings (Settings) → /settings — admin
- System Monitoring (Monitor) → /monitoring — admin
- User Profile (User) → /profile — all roles

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add role permissions and menu configuration"
```

---

### Task 6: Mock data

**Files:**
- Create: `src/data/users.ts`, `src/data/clients.ts`, `src/data/tasks.ts`, `src/data/tickets.ts`, `src/data/ib-deals.ts`, `src/data/automation-rules.ts`, `src/data/communications.ts`, `src/data/notifications.ts`, `src/data/teams.ts`, `src/data/performance.ts`

**Step 1: Create user data** (`src/data/users.ts`)

10 users: 3 Sales, 3 Support, 2 Manager, 2 Admin. Each with realistic names, languages, regions, skills per PRD 2.9. Include a "current user" ID for each role (used when switching roles).

Example Sales users: "James Wilson" (English, Asia), "Li Wei" (Chinese, Asia), "Yuki Tanaka" (Japanese, Asia).

**Step 2: Create client data** (`src/data/clients.ts`)

35 clients covering all 8 statuses (lead×6, registered×5, kyc_pending×4, kyc_rejected×2, kyc_approved×5, funded×5, active×5, dormant×3). Varied countries/languages. Some assigned to Sales users, leads unassigned. Some with IB info. Realistic names matching countries.

**Step 3: Create task data** (`src/data/tasks.ts`)

25 tasks covering all 9 types and all 5 statuses. Linked to clients and assigned to users. Include communication logs (2-3 entries each). Some in task pool (no assignee). Varied priorities. Some with retry counts.

**Step 4: Create ticket data** (`src/data/tickets.ts`)

18 tickets. Mix of CRM sync (`crm_issue`) and internal (`internal_created`). All 9 categories represented. All 5 statuses. Some with escalation history. Linked to clients.

**Step 5: Create IB deal data** (`src/data/ib-deals.ts`)

8 IB deals covering all 5 statuses. Each with approval history entries. Linked to clients and Sales users.

**Step 6: Create remaining data files**

- `src/data/automation-rules.ts`: 6 rules matching PRD examples (Chinese KYC auto-assign, high priority notification, dormancy detection, no response retry, IB expiry followup, IB ticket routing). Each with trigger type, conditions, actions.
- `src/data/communications.ts`: 25 conversation records across channels (livechat, whatsapp, email, phone). Each has message array with sender/content/timestamp.
- `src/data/notifications.ts`: 15 notifications covering task assignment, ticket escalation, IB approval, client status changes.
- `src/data/teams.ts`: 4 groups (China Sales Group, IB Support Group, KYC Expert Group, VIP Service Group). Each with member user IDs.
- `src/data/performance.ts`: Pre-calculated performance metrics for Sales team (new clients, conversion rates, deposit amounts, task completion) and Support team (ticket counts, response times, resolution rates). Include weekly/monthly/quarterly data.

**Step 7: Verify build**

```bash
npm run build
```

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add comprehensive mock data for all modules"
```

---

### Task 7: Zustand stores

**Files:**
- Create: `src/store/auth-store.ts`, `src/store/client-store.ts`, `src/store/task-store.ts`, `src/store/ticket-store.ts`, `src/store/ib-store.ts`, `src/store/team-store.ts`, `src/store/automation-store.ts`, `src/store/notification-store.ts`

**Step 1: Create auth store** (`src/store/auth-store.ts`)

State: `currentUser: User | null`, `currentRole: Role`, `language: 'en' | 'zh'`, `isLoggedIn: boolean`.
Actions: `login(role)` — sets currentUser from mock data for that role + sets isLoggedIn. `switchRole(role)` — same but preserves logged in state. `switchLanguage(lang)` — updates language and calls `i18n.changeLanguage()`. `logout()` — clears state.

**Step 2: Create client store** (`src/store/client-store.ts`)

State: `clients: Client[]` (initialized from mock data).
Actions: `claimClient(clientId, userId)` — sets assignedTo. `releaseClient(clientId)` — clears assignedTo, sets status back to 'lead'. `updateClient(clientId, partial)` — merges updates.
Getters (derived): `getPublicPool(clients)` — filter status=lead. `getMyClients(clients, userId)` — filter assignedTo=userId. `getAllClients(clients)` — filter status != lead.

**Step 3: Create task store** (`src/store/task-store.ts`)

State: `tasks: Task[]`.
Actions: `claimTask(taskId, userId)`, `returnTask(taskId)`, `updateTaskStatus(taskId, status)`, `createTask(task)`, `assignTask(taskId, userId)`.
Getters: `getMyTasks(userId)`, `getTaskPool()` (unassigned), `getAllTasks()`.

**Step 4: Create ticket store** (`src/store/ticket-store.ts`)

State: `tickets: Ticket[]`.
Actions: `createTicket(ticket)`, `updateTicketStatus(ticketId, status)`, `escalateTicket(ticketId, escalation)`, `assignTicket(ticketId, userId)`.
Getters: `getMyTickets(userId)`, `getAllTickets()`.

**Step 5: Create IB store** (`src/store/ib-store.ts`)

State: `ibDeals: IBDeal[]`.
Actions: `createIBDeal(deal)`, `approveIBDeal(dealId)`, `rejectIBDeal(dealId, reason)`, `resubmitIBDeal(dealId, updates)`.
Getters: `getMyIBDeals(userId)`, `getPendingApproval()`, `getAllIBDeals()`.

**Step 6: Create remaining stores**

- `src/store/team-store.ts`: State: groups[]. Actions: createGroup, updateGroup, deleteGroup.
- `src/store/automation-store.ts`: State: rules[]. Actions: toggleRule, createRule, updateRule, deleteRule.
- `src/store/notification-store.ts`: State: notifications[], unreadCount. Actions: markAsRead, markAllAsRead.

**Step 7: Verify build**

```bash
npm run build
```

**Step 8: Commit**

```bash
git add -A
git commit -m "feat: add Zustand stores for all modules"
```

---

### Task 8: Custom hooks

**Files:**
- Create: `src/hooks/use-role.ts`, `src/hooks/use-permission.ts`

**Step 1: Create useRole hook** (`src/hooks/use-role.ts`)

Returns: `{ currentRole, currentUser, isRole(role), switchRole(role) }`. Reads from authStore.

**Step 2: Create usePermission hook** (`src/hooks/use-permission.ts`)

Returns: `{ canAccess(module, action), getMenuItems() }`. Uses permissions.ts config + current role to filter menu items and check action permissions.

**Step 3: Verify build**

```bash
npm run build
```

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add useRole and usePermission hooks"
```

---

## Phase 2: App Shell

### Task 9: Login page

**Files:**
- Create: `src/pages/login/LoginPage.tsx`

**Step 1: Build the login page**

Centered layout with:
- System logo area (text-based: icon + "Sales Management System" / "客户销售管理系统")
- 4 role cards in a 2×2 grid, each with: icon (Lucide), role name, brief description (from PRD 1.3), hover effect
- Language toggle button (top-right corner)
- Click card → `authStore.login(role)` → navigate to `/dashboard`

Use shadcn/ui Card, Button components. Tailwind for layout.

**Step 2: Verify**

```bash
npm run dev
```

Open browser, see login page with 4 cards. Click one card, verify `authStore` updates (check via console or React DevTools).

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add login page with role selection cards"
```

---

### Task 10: App layout (Header + Sidebar)

**Files:**
- Create: `src/components/layout/AppLayout.tsx`, `src/components/layout/Header.tsx`, `src/components/layout/Sidebar.tsx`, `src/components/layout/SidebarMenuItem.tsx`

**Step 1: Build Sidebar**

- 240px wide (64px when collapsed)
- Collapse toggle button at bottom
- Menu items from `menu-config.ts`, filtered by current role via `usePermission().getMenuItems()`
- Each item: Lucide icon + label (from i18n menu namespace)
- Expandable sub-menus with chevron animation
- Active state highlight based on current route (React Router `useLocation`)
- Navigation via React Router `useNavigate`

**Step 2: Build Header**

- 64px height, sticky top
- Left: Logo/app name (collapsible with sidebar)
- Center-left: Breadcrumb (React Router based)
- Right section (flex row):
  - Language toggle button (Globe icon, toggles EN/ZH, calls authStore.switchLanguage)
  - Notification bell (Bell icon + unread count badge from notificationStore)
  - Role switcher: Dropdown (DropdownMenu) showing 4 roles, current role highlighted, click switches via authStore.switchRole + navigate to /dashboard
  - User info: Avatar + name + status dot (green/yellow/gray per active/busy/offline)

**Step 3: Build AppLayout**

Wraps `<Outlet />` from React Router. Structure:
```tsx
<div className="flex h-screen">
  <Sidebar />
  <div className="flex flex-col flex-1 overflow-hidden">
    <Header />
    <main className="flex-1 overflow-auto p-6">
      <Outlet />
    </main>
  </div>
</div>
```

**Step 4: Verify**

```bash
npm run dev
```

Navigate to app, see sidebar + header. Click sidebar items, verify URL changes. Toggle language, verify menu text switches. Switch role, verify menu items change.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add app layout with sidebar, header, and role switching"
```

---

### Task 11: Routing setup

**Files:**
- Create: `src/routes.tsx`
- Modify: `src/App.tsx`

**Step 1: Define routes** (`src/routes.tsx`)

Use React Router v7 `createBrowserRouter`:
- `/login` → LoginPage
- `/` → AppLayout (with auth guard: redirect to /login if not logged in)
  - `/dashboard` → DashboardPage (renders role-specific dashboard)
  - `/client/public-pool` → PublicPoolPage
  - `/client/list` → ClientsPage
  - `/client/my-clients` → MyClientsPage
  - `/client/:id` → ClientDetailPage
  - `/task/my-tasks` → MyTasksPage
  - `/task/pool` → TaskPoolPage
  - `/task/all` → AllTasksPage
  - `/ticket/my-tickets` → MyTicketsPage
  - `/ticket/all` → AllTicketsPage
  - `/ib/my-deals` → MyIBDealsPage
  - `/ib/pending` → PendingApprovalPage
  - `/ib/all` → AllIBDealsPage
  - `/communication` → CommunicationPage
  - `/team/members` → TeamMembersPage
  - `/team/groups` → GroupsPage
  - `/automation` → AutomationPage
  - `/performance/my` → MyPerformancePage
  - `/performance/team` → TeamPerformancePage
  - `/user/list` → UserListPage
  - `/role/list` → RoleListPage
  - `/settings` → SystemSettingsPage
  - `/monitoring` → SystemMonitoringPage
  - `/profile` → UserProfilePage

For now, create placeholder components for all pages (just `<div>Page Name</div>`). We'll build them out in Phase 3.

**Step 2: Add route guard**

In AppLayout or a wrapper component, check `authStore.isLoggedIn`. If false, redirect to `/login`. Also check role permission for the current route — if unauthorized, redirect to `/dashboard`.

**Step 3: Update App.tsx**

```tsx
import { RouterProvider } from 'react-router-dom'
import { router } from './routes'
import './i18n'

function App() {
  return <RouterProvider router={router} />
}
export default App
```

**Step 4: Verify**

```bash
npm run dev
```

Test: Open `/login`, select role, navigate to dashboard. Click sidebar items, verify routes work. Try accessing unauthorized route, verify redirect. Switch role, verify redirect to dashboard.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add routing with auth guard and role-based route protection"
```

---

## Phase 3: Shared Components

### Task 12: Reusable components (DataTable, StatusBadge, etc.)

**Files:**
- Create: `src/components/common/StatusBadge.tsx`, `src/components/common/PriorityTag.tsx`, `src/components/common/RoleBadge.tsx`, `src/components/common/UserStatusDot.tsx`, `src/components/common/DataMasking.tsx`, `src/components/common/StatCard.tsx`, `src/components/common/PageHeader.tsx`, `src/components/common/TimelineList.tsx`, `src/components/data-table/DataTable.tsx`, `src/components/data-table/DataTablePagination.tsx`, `src/components/data-table/DataTableFilter.tsx`

**Step 1: Build StatusBadge**

Generic badge component that takes `status` string + `type` ('client' | 'task' | 'ticket' | 'ib') and renders the appropriate colored badge using shadcn Badge. Color mapping from constants.

**Step 2: Build PriorityTag**

Takes `priority` ('low' | 'medium' | 'high' | 'urgent'). Colors per PRD: low=gray, medium=blue, high=orange, urgent=red.

**Step 3: Build other common components**

- `RoleBadge`: Colored badge per role
- `UserStatusDot`: Green/yellow/gray dot for active/busy/offline
- `DataMasking`: Shows masked phone (138****5678) or email (j*****e@example.com) with optional "View Full" button (for Support role)
- `StatCard`: Dashboard stat card with icon, title, value, optional trend indicator. Uses shadcn Card.
- `PageHeader`: Page title + optional action buttons area
- `TimelineList`: Vertical timeline component for communication logs, approval history, etc. Each entry: timestamp, actor, content.

**Step 4: Build DataTable**

Reusable table component wrapping shadcn Table:
- Props: `columns` definition, `data` array, `searchable` fields, `filters` config
- Features: column sorting, search input, filter dropdowns, pagination
- Uses `@tanstack/react-table` if needed, or manual implementation for simplicity

Install if needed:
```bash
npm install @tanstack/react-table
```

**Step 5: Verify build**

```bash
npm run build
```

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add reusable components (DataTable, StatusBadge, StatCard, etc.)"
```

---

## Phase 4: Module Pages

### Task 13: Dashboard pages (4 variants)

**Files:**
- Create: `src/pages/dashboard/DashboardPage.tsx`, `src/pages/dashboard/SalesDashboard.tsx`, `src/pages/dashboard/SupportDashboard.tsx`, `src/pages/dashboard/ManagerDashboard.tsx`, `src/pages/dashboard/AdminDashboard.tsx`

**Step 1: Build DashboardPage router**

`DashboardPage.tsx` reads current role from `useRole()` and renders the corresponding dashboard component.

**Step 2: Build SalesDashboard**

Per PRD 2.13: 4 StatCards in a row:
- Pending Tasks (count from taskStore where status=pending, assignee=current user)
- In Progress Tasks (status=in_progress)
- Completed Today (status=completed, today's date)
- My Clients (count from clientStore where assignedTo=current user)

Each card clickable (navigates to the relevant page).

**Step 3: Build SupportDashboard**

4 StatCards:
- Open Tickets (status=open, assignee=me)
- In Progress Tickets (status=in_progress, assignee=me)
- Resolved Today (status=resolved, today)
- Pending Conversations (mock count: 5)

**Step 4: Build ManagerDashboard**

6 StatCards + charts:
- Total Clients, Active Clients, Pending IB Approvals, Open Tickets, Team Members, Active Rules
- Client Lifecycle Distribution: Recharts PieChart showing client count per status
- Team Performance Overview: Two summary sections — Sales metrics (new clients, conversion rate, deposit amount, task completion rate) + Support metrics (ticket count, avg response time, resolution rate)

**Step 5: Build AdminDashboard**

4 StatCards:
- Total Users, Active Rules, Event Consumption Status (mock: "Healthy"), Dead Letter Queue (mock count: 3)

**Step 6: Verify**

```bash
npm run dev
```

Login as each role, verify correct dashboard renders with populated data.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add role-specific dashboard pages with stat cards and charts"
```

---

### Task 14: Client module

**Files:**
- Create: `src/pages/client/PublicPoolPage.tsx`, `src/pages/client/ClientsPage.tsx`, `src/pages/client/MyClientsPage.tsx`, `src/pages/client/ClientDetailPage.tsx`, `src/pages/client/components/ClientTable.tsx`, `src/pages/client/components/CreateClientDialog.tsx`, `src/pages/client/components/ImportClientDialog.tsx`

**Step 1: Build ClientTable component**

Shared DataTable configured for client data. Columns: Name (link to detail), Country, Language, Phone (masked), Email (masked), Status (StatusBadge), Balance, Assigned To, Tags, Created. Configure search on name, country. Filter on status, country, language.

**Step 2: Build PublicPoolPage**

- PageHeader: "Public Pool" + Create button + Import button
- ClientTable filtered to status=lead clients
- Row actions: Claim button (calls clientStore.claimClient)
- CreateClientDialog: Form with name, country, language, phone, email, tags
- ImportClientDialog: UI-only file upload area (no actual upload)

**Step 3: Build ClientsPage** (Support, Manager)

- PageHeader: "Clients"
- ClientTable filtered to status != lead
- Row actions: Edit (Manager only), View Detail
- Manager can edit all; Support sees masked contact info with "View Full" button

**Step 4: Build MyClientsPage** (Sales)

- PageHeader: "My Clients"
- ClientTable filtered to assignedTo = current user
- Row actions: Release button (calls clientStore.releaseClient), View Detail

**Step 5: Build ClientDetailPage**

- Route: `/client/:id`
- Top section: Client info card (all fields, masked as appropriate)
- Tabs:
  - Related Tasks: filtered task list from taskStore
  - Related Tickets: filtered ticket list from ticketStore
  - Communication Records: timeline of communication logs

**Step 6: Verify**

Test as Sales: see Public Pool, claim a client, check My Clients. Test as Manager: see Public Pool + Clients. Test as Support: see Clients with masked data.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add Client module (Public Pool, Clients, My Clients, Detail)"
```

---

### Task 15: Task module

**Files:**
- Create: `src/pages/task/MyTasksPage.tsx`, `src/pages/task/TaskPoolPage.tsx`, `src/pages/task/AllTasksPage.tsx`, `src/pages/task/components/TaskTable.tsx`, `src/pages/task/components/TaskDetailDrawer.tsx`, `src/pages/task/components/CreateTaskDialog.tsx`

**Step 1: Build TaskTable**

DataTable columns: Type (i18n label), Priority (PriorityTag), Status (StatusBadge), Client Name (link), Assignee, Due Date (formatted, red if overdue, countdown), Created. Search on client name. Filter on type, status, priority.

**Step 2: Build TaskDetailDrawer**

Sheet (side drawer) that opens when clicking a task row. Content:
- Basic info section: all task fields
- Communication Log: TimelineList of contact records
- Action buttons (bottom): varies by status
  - Pending: "Start" (→ in_progress)
  - In Progress: "Complete", "Failed", "No Response", "Return to Pool"
  - For Manager: "Assign" dropdown

**Step 3: Build page components**

- MyTasksPage: TaskTable filtered to assignedTo=me + TaskDetailDrawer
- TaskPoolPage: TaskTable filtered to unassigned + Claim button per row + TaskDetailDrawer
- AllTasksPage (Manager): TaskTable unfiltered + Create Task button + Assign action + CreateTaskDialog

**Step 4: Build CreateTaskDialog**

Form: Task Type (select), Priority (select), Client (select from clients), Assignee (optional, select from users), Due Date (date picker), Description (textarea).

**Step 5: Verify**

Test task operations: claim from pool, start task, mark complete, return to pool.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Task module (My Tasks, Task Pool, All Tasks, Detail drawer)"
```

---

### Task 16: Ticket module

**Files:**
- Create: `src/pages/ticket/MyTicketsPage.tsx`, `src/pages/ticket/AllTicketsPage.tsx`, `src/pages/ticket/components/TicketTable.tsx`, `src/pages/ticket/components/TicketDetailDrawer.tsx`, `src/pages/ticket/components/CreateTicketDialog.tsx`, `src/pages/ticket/components/EscalateDialog.tsx`

**Step 1: Build TicketTable**

Columns: Source (badge: CRM/Internal), Channel, Category, Priority (PriorityTag), Status (StatusBadge), Client, Assignee, Created. Filter on category, status, priority.

**Step 2: Build TicketDetailDrawer**

Sheet with: Ticket info + Processing History (TimelineList) + Action buttons:
- Open: "Start Processing" (→ in_progress)
- In Progress: "Resolve", "Escalate", "Close"
- On Hold: info text "Waiting for Manager"
- Resolved: "Close", "Reopen"
- Closed: "Reopen"

**Step 3: Build EscalateDialog**

Form per PRD: Escalation Type (radio: Submit to Manager / Forward to Sales), Priority (select), Reason (required textarea), Notes (optional textarea). On submit: updates ticket status to on_hold, adds escalation to history.

**Step 4: Build pages**

- MyTicketsPage: TicketTable filtered to assignedTo=me + TicketDetailDrawer
- AllTicketsPage (Manager): TicketTable unfiltered + Create + Assign + TicketDetailDrawer

**Step 5: Build CreateTicketDialog**

Form: Channel (select), Category (select), Priority (select), Client (select), Content (textarea).

**Step 6: Verify and commit**

```bash
git add -A
git commit -m "feat: add Ticket module (My Tickets, All Tickets, Detail, Escalation)"
```

---

### Task 17: IB Application module

**Files:**
- Create: `src/pages/ib/MyIBDealsPage.tsx`, `src/pages/ib/PendingApprovalPage.tsx`, `src/pages/ib/AllIBDealsPage.tsx`, `src/pages/ib/components/IBDealTable.tsx`, `src/pages/ib/components/IBDealDetailDrawer.tsx`, `src/pages/ib/components/CreateIBDealDialog.tsx`, `src/pages/ib/components/ApprovalDialog.tsx`

**Step 1: Build IBDealTable**

Columns: Client Name, Commission Rate, Commission Type, Monthly Target, Status (StatusBadge), Effective Date, Expiry Date, Created By, Created.

**Step 2: Build IBDealDetailDrawer**

Sheet with: Deal info section (all form fields displayed) + Approval History (TimelineList: created → submitted → approved/rejected, with actor and timestamps).

**Step 3: Build CreateIBDealDialog**

Form per PRD 2.4: Commission Rate (number), Commission Type (select: per_lot/percentage/fixed), Monthly Target (text), Effective Date (date), Expiry Date (date, optional), Extra Payment (number, optional), Payment Frequency (select, conditional on Extra Payment), Notes (textarea).

**Step 4: Build ApprovalDialog**

Two variants:
- Approve: Confirmation dialog with optional notes
- Reject: Reason (required textarea) + Suggestion (optional textarea)

**Step 5: Build pages**

- MyIBDealsPage (Sales): IBDealTable filtered to createdBy=me + Create button + Detail drawer. Rejected deals show "Edit & Resubmit" action.
- PendingApprovalPage (Manager): IBDealTable filtered to status=pending_approval + Approve/Reject buttons per row + Detail drawer
- AllIBDealsPage (Manager): IBDealTable unfiltered + Create button + Detail drawer

**Step 6: Verify and commit**

```bash
git add -A
git commit -m "feat: add IB Application module (My Deals, Pending Approval, All Deals)"
```

---

### Task 18: Communication Center

**Files:**
- Create: `src/pages/communication/CommunicationPage.tsx`, `src/pages/communication/components/ConversationList.tsx`, `src/pages/communication/components/ChatArea.tsx`, `src/pages/communication/components/ClientContextPanel.tsx`

**Step 1: Build three-column layout**

`CommunicationPage.tsx`: Flex layout, 3 columns:
- Left (280px, border-right): ConversationList
- Center (flex-1): ChatArea
- Right (320px, border-left): ClientContextPanel

**Step 2: Build ConversationList**

- Channel tabs at top: LiveChat, WhatsApp, Email, Phone (using shadcn Tabs)
- Scrollable list of conversations: Avatar, client name, last message preview (truncated), timestamp, unread badge
- Click to select → updates ChatArea and ClientContextPanel
- Use mock communication data

**Step 3: Build ChatArea**

- Header: Client name + channel icon
- Scrollable message area: Chat bubbles (sent = right/blue, received = left/gray), date dividers
- Bottom: Input area + Send button + Attachment button (decorative) + "Create Ticket" button
- Typing in input and clicking Send adds a mock message to the conversation (visual only)

**Step 4: Build ClientContextPanel**

- Client basic info card: name, status, country, balance
- Recent Tickets list (last 3)
- "View Full Client Details" button → navigates to ClientDetailPage

**Step 5: Verify**

Login as Support, go to Communication. See conversation list, click one, see chat history, see client context. Send a mock message.

**Step 6: Commit**

```bash
git add -A
git commit -m "feat: add Communication Center with 3-column chat layout"
```

---

### Task 19: Team & Group module

**Files:**
- Create: `src/pages/team/TeamMembersPage.tsx`, `src/pages/team/GroupsPage.tsx`, `src/pages/team/components/MemberTable.tsx`, `src/pages/team/components/GroupCard.tsx`, `src/pages/team/components/CreateGroupDialog.tsx`

**Step 1: Build TeamMembersPage**

DataTable showing all users. Columns: Name, Role (RoleBadge), Status (UserStatusDot + text), Languages, Regions, Task Load (progress bar: current tasks / max capacity), Skills (tag list). Manager can click to edit status or view details.

**Step 2: Build GroupsPage**

Grid of GroupCards. Each card: Group name, member count, description, member avatars (first 5). Actions: Edit, Delete. "Create Group" button at top.

**Step 3: Build CreateGroupDialog**

Form: Group Name (text), Description (textarea), Members (multi-select from user list with checkboxes).

**Step 4: Verify and commit**

```bash
git add -A
git commit -m "feat: add Team & Group module (members table, group cards)"
```

---

### Task 20: Automation module

**Files:**
- Create: `src/pages/automation/AutomationPage.tsx`, `src/pages/automation/components/RuleTable.tsx`, `src/pages/automation/components/RuleDetailDrawer.tsx`, `src/pages/automation/components/CreateRuleDialog.tsx`, `src/pages/automation/components/ConditionBuilder.tsx`

**Step 1: Build RuleTable**

Columns: Name, Enabled (Switch toggle), Trigger Type (badge: Event/Scheduled/Both), Conditions (summary text), Actions (summary text), Last Modified. Toggle calls automationStore.toggleRule.

**Step 2: Build RuleDetailDrawer**

Shows full rule details: trigger type, conditions tree (visual representation of AND/OR groups), action list, created by, timestamps.

**Step 3: Build ConditionBuilder** (for CreateRuleDialog)

Visual builder for condition groups:
- Add condition group (AND/OR selector between groups)
- Within group: add conditions (field selector + operator + value)
- Field types: Client Status, Country, Language, Task Type, Priority, Event, Time
- This can be simplified for demo — show the structure without full editing capability

**Step 4: Build CreateRuleDialog**

Form: Name, Trigger Type (select), Conditions (ConditionBuilder), Actions (checkboxes/selects for: assign to person, assign to group, create task, update status, notify manager, escalate).

**Step 5: Build AutomationPage**

For Manager: Full CRUD. For Admin: Read-only table (no toggle, no create/edit).

**Step 6: Verify and commit**

```bash
git add -A
git commit -m "feat: add Automation module with rule management and condition builder"
```

---

### Task 21: Performance module

**Files:**
- Create: `src/pages/performance/MyPerformancePage.tsx`, `src/pages/performance/TeamPerformancePage.tsx`, `src/pages/performance/components/MetricCard.tsx`, `src/pages/performance/components/LeaderboardTable.tsx`, `src/pages/performance/components/FunnelChart.tsx`, `src/pages/performance/components/DistributionChart.tsx`

**Step 1: Build MyPerformancePage** (Sales/Support)

- Time range selector: Week / Month / Quarter (shadcn Tabs or SegmentedControl)
- Sales view: MetricCards for new clients, registration conversion rate, deposit conversion rate, total deposit amount, avg client value, IB deals created, task completion rate. Trend line chart (Recharts LineChart) showing weekly/monthly trend.
- Support view: MetricCards for total tickets, pending tickets, avg resolution time, first response time, resolution rate, escalation rate. Trend line chart.

**Step 2: Build TeamPerformancePage** (Manager)

- Time range selector
- Sales Team section: Summary metrics + Individual leaderboard (table: rank, name, new clients, deposit amount, conversion rate, task completion rate)
- Support Team section: Summary metrics + Individual leaderboard (table: rank, name, tickets handled, resolution rate, avg response time)
- FunnelChart: Client lifecycle funnel (Lead → Registered → KYC Approved → Funded → Active) using Recharts
- DistributionChart: Ticket distribution by source and category (Recharts PieChart/BarChart)
- Group comparison section: Select groups, compare metrics side by side

**Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add Performance module with metrics, leaderboards, and charts"
```

---

### Task 22: User Management (Admin)

**Files:**
- Create: `src/pages/user/UserListPage.tsx`, `src/pages/user/components/UserTable.tsx`, `src/pages/user/components/CreateUserDialog.tsx`

**Step 1: Build UserListPage**

DataTable with columns: Name, Username, Email, Role (RoleBadge), Status (UserStatusDot), Languages (tags), Regions (tags), Max Tasks, Skills (tags). Actions per row: Edit, Disable/Enable, Reset Password.

**Step 2: Build CreateUserDialog**

Form per PRD 2.9: Name, Username, Password, Email, Role (select), Status (select), Languages (multi-select), Regions (multi-select), Max Task Capacity (number), Skills (multi-select from expert tags list).

On submit: adds user to mock data (visual only).

**Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add User Management page with CRUD dialogs"
```

---

### Task 23: Role, Settings, Monitoring (Admin pages)

**Files:**
- Create: `src/pages/role/RoleListPage.tsx`, `src/pages/settings/SystemSettingsPage.tsx`, `src/pages/monitoring/SystemMonitoringPage.tsx`

**Step 1: Build RoleListPage**

- 4 preset role cards: Sales, Support, Manager, Admin
- Each card shows: Role name, description, accessible modules list (from PRD 2.10)
- Permission matrix table: rows = modules, columns = operations, cells = checkmark/cross
- All read-only for preset roles
- "Custom Roles" section with placeholder text "Coming soon"

**Step 2: Build SystemSettingsPage**

Grouped form sections using shadcn Card:
- External System Integration: RabbitMQ (connection string input), CRM API (URL + API Key), MT5 API (URL + API Key)
- Communication Channels: LiveChat (API Key + Webhook URL), WhatsApp (Phone ID + Token), Email (SMTP host/port/user/pass + IMAP), Phone (Account + Token)
- Notification Channels: Telegram Bot (Bot Token + Chat ID), Teams (Webhook URL)

All fields pre-filled with placeholder values. Save button (shows success toast, no actual save).

**Step 3: Build SystemMonitoringPage**

- Event Consumption Status: 4-5 cards for different queues (client.registered, client.funded, ticket.created, etc.) each showing: queue name, consumption rate (e.g., "124/min"), backlog count, status indicator (green/red)
- Dead Letter Queue: DataTable with columns (Message ID, Queue, Error, Timestamp, Retry Count). Actions: Retry, Discard.
- Automation Execution Log: DataTable with columns (Rule Name, Trigger Event, Result badge (success/failed), Execution Time, Duration)

**Step 4: Verify and commit**

```bash
git add -A
git commit -m "feat: add Role, System Settings, and System Monitoring pages"
```

---

### Task 24: User Profile page

**Files:**
- Create: `src/pages/profile/UserProfilePage.tsx`

**Step 1: Build UserProfilePage**

Sections using shadcn Card:
- Personal Info: Avatar (placeholder circle with initials), Name (editable), Email (editable), Username (read-only), Role (read-only badge)
- Change Password: Current password, New password, Confirm password. Submit button.
- Language Preference: Dropdown (English / 中文), changes take effect immediately (calls authStore.switchLanguage)
- Notification Settings: Toggle switches per PRD 2.12 (Email notifications, System notifications, Task assignment, Ticket escalation, IB approval, Daily summary)

Save button at bottom (shows success toast).

**Step 2: Verify and commit**

```bash
git add -A
git commit -m "feat: add User Profile page with personal info and notification settings"
```

---

## Phase 5: Polish

### Task 25: Notification panel

**Files:**
- Create: `src/components/layout/NotificationPanel.tsx`
- Modify: `src/components/layout/Header.tsx`

**Step 1: Build NotificationPanel**

Popover (shadcn Popover) triggered by the notification bell in the Header. Content:
- Header: "Notifications" + "Mark all as read" link
- Scrollable list of notifications: icon (per type), title, description, timestamp, read/unread indicator
- Click notification: mark as read, optionally navigate to related page

**Step 2: Wire up in Header**

Replace placeholder bell icon with NotificationPanel trigger. Badge shows unreadCount from notificationStore.

**Step 3: Verify and commit**

```bash
git add -A
git commit -m "feat: add notification panel in header"
```

---

### Task 26: i18n completion for all module pages

**Files:**
- Create/Modify: `src/i18n/en/dashboard.json`, `src/i18n/en/client.json`, `src/i18n/en/task.json`, `src/i18n/en/ticket.json`, `src/i18n/en/ib.json`, `src/i18n/en/communication.json`, `src/i18n/en/team.json`, `src/i18n/en/automation.json`, `src/i18n/en/performance.json`, `src/i18n/en/user.json`, `src/i18n/en/settings.json`
- Create/Modify: `src/i18n/zh/` (same files, Chinese)
- Modify: `src/i18n/index.ts` (register new namespaces)

**Step 1: Create module-specific translation files**

For each module, create en and zh JSON files with all text used in that module's pages. This includes: page titles, table column headers, form labels, button text, placeholder text, status labels, error messages, empty state text.

**Step 2: Update i18n index**

Import and register all new translation namespaces in `src/i18n/index.ts`.

**Step 3: Update all page components**

Ensure all hardcoded strings in pages use `useTranslation(namespace)` with the `t()` function. Replace any remaining hardcoded Chinese or English text.

**Step 4: Verify**

Switch between English and Chinese on every page. Verify all text updates correctly.

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: complete i18n translations for all modules (EN + ZH)"
```

---

### Task 27: Final polish and visual QA

**Files:**
- Modify: Various component files for visual fixes

**Step 1: Visual QA pass**

Walk through every page as each role:
- Sales: Login → Dashboard → Public Pool (Claim) → My Clients (Release) → My Tasks → Task Pool (Claim) → My Tickets → My IB Deals (Create) → My Performance → Profile
- Support: Login → Dashboard → Clients → My Tasks → My Tickets → Communication Center → My Performance → Profile
- Manager: Login → Dashboard → Public Pool → Clients → All Tasks (Create) → All Tickets → Pending Approval (Approve/Reject) → All IB Deals → Communication → Team Members → Groups → Automation → Team Performance → Users → Profile
- Admin: Login → Dashboard → Automation (read-only) → Users → Roles → Settings → Monitoring → Profile

**Step 2: Fix visual issues**

Address any spacing, alignment, overflow, color, or layout issues found during QA.

**Step 3: Verify build**

```bash
npm run build
```

Ensure clean build with no TypeScript errors and no warnings.

**Step 4: Commit**

```bash
git add -A
git commit -m "fix: visual polish and QA fixes across all pages"
```

---

## Summary

| Phase | Tasks | Description |
|---|---|---|
| 1: Foundation | 1-8 | Scaffold, shadcn/ui, types, i18n, permissions, mock data, stores, hooks |
| 2: App Shell | 9-11 | Login page, layout (sidebar + header), routing |
| 3: Shared Components | 12 | DataTable, StatusBadge, StatCard, Timeline, etc. |
| 4: Module Pages | 13-24 | All 15 modules built out with full UI and interactions |
| 5: Polish | 25-27 | Notifications, i18n completion, visual QA |

**Total: 27 tasks**

Dependencies:
- Tasks 1-8 are sequential (each builds on prior)
- Tasks 9-11 depend on Phase 1
- Task 12 depends on Phase 2
- Tasks 13-24 depend on Task 12 but are **parallelizable** (each module is independent)
- Tasks 25-27 depend on all Phase 4 tasks
