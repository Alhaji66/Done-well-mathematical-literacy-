import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import { IconClose, IconMenu } from "../../lib/icons";
import { Button } from "../ui/Button";
import { Logo } from "../ui/Logo";

const navLinks = [
  { label: "Home", to: "/" },
  { label: "Learners", to: "/#learners" },
  { label: "Parents", to: "/#parents" },
  { label: "Teachers", to: "/#teachers" },
  { label: "Schools", to: "/#schools" },
  { label: "Publications", to: "/#publications" },
];

export function PublicHeader() {
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 border-b border-navy-100 bg-white/95 backdrop-blur">
      <div className="container-page flex h-16 items-center justify-between">
        <Link to="/" className="focus-ring rounded-md">
          <Logo />
        </Link>

        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <NavLink
              key={link.label}
              to={link.to}
              className="focus-ring rounded-md px-3 py-2 text-sm font-medium text-navy-600 transition-colors hover:bg-navy-50 hover:text-navy-900"
            >
              {link.label}
            </NavLink>
          ))}
        </nav>

        <div className="hidden items-center gap-2 md:flex">
          <Button as="link" to="/sign-in" variant="outline" size="sm">
            Sign In
          </Button>
          <Button as="link" to="/sign-in" variant="primary" size="sm">
            Try the demo
          </Button>
        </div>

        <button
          className="focus-ring rounded-lg p-2 text-navy-700 md:hidden"
          onClick={() => setOpen((v) => !v)}
          aria-label={open ? "Close menu" : "Open menu"}
        >
          {open ? <IconClose className="h-6 w-6" /> : <IconMenu className="h-6 w-6" />}
        </button>
      </div>

      {open ? (
        <div className="border-t border-navy-100 bg-white px-4 pb-4 md:hidden">
          <nav className="flex flex-col gap-1 pt-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.label}
                to={link.to}
                onClick={() => setOpen(false)}
                className="focus-ring rounded-md px-3 py-2.5 text-sm font-medium text-navy-700 hover:bg-navy-50"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
          <div className="mt-3 flex flex-col gap-2">
            <Button as="link" to="/sign-in" variant="outline" onClick={() => setOpen(false)}>
              Sign In
            </Button>
            <Button as="link" to="/sign-in" variant="primary" onClick={() => setOpen(false)}>
              Try the demo
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
