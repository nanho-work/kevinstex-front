"use client"

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function BenefitsSection() {
    // Pain points for left column
    const painPoints = [
        "복잡한 절차",
        "필요한 서류 준비 어려움",
        "많은 시간 소요",
        "세무 지식 부족으로 오류 발생"
    ];

    const strengths = [
        "원클릭 간단 절차, 무료 상담으로 바로 시작",
        "필요 서류 자동 안내 & 전담 세무사 확인",
        "신속 처리, 평균 2개월 내 환급",
        "전문 세무사 검토로 안전하고 환급률 극대화"
    ];

    const containerRef = useRef<HTMLDivElement>(null);
    const containerRefMobile = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!containerRef.current) return;
        const pains = containerRef.current.querySelectorAll(".pain");
        const arrows = containerRef.current.querySelectorAll(".arrow");
        const strengthsEls = containerRef.current.querySelectorAll(".strength");

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: containerRef.current,
                start: "top 80%"
            }
        });
        pains.forEach((pain, i) => {
            tl.fromTo(
                pain,
                { x: -100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
                i * 0.3
            );
            tl.fromTo(
                arrows[i],
                { opacity: 0 },
                { opacity: 1, duration: 0.3 },
                i * 0.3 + 0.3
            );
            tl.fromTo(
                strengthsEls[i],
                { x: 100, opacity: 0 },
                { x: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
                i * 0.3 + 0.6
            );
        });
    }, []);

    useEffect(() => {
        if (!containerRefMobile.current) return;
        const mobilePains = containerRefMobile.current.querySelectorAll(".mobile-pain");
        const mobileStrengths = containerRefMobile.current.querySelectorAll(".mobile-strength");

        const tlMobile = gsap.timeline({
            scrollTrigger: {
                trigger: containerRefMobile.current,
                start: "top 80%"
            }
        });

        mobilePains.forEach((pain, i) => {
            tlMobile.fromTo(
                pain,
                { opacity: 0 },
                { opacity: 1, duration: 0.5, ease: "power2.out" },
                i * 0.3
            );
            tlMobile.fromTo(
                mobileStrengths[i],
                { opacity: 0, scale: 0.8 },
                { opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" },
                i * 0.3 + 0.3
            );
        });
    }, []);

    return (
        <section className="py-16 max-full mx-auto">
            <h3 className="text-3xl font-semibold mb-10 text-left text-gray-900">
                <span className="bg-gradient-to-r from-blue-500 to-blue-800 bg-clip-text text-transparent">
                    THE KEVIN`s TAX LAB
                </span>
                <br />
                <span className="text-gray-900">경정청구는 뭐가 다를까?</span>
            </h3>
            <div className="flex flex-col ">
                <div className="text-xl font-semibold mb-6 text-gray-800 text-start ml-10">
                    <h4>
                        <span>기존 경정청구의 어려움 &nbsp;</span>
                        <br className="block md:hidden" />
                        <span>THE KEVIN`s TAX LAB 경정청구의 차이</span>
                    </h4>
                </div>
                {/* 웹버전 */}
                <div className="hidden md:block">
                    <div className="w-full ml-10 " ref={containerRef}>
                        {painPoints.map((point, idx) => (
                            <div
                                key={idx}
                                className="flex items-center space-x-4 mb-8"
                                style={{ marginLeft: `${idx * 8}rem` }}
                            >
                                <div className="pain w-96 bg-transparent border border-red-300 rounded-lg p-4 shadow-sm flex items-center justify-center">
                                    <span className="text-red-500 text-lg">❌</span>
                                    <span className="ml-2 text-gray-700">{point}</span>
                                </div>
                                <div className="arrow flex items-center justify-center text-gray-400 text-2xl">→</div>
                                <div className="strength w-96 bg-transparent border border-green-300 rounded-lg p-4 shadow-sm flex items-center justify-center">
                                    <span className="text-green-600 text-lg">✅</span>
                                    <span className="ml-2 text-gray-800">{strengths[idx]}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
                {/* 모바일버전 */}
                <div className="block md:hidden" ref={containerRefMobile}>
                    {painPoints.map((point, idx) => (
                        <div key={idx} className="flex flex-col items-center mb-8 px-2">
                            <div className="mobile-pain w-full bg-transparent border border-red-300 rounded-lg p-4 shadow-sm flex items-center justify-center mb-2">
                                <span className="text-red-500 text-lg">❌</span>
                                <span className="ml-2 text-gray-700">{point}</span>
                            </div>
                            <div className="text-2xl text-gray-400 my-1">↓</div>
                            <div className="mobile-strength w-full bg-transparent border border-green-300 rounded-lg p-4 shadow-sm flex items-center justify-center mt-2">
                                <span className="text-green-600 text-lg">✅</span>
                                <span className="ml-2 text-gray-800">{strengths[idx]}</span>
                            </div>
                            {idx !== painPoints.length - 1 && (
                                <hr className="w-full border-t border-gray-300 my-4" />
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}