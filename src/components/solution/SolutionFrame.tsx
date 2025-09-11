'use client';

interface SolutionFrameProps {
  className?: string;
}

export default function SolutionFrame({ className }: SolutionFrameProps) {
  const openCorp = () => {
    window.open(
      'https://solution.keumbaek.com/new/process1?corpType=corp',
      '_blank',
      'noopener,noreferrer'
    );
  };

  const openIndividual = () => {
    window.open(
      'https://solution.keumbaek.com/new/process1?corpType=priv',
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <div className={`max-w-xl mx-auto mt-10 ${className ?? ''}`}>
      <h1 className="text-2xl font-bold text-center mb-2">
        <span className="text-blue-600 font-bold">사업자 유형</span>을 선택해 주세요
      </h1>
      <p className="text-center text-gray-500 text-base mb-6">
        사업자 <span className="text-blue-600 font-semibold">50%</span>가 평균 8,950,000원을 환급받습니다.
      </p>
      <div className="space-y-4">
        <button
          onClick={openCorp}
          className="w-full border-4 border-blue-500 rounded-lg p-6 flex items-center justify-between hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <span className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white text-3xl">🏢</span>
            <span className="text-blue-600 font-bold text-2xl">법인사업자</span>
          </div>
          <span className="text-blue-500 text-2xl font-bold">{'❯❯'}</span>
        </button>
        <button
          onClick={openIndividual}
          className="w-full border-4 border-blue-500 rounded-lg p-6 flex items-center justify-between hover:bg-blue-50 transition-colors"
        >
          <div className="flex items-center space-x-4">
            <span className="w-12 h-12 bg-blue-500 rounded-md flex items-center justify-center text-white text-3xl">👤</span>
            <span className="text-green-600 font-bold text-2xl">개인사업자</span>
          </div>
          <span className="text-blue-500 text-2xl font-bold">{'❯❯'}</span>
        </button>
      </div>
    </div>
  );
}