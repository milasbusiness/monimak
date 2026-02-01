# 🚀 Quick Start Guide

## Installation & Setup

### 1. Install Dependencies

```bash
npm install
```

This will install all required packages including:
- Next.js 14
- React 18
- TypeScript
- Tailwind CSS
- Framer Motion
- Zustand
- Lucide Icons
- shadcn/ui dependencies

### 2. Run Development Server

```bash
npm run dev
```

The app will be available at [http://localhost:3000](http://localhost:3000)

### 3. Build for Production (Optional)

```bash
npm run build
npm start
```

## 🎮 Demo Walkthrough

### As a User (Fan)

1. **Visit Landing Page** → [http://localhost:3000](http://localhost:3000)
   - See the hero section, features, and creator highlights
   
2. **Register/Login** → Click "Get Started Free"
   - Use any email (e.g., `user@demo.com`)
   - Use any password (e.g., `password`)
   - You'll be logged in as a USER

3. **Explore Features:**
   - **Home** - See posts from subscribed creators (you start with 1 subscription)
   - **Discover** - Browse all creators, subscribe/unsubscribe
   - **Creator Profile** - Click any creator to see their profile
   - **Chat** - Message creators (mock conversations)
   - **Library** - View subscriptions and saved posts
   - **Settings** - Update profile, notifications, and preferences

4. **Try Interactions:**
   - Like posts (heart icon)
   - Save posts (bookmark icon)
   - Subscribe to creators (gradient button)
   - View locked content (shows paywall)
   - Click images to open lightbox

### As a Creator (Admin)

1. **Switch to Admin Mode:**
   - Go to **Settings** page
   - Scroll to "Developer Mode" section
   - Click "Switch to Admin"
   - You'll be redirected to the admin dashboard

2. **Admin Features:**
   - **Dashboard** - View revenue, subscribers, posts, messages stats
   - **Upload** - Create new posts:
     - Choose Image or Video
     - Enter media URL (use Unsplash URLs)
     - Write caption
     - Add tags
     - Set visibility (Public Preview or Subscribers Only)
   - **Messages** - Manage quick reply templates

3. **Creating a Post (Example):**
   ```
   Type: Image
   URL: https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=800
   Caption: Check out my latest work! ✨
   Tags: art, photography, exclusive
   Visibility: Subscribers Only
   ```

### Switching Between Modes

**Method 1: Settings Page**
1. Go to `/settings`
2. Find "Developer Mode" card
3. Click "Switch to Admin" or "Switch to User"

**Method 2: During Login**
- The login function has a third parameter for role
- By default, users are logged in as "user"
- Admins go to `/admin`, users go to `/home`

## 📱 Testing Responsiveness

1. **Desktop** (≥1024px):
   - Fixed sidebar navigation
   - Multi-column layouts
   - Expanded creator cards

2. **Mobile** (<1024px):
   - Bottom tab navigation
   - Single column layouts
   - Collapsible mobile menu

3. **Test with Chrome DevTools:**
   - Open DevTools (F12)
   - Toggle device toolbar (Ctrl+Shift+M)
   - Try different device presets

## 🎨 UI Features to Check Out

### Animations
- Hover effects on cards (scale, glow)
- Page transitions (fade in/up)
- Button gradients with glow
- Loading skeletons
- Typing indicator in chat

### Glass Morphism
- Navigation sidebars
- Cards and modals
- Input fields
- Floating panels

### Gradients
- CTA buttons (pink → purple → indigo)
- Section backgrounds
- Text highlights
- Icon containers

### States
- Empty states (no subscriptions, no posts)
- Loading states (skeletons)
- Locked content (paywall overlay)
- Active/inactive navigation items

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 3000
npx kill-port 3000
# Then run again
npm run dev
```

### Module Not Found
```bash
# Clear cache and reinstall
rm -rf node_modules
rm package-lock.json
npm install
```

### Build Errors
```bash
# Clean Next.js cache
rm -rf .next
npm run dev
```

### Images Not Loading
- Make sure you're using valid Unsplash URLs
- Check your internet connection
- Try different image URLs from: https://unsplash.com

## 💡 Pro Tips

1. **Mock Data** is in `lib/mock/data.ts`
   - Modify creators, posts, messages
   - Add your own test data

2. **State Persistence** via Zustand
   - User auth state persists in localStorage
   - Clear storage: Chrome DevTools → Application → Local Storage

3. **Theme Customization** in `app/globals.css`
   - Modify gradient colors
   - Adjust glow effects
   - Change glass opacity

4. **Component Customization** in `components/`
   - All components are fully customizable
   - Add new features or modify existing ones

## 🎯 Demo Scenarios

### Scenario 1: User Journey
1. Land on homepage → Register
2. Browse feed → Like a post
3. Discover creators → Subscribe to one
4. View creator profile → See locked content
5. Go to chat → Send a message

### Scenario 2: Creator Journey
1. Switch to admin mode
2. View dashboard stats
3. Create a new post (with image URL)
4. Add quick reply template
5. Switch back to user mode to see the new post

### Scenario 3: Subscription Flow
1. As user, view a locked post
2. See the paywall overlay
3. Click "Subscribe" button
4. Toggle subscription (instant in demo)
5. Post is now unlocked

## 📚 Next Steps

After exploring the demo:

1. **Customize the Design**
   - Modify colors in `tailwind.config.ts`
   - Update component styles
   - Add your own branding

2. **Extend Functionality**
   - Add more post types
   - Implement search functionality
   - Add notification system

3. **Connect to Backend**
   - Replace mock data with API calls
   - Add real authentication
   - Implement file uploads

4. **Deploy**
   - Vercel (recommended for Next.js)
   - Netlify
   - Your own hosting

## 🎉 Enjoy!

You now have a fully functional creator subscription platform MVP. Explore all the features and have fun customizing it to your needs!

For questions or issues, refer to the main [README.md](./README.md)
