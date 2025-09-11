import SolutionFrame from '@/components/solution/SolutionFrame';
import SolutionNotice from '@/components/solution/SolutionNotice';

export default function SolutionPage() {
    return (
        <main className="max-w-screen-xl mx-auto p-4">
            <SolutionNotice />
            <h1 className="text-4xl font-bold top-5 mb-4 text-center">
                <span className="block md:hidden">
                    세금환급<br />무료조회
                </span>
                <span className="hidden md:inline">
                    세금환급 무료조회
                </span>
            </h1>
            <SolutionFrame className="mb-10" />

            <p className="mb-6 text-gray-700 text-3xl text-center leading-loose">
                화면 전환 후  <br />
                신청번호 :<span className="font-mono text-blue-600 font-bold"> 17777</span>
            </p>
        </main>
    );
}