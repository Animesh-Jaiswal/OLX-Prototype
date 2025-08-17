import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Create from "./pages/Create";
import Show from "./pages/Show";
import Navbar from "./components/Navbar";
import Update from "./pages/Update";

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create" element={<Create />} />
            <Route path="/ads/:id" element={<Show />} />
            <Route path="/ads/:id/edit" element={<Update />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}
export default App;
