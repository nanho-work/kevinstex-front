"use client";

import { useEffect, useRef } from "react"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/ScrollTrigger"

gsap.registerPlugin(ScrollTrigger)

function StepCard({ step, title, description, icon }: { step: string; title: string; description: string; icon: string }) {
    return (
        <div className="bg-blue-50 rounded-lg w-full h-72 md:w-72 md:h-72 p-4 shadow-md border-2 border-blue-400">
            <div className="bg-white rounded-lg w-full h-full p-1">
                <div className="bg-blue-50 rounded-lg p-6 w-full h-full text-center">
                    <p className="text-purple-600 text-lg mb-2">{step}</p>
                    <p className="font-bold mb-2">{title}</p>
                    <p className="text-gray-700 text-sm mb-6">{description}</p>
                    <img src={`/icons/${icon}`} alt={title} className="w-12 h-12 md:w-16 md:h-16 mx-auto mb-4" />
                </div>
            </div>
        </div>
    )
}

export default function ProcessSection() {
    const steps = [
        { step: "STEP 01", title: "신청", description: "원클릭 간편조회 접수하기", icon: "touch.png" },
        { step: "STEP 02", title: "검토", description: "환급금액 산출 및 안내", icon: "checklist.png" },
        { step: "STEP 03", title: "제출", description: "계약 진행", icon: "document.png" },
        { step: "STEP 04", title: "세무서 접수", description: "세무서 대응", icon: "receptionist.png" },
        { step: "STEP 05", title: "환급", description: "2개월 이내", icon: "refund.png" },
        { step: "STEP 06", title: "계약 이행", description: "수수료 수취", icon: "rate.png" },
    ]

    const cardsRef = useRef<HTMLDivElement[]>([])
    const sectionRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        gsap.from(cardsRef.current, {
            opacity: 0,
            y: 50,
            stagger: 0.6,
            duration: 0.9,
            ease: "power3.out",
            scrollTrigger: {
                trigger: sectionRef.current,
                start: "top 100%",
            }
        })
    }, [])

    return (
        <section className="py-20 w-full" ref={sectionRef}>
            <h2 className="text-2xl font-bold text-center mb-10">진행 절차</h2>

            {/* // 웹버전 */}
            <div className="hidden md:block">
                <div className="flex justify-between py-10 p-10 space-x-8 mb-6">
                    <div className="flex items-center space-x-4" ref={el => { if (el) cardsRef.current[0] = el }}>
                        <StepCard {...steps[0]} />
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-gray-400">➡︎</span>
                    </div>
                    <div className="flex items-center space-x-4" ref={el => { if (el) cardsRef.current[1] = el }}>
                        <StepCard {...steps[1]} />
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-gray-400">➡︎</span>
                    </div>
                    <div className="flex items-center space-x-4" ref={el => { if (el) cardsRef.current[2] = el }}>
                        <StepCard {...steps[2]} />
                    </div>
                </div>

                <div className="flex justify-end mr-40 mb-6">
                    <span className="text-3xl text-gray-400">⬇︎</span>
                </div>

                <div className="flex justify-between py-10 p-10 space-x-8">
                    <div className="flex items-center space-x-4" ref={el => { if (el) cardsRef.current[5] = el }}>
                        <StepCard {...steps[5]} />
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-gray-400">⬅︎</span>
                    </div>
                    <div className="flex items-center space-x-4" ref={el => { if (el) cardsRef.current[4] = el }}>
                        <StepCard {...steps[4]} />
                    </div>
                    <div className="flex items-center justify-center">
                        <span className="text-3xl text-gray-400">⬅︎</span>
                    </div>
                    <div className="flex items-center space-x-4" ref={el => { if (el) cardsRef.current[3] = el }}>
                        <StepCard {...steps[3]} />
                    </div>
                </div>
            </div>

            {/* // 모바일버전 */}
            <div className="block md:hidden">
                <div className="grid grid-cols-2 gap-3 mt-10">
                    {steps.map((stepObj, index) => (
                        <div key={index} ref={el => { if (el) cardsRef.current[index + 6] = el }}>
                            <StepCard {...stepObj} />
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}