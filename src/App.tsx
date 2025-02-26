import { RouterProvider, createBrowserRouter, Navigate } from 'react-router-dom';
import HomePage from '@/pages/HomePage';
import CreateWorkflowPage from '@/pages/CreateWorkflowPage';
import WorkflowDetails from '@/components/WorkflowDetails';
import LandingPage from '@/pages/LandingPage';
import RootLayout from '@/components/RootLayout';

const router = createBrowserRouter([
  {
    path: '/',
    element: <LandingPage />
  },
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        path: 'home',
        element: <HomePage />
      },
      {
        path: 'create',
        element: <CreateWorkflowPage />
      },
      {
        path: 'workflows/:id',
        element: <WorkflowDetails />
      }
    ]
  },
  {
    path: '*',
    element: <Navigate to="/" replace />
  }
]);

export default function App() {
  return <RouterProvider router={router} />;
}