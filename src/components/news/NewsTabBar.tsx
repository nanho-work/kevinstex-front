interface NewsTabBarProps {
  selectedQuery: string;
  setSelectedQuery: (query: string) => void;
}

const tabs = ['종합소득세', '근로소득세', '부가가치세', '법인세', '절세'];

export default function NewsTabBar({
  selectedQuery,
  setSelectedQuery,
}: NewsTabBarProps) {
  return (
    <div className="flex overflow-x-auto whitespace-nowrap gap-6 border-b border-gray-200 pb-3 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedQuery(tab)}
          className={`text-sm font-medium transition ${
            selectedQuery === tab
              ? 'text-gray-900 border-b-2 border-gray-900 pb-2'
              : 'text-gray-500 hover:text-gray-900'
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}