import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import elements for routes
import Dashboard from "./routes/Dashboard";
import Register from "./routes/Register";
import SignIn from "./routes/SignIn";

const router = createBrowserRouter([
  // Dashboard
  {
    path: "/",
    element: <Dashboard />,
  },
  // Register
  {
    path: "/register",
    element: <Register />,
  },
  // Sign in
  {
    path: "/signin",
    element: <SignIn />,
  },
]);

const App = () => (
  <div className="d-flex w-100 min-vh-100 p-4 bg-light">
    <div className="d-flex w-100 container flex-column align-items-center gap-3">
      <RouterProvider router={router} />
    </div>
  </div>
);

export default App;
