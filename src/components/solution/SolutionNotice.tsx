'use client';

import { useState } from 'react';

export default function SolutionNotice() {
  const [open, setOpen] = useState(true);

  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg max-w-md text-center">
        <h2 className="text-lg font-bold mb-2">안내</h2>
        <p className="text-gray-700 text-lg mb-4">
          신청번호 입력란에 <span className="font-mono font-bold">17777</span>을 입력해 주세요.
        </p>
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded"
          onClick={() => setOpen(false)}
        >
          확인
        </button>
      </div>
    </div>
  );
}