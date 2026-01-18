# Bulk Assignment & Admin Scenario Management Implementation

## Overview
This document outlines the implementation of the new admin scenario management system, including bulk assignment capabilities and global scenario management.

## Features Implemented

### 1. Global Scenario Management
- **Admin-only** global scenario catalog
- Create, read, update, and delete (CRUD) operations for global scenarios
- Scenarios are created at the admin level and assigned to users
- Protection: Cannot delete scenarios that are assigned to any user

### 2. Scenario Assignment System
- Assign individual scenarios to users
- **Bulk assign** multiple scenarios to a user in one operation
- Unassign scenarios from users
- View all scenarios assigned to a specific user
- Protection: Cannot unassign scenarios that are used in invoices

### 3. User Interface Components

#### Admin Navigation
Added two new sections to admin panel:
- **Global Scenarios** - Manage the global scenario catalog
- **Scenario Assignments** - Assign scenarios to users

#### Global Scenarios Page (`/admin/scenarios`)
- List all global scenarios with search functionality
- Create new global scenarios with code and description
- Edit existing scenarios
- Delete scenarios (with validation)
- Clean, card-based UI with icons and visual hierarchy

#### Scenario Assignments Page (`/admin/scenario-assignments`)
- Two-panel layout:
  - **Left Panel**: User list with search
  - **Right Panel**: Scenario assignment interface
- Shows assigned scenarios for selected user
- Shows available scenarios with multi-select checkboxes
- **Bulk assign** button appears when scenarios are selected
- Unassign individual scenarios
- Real-time updates using React Query

## Technical Implementation

### Type Definitions (`types/api.ts`)

```typescript
// Global Scenario Types
interface GlobalScenario {
  id: string;
  scenarioCode: string;
  scenarioDescription: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateGlobalScenarioRequest {
  scenarioCode: string;
  scenarioDescription: string;
}

interface UpdateGlobalScenarioRequest {
  scenarioCode?: string;
  scenarioDescription?: string;
}

// Assignment Types
interface AssignScenarioRequest {
  userId: string;
  scenarioId: string;
}

interface BulkAssignScenarioRequest {
  userId: string;
  scenarioIds?: string[];
  scenarioCodes?: string[];
}

interface UnassignScenarioRequest {
  userId: string;
  scenarioId: string;
}

interface UserScenarioAssignment {
  id: string;
  userId: string;
  scenarioId: string;
  scenario?: GlobalScenario;
  user?: User;
  createdAt: string;
}
```

### Service Layer (`services/adminScenario.service.ts`)

All admin scenario operations:
- `createGlobalScenario()` - Create global scenario
- `getGlobalScenarios()` - List all global scenarios
- `getGlobalScenarioById()` - Get single scenario
- `updateGlobalScenario()` - Update scenario
- `deleteGlobalScenario()` - Delete scenario
- `assignScenarioToUser()` - Assign single scenario
- `bulkAssignScenarios()` - Assign multiple scenarios
- `unassignScenarioFromUser()` - Unassign scenario
- `getUserAssignments()` - Get user's assigned scenarios

### React Query Hooks (`hooks/useAdminScenarios.ts`)

Custom hooks for data fetching and mutations:
- `useGlobalScenarios()` - Fetch all global scenarios (30-min cache)
- `useCreateGlobalScenario()` - Create scenario mutation
- `useUpdateGlobalScenario()` - Update scenario mutation
- `useDeleteGlobalScenario()` - Delete scenario mutation
- `useAssignScenario()` - Assign scenario mutation
- `useBulkAssignScenarios()` - Bulk assign mutation
- `useUnassignScenario()` - Unassign scenario mutation
- `useUserScenarioAssignments()` - Fetch user assignments (5-min cache)

All mutations include:
- Global loading indicators
- Toast notifications
- Automatic cache invalidation
- Error handling

## API Endpoints Used

### Global Scenario Management
- `POST /admin/scenarios/global` - Create global scenario
- `GET /admin/scenarios/global` - List all global scenarios
- `PATCH /admin/scenarios/global/:id` - Update global scenario
- `DELETE /admin/scenarios/global/:id` - Delete global scenario

### Scenario Assignment
- `POST /admin/scenarios/assign` - Assign single scenario
- `POST /admin/scenarios/assign/bulk` - Bulk assign scenarios
- `DELETE /admin/scenarios/assign` - Unassign scenario
- `GET /admin/scenarios/users/:userId` - Get user assignments

