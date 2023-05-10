import { createBrowserRouter, RouterProvider } from "react-router-dom";

// Import elements for routes
import Dashboard from "./routes/Dashboard";
import Register from "./routes/Register";
import SignIn from "./routes/SignIn";
import Create, { loader as CreateLoader } from "./routes/Create";
import Photo from "./routes/Photo";
import Profile, { loader as ProfileLoader } from "./routes/Profile";
import Check, { loader as CheckLoader } from "./routes/Check";

import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

const router = createBrowserRouter([
  // Dashboard
  {
    path: "/",
    element: <Dashboard />,
    children: [
      {
        path: "/check/:id",
        element: <Check />,
        // @ts-ignore
        loader: CheckLoader,
      },
    ],
  },
  // User profile
  {
    path: "/:name",
    element: <Profile />,
    // @ts-ignore
    loader: ProfileLoader,
  },
  // Create task
  {
    path: "/create",
    element: <Create />,
    loader: CreateLoader,
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
  <>
    <ToastContainer
      autoClose={3000}
      hideProgressBar={false}
      newestOnTop={false}
      closeOnClick
      rtl={false}
      pauseOnFocusLoss
      draggable
      pauseOnHover
      theme="dark"
    />
    <div className="d-flex w-100 min-vh-100 p-3">
      <div className="d-flex w-100 container flex-column align-items-center gap-3">
        <RouterProvider router={router} />
      </div>
    </div>
  </>
);

export default App;
