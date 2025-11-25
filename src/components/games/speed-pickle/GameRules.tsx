export function GameRules() {
  return (
    <div className="mt-8 p-6 bg-slate-50 rounded-2xl">
      <h3 className="font-bold text-slate-900 mb-3">How to Play:</h3>
      <ul className="space-y-2 text-slate-600">
        <li className="flex items-center gap-2">
          <span className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">1</span>
          Find and click the slightly different pickle
        </li>
        <li className="flex items-center gap-2">
          <span className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">2</span>
          Score points for each correct pick
        </li>
        <li className="flex items-center gap-2">
          <span className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">3</span>
          Level up every 500 points
        </li>
        <li className="flex items-center gap-2">
          <span className="w-6 h-6 bg-violet-100 rounded-full flex items-center justify-center text-violet-600 text-sm font-bold">4</span>
          Gain +1s for correct picks, lose -2s for mistakes
        </li>
      </ul>
    </div>
  );
}
