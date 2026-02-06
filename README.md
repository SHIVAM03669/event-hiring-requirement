# Event Hiring Hub

Event Hiring Hub is a modern web application designed to streamline the process of hiring professionals for events. Whether you need an event planner, a performer, or a crew member, this platform allows you to post your specific requirements easily. It also features an admin dashboard for managing and reviewing these submissions.

## 🚀 Features

- **Post Requirements**: A detailed, user-friendly form to submit hiring needs for different roles:
  - **Event Planners**: Specify budget, guest count, and required services.
  - **Performers**: detailed requests for genres, performance types, and equipment.
  - **Crew**: Define roles, crew count, experience levels, and shift details.
- **Admin Dashboard**: A secure area to view, filter, and inspect all submitted hiring requirements.
- **Responsive Design**: Built with a mobile-first approach, ensuring a seamless experience on all devices.
- **Real-time Validation**: Robust form validation to ensure accurate data submission.

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [Shadcn/ui](https://ui.shadcn.com/) (based on Radix UI)
  - [Framer Motion](https://www.framer.com/motion/) for animations
  - [Lucide React](https://lucide.dev/) for icons
- **Database**: [Supabase](https://supabase.com/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/) & [Zod](https://zod.dev/)

## 📂 Project Structure

- `src/app`: Contains the application routes and page structured (App Router).
  - `/post`: Route for the requirement submission form.
  - `/admin`: Route for the admin dashboard.
- `src/components`: Reusable UI components and specific feature components (`RequirementForm.tsx`, etc.).
- `src/lib`: Utility functions and database configuration (`db.ts`, `utils.ts`).

## 🏁 Getting Started

Follow these steps to get the project running locally.

### Prerequisites

- Node.js 18.x or later
- npm, yarn, pnpm, or bun

### Installation

1.  **Clone the repository:**
    ```bash
    git clone https://github.com/yourusername/event-hiring-hub.git
    cd event-hiring-hub
    ```

2.  **Install dependencies:**
    ```bash
    npm install
    # or
    yarn install
    ```

3.  **Environment Setup:**
    Create a `.env.local` file in the root directory and add your Supabase credentials:
    ```env
    SUPABASE_URL=your_supabase_project_url
    SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
    ```

4.  **Run the development server:**
    ```bash
    npm run dev
    # or
    yarn dev
    ```

5.  Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📄 License

This project is open-source and available under the query [MIT License](LICENSE).
