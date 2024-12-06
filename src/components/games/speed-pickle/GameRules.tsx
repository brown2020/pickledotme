export function GameRules() {
  return (
    <div className="mt-8 p-4 bg-gray-50 rounded-lg">
      <h3 className="font-semibold mb-2">How to Play:</h3>
      <ul className="list-disc list-inside text-gray-600 space-y-1">
        <li>Find and click the slightly darker pickle</li>
        <li>Score points for each correct pick</li>
        <li>Level up every 500 points</li>
        <li>Higher levels have more pickles and subtle differences</li>
        <li>Gain 1 second for correct picks</li>
        <li>Lose 2 seconds for mistakes</li>
      </ul>
    </div>
  );
}
