import { createRoot } from "react-dom/client";
import { SpaContainer } from "pankosmia-rcl";
import { createHashRouter, RouterProvider } from "react-router-dom";
import "./index.css";
import App from "./App";
import { MuncherTest } from "./pages/MuncherTest";

const router = createHashRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/MuncherTest",
    element: <MuncherTest />,
  },
  // {
  //   path: "createPage",
  //   element: <CreatePage />,
  // },
  // {
  //   path: "updatePage",
  //   element: <UpdatePage />,
  // },
]);

createRoot(document.getElementById("root")).render(
  <SpaContainer>
    <RouterProvider router={router} />
  </SpaContainer>,
);
