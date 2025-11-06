# Auth Feature Module

This module contains all authentication-related functionality.

## Structure

```
auth/
├── components/         # UI components
│   ├── LoginForm.tsx
│   ├── LoginHeader.tsx
│   └── useDevelopmentMode.tsx
├── schemas/           # Validation schemas
│   └── login.schema.ts
├── services/          # API services
│   └── index.ts
├── hooks/             # Custom hooks (empty)
│   └── index.ts
└── types/             # Type definitions (empty)
    └── index.ts
```

## Components

### LoginForm
Main login form with validation and error handling.

**Props:**
- `onSuccess?: () => void` - Callback on successful login
- `onError?: (error: string) => void` - Callback on error

**Features:**
- Email/username input with validation
- Password input with show/hide toggle
- Remember me checkbox
- Forgot password link
- Real-time validation
- Loading states

### LoginHeader
Header component with logo and title.

**Props:**
- `isDevelopment?: boolean` - Shows DEV badge if true

### useDevelopmentMode
Hook to enable development mode toggle.

**Usage:**
```typescript
const form = useForm();
useDevelopmentMode({
  getValues: form.getValues,
  setValue: form.setValue,
  fieldName: "isDevelopment" // optional
});
```

## Schemas

### loginSchema
Zod schema for login form validation.

**Fields:**
- `email`: string (email format or min 3 chars)
- `password`: string (min 6 chars)
- `savePassword`: boolean (optional)
- `isDevelopment`: boolean (optional)

## Services

### login(data, configs?)
POST request to `/login` endpoint.

**Parameters:**
- `data: { email: string; password: string }`
- `configs?: AxiosRequestConfig`

**Returns:** `Promise<LoginResponse>`

### logout(config?)
POST request to `/logout` endpoint.

### forgot(email)
POST request to `/forgot` endpoint for password reset.

### reset(payload)
POST request to `/reset` endpoint with OTP and new password.

### getUserByEmail(email)
GET request to find user by email.

## Types

### LoginResponse
```typescript
interface LoginResponse {
  user_id: number;
  access_token: string;
  role: {
    id: number;
    name: string;
    newRolePermissions: any[];
  };
  email: string | null;
  username: string;
}
```

## Usage Example

```typescript
import { LoginForm, LoginHeader } from "features/auth/components";
import { loginSchema } from "features/auth/schemas";
import { login } from "features/auth/services";

function LoginPage() {
  return (
    <>
      <LoginHeader isDevelopment={false} />
      <LoginForm 
        onSuccess={() => router.push("/dashboard")}
        onError={(err) => toast.error(err)}
      />
    </>
  );
}
```

