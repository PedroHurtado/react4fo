import { Route, Routes } from "react-router";
import { lazy, Suspense } from "react";
import Menu from "./menu";

const Page1 = lazy(() => import("./Page1"));
const Page2 = lazy(() => import("./Page2"));
const Page3 = lazy(()=>import("./Page3"))

export default function Layout() {
  return (
    <div>
      <Menu />
      <Suspense>
        <Routes>
          <Route path="page1" element={<Page1 />} />
          <Route path="page1" element={<Page2 />} />
        </Routes>
      </Suspense>
    </div>
  );
}
