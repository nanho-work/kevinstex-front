interface NewsTabBarProps {
  selectedQuery: string;
  setSelectedQuery: (query: string) => void;
}

const tabs = ['종합소득세', '근로소득세', '부가가치세', '법인세', '절세'];

export default function NewsTabBar({ selectedQuery, setSelectedQuery }: NewsTabBarProps) {
  return (
    <div className="flex flex-wrap justify-center gap-2 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab}
          onClick={() => setSelectedQuery(tab)}
          className={`px-4 py-2 rounded-full border ${
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