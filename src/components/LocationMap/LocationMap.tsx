'use client';

import Script from 'next/script';
import { useEffect, useState } from 'react';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function LocationMap() {
  const [scriptLoaded, setScriptLoaded] = useState(false);
  // Removed useRouter for App Router compatibility

  // Fallback: If window.kakao.maps exists but scriptLoaded is still false, trigger maps.load
  useEffect(() => {
    if (window.kakao?.maps && !scriptLoaded) {
      window.kakao.maps.load(() => {
        console.log('[KAKAO] kakao.maps.load triggered from fallback useEffect ✅');
        setScriptLoaded(true);
      });
    }
  }, []);

  useEffect(() => {
    if (!scriptLoaded || !window.kakao?.maps) return;

    const infowindowContent = document.createElement('div');
    infowindowContent.id = 'infowindow-content';
    infowindowContent.className = 'font-sans text-[12px] text-left leading-relaxed p-2';
    infowindowContent.style.display = 'none';
    infowindowContent.innerHTML = `
      <div style="padding: 8px; min-width: 260px;">
        <a href="https://map.naver.com/p/search/%EB%94%94%EC%BC%80%EB%B9%88%EC%A6%88%ED%83%9D%EC%8A%A4%EB%9E%A9/place/1166913410?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508041518&locale=ko&svcName=map_pcv5&searchText=%EB%94%94%EC%BC%80%EB%B9%88%EC%A6%88%ED%83%9D%EC%8A%A4%EB%9E%A9"
           target="_blank" rel="noopener noreferrer" class="block mb-4">
          <img src="/logo.png" alt="디 케빈즈 택스랩" class="w-[120px] h-auto mb-1" />
        </a>
        <div class="font-bold text-black">디 케빈즈 택스랩</div>
        <div class="text-gray-500">서울 송파구 송파대로22길 5-20</div>
        <div class="text-gray-500" style="white-space: nowrap;">(우) 05805 &nbsp; (지번) 문정동 53-13</div>
      </div>
    `;
    document.body.appendChild(infowindowContent);

    const container = document.getElementById('map');
    const contentEl = document.getElementById('infowindow-content');
    if (!container || !contentEl) return;

    const options = {
      center: new window.kakao.maps.LatLng(37.4882834285316, 127.122189149996),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    const marker = new window.kakao.maps.Marker({
      position: options.center,
      map,
      title: '디 케빈즈 택스랩',
    });
    const infowindow = new window.kakao.maps.InfoWindow({
      content: contentEl.innerHTML,
    });

    infowindow.open(map, marker);
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
      map.setCenter(options.center);
    });

    return () => {
      document.body.removeChild(infowindowContent);
    };
  }, [scriptLoaded]);


  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false`}
        strategy="afterInteractive"
        onLoad={() => {
          console.log('[KAKAO] Script loaded ✅');
          if (!window.kakao?.maps) {
            console.error('[KAKAO] window.kakao.maps not available');
            return;
          }
          window.kakao.maps.load(() => {
            console.log('[KAKAO] kakao.maps.load complete ✅');
            setScriptLoaded(true);
          });
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-[#333] text-sm font-sans p-5 relative">
        {/* 지도 (좌측) */}
        <div className="md:col-span-3">
          <div id="map" className="min-h-[360px] h-[450px] rounded border border-gray-300" />

          <div className="bg-[#f9f9f9] border border-black/10 rounded-b px-[11px] py-[7px] mt-1 flex justify-between">
            <a
              href="https://map.kakao.com"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="카카오맵 바로가기"
            >
              <img
                src="//t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png"
                width="72"
                height="16"
                alt="카카오맵"
              />
            </a>
            <div className="text-xs space-x-2">
              <a
                href="https://map.kakao.com/?from=roughmap&q=디%20케빈즈%20택스%20랩&map_type=TYPE_MAP&urlX=127.122150&urlY=37.488268"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="로드뷰"
                className="text-black no-underline"
              >
                로드뷰
              </a>
              <a
                href="https://map.kakao.com/?from=roughmap&q=디%20케빈즈%20택스%20랩&map_type=TYPE_MAP&urlX=127.122150&urlY=37.488268"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="길찾기"
                className="text-black no-underline"
              >
                길찾기
              </a>
              <a
                href="https://map.kakao.com/?from=roughmap&q=디%20케빈즈%20택스%20랩&map_type=TYPE_MAP&urlX=127.122150&urlY=37.488268"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="지도 크게 보기"
                className="text-black no-underline"
              >
                지도 크게 보기
              </a>
            </div>
          </div>
        </div>

        {/* 안내 정보 (우측) */}
        <div className="md:col-span-2 bg-white rounded border border-gray-200 p-6 leading-relaxed h-full">
          <p className="text-xs tracking-widest text-gray-400 bg-gray-100 inline-block px-2 py-1 rounded mb-2">LOCATION</p>
          <h2 className="text-base font-semibold text-gray-900 mb-4">주소</h2>
          <p>서울 송파구 송파대로22길 5-20, 1층 101호</p>

          <h2 className="text-base font-semibold text-gray-900 mt-6 mb-2">지하철 이용 시</h2>
          <ul className="space-y-1">
            <li>문정역 1번 출구 기준 도보 약 3분 (약 213m)</li>
            <li>1번 출구 → 약 100m 직진</li>
            <li>첫 골목 우회전 → 약 50m 이동</li>
            <li>송파대로22길 좌회전 → 약 100m 직진</li>
          </ul>

          <h2 className="text-base font-semibold text-gray-900 mt-6 mb-2">영업시간</h2>
          <p>
            평일: 10:00 ~ 17:00<br />
            토/일/공휴일: 휴무
          </p>

          <div className="mt-5 text-right">
            <a
              href="https://map.kakao.com/link/to/THE KEVIN'S TAX LAB,37.488268,127.122150"
              target="_blank"
              rel="noopener noreferrer"
              className="text-gray-700 text-sm underline hover:text-gray-900"
              aria-label="카카오맵 길찾기 바로가기"
            >
              길찾기 바로가기
            </a>
          </div>
        </div>
      </div>
    </>
  );
}