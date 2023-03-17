import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import elements for routes
import Dashboard from "./routes/Dashboard";
import SignIn from "./routes/SignIn";

const router = createBrowserRouter([
  // Dashboard
  {
    path: "/",
    element: <Dashboard />,
  },
  // Sign in
  {
    path: "/signin",
    element: <SignIn />,
  },
]);

const App = () => <RouterProvider router={router} />;

export default App;
