# User Management System

A modern, extensible React-based CRUD application built with Next.js 14, TypeScript, and a schema-driven architecture that allows adding new fields with minimal code changes.

## 🚀 Features

- **Full CRUD Operations**: Create, Read, Update, and Delete users
- **Schema-Driven Architecture**: Add new fields by updating a single configuration file
- **Real-time Validation**: Zod-powered form validation with user-friendly error messages
- **Responsive Design**: Beautiful UI that works seamlessly on desktop and mobile
- **Premium UI/UX**: Gradient designs, smooth animations, and modern aesthetics
- **Toast Notifications**: Real-time feedback for all user actions
- **Confirmation Dialogs**: Safe deletion with confirmation prompts
- **Type-Safe**: Full TypeScript implementation for reliability

## 🛠️ Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Form Handling**: React Hook Form + Zod validation
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **API Client**: Axios
- **Mock API**: JSON Server

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd task
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Start the development server**
   ```bash
   npm run dev
   ```

   This will start both the Next.js dev server (port 3000) and JSON Server (port 3001).

5. **Open your browser**
   ```
   http://localhost:3000
   ```

## 📝 Available Scripts

- `npm run dev` - Start development server with JSON Server
- `npm run server` - Start JSON Server only
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

## 🎯 How to Add New Fields

This application is designed for easy extensibility. To add a new field (e.g., "Date of Birth"):

### Step 1: Update the Schema Configuration

Edit `src/lib/schema.ts`:

```typescript
// Add to the Zod schema
export const userSchema = z.object({
  firstName: z.string().min(2).max(50),
  lastName: z.string().min(2).max(50),
  phone: z.string().min(10).max(15),
  email: z.string().email(),
  // Add your new field here
  dateOfBirth: z.string().optional(),
});

// Add to the field configuration
export const userFieldsConfig: FieldConfig[] = [
  // ... existing fields
  {
    name: 'dateOfBirth',
    label: 'Date of Birth',
    type: 'date',
    placeholder: 'Select date',
    required: false,
  },
];
```

### Step 2: Update TypeScript Types

Edit `src/types/user.ts`:

```typescript
export interface User {
  id: string;
  firstName: string;
  lastName: string;
  phone: string;
  email: string;
  dateOfBirth?: string; // Add new field
}
```

### Step 3: Update Mock Database (Optional)

Edit `server/db.json` to add the field to existing users:

```json
{
  "users": [
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "phone": "+1 (555) 123-4567",
      "email": "john.doe@example.com",
      "dateOfBirth": "1990-01-15"
    }
  ]
}
```

**That's it!** The form, table, and all CRUD operations will automatically support the new field. No UI component changes required.

## 🏗️ Project Structure

```
task/
├── src/
│   ├── app/                    # Next.js app router
│   │   ├── layout.tsx         # Root layout with providers
│   │   ├── page.tsx           # Main application page
│   │   └── globals.css        # Global styles
│   ├── components/
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── label.tsx
│   │   │   ├── dialog.tsx
│   │   │   └── toast.tsx
│   │   ├── UserForm.tsx       # Dynamic form component
│   │   ├── UserTable.tsx      # Responsive table/list
│   │   └── DeleteConfirmDialog.tsx
│   ├── lib/
│   │   ├── api.ts             # API client
│   │   ├── schema.ts          # Field schema & validation
│   │   └── utils.ts           # Utilities
│   └── types/
│       └── user.ts            # TypeScript types
├── server/
│   └── db.json                # JSON Server database
├── .env.local                 # Environment variables
└── package.json
```

## 🎨 Design Features

- **Gradient Backgrounds**: Modern blue-to-purple gradients
- **Glassmorphism**: Subtle backdrop blur effects
- **Smooth Animations**: Framer Motion powered transitions
- **Responsive Layout**: Mobile-first design approach
- **Premium Typography**: Inter font family
- **Micro-interactions**: Hover states and button animations

## 🔧 API Endpoints

The JSON Server provides the following REST API endpoints:

- `GET /users` - Get all users
- `GET /users/:id` - Get user by ID
- `POST /users` - Create new user
- `PUT /users/:id` - Update user
- `DELETE /users/:id` - Delete user

## 🚀 Deployment

### Deploy to Vercel

1. **Push your code to GitHub**

2. **Import to Vercel**
   - Go to [vercel.com](https://vercel.com)
   - Click "Import Project"
   - Select your repository

3. **Configure Environment Variables**
   - Add `NEXT_PUBLIC_API_URL` with your production API URL

4. **Deploy**
   - Vercel will automatically build and deploy

**Note**: For production, replace JSON Server with a real backend API (e.g., Node.js + Express, NestJS, or a cloud service like Supabase).

## 📄 License

MIT

## 👨‍💻 Author

**Tushar Deomare**
- Email: tdeomare1@gmail.com
- LinkedIn: [linkedin.com/in/tushar-deomare-04a34819b](https://linkedin.com/in/tushar-deomare-04a34819b)
- Portfolio: [tushar-deomare-portfolio.vercel.app](https://tushar-deomare-portfolio.vercel.app)

---

Built with ❤️ using Next.js 14 and TypeScript
