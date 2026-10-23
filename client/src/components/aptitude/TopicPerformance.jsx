function TopicPerformance({ topicPerformance = [], difficultyPerformance = [] }) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
      {/* Topic-wise Performance Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
          Topic-wise Performance
        </h3>

        <div className="mt-4 space-y-3">
          {topicPerformance.length === 0 ? (
            <p className="text-xs text-gray-400">No topic data available.</p>
          ) : (
            topicPerformance.map((tp) => (
              <div
                key={tp.topic}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <p className="text-xs font-bold text-gray-900">{tp.topicName}</p>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {tp.correct} correct out of {tp.attempted} attempted ({tp.total} total)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {tp.accuracy}%
                  </span>
                  <span className="block text-[10px] text-gray-400">Accuracy</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Difficulty-wise Performance Card */}
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-base font-bold text-gray-900 pb-3 border-b border-gray-100">
          Difficulty-wise Performance
        </h3>

        <div className="mt-4 space-y-3">
          {difficultyPerformance.length === 0 ? (
            <p className="text-xs text-gray-400">No difficulty data available.</p>
          ) : (
            difficultyPerformance.map((dp) => (
              <div
                key={dp.difficulty}
                className="p-3.5 rounded-xl bg-gray-50 border border-gray-100 flex items-center justify-between"
              >
                <div>
                  <span className="text-xs font-bold text-gray-900 capitalize">
                    {dp.difficulty} Level
                  </span>
                  <p className="text-[11px] text-gray-500 mt-0.5">
                    {dp.correct} correct out of {dp.attempted} attempted ({dp.total} total)
                  </p>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-gray-900">
                    {dp.accuracy}%
                  </span>
                  <span className="block text-[10px] text-gray-400">Accuracy</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default TopicPerformance;
