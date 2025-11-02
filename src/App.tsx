import { RouterProvider} from "react-router";
import {router} from "./appRoutes/routes.tsx";

export default function App() {
  return (
      <RouterProvider router={router} />
  );
}
