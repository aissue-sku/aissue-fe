import { createBrowserRouter } from "react-router-dom";
import AppLayout from "../components/layout/AppLayout";
import SplashPage from "../pages/splash/SplashPage";
import LoginPage from "../pages/login/LoginPage";
import SignupPage from "../pages/signup/SignupPage";
import HomePage from "../pages/home/HomePage";
import SearchPage from "../pages/search/SearchPage";
import SearchResultPage from "../pages/search/SearchResultPage";
import NewsArticlePage from "../pages/search/NewsArticlePage";
import NotificationPage from "../pages/notification/NotificationPage";
import AnalysisPage from "../pages/analysis/AnalysisPage";
import AnalysisResultPage from "../pages/analysis/AnalysisResultPage";
import AnalysisTrustPage from "../pages/analysis/AnalysisTrustPage";
import ProfilePage from "../pages/profile/ProfilePage";
import CharacterShopPage from "../pages/profile/CharacterShopPage";
import KeywordManagePage from "../pages/profile/KeywordManagePage";

const router = createBrowserRouter([
  { path: "/", element: <SplashPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/signup", element: <SignupPage /> },
  {
    element: <AppLayout />,
    children: [
      { path: "/home", element: <HomePage /> },
      { path: "/search", element: <SearchPage /> },
      { path: "/search/result", element: <SearchResultPage /> },
      { path: "/search/article", element: <NewsArticlePage /> },
      { path: "/notification", element: <NotificationPage /> },
      { path: "/analysis", element: <AnalysisPage /> },
      { path: "/analysis/result", element: <AnalysisResultPage /> },
      { path: "/analysis/trust", element: <AnalysisTrustPage /> },
      { path: "/profile", element: <ProfilePage /> },
      { path: "/profile/shop", element: <CharacterShopPage /> },
      { path: "/profile/keywords", element: <KeywordManagePage /> },
    ],
  },
]);

export default router;
