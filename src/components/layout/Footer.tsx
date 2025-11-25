import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-400 mt-auto">
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link 
              href="/" 
              className="text-xl font-bold text-white flex items-center gap-2"
            >
              🥒 Pickle.me
            </Link>
            <p className="mt-2 text-sm">
              Your AI-powered problem solver and brain trainer.
            </p>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-3">Quick Links</h4>
            <nav className="flex flex-col gap-2">
              <Link href="/pickle" className="text-sm hover:text-emerald-400 transition-colors">
                Get Advice
              </Link>
              <Link href="/games" className="text-sm hover:text-emerald-400 transition-colors">
                Play Games
              </Link>
              <Link href="/profile" className="text-sm hover:text-emerald-400 transition-colors">
                Your Profile
              </Link>
            </nav>
          </div>

          {/* Legal */}
          <div>
            <h4 className="text-white font-semibold mb-3">Legal</h4>
            <nav className="flex flex-col gap-2">
              <Link href="#" className="text-sm hover:text-emerald-400 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-sm hover:text-emerald-400 transition-colors">
                Terms of Service
              </Link>
            </nav>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-slate-800 text-center text-sm">
          <p>© {new Date().getFullYear()} Pickle.me — All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
