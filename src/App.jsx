import { lazy, Suspense } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

import ProtectedRoute from "./components/ProtectedRoute";
import Navbar from "./components/layouts/navbar";

// Load pages only when their routes are visited
const Home = lazy(() => import("./pages/Home"));
const Dashboard = lazy(() => import("./pages/Dashboard"));
const CreateResume = lazy(() => import("./pages/CreateResume"));
const Templates = lazy(() => import("./pages/Templates"));
const NotFound = lazy(() => import("./pages/NotFound"));
const Auth = lazy(() => import("./pages/Auth"));

function App() {
  return (
    <BrowserRouter>
      <Navbar />

      <Suspense
        fallback={
          <div className="flex min-h-[60vh] items-center justify-center bg-white">
            <div className="h-9 w-9 animate-spin rounded-full border-4 border-blue-100 border-t-blue-600" />
          </div>
        }
      >
        <Routes>
          <Route path="/" element={<Home />} />

          <Route path="/register" element={<Auth />} />
          <Route path="/login" element={<Auth />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/create-resume" element={<CreateResume />} />
            <Route path="/templates" element={<Templates />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}

export default App;
