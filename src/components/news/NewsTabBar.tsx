interface NewsTabBarProps {
  selectedQuery: string;
  setSelectedQuery: (query: string) => void;
}

const tabs = ['종합소득세', '근로소득세', '부가가치세', '법인세', '절세'];

export default function NewsTabBar({ selectedQuery, setSelectedQuery }: NewsTabBarProps) {
  return (
    <div className="flex overflow-x-auto whitespace-nowrap gap-2 mb-6 scrollbar-hide">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedQuery(tab)}
          className={`min-w-[100px] max-w-[140px] whitespace-nowrap text-center px-4 py-2 mb-4 rounded-full border ${
            selectedQuery === tab
              ? 'bg-blue-600 text-white'
              : 'bg-white text-gray-800 border-gray-300'
          } hover:bg-blue-100`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
}