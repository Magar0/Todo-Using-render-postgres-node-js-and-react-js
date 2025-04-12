import { useDispatch } from "react-redux";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { logout } from "../store/slices/authSlice";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate("/sign-in");
  };

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
  ];

  return (
    <>
      <div className="sticky top-0 flex h-20 w-full items-center justify-between bg-slate-200 px-5">
        <div className="text-2xl font-bold text-neutral-700">TODO</div>
        <nav className="flex items-center gap-4">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `border-blue-300 px-3 py-1 hover:border-b-2 hover:text-blue-600 ${isActive ? "font-medium text-blue-600" : "text-gray-600"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            onClick={handleLogout}
            className="px-3 py-1 text-base text-red-600 hover:border-b-2 hover:border-red-300 hover:text-red-800"
          >
            Logout
          </button>
        </nav>
      </div>
      <Outlet />
    </>
  );
};

export default Navbar;
