"use client";

import { useEffect, useRef } from "react";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export default function ExplanationSection() {
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
  cardRefs.current = [];
  const addToRefs = (el: HTMLDivElement) => {
    if (el && !cardRefs.current.includes(el)) {
      cardRefs.current.push(el);
    }
  };

  const arrowRefs = useRef<(HTMLSpanElement | null)[]>([]);
  arrowRefs.current = [];
  const addArrowRefs = (el: HTMLSpanElement) => {
    if (el && !arrowRefs.current.includes(el)) {
      arrowRefs.current.push(el);
    }
  };

  useEffect(() => {
    cardRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.2,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });

    arrowRefs.current.forEach((el, index) => {
      gsap.fromTo(
        el,
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          duration: 0.6,
          delay: index * 0.2 + 0.1,
          scrollTrigger: {
            trigger: el,
            start: "top 80%",
          },
        }
      );
    });
  }, []);

  return (
    <section className="py-16 p-10 bg-blue-50 rounded-lg mx-auto text-center">
      <h2 className="text-3xl text-start font-bold mb-2 pl-4">경정 청구란?</h2>
      <h3 className="text-xl text-start  mb-10 pl-4">
        납세자가 세금을 더
        <br className="block md:hidden" />
        많이 납부했거나 잘못 납부했을 때,
        <br className="block md:hidden" />
        국세청에 이를 바로잡아
        <br className="block md:hidden" />
        더 낸 세금을 돌려달라고 요청하는 제도
      </h3>
      <div className="flex flex-col p-6 md:flex-row items-center justify-between gap-6">
        <div ref={addToRefs} className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center w-72">
            <img src="/icons/five.png" alt="5년 이내" className="w-20 h-32" />
          <h3 className="text-lg font-semibold mb-2">납세신고 후 5년 이내</h3>
          <p className="text-gray-700 text-sm">신고일로부터 5년 이내라면</p>
        </div>
        <span ref={addArrowRefs} className="text-3xl text-gray-400">
          <span className="hidden md:inline">→</span>
          <span className="inline md:hidden">↓</span>
        </span>
        <div ref={addToRefs} className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center w-72">
            <img src="/icons/sad.png" alt="5년 이내" className="w-20 h-28" />
          <h3 className="text-lg font-semibold mb-2">세제혜택 자료 누락·착오</h3>
          <p className="text-gray-700 text-sm">공제나 감면 자료를 빠뜨렸거나 실수한 경우</p>
        </div>
        <span ref={addArrowRefs} className="text-3xl text-gray-400">
          <span className="hidden md:inline">→</span>
          <span className="inline md:hidden">↓</span>
        </span>
        <div ref={addToRefs} className="bg-white rounded-lg p-6 shadow-sm flex flex-col items-center w-72">
            <img src="/icons/happy.png" alt="5년 이내" className="w-20 h-28" />
          <h3 className="text-lg font-semibold mb-2">세금 환급!</h3>
          <p className="text-gray-700 text-sm">경정청구로 환급을 받을 수 있습니다</p>
        </div>
      </div>
    </section>
  )
}