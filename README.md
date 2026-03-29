# PrimeCart Frontend

A modern, full-featured e-commerce frontend application built with React 19, TypeScript, and Tailwind CSS. PrimeCart offers a seamless shopping experience with user authentication, product management, shopping cart, checkout process, and comprehensive admin dashboard.

## 🚀 Features

### Shopping Experience
- **Product Catalog**: Browse products with advanced filtering and search
- **Product Details**: Detailed product pages with image galleries
- **Shopping Cart**: Persistent cart with real-time updates and quantity management
- **Secure Checkout**: Multi-step checkout process with payment integration
- **Order Management**: View order history and track order status
- **User Authentication**: Login, registration, and password reset functionality

### User Account
- **Authentication**: Secure login, registration, and password reset
- **Profile Management**: Update personal information and addresses
- **Order History**: View past purchases and order details
- **Theme Support**: Dark/light mode toggle

### Admin Dashboard
- **Product Management**: Add, edit, delete products
- **Order Management**: View, process, and manage customer orders
- **User Management**: Manage customer accounts and permissions
- **Activity Logs**: Track system activities and user actions

## 🛠️ Tech Stack

### Core Technologies
- **React 19**: Latest React with concurrent features
- **TypeScript**: Type-safe development
- **Vite 5.4**: Fast build tool and development server
- **Tailwind CSS 4**: Modern utility-first CSS framework

### Key Libraries
- **React Router 7**: Client-side routing with protected routes
- **Zustand**: Lightweight state management (auth, cart, products, theme)
- **Axios**: HTTP client with interceptors for API communication
- **Framer Motion**: Smooth animations and transitions
- **Lucide React**: Beautiful icon library
- **Sonner**: Toast notifications
- **Radix UI**: Accessible component primitives
- **Class Variance Authority**: Component variant management

### Development Tools
- **ESLint**: Code linting and formatting
- **PostCSS**: CSS processing
- **Autoprefixer**: CSS vendor prefixing

## 📦 Project Structure

```
src/
├── api/                    # API services and HTTP client
│   ├── authService.ts
│   ├── cartService.ts
│   └── httpClient.ts
├── components/             # Reusable UI components
│   ├── admin/             # Admin-specific components
│   ├── filters/           # Product filter components
│   ├── layout/            # Layout components (Header, Footer)
│   ├── shop/              # Shopping-related components
│   └── user/              # User account components
├── constants/              # Application constants
│   ├── categories.ts
│   └── index.ts
├── data/                   # Mock data and fixtures
├── hooks/                  # Custom React hooks
├── pages/                  # Page components
│   ├── Admin/             # Admin pages
│   ├── Auth.tsx           # Authentication page
│   ├── Cart.tsx           # Shopping cart
│   ├── Checkout.tsx       # Checkout process
│   ├── Home.tsx           # Home page
│   ├── NotFound.tsx       # 404 page
│   ├── Orders.tsx         # Order management
│   ├── ProductDetail.tsx  # Product details
│   ├── Products.tsx       # Product listing
│   └── Profile.tsx        # User profile
├── stores/                 # Zustand state stores
│   ├── authStore.ts       # Authentication state
│   ├── cartStore.ts       # Shopping cart state
│   ├── orderStore.ts      # Order management
│   ├── paymentStore.ts    # Payment processing
│   ├── productStore.ts    # Product data
│   ├── reportStore.ts     # Admin reports
│   ├── themeStore.ts      # Theme management
│   └── userStore.ts       # User data
├── types/                  # TypeScript type definitions
├── ui/                     # Base UI components
│   ├── Button.tsx         # Custom button component
│   ├── Modal.tsx          # Modal component
│   └── SearchBar.tsx      # Search functionality
└── utils/                  # Utility functions
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Emmakaranja1/primecart-frontend-project.git
   cd primecart-frontend-project
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your API URL in `.env`:
   ```env
   VITE_API_BASE_URL=https://your-api-domain.com
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to `http://localhost:5173`

## 📜 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 🌍 Deployment

### Railway Deployment

This project is optimized for Railway deployment with automatic configuration:

1. **Push to GitHub**
   ```bash
   git add .
   git commit -m "deploy: latest changes"
   git push
   ```

2. **Railway Setup**
   - Connect your GitHub repository to Railway
   - Set environment variable: `VITE_API_BASE_URL=https://your-api-domain.com`
   - Railway will automatically detect and deploy the Node.js application

3. **Deployment Process**
   Railway automatically runs:
   ```bash
   npm ci
   npm run build
   npm start
   ```

### Manual Deployment

For other hosting platforms:

1. **Build the application**
   ```bash
   npm run build
   ```

2. **Serve the dist folder**
   ```bash
   npm install -g serve
   serve -s dist -l 3000
   ```

## 🔧 Configuration

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | Base URL for API requests | `https://api.primecart.com` |

### Vite Configuration

The project uses Vite with React plugin and TypeScript support. Key configurations:

- **Base Path**: Set to `/` for proper routing
- **Path Aliases**: `@` maps to `src/` directory
- **Proxy**: Development proxy for API requests

### Tailwind CSS

Uses Tailwind CSS v4 with PostCSS:
- Custom color palette and design tokens
- Responsive breakpoints
- Dark mode support (configurable)

## 🎨 UI Components

The project uses a component-based architecture with:

- **Base Components**: Reusable UI primitives in `/ui`
- **Composite Components**: Feature-specific components
- **Layout Components**: Header, footer, navigation
- **Form Components**: Input validation and error handling

## 📱 Responsive Design

- **Mobile-first** approach
- **Breakpoints**: sm (640px), md (768px), lg (1024px), xl (1280px)
- **Touch-friendly** interactions
- **Progressive enhancement**

## 🔐 Authentication & Security

- **JWT Tokens**: Secure authentication with automatic token refresh
- **Protected Routes**: Route guards for authenticated and admin users
- **API Security**: Request/response interceptors for error handling
- **Local Storage**: Secure token storage with fallback mechanisms

## 🛒 E-commerce Features

### Product Management
- **Categories**: Electronics, Fashion, Home, Sports, Accessories, Beauty, Toys, Books
- **Brands**: AudioTech, TechTime, EcoWear, PhotoPro, FitGear, and more
- **Product Filtering**: Filter by category, brand, price range, and featured status
- **Product Details**: Image galleries and detailed product information

### Shopping Cart
- **Persistent Cart**: Cart data managed with Zustand state
- **Quantity Management**: Add, remove, and update item quantities
- **Cart Sidebar**: Slide-out cart with item summary
- **Real-time Updates**: Live cart updates across the application

### Checkout Process
- **Multi-step Checkout**: Address → Payment → Review → Confirmation
- **Payment Integration**: Multiple payment method support
- **Order Processing**: Real-time order status tracking
- **Order Confirmation**: Detailed order summary after purchase

## 📊 Admin Features

### Dashboard Analytics
- **Sales Overview**: Revenue, orders, and customer metrics
- **Product Performance**: Best-selling and low-stock items
- **User Activity**: Recent actions and system logs

### Management Tools
- **Product CRUD**: Create, read, update, delete products
- **Order Processing**: Fulfill orders and update tracking
- **User Management**: Customer account administration



## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License.

---

Built with ❤️ by Emma Karanja
