import SolutionFrame from '@/components/solution/SolutionFrame';
import SolutionNotice from '@/components/solution/SolutionNotice';

export default function SolutionPage() {
    return (
        <main className="max-w-screen-xl mx-auto p-4">
            <SolutionNotice />
            <h1 className="text-5xl font-bold top-5 mb-4 text-center">세무환급무료조회</h1>
            <SolutionFrame className="mb-10" />

            <p className="mb-6 text-gray-700 text-4xl text-center">
                화면 전환 후  <br />
                신청번호 :<span className="font-mono font-bold"> 17777</span>
            </p>

        </main>
    );
}