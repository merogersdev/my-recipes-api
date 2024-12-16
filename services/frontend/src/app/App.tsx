import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "../pages/home/Home.tsx";
import NotFound from "../pages/notFound/NotFound.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
]);

export default function App() {
  return <RouterProvider router={router} />;
}
