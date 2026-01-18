import { redirect } from 'next/navigation';

/**
 * Home Page - Redirects to Workspace
 * 
 * The main entry point now redirects to the workspace page
 * where users can view and manage their projects.
 */
export default function HomePage() {
  redirect('/workspace');
}

