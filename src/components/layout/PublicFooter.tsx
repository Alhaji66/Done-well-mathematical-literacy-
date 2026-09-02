import { Link } from "react-router-dom";
import { IconWhatsapp } from "../../lib/icons";
import { Logo } from "../ui/Logo";

export function PublicFooter() {
  return (
    <footer className="border-t border-navy-100 bg-navy-950 text-navy-200">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Logo dark />
          <p className="mt-3 max-w-xs text-sm text-navy-300">
            Resources. Practice. Support. Progress. An extension of Done Well Publications, South Africa.
          </p>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Platform</p>
          <ul className="space-y-2 text-sm text-navy-300">
            <li><Link className="hover:text-white" to="/sign-in">Learner dashboard</Link></li>
            <li><Link className="hover:text-white" to="/sign-in">Parent dashboard</Link></li>
            <li><Link className="hover:text-white" to="/sign-in">Teacher dashboard</Link></li>
            <li><Link className="hover:text-white" to="/sign-in">School dashboard</Link></li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Contact</p>
          <ul className="space-y-2 text-sm text-navy-300">
            <li>hello@donewellpublications.co.za</li>
            <li>+27 (0)11 000 0000</li>
            <li className="flex items-center gap-2">
              <IconWhatsapp className="h-4 w-4 text-emerald-400" />
              WhatsApp support (coming soon)
            </li>
          </ul>
        </div>

        <div>
          <p className="mb-3 text-sm font-semibold text-white">Legal</p>
          <ul className="space-y-2 text-sm text-navy-300">
            <li><a className="hover:text-white" href="#privacy">Privacy Policy</a></li>
            <li><a className="hover:text-white" href="#terms">Terms of Use</a></li>
            <li><a className="hover:text-white" href="#popia">POPIA Notice</a></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-navy-800 py-5">
        <p className="container-page text-xs text-navy-400">
          © {new Date().getFullYear()} Done Well Publications. DONE WELL® is a registered trademark. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
