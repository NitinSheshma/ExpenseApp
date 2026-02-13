# Expense Feature - Client Implementation

## Overview
React components and pages for Expense Management feature with intuitive UI for creating, tracking, and settling expenses.

## Components Created

### 1. AddExpenseModal (`src/components/AddExpenseModal.jsx`)
**Purpose**: Modal form for creating new expenses

**Features**:
- Title and description input fields
- Amount input with currency support
- Payer selection dropdown
- Two split modes: Equal and Custom
- Member inclusion/exclusion checkboxes
- Auto-calculation for equal splits
- Real-time validation with error messages
- Loading states during submission

**Props**:
- `show`: Boolean to control visibility
- `onHide`: Callback when modal closes
- `groupId`: ID of the group
- `groupMembers`: Array of member emails
- `onSuccess`: Callback with created expense data

**State Management**:
- Form data (title, amount, splitType, etc.)
- Splits array with member details
- Validation errors
- Loading state

### 2. ExpenseCard (`src/components/ExpenseCard.jsx`)
**Purpose**: Display individual expense details

**Features**:
- Shows expense title and amount prominently
- Displays payer name and creation date
- Expandable section for split details
- Delete functionality with confirmation
- Consistent styling with existing cards
- Responsive design

**Props**:
- `expense`: Expense object with all details
- `onDelete`: Callback when expense is deleted

**State Management**:
- Show/hide split details
- Loading state during deletion

### 3. SettlementSummary (`src/components/SettlementSummary.jsx`)
**Purpose**: Display settlement calculations and allow group settlement

**Features**:
- Fetch and display settlement summary
- Table showing member balances
- Visual badges for "Owes" vs "Gets Back"
- Settle group button (admin only)
- Real-time updates
- Shows settled status clearly
- Loading states

**Props**:
- `groupId`: ID of the group
- `group`: Group object with admin and payment status
- `onGroupSettle`: Callback when group is settled

**State Management**:
- Settlement data (array of member balances)
- Loading and settling states

## Pages

### GroupExpenses (`src/pages/GroupExpenses.jsx`)
**Purpose**: Main page for managing group expenses

**Features**:
- Breadcrumb navigation
- Display group details and members
- SettlementSummary integration
- Expenses list with AddExpenseModal button
- ExpenseCard component for each expense
- Empty state handling
- Loading state handling
- Real-time updates on expense operations

**Data Management**:
- Fetch group details from /groups/my-groups
- Fetch expenses from /expenses/group/:groupId
- Update state on expense creation/deletion
- Integration with SettlementSummary updates

## Styling

### Custom CSS (`src/styles/custom.css`)
- Hover effects for cards
- Slide-up animation for modals
- Smooth transitions throughout
- Focus states for accessibility
- Spinner animations
- Badge styling

## Integration Points

### Redux
- Uses `useSelector` to get current user
- Leverages user email for operations
- Maintains consistency with auth state

### Axios
- All API calls use axios with credentials
- Proper error handling and user feedback
- Loading states during async operations

### React Patterns
- Functional components with hooks
- useState for local state
- useEffect for side effects
- Props drilling for component communication
- Callback functions for parent updates

## User Flows

### Adding Expense
1. User clicks "Add Expense" button
2. Modal opens with form
3. Fill form fields
4. Select split type (equal/custom)
5. Configure split amounts
6. Click "Add Expense"
7. Expense appears in list
8. Settlement updates

### Viewing Settlement
1. User views SettlementSummary component
2. Clicks "Update" to fetch latest settlement
3. Sees member balances in table
4. Admin sees "Settle Group" button

### Settling Group
1. Group admin visits group
2. Reviews settlement summary
3. Clicks "Settle Group"
4. Confirms action
5. Group marked as settled
6. Cannot add more expenses

## Error Handling

- Form validation prevents invalid submissions
- API errors display user-friendly messages
- Network errors handled gracefully
- Confirmation dialogs for destructive actions

## Performance Optimizations

- Minimal re-renders using proper dependencies
- Efficient state updates
- Lazy loading of settlement data
- Optimized list rendering with keys

## Accessibility

- Semantic HTML
- ARIA labels where needed
- Focus management
- Keyboard navigation support
- Color contrast compliance

## Testing Considerations

- Components can be tested in isolation
- Mock APIs for unit testing
- Integration tests for full flows
- E2E tests for user scenarios
