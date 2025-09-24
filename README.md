E-commerce Application with Next.js
This is an e-commerce application project built with Next.js and TypeScript. It fully simulates the features outlined in the project brief, including user authentication, product display, cart management, and a checkout process.

Live Demo URL: https://burningbros.vercel.app/

Tech Stack
Framework: Next.js, TypeScript, Tailwind CSS
State Management: Zustand
Forms: React Hook Form & Zod
Animations: Framer Motion

1. How to run the project
   To run this project on your local machine, please follow these steps:

Step 1: Clone repository
git clone https://github.com/phuongnguyen2505/burningbros

Step 2: Navigate to the project directory
cd burningbros

Step 3: Create environment file
Create a file named .env in the root directory and add the following line to connect to the API:
NEXT_PUBLIC_API_BASE_URL=https://dummyjson.com

Step 4: Install dependencies
npm install
or
yarn install

Step 5: Run the development server
npm run dev
or
yarn dev

Now, open your browser and navigate to http://localhost:3000 to see the application.

2. Folder structure
   The project is structured by feature modules to ensure it is easy to manage and scale.

/
├── app/                  # Contains the application's routes based on the App Router architecture.
├── components/           # Contains reusable React components.
│   ├── common/           # General-purpose components (Button, Input, Icons...).
│   ├── layout/           # Structural layout components (Navbar, Footer, MainLayout...).
│   └── ui/               # Feature-specific components (ProductCard...).
├── context/              # Contains React Context Providers (e.g., AppProviders).
├── hooks/                # Contains custom hooks (e.g., useDebounce).
├── lib/                  # Contains core logic, more complex helpers (e.g., api.ts, validators.ts).
├── store/                # Contains Zustand stores for global state management.
├── types/                # Contains TypeScript definitions (interfaces).
└── utils/                # Contains small, reusable utility functions (e.g., cardUtils.ts).

3. Challenges & Solutions
Static Build Failures: Resolved NextRouter was not mounted errors during the build process by enforcing dynamic rendering (SSR) for the entire application, which solved the conflict between the client-side useRouter hook in the shared layout and Next.js's default static generation.

Checkout Race Condition: Fixed a bug where users were redirected to the homepage instead of the success page after checkout. The solution was to move the clearCart() action from the checkout page to the success page, ensuring it only executes after the navigation is complete.

Dependency Instability: Overcame initial project instability and build failures by downgrading core dependencies from experimental versions (e.g., Next.js 15, React 19) to the latest stable releases, ensuring a reliable development environment.