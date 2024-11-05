// src/components/layout/Footer.tsx
export function Footer() {
  return (
    <footer className="bg-white border-t mt-auto">
      <div className="container mx-auto px-4 py-6">
        <div className="flex justify-between items-center">
          <p className="text-sm text-gray-600">
            © {new Date().getFullYear()} Pickle.me - Your AI-powered problem
            solver
          </p>
          <div className="flex gap-4">
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">
              Privacy Policy
            </a>
            <a href="#" className="text-sm text-gray-600 hover:text-green-600">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
