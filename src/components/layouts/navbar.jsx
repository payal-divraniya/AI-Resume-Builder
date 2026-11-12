import { useEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  ArrowRight,
  FileText,
  House,
  LayoutDashboard,
  LogOut,
  Menu,
  Palette,
  Sparkles,
  X,
} from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import "./navbar.css";
import "../../styles/motion-enhancements.css";

const navItems = [
  { label: "Home", to: "/", icon: House },
  {
    label: "Dashboard",
    to: "/dashboard",
    icon: LayoutDashboard,
    protected: true,
  },
  {
    label: "Templates",
    to: "/templates",
    icon: Palette,
    protected: true,
  },
  {
    label: "Create Resume",
    to: "/create-resume",
    icon: FileText,
    protected: true,
  },
];

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const [menuOpen, setMenuOpen] = useState(false);
  const [logoutOpen, setLogoutOpen] = useState(false);

  const cancelButtonRef = useRef(null);

  useEffect(() => {
    if (!logoutOpen) return undefined;

    cancelButtonRef.current?.focus();

    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setLogoutOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [logoutOpen]);

  const visibleItems = navItems.filter(
    (item) => !item.protected || isAuthenticated,
  );

  const closeMenu = () => setMenuOpen(false);

  function handleLogout() {
    logout();
    setLogoutOpen(false);
    closeMenu();
    navigate("/login", { replace: true });
  }

  const getLinkClass = ({ isActive }) =>
    `navbar-link ${isActive ? "navbar-link-active" : ""}`;

  const renderNavLinks = (mobile = false) =>
    visibleItems.map((item) => {
      const Icon = item.icon;

      return (
        <NavLink
          key={item.to}
          to={item.to}
          end={item.to === "/"}
          onClick={mobile ? closeMenu : undefined}
          className={getLinkClass}
        >
          <Icon size={17} strokeWidth={1.9} />
          <span>{item.label}</span>

          {mobile && item.to === "/create-resume" && (
            <ArrowRight size={16} className="navbar-mobile-arrow" />
          )}
        </NavLink>
      );
    });

  const userInitial = user?.name?.trim()?.charAt(0)?.toUpperCase() || "U";

  return (
    <>
      <header className="navbar-shell">
        <nav className="navbar-inner" aria-label="Main navigation">
          <div className="navbar-main-row">
            <Link to="/" onClick={closeMenu} className="navbar-brand">
              <span className="navbar-brand-mark" aria-hidden="true">
                <FileText size={22} strokeWidth={2.2} />

                <span className="navbar-brand-sparkle">
                  <Sparkles size={11} />
                </span>
              </span>

              <span className="navbar-brand-name">
                Resume<span>AI</span>
                <small>BUILD YOUR NEXT OPPORTUNITY</small>
              </span>
            </Link>

            <div className="navbar-desktop-links">{renderNavLinks()}</div>

            <div className="navbar-desktop-actions">
              {isAuthenticated ? (
                <>
                  <div
                    className="navbar-user"
                    title={user?.name || "User account"}
                  >
                    <span className="navbar-avatar">{userInitial}</span>

                    <span className="navbar-user-copy">
                      <small>WELCOME BACK</small>
                      <strong>{user?.name || "User"}</strong>
                    </span>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setMenuOpen(false);
                      setLogoutOpen(true);
                    }}
                    className="navbar-logout"
                  >
                    <LogOut size={16} />
                    <span>Logout</span>
                  </button>
                </>
              ) : (
                <>
                  <Link to="/login" className="navbar-login">
                    Log in
                  </Link>

                  <Link to="/register" className="navbar-cta">
                    Get Started <ArrowRight size={16} />
                  </Link>
                </>
              )}
            </div>

            <button
              type="button"
              className="navbar-menu-toggle"
              onClick={() => setMenuOpen((open) => !open)}
              aria-label={
                menuOpen ? "Close navigation menu" : "Open navigation menu"
              }
              aria-expanded={menuOpen}
              aria-controls="navbar-mobile-panel"
            >
              {menuOpen ? <X size={21} /> : <Menu size={21} />}
            </button>
          </div>

          <div
            id="navbar-mobile-panel"
            className={`navbar-mobile-panel ${menuOpen ? "is-open" : ""}`}
            aria-hidden={!menuOpen}
          >
            <div className="navbar-mobile-links">{renderNavLinks(true)}</div>

            {isAuthenticated ? (
              <div className="navbar-mobile-account">
                <div className="navbar-mobile-user">
                  <span className="navbar-avatar">{userInitial}</span>

                  <span className="navbar-user-copy">
                    <small>SIGNED IN AS</small>
                    <strong>{user?.name || "User"}</strong>
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => {
                    setMenuOpen(false);
                    setLogoutOpen(true);
                  }}
                  className="navbar-mobile-logout"
                >
                  <LogOut size={17} /> Log out
                </button>
              </div>
            ) : (
              <div className="navbar-mobile-auth">
                <Link
                  to="/login"
                  onClick={closeMenu}
                  className="navbar-mobile-login"
                >
                  Log in
                </Link>

                <Link
                  to="/register"
                  onClick={closeMenu}
                  className="navbar-mobile-cta"
                >
                  Create free account <ArrowRight size={16} />
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* LOGOUT CONFIRMATION MODAL */}
      {logoutOpen &&
        createPortal(
          <div
            className="fixed inset-0 z-9999 flex items-center justify-center bg-slate-950/50 p-4 backdrop-blur-sm"
            onMouseDown={(event) => {
              if (event.target === event.currentTarget) {
                setLogoutOpen(false);
              }
            }}
          >
            <section
              role="dialog"
              aria-modal="true"
              aria-labelledby="logout-dialog-title"
              aria-describedby="logout-dialog-description"
              className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-7 shadow-2xl"
            >
              <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-100 bg-blue-50 text-blue-600">
                <LogOut size={25} strokeWidth={2} />
              </div>

              <h2
                id="logout-dialog-title"
                className="mt-5 text-center text-xl font-bold tracking-tight text-[#172033]"
              >
                Are you sure you want to log out?
              </h2>

              <p
                id="logout-dialog-description"
                className="mt-3 text-center text-sm leading-6 text-[#526174]"
              >
                You will need to log in again to access your account.
              </p>

              <div className="mt-7 flex flex-col-reverse gap-3 sm:flex-row">
                <button
                  ref={cancelButtonRef}
                  type="button"
                  onClick={() => setLogoutOpen(false)}
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition duration-200 hover:border-slate-300 hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-[#2563EB] px-4 py-3 text-sm font-semibold text-white shadow-md shadow-blue-600/20 transition duration-200 hover:bg-blue-700 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                  Yes, Logout
                </button>
              </div>
            </section>
          </div>,
          document.body,
        )}
    </>
  );
}
