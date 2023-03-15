import { createBrowserRouter, RouterProvider } from "react-router-dom";
import SignIn from "./Routes/SignIn";

const router = createBrowserRouter([
  {
    path: '/signin',
    element: <SignIn/>
  }
])


function App() {
  return (
    <RouterProvider router={router}/>
  );
}

export default App;
