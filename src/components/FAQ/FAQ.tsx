// src/components/FAQ.tsx
'use client'

import { useState, useEffect, useRef } from 'react';
import Lottie from 'lottie-react';
import faqAnimation from '@/animations/faq-web-page.json';
import gsap from 'gsap';

const faqData = [
  {
    question: 'Q. 매달 나가는 기장료가 부담되는데, 꼭 세무사에게 맡겨야 할까요?',
    answer: (
      <>
        <p className="mb-4">
          업종별 연매출이 일정 기준 이하인 경우에는 간편장부 대상자로서 직접 세무 신고를 해보는 것도 한 가지 방법입니다.<br />
          예를 들어, 도소매업은 3억 원 미만, 제조업은 1억5천만 원 미만, <br />서비스업은 7,500만 원 미만일 경우 간편장부 대상자가 될 수 있습니다.
          (자세한 기준은{' '}
          <a href="https://www.nts.go.kr/nts/cm/cntnts/cntntsView.do?mi=2230&cntntsId=7669" target="_blank" rel="noopener noreferrer" className="text-gray-700 underline hover:text-gray-900">
            국세청 안내 페이지
          </a>
          에서 확인하실 수 있습니다)
        </p>
        <p className="mb-3 font-semibold">아래와 같은 경우라면 전문가에게 기장을 맡기는 것이 훨씬 더 유리할 수 있습니다:</p>
        <ol className="list-decimal list-inside mb-4 space-y-4 mt-2">
          <li>
            <span className="font-medium">세금 혜택을 놓치면 오히려 손해입니다.</span>
            <div className="pl-4 mt-2">
              조세특례제한법상 다양한 세액공제 및 감면 제도를 제대로 활용하지 못하면, 실제보다 많은 세금을 납부하게 될 수 있습니다.<br />
              또한 회계 오류로 인해 대출이 거절되거나, 정부 지원사업에서 불이익을 받을 수 있는 위험도 존재합니다.
            </div>
          </li>
          <li>
            <span className="font-medium">대표님의 시간은 더 가치 있게 사용될 수 있습니다.</span>
            <div className="pl-4 mt-2">
              매달 10시간을 세무 업무에 할애한다고 가정하면, 월 10만 원의 기장료는 시간당 1만 원의 비용 절감 효과가 있습니다.<br />
              2025년 기준 최저임금이 시간당 10,030원임을 감안해도, 대표님이 그 시간 동안 사업 전략을 구상하거나 매출을 올릴 활동에 집중하는 편이 훨씬 생산적입니다.<br />
              더불어 비전문가가 직접 신고할 경우 실수로 인한 가산세 발생 가능성도 크기 때문에, 이러한 ‘실패 비용’까지 감안하면 세무 전문가에게 맡기는 것이 더 현명한 선택입니다.
            </div>
          </li>
        </ol>
        <p>기장료는 단순히 비용이 아니라, 사업 리스크를 줄이고 절세 기회를 지키기 위한 투자라고 생각해 보시는 것도 좋겠습니다.</p>
      </>
    )
  },
  {
    question: 'Q. 세무 업무는 국세청이나 세무서 출신 세무사에게 맡기는 게 더 좋은 거 아닌가요?',
    answer: (
      <>
        <p className="mb-4">
          꼭 그렇지는 않습니다. 전관 출신 세무사가 무조건 유리하다는 인식은 과거의 이야기입니다.
        </p>
        <p className="mb-4">
          예전에는 일부 전관 출신들이 인맥을 활용해 세무조사 대응에서 다소 편법적인 방식으로 유리함을 취하는 경우가 있었지만,<br />
          현재는 세무 행정 전반이 매우 투명해졌습니다.
        </p>
        <p className="mb-4">
          특히 평소에 단순 기장, 종소세, 법인세 신고 등 일상적인 업무를 맡기실 경우에는<br />
          전관 출신의 높은 수임료에 비해 별다른 실익이 없어, 오히려 비효율적일 수 있습니다.
        </p>
        <p className="mb-4">
          또한 지방 국세청 세무조사처럼 규모가 큰 경우에는<br />
          보통 세무사 1명이 단독으로 대응하기엔 시간이 부족해, 여러 명이 팀을 이루어 협업하는 방식으로도 진행됩니다.<br />
          이때는 평소 함께 일해 온 파트너 세무사들이 자연스럽게 역할을 나누며 대응하기 때문에,<br />
          전관 출신이 아니더라도 충분히 전문적이고 전략적인 대응이 가능합니다.
        </p>
        <p>
          결국 중요한 건 ‘전관 여부’보다는<br />
          누가 내 사업을 꼼꼼하게 관리해주고, 조사나 이슈 발생 시 실질적으로 대응할 수 있는 체계를 갖췄는지 여부입니다.
        </p>
      </>
    )
  },
  {
    question: 'Q. 제가 서울이 아닌 지역에 있는데, 그래도 세무 업무를 맡길 수 있을까요?',
    answer: (
      <>
        <p className="mb-4">
          네, 전혀 문제 없습니다.
        </p>
        <p className="mb-4">
          요즘 세무 업무는 대부분 전산화되어 있어, 지역에 상관없이 전국 어디서든 원활하게 진행할 수 있습니다.
        </p>
        <p className="mb-4">
          전자세금계산서, 카드 매출, 현금영수증 등 주요 증빙자료는 국세청 시스템과 연동되어 있으므로<br />
          별도로 파일을 전달하지 않으셔도 저희가 바로 확인할 수 있습니다.
        </p>
        <p className="mb-4">
          추가로 필요한 서류가 있을 경우에는 카카오톡이나 이메일을 통해 간단히 사진이나 파일로 보내주시면 됩니다.
        </p>
        <p>
          저희 사무실에도 제주도, 부산, 대전는 물론이고 해외 사업장을 운영 중인 고객도 계시기 때문에,<br />
          지역적인 제약 없이 충분히 원격으로 대응이 가능합니다.<br />
          서울에 계시지 않더라도 안심하고 맡기셔도 좋습니다.
        </p>
      </>
    )
  }
];

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const answerRefs = useRef<(HTMLDivElement | null)[]>([]);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  useEffect(() => {
    answerRefs.current.forEach((ref, idx) => {
      if (!ref) return;
      if (openIndex === idx) {
        gsap.fromTo(
          ref,
          { height: 0, opacity: 0, y: -10 },
          { height: 'auto', opacity: 1, y: 0, duration: 0.4, ease: 'power2.out' }
        );
      } else {
        gsap.to(ref, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
      }
    });
  }, [openIndex]);

  return (
    <section className="w-full">
      <div className="mb-12">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          <div className="w-14 h-14 md:w-16 md:h-16 flex-shrink-0">
            <Lottie animationData={faqAnimation} loop={true} />
          </div>
          <div>
            <p className="text-xs tracking-widest text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded">FAQ</p>
            <h2 className="mt-3 text-2xl sm:text-3xl font-bold text-gray-900">자주 묻는 질문</h2>
            <p className="mt-2 text-sm sm:text-base text-gray-600">상담 전 자주 문의하시는 내용을 정리했습니다.</p>
          </div>
        </div>
      </div>
      <ul className="space-y-5">
        {faqData.map((item, index) => (
          <li
            key={index}
            className={`bg-white border rounded-xl p-6 transition shadow-sm ${
              openIndex === index ? 'border-gray-400' : 'border-gray-300 hover:border-gray-400'
            }`}
          >
            <button
              onClick={() => toggle(index)}
              className="flex items-start justify-between w-full text-left font-semibold px-1 py-1"
            >
              <span className="text-base md:text-lg text-gray-900 leading-snug">{item.question}</span>
              <span
                className={`ml-4 mt-1 inline-flex h-6 w-6 items-center justify-center rounded-full border border-gray-200 bg-white transition-transform duration-300 ${
                  openIndex === index ? 'rotate-180 text-gray-700' : 'text-gray-500'
                }`}
                aria-hidden
              >
                <svg viewBox="0 0 20 20" fill="none" className="h-4 w-4" xmlns="http://www.w3.org/2000/svg">
                  <path d="M6 8l4 4 4-4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </button>
            <div
              ref={(el) => (answerRefs.current[index] = el)}
              className="overflow-hidden text-gray-700 text-sm sm:text-base leading-relaxed mt-6 pt-5 border-t border-gray-100 space-y-4"
              style={{ height: openIndex === index ? 'auto' : 0 }}
            >
              {openIndex === index && item.answer}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}