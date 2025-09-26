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
          <Route path="page1/:id" element={<Page1 />} />
          <Route path="page2" element={<Page2 />} />
          <Route path="page3" element={<Page3 />} />
        </Routes>
      </Suspense>
    </div>
  );
}
