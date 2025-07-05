'use client';

import '@fontsource/dancing-script';
import Image from 'next/image';

const prefix = process.env.NODE_ENV === 'production' ? '/kevinstex-front' : ''

export default function About() {
    return (
        <main className="bg-white py-16 px-4 font-Pretendard">
            <div className="max-w-5xl mx-auto">
                <h1 className="text-3xl font-bold text-blue-900 mb-8 text-center">
                    대표 세무사 소개
                </h1>

                <div className="flex flex-col md:flex-row items-center md:items-start gap-8">
                    {/* 프로필 이미지 */}
                    <Image
                        src={`${prefix}/kwon_profile.png`}
                        alt="권도윤 세무사"
                        width={200}
                        height={200}
                        className="rounded-full shadow-md"
                    />

                    {/* 소개 내용 */}
                    <div className="text-gray-800 text-base leading-loose">
                        <p className="mb-4">안녕하세요.</p>
                        <p className="mb-4">
                            만나 뵙게 되어 반갑습니다. <strong>송파구 문정동</strong>에 위치한 <strong>디케빈즈택스랩</strong> 대표 세무사 <strong>권도윤</strong>입니다.
                        </p>
                        <p className="mb-4">세무사를 하다 보면 고객분들께 이런 질문을 종종 듣습니다.</p>
                        <p className="mb-4">
                            <strong><em>"세금은 세무사님께 쉬운 퍼즐 같은 건가요?"</em></strong>
                        </p>
                        <p className="mb-4">
                            사실 세금은 단순한 퍼즐이라기보다는, 고객 한 분 한 분의 이야기를 듣고 가장 알맞은 그림을 함께 그려나가는 과정이라 말씀드리고 싶습니다.
                        </p>
                        <p className="mb-4">
                            이 페이지를 읽고 계신 여러분과 그런 멋진 그림을 함께 그릴 수 있기를 기대하며, 저에 대해 조금 더 소개드리겠습니다.
                        </p>

                        <h2 className="text-xl font-semibold mt-8 mb-2 text-blue-900">학력 및 자격</h2>
                        <ul className="list-disc list-inside mb-4">
                            <li>Murchison Middle School, Austin, TX, USA 졸업</li>
                            <li>Anderson High School, Austin, TX, USA 입학</li>
                            <li>영동일 고등학교 졸업</li>
                            <li>동국대학교 화공생물공학과 입학</li>
                            <li>동국대학교 경제학과 졸업</li>
                            <li>2013년 펀드 투자상담사 자격증 취득</li>
                            <li>2014년 증권 투자상담사 자격증 취득</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-2 text-blue-900">경력</h2>
                        <ul className="list-disc list-inside mb-4">
                            <li>현) 디 케빈즈 택스랩 대표 세무사</li>
                            <li>전) 남택스&컨설팅 근무</li>
                            <li>전) 세무법인 배 근무</li>
                            <li>전) 세무법인 혜안 근무</li>
                        </ul>

                        <h2 className="text-xl font-semibold mb-2 text-blue-900">전문 분야</h2>
                        <ul className="list-disc list-inside mb-4">
                            <li>기장 대리 / 신고 대리</li>
                            <li>양도 상속 증여</li>
                            <li>법인 컨설팅 / 가업승계</li>
                            <li>세무 조사</li>
                            <li>신용등급관리</li>
                        </ul>

                        <p className="mb-4">
                            저는 고객 여러분의 <strong>세무 파트너</strong>로서, 신뢰와 전문성을 바탕으로 한 조언과 도움을 드릴 것을 약속드립니다.
                            단순한 신고 대행이 아닌, 절세 전략과 경영 조언을 통해 <strong>함께 성장하는 동반자</strong>가 되겠습니다.
                        </p>
                        <p className="mb-4">
                            앞으로 여러분의 곁에서 최선의 서비스를 제공하며, 세무 고민부터 경영 고민까지 든든하게 함께하겠습니다. 감사합니다.
                        </p>

                        <p
                            className="mt-8 text-right text-gray-500"
                            style={{ fontFamily: 'KCC-eunyoung', fontSize: '1.5rem' }}
                        >
                            디케빈즈택스랩 | 대표 세무사 권도윤
                        </p>
                    </div>
                </div>
            </div>
        </main>
    );
}