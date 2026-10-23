import { createBrowserRouter } from "react-router";

import MainLayout from "./layouts/MainLayout.jsx";

import HomePage from "./pages/Home/Home";
import OfficerPage from "./pages/Officer/OfficersPage";
import RecruitmentPage from "./pages/Recruitment/RecruitmentPage";
import UnitsPage from "./pages/Units/UnitsPage";
import ComingSoonPage from "./pages/ComingSoon/ComingSoonPage";
import NotFoundPage from "./pages/NotFound/NotFoundPage";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: MainLayout,
    children: [
      {
        index: true,
        Component: HomePage,
      },
      {
        path: "units",
        Component: UnitsPage,
      },
      {
        path: "units/:id?",
        Component: UnitsPage,
      },
      {
        path: "officers",
        Component: OfficerPage,
      },
      {
        path: "officers/:id?",
        Component: OfficerPage,
      },
      {
        path: "recruitment",
        Component: RecruitmentPage,
      },
      {
        path: "recruitment/:id?",
        Component: RecruitmentPage,
      },
      {
        path: "coming_soon",
        Component: ComingSoonPage,
      },
      {
        path: "*",
        Component: NotFoundPage,
      },
    ],
  },
]);
