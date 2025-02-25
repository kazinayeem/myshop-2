import { Sidebar, Menu, MenuItem, SubMenu } from "react-pro-sidebar";
import { Link } from "react-router";
import { Route, Routes } from "react-router";

export default function App() {
  return (
    <div className="flex h-screen">
      {/* Fixed Sidebar */}
      <Sidebar className=" w-64 bg-black text-white fixed">
        <Menu>
          <SubMenu label="Charts">
            <MenuItem>
              <Link to="/pie">Pie charts</Link>
            </MenuItem>
            <MenuItem>
              <Link to="/line">Line charts</Link>
            </MenuItem>
          </SubMenu>
          <MenuItem>
            <Link to="/docs">Documentation</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/calendar">Calendar</Link>
          </MenuItem>
          <MenuItem>
            <Link to="/login">Login</Link>
          </MenuItem>
        </Menu>
      </Sidebar>

      {/* Dynamic Content */}
      <main className="ml-64 flex-1 p-6 bg-gray-100 overflow-y-auto">
        {/* Routing to different components */}
        <Routes >
          <Route
            path="/pie"
            element={<h1 className="text-xl font-bold">Pie Charts</h1>}
          />
          <Route
            path="/line"
            element={<h1 className="text-xl font-bold">Line Charts</h1>}
          />
          <Route
            path="/docs"
            element={<h1 className="text-xl font-bold">Documentation</h1>}
          />
          <Route
            path="/login"
            element={<h1 className="text-xl font-bold">Login</h1>}
          />
         
          <Route
            path="/calendar"
            element={<h1 className="text-xl font-bold">Calendar</h1>}
          />
          <Route
            path="/"
            element={<h1 className="text-xl font-bold">Welcome Home</h1>}
          />
        </Routes>
      </main>
    </div>
  );
}
