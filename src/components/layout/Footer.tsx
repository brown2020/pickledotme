import Link from "next/link";
import { Github, Twitter } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-slate-900 dark:bg-slate-950 text-slate-400 mt-auto">
      <div className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <Link
              href="/"
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              🥒 Pickle.me
            </Link>
            <p className="mt-3 text-sm max-w-md">
              Your AI-powered problem solver and brain trainer. Get unstuck with 
              thoughtful advice and sharpen your mind with memory games.
            </p>
            <div className="flex gap-4 mt-4">
              <a
                href="https://github.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="GitHub"
              >
                <Github className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-lg hover:bg-slate-800 transition-colors"
                aria-label="Twitter"
              >
                <Twitter className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-4">Product</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="/pickle"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Get Advice
              </Link>
              <Link
                href="/games"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Play Games
              </Link>
              <Link
                href="/profile"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Your Profile
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-4">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link
                href="#"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Terms of Service
              </Link>
              <Link
                href="#"
                className="text-sm hover:text-emerald-400 transition-colors"
              >
                Cookie Policy
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm">
            © {new Date().getFullYear()} Pickle.me — All rights reserved.
          </p>
          <p className="text-sm text-slate-500">
            Made with 🥒 and a lot of ☕
          </p>
        </div>
      </div>
    </footer>
  );
}
