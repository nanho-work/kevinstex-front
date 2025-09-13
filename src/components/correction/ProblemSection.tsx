"use client";

import animation4 from '@/animations/thinking.json';
import Lottie from "lottie-react";
import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ProblemSection() {
    // Checklist items for common 경정청구 issues
    const checklist = [
        '개인사업자 또는 법인사업자이신가요?',
        '지난 5년 이내에 신고·납부하신 세금이 있으신가요?',
        '직원을 고용한 적이 있으신가요?',
        '비용 처리를 누락한 적이 있다고 느끼시나요?',
    ];

    const listRefs = useRef<(HTMLLIElement | null)[]>([]);
    listRefs.current = [];
    const addToRefs = (el: HTMLLIElement) => {
      if (el && !listRefs.current.includes(el)) {
        listRefs.current.push(el);
      }
    };

    useEffect(() => {
      listRefs.current.forEach((el, index) => {
        gsap.fromTo(
          el,
          { x: 50, opacity: 0 },
          {
            x: 0,
            opacity: 1,
            duration: 0.6,
            delay: index * 0.2,
            scrollTrigger: {
              trigger: el,
              start: "top 90%",
            },
          }
        );
      });
    }, []);

    return (
        <section className="w-full py-16 bg-white">
            <div className="w-full mx-auto">
                <h2 className="text-2xl font-bold mb-4 text-center">
                    아래 항목 중 하나라도 해당되신다면
                    <br className="block md:hidden" />
                    경정청구가 가능합니다.
                </h2>
                <p className="text-gray-700 mb-8 text-center">
                    사업자·개인이 놓치기 쉬운 환급 사례 (예: 부가세, 종소세 누락)
                </p>

                <div className="grid md:grid-cols-10 gap-8 items-center">
                    {/* 왼쪽 Lottie 애니메이션 영역 */}
                    <div className="w-full rounded-lg flex items-center justify-center md:col-span-4">
                        <Lottie
                            animationData={animation4}
                            loop={true}
                            style={{ width: 400, height: 280 }}
                        />
                    </div>

                    {/* 오른쪽 체크리스트 */}
                    <ul className="flex flex-col gap-4 md:col-span-6">
                        {checklist.map((item, idx) => (
                            <li
                                key={idx}
                                ref={addToRefs}
                                className="flex items-center bg-gray-50 rounded-lg px-4 py-3 shadow-sm"
                            >
                                <span className="w-8 h-8 mr-4 flex items-center justify-center bg-blue-200 rounded-full text-blue-400">
                                    <img src="/icons/check-blue.svg" className="w-6 h-6" alt="파란 체크" />
                                </span>
                                <span className="text-left text-gray-800">{item}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    );
}