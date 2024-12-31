import { createBrowserRouter, RouterProvider } from "react-router";

import Home from "../pages/home/Home.tsx";
import NotFound from "../pages/notFound/NotFound.tsx";
import { poolData } from "../config/UserPool.ts";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
    errorElement: <NotFound />,
  },
]);

console.log(poolData);

export default function App() {
  return <RouterProvider router={router} />;
}
