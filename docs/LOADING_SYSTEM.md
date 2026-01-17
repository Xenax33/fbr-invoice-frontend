# Global Loading State System

A beautiful, centralized loading management system with animated typing indicator that matches your UI/UX.

## 🎨 Features

- **Beautiful Animated Loader**: Typing indicator with gradient colors matching your blue/indigo theme
- **Global State Management**: Control loading from anywhere in the app
- **Customizable Messages**: Show context-specific loading messages
- **Auto-managed with React Query**: Optional hooks for automatic loading state
- **Backdrop Blur**: Professional glassmorphism effect
- **TypeScript Support**: Full type safety

## 📦 What's Included

### 1. LoadingContext (`contexts/LoadingContext.tsx`)
Global state management for loading status

### 2. GlobalLoader (`components/GlobalLoader.tsx`)
Beautiful animated loader component with typing indicator

### 3. Helper Hooks (`hooks/useLoadingState.ts`)
- `useLoadingMutation()` - Auto-manage loading for mutations
- `useLoadingQuery()` - Auto-manage loading for queries
- `useManualLoading()` - Manual control

### 4. Integration
- Wrapped in root layout
- Available throughout the app

## 🚀 Usage

### Method 1: Manual Control (Most Common)

```tsx
import { useLoading } from '@/contexts/LoadingContext';

function MyComponent() {
  const { showLoading, hideLoading } = useLoading();

  const handleAction = async () => {
    showLoading('Processing...');
    try {
      await someAsyncOperation();
      hideLoading();
      toast.success('Success!');
    } catch (error) {
      hideLoading();
      toast.error('Failed!');
    }
  };

  return <button onClick={handleAction}>Do Something</button>;
}
```

### Method 2: Auto-manage with Mutations

```tsx
import { useLoadingMutation } from '@/hooks/useLoadingState';
import { useCreateInvoice } from '@/hooks/useInvoices';

function InvoiceForm() {
  const createInvoice = useCreateInvoice();
  
  // Automatically shows/hides loader
  useLoadingMutation(createInvoice, 'Creating invoice...');

  const handleSubmit = async (data) => {
    await createInvoice.mutateAsync(data);
  };

  return <form onSubmit={handleSubmit}>...</form>;
}
```

### Method 3: Simple Manual Control

```tsx
import { useManualLoading } from '@/hooks/useLoadingState';

function ImportPage() {
  const loading = useManualLoading();

  const handleImport = async () => {
    loading.show('Importing data...');
    await importData();
    loading.hide();
  };

  return <button onClick={handleImport}>Import</button>;
}
```

## 🎯 Real-World Examples

### Login Page (Already Implemented)
```tsx
const { showLoading, hideLoading } = useLoading();

const handleLogin = async (email, password) => {
  showLoading('Signing you in...');
  try {
    await login(email, password);
    // Redirect happens, no need to hide
  } catch (error) {
    hideLoading();
  }
};
```

### Transaction Types Sync
```tsx
const { showLoading, hideLoading } = useLoading();

const handleSync = async () => {
  showLoading('Syncing from FBR...');
  try {
    const result = await syncTransactionTypes.mutateAsync({
      isTestEnvironment: true,
    });
    hideLoading();
    toast.success(result.message);
  } catch (error) {
    hideLoading();
    toast.error('Sync failed');
  }
};
```

### Invoice Creation
```tsx
const { showLoading, hideLoading } = useLoading();

const handleCreate = async (formData) => {
  showLoading('Submitting to FBR...');
  try {
    await createInvoice.mutateAsync(formData);
    hideLoading();
    toast.success('Invoice created!');
    closeModal();
  } catch (error) {
    hideLoading();
    toast.error('Failed to create invoice');
  }
};
```

### Bulk Operations
```tsx
const { showLoading } = useLoading();

const handleBulkDelete = async (ids) => {
  for (let i = 0; i < ids.length; i++) {
    showLoading(`Deleting ${i + 1} of ${ids.length}...`);
    await deleteItem(ids[i]);
  }
  hideLoading();
};
```

## 🎨 Customization

### Change Loader Colors
Edit `components/GlobalLoader.tsx`:

```tsx
// Current: Blue/Indigo gradient
background: linear-gradient(135deg, #3b82f6 0%, #6366f1 100%);

// Change to your colors:
background: linear-gradient(135deg, #yourColor1 0%, #yourColor2 100%);
```

### Change Loading Message Style
```tsx
<p className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
  {loadingMessage}
</p>
```

### Adjust Animation Speed
```css
animation: typing-circle7124 0.5s alternate infinite ease;
/* Change 0.5s to your preferred speed */
```

## 📍 Where to Use

### ✅ Use Global Loader For:
- Login/Logout operations
- Creating/Updating/Deleting records
- Syncing from external APIs
- Bulk operations
- File uploads
- Long-running processes

### ❌ Don't Use For:
- Initial page loads (use skeleton screens)
- Quick searches (< 500ms)
- Background data refreshes
- Inline validations

## 🔧 Best Practices

1. **Always hide the loader**
   ```tsx
   try {
     showLoading();
     await operation();
     hideLoading(); // ✅
   } catch (error) {
     hideLoading(); // ✅ Don't forget in catch!
   }
   ```

2. **Use descriptive messages**
   ```tsx
   showLoading('Creating invoice...'); // ✅ Good
   showLoading('Loading...'); // ⚠️ Generic
   ```

3. **Don't nest loaders**
   ```tsx
   showLoading('Step 1...');
   await step1();
   showLoading('Step 2...'); // ✅ Update message
   await step2();
   hideLoading();
   ```

4. **Timeout safety** (optional)
   ```tsx
   const timeout = setTimeout(() => hideLoading(), 30000);
   try {
     showLoading();
     await operation();
   } finally {
     clearTimeout(timeout);
     hideLoading();
   }
   ```

## 🐛 Troubleshooting

### Loader stays visible
- Make sure you call `hideLoading()` in both success and error cases
- Check for early returns that skip `hideLoading()`

### Loader doesn't show
- Verify LoadingProvider is in your layout
- Check that GlobalLoader is rendered in layout
- Ensure you're calling `showLoading()` before the async operation

### Multiple loaders
- The global loader is a singleton - only one shows at a time
- Latest message overwrites previous ones
- This is by design for simplicity

## 📚 API Reference

### `useLoading()`
```tsx
const { isLoading, loadingMessage, showLoading, hideLoading } = useLoading();
```
- `isLoading`: boolean - Current loading state
- `loadingMessage`: string - Current message
- `showLoading(message?)`: function - Show loader with optional message
- `hideLoading()`: function - Hide loader

### `useLoadingMutation(mutation, message?)`
Auto-manages loading for React Query mutations
- `mutation`: UseMutationResult - React Query mutation
- `message`: string - Loading message (optional)

### `useLoadingQuery(query, message?)`
Auto-manages loading for React Query queries
- `query`: UseQueryResult - React Query query
- `message`: string - Loading message (optional)

### `useManualLoading()`
```tsx
const loading = useManualLoading();
loading.show('Message...');
loading.hide();
```

## 🎉 That's It!

Your global loading system is ready to use. Just import `useLoading()` wherever you need it!
