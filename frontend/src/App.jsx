import "./App.css";
import Footer from "./components/footer";
import Navbar from "./components/Navbar";
import { Outlet } from "react-router-dom";
function App() {
  return (
    <>
      <Navbar></Navbar>
      <main className="my-3">
        <Outlet />
      </main>
      <Footer></Footer>
    </>
  );
}

export default App;
