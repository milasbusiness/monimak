# Monimak - Creator Subscription Platform MVP

A modern, premium creator subscription platform built with Next.js 14, TypeScript, Tailwind CSS, and shadcn/ui. This MVP features a sleek dark theme with gradient accents, smooth animations, and a complete UI for both creators and fans.

## ✨ Features

### For Fans
- 🏠 **Home Feed** - Browse posts from subscribed creators
- 🔍 **Discover** - Find and subscribe to new creators
- 💬 **Direct Messaging** - Chat with your favorite creators
- 📚 **Library** - Manage subscriptions and saved posts
- ⚙️ **Settings** - Customize your profile and preferences

### For Creators (Admin)
- 📊 **Dashboard** - View stats, revenue, and recent activity
- 📸 **Upload** - Create and publish new posts (image/video)
- 💬 **Message Management** - Quick reply templates and auto-responses
- 🔐 **Content Gating** - Set posts as public or subscribers-only

### UI/UX Highlights
- 🎨 Dark-first theme with neon/pink/purple gradient accents
- ✨ Smooth micro-interactions and hover effects
- 📱 Fully responsive (mobile-first design)
- 🔒 Locked content with beautiful paywall overlays
- 💎 Premium glass-morphism effects
- 🎭 Skeleton loading states
- 🎯 Empty state illustrations

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **UI Components:** shadcn/ui
- **Icons:** Lucide React
- **Animations:** Framer Motion
- **State Management:** Zustand (with localStorage persistence)
- **Data:** Mock data (no backend required)

## 📦 Installation

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd monimak
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🎮 Usage

### Getting Started

1. **Landing Page** - Visit `/` to see the hero section and features
2. **Sign Up** - Click "Get Started Free" or visit `/register`
3. **Login** - Use any email/password (demo mode) at `/login`
4. **Explore** - Browse the home feed, discover creators, and explore features

### Switching Between User and Admin Modes

The app supports both user and creator (admin) roles. To switch between them:

1. **Via Settings Page:**
   - Go to Settings (`/settings`)
   - Scroll to the "Developer Mode" section
   - Click "Switch to Admin" or "Switch to User"
   - You'll be redirected to the appropriate dashboard

2. **During Login:**
   - The role is set automatically to "user" by default
   - Admins get redirected to `/admin` instead of `/home`

### Key Pages

#### User Mode
- `/home` - Your personalized feed
- `/discover` - Browse all creators
- `/creator/[id]` - Creator profile pages
- `/chat` - Direct messaging
- `/library` - Subscriptions and saved posts
- `/settings` - Account settings

#### Admin Mode
- `/admin` - Creator dashboard with stats
- `/admin/upload` - Create new posts
- `/admin/messages` - Quick reply templates

## 🎨 Design Features

### Color Palette
- **Primary:** Pink to Purple gradients
- **Background:** Deep blacks and grays
- **Accents:** Neon pink (#ec4899), Purple (#a855f7), Indigo (#6366f1)

### Key UI Components
- **PostCard** - Media posts with like/comment/save actions
- **CreatorCard** - Creator profile cards with subscribe CTAs
- **MediaLightbox** - Full-screen media viewer
- **SubscribeCTA** - Premium subscription call-to-action
- **AppShell** - Responsive navigation (sidebar + bottom nav)

### Animations
- Smooth page transitions
- Hover scale effects on cards
- Gradient button glows
- Loading skeletons
- Micro-interactions throughout

## 🔐 Mock Features

Since this is an MVP without a real backend:

- **Authentication:** Any email/password combination works
- **Subscriptions:** Toggle on/off instantly (stored in localStorage)
- **Posts:** New posts are added to the mock data store
- **Messages:** Conversations are simulated with mock data
- **Payments:** Subscribe buttons are UI-only (no real transactions)
- **File Upload:** Uses URLs instead of actual file uploads

## 📱 Responsive Design

- **Mobile** (< 1024px): Bottom navigation, collapsible sidebar
- **Desktop** (≥ 1024px): Fixed sidebar navigation
- **Tablet**: Optimized layouts with flexible grids

## 🛠️ Project Structure

```
monimak/
├── app/
│   ├── (app)/           # Authenticated routes
│   │   ├── home/        # User feed
│   │   ├── discover/    # Browse creators
│   │   ├── creator/[id] # Creator profile
│   │   ├── chat/        # Messaging
│   │   ├── library/     # Saved content
│   │   ├── settings/    # User settings
│   │   └── admin/       # Admin dashboard
│   │       ├── upload/  # Create posts
│   │       └── messages/ # Templates
│   ├── (auth)/          # Auth routes
│   │   ├── login/
│   │   └── register/
│   ├── page.tsx         # Landing page
│   ├── layout.tsx       # Root layout
│   └── globals.css      # Global styles
├── components/
│   ├── ui/              # shadcn/ui components
│   ├── app-shell.tsx    # Navigation shell
│   ├── post-card.tsx    # Post component
│   ├── creator-card.tsx # Creator component
│   └── ...              # Other components
├── lib/
│   ├── mock/
│   │   └── data.ts      # Mock data
│   ├── store.ts         # Zustand store
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Utility functions
└── public/              # Static assets
```

## 🎯 Future Enhancements

This MVP can be extended with:
- Real authentication (NextAuth, Supabase, etc.)
- Database integration (PostgreSQL, MongoDB)
- File upload (AWS S3, Cloudinary)
- Payment processing (Stripe)
- Real-time messaging (WebSockets)
- Video streaming
- Push notifications
- Analytics dashboard
- SEO optimization
- PWA features

## 🤝 Contributing

This is an MVP/demo project. Feel free to fork and extend it for your own use!

## 📄 License

MIT License - feel free to use this project for learning and development.

## 🎉 Credits

Built with ❤️ using:
- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [shadcn/ui](https://ui.shadcn.com/)
- [Framer Motion](https://www.framer.com/motion/)
- [Lucide Icons](https://lucide.dev/)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

**Note:** This is a frontend MVP with mock data. No real user data is stored or transmitted. Perfect for demos, prototypes, and learning!
