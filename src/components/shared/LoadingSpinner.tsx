// src/components/shared/LoadingSpinner.tsx
export function LoadingSpinner() {
  return (
    <div className="flex justify-center items-center p-4">
      <div className="relative">
        <div className="w-12 h-12 rounded-full border-4 border-green-200"></div>
        <div className="w-12 h-12 rounded-full border-4 border-green-600 border-t-transparent animate-spin absolute top-0 left-0"></div>
      </div>
    </div>
  );
}
