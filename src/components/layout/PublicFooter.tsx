import { Link } from 'react-router-dom'
import { MessageIcon } from '@/components/ui/Icons'

export function PublicFooter() {
  return (
    <footer className="border-t border-navy-100 bg-navy-900 text-navy-200">
      <div className="container-page grid gap-10 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <span className="text-lg font-extrabold tracking-tight text-white">
            DONE WELL<span className="align-super text-[0.6em] text-gold-400">®</span>
          </span>
          <p className="mt-3 text-sm leading-relaxed text-navy-300">
            Resources. Practice. Support. Progress. An extension of Done Well Publications, built to make quality
            school support affordable and accessible across South Africa.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Explore</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><Link to="/learners" className="hover:text-white">For Learners</Link></li>
            <li><Link to="/parents" className="hover:text-white">For Parents</Link></li>
            <li><Link to="/teachers" className="hover:text-white">For Teachers</Link></li>
            <li><Link to="/schools" className="hover:text-white">For Schools</Link></li>
            <li><Link to="/publications" className="hover:text-white">Publications</Link></li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Contact</h3>
          <ul className="mt-3 space-y-2 text-sm text-navy-300">
            <li>hello@donewellpublications.co.za</li>
            <li>
              <a href="tel:+27736045360" className="hover:text-white">
                +27 73 604 5360
              </a>
            </li>
            <li className="flex items-center gap-1.5">
              <MessageIcon className="h-4 w-4 text-emerald-400" />
              <a
                href="https://wa.me/27717713275"
                target="_blank"
                rel="noreferrer"
                className="hover:text-white"
              >
                WhatsApp: +27 71 771 3275
              </a>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold text-white">Legal</h3>
          <ul className="mt-3 space-y-2 text-sm">
            <li><span className="cursor-default text-navy-300">Privacy Policy</span></li>
            <li><span className="cursor-default text-navy-300">Terms of Service</span></li>
            <li><span className="cursor-default text-navy-300">POPIA Notice</span></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-navy-800 py-5">
        <p className="container-page text-xs text-navy-400">
          © {new Date().getFullYear()} Done Well Publications. All rights reserved. DONE WELL® is a registered trademark.
        </p>
      </div>
    </footer>
  )
}