## Bulk Assignment Feature

The bulk assignment feature allows admins to assign multiple scenarios to a user simultaneously:

### API Request Options

1. **Using Scenario IDs**:
```json
{
  "userId": "<UUID>",
  "scenarioIds": ["<UUID1>", "<UUID2>", "<UUID3>"]
}
```

2. **Using Scenario Codes**:
```json
{
  "userId": "<UUID>",
  "scenarioCodes": ["SN001", "SN002", "SN003"]
}
```

### UI Workflow
1. Admin selects a user from the user list
2. System loads user's current scenario assignments
3. Admin selects multiple scenarios from available list using checkboxes
4. "Assign (N)" button appears showing count of selected scenarios
5. Click button to bulk assign all selected scenarios
6. System updates immediately with loading indicator
7. Success/error notification shown
8. Lists refresh automatically

## Data Flow

```
Admin Action → Hook Mutation → Service → API
                     ↓
              Loading Indicator
                     ↓
            Success/Error Toast
                     ↓
           Query Cache Invalidation
                     ↓
              UI Auto-Refresh
```

## Validation & Protection

### Delete Global Scenario
- Blocked if scenario is assigned to any user
- Error message: "Cannot delete scenario that is assigned to users"

### Unassign Scenario
- Blocked if scenario is used in any invoices
- Error message: "Cannot unassign scenario that is used in invoices"

## Files Created/Modified

### Created Files
1. `services/adminScenario.service.ts` - Admin scenario service
2. `hooks/useAdminScenarios.ts` - React Query hooks
3. `app/admin/scenarios/page.tsx` - Global scenarios management page
4. `app/admin/scenario-assignments/page.tsx` - Scenario assignment page

### Modified Files
1. `types/api.ts` - Added GlobalScenario and assignment types
2. `components/layouts/AdminLayout.tsx` - Added navigation items

## User Experience Features

### Search Functionality
- Global scenarios: Search by code or description
- Users: Search by name, email, or business name

### Visual Feedback
- Loading spinners during data fetch
- Global loading indicator for mutations
- Success/error toast notifications
- Highlighted selected user
- Disabled buttons during operations

### Responsive Design
- Works on mobile, tablet, and desktop
- Scrollable lists for long data sets
- Modal dialogs for create/edit operations

### Accessibility
- Proper semantic HTML
- ARIA labels where needed
- Keyboard navigation support
- Clear visual states (hover, active, disabled)

## Integration with Existing System

### User Scenarios
- Users see only their assigned scenarios in `/dashboard/scenarios`
- Users can only create invoices using assigned scenarios
- User scenarios page explains saleType relationship

### Invoice Creation
- Invoice creation uses scenario for entire invoice
- Scenario provides `saleType` for FBR submission
- No per-item scenario selection (simplified)

## Performance Optimizations

### React Query Caching
- Global scenarios: 30-minute stale time
- User assignments: 5-minute stale time
- Automatic background refetch
- Cache invalidation on mutations

### Loading States
- Global loading context for mutations
- Per-query loading states for fetches
- Optimistic updates where possible

## Future Enhancements

Potential improvements for consideration:
1. Scenario usage statistics (how many users, invoices)
2. Batch user operations (assign scenario to multiple users)
3. Scenario categories or tags
4. Export/import scenarios
5. Audit log for assignments
6. Scenario templates

## Testing Checklist

- ✅ Create global scenario
- ✅ Edit global scenario
- ✅ Delete global scenario (success case)
- ✅ Delete global scenario (blocked when assigned)
- ✅ Assign single scenario to user
- ✅ Bulk assign multiple scenarios
- ✅ Unassign scenario (success case)
- ✅ Unassign scenario (blocked when used in invoices)
- ✅ Search scenarios
- ✅ Search users
- ✅ View user assignments
- ✅ Navigation between admin pages
- ✅ Toast notifications
- ✅ Loading indicators
- ✅ Error handling
- ✅ TypeScript compilation
- ✅ Responsive design

## Summary

The bulk assignment feature and admin scenario management system is now fully implemented and ready for use. Admins can:

1. Manage a global catalog of scenarios
2. Assign scenarios to users individually or in bulk
3. View and manage user assignments
4. All operations protected with appropriate validation
5. Clean, intuitive UI with real-time updates
6. Full error handling and user feedback

The system integrates seamlessly with the existing invoice management workflow, where users create invoices using their assigned scenarios.
