import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import elements for routes
import Dashboard from "./routes/Dashboard";
import Register from "./routes/Register";
import SignIn from "./routes/SignIn";
import Create from "./routes/Create";
import Photo from "./routes/Photo";
import Profile, { loader as ProfileLoader } from "./routes/Profile";

const router = createBrowserRouter([
  // Dashboard
  {
    path: "/",
    element: <Dashboard />,
  },
  // User profile
  {
    path: "/:name",
    element: <Profile />,
    loader: ProfileLoader,
  },
  // Create task
  {
    path: "/create",
    element: <Create />,
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
  // Profile picture page
  {
    path: "/photo",
    element: <Photo />,
  },
]);

const App = () => (
  <div className="d-flex w-100 min-vh-100 p-3">
    <div className="d-flex w-100 container flex-column align-items-center gap-3">
      <RouterProvider router={router} />
    </div>
  </div>
);

export default App;
