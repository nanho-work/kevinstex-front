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
  const [mapCenter, setMapCenter] = useState({ lat: 37.4882834285316, lng: 127.122189149996 });
  const officeName = '디 케빈즈 택스랩';
  const officeAddress = '경기도 성남시 수정구 위례서로 24, 행복빌딩 5층 502호';
  const officePostalCode = '13647';
  const officeLotNumberAddress = '창곡동 557-3';
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
      <div style="padding: 8px; min-width: 260px; max-width: 360px; white-space: normal; word-break: keep-all;">
        <a href="https://map.kakao.com/link/search/${encodeURIComponent(officeAddress)}"
           target="_blank" rel="noopener noreferrer" class="block mb-4">
          <img src="/logo.png" alt="디 케빈즈 택스랩" class="w-[120px] h-auto mb-1" />
        </a>
        <div class="font-bold text-black">${officeName}</div>
        <div class="text-gray-500">${officeAddress}</div>
        <div class="text-gray-500">(우) ${officePostalCode} / (지번) ${officeLotNumberAddress}</div>
      </div>
    `;
    document.body.appendChild(infowindowContent);

    const container = document.getElementById('map');
    const contentEl = document.getElementById('infowindow-content');
    if (!container || !contentEl) return;

    const options = {
      center: new window.kakao.maps.LatLng(mapCenter.lat, mapCenter.lng),
      level: 3,
    };
    const map = new window.kakao.maps.Map(container, options);
    const marker = new window.kakao.maps.Marker({
      position: options.center,
      map,
      title: officeName,
    });
    const infowindow = new window.kakao.maps.InfoWindow({
      content: contentEl.innerHTML,
    });

    infowindow.open(map, marker);
    window.kakao.maps.event.addListener(marker, 'click', () => {
      infowindow.open(map, marker);
      map.setCenter(marker.getPosition());
    });

    if (window.kakao.maps.services) {
      const geocoder = new window.kakao.maps.services.Geocoder();
      geocoder.addressSearch(officeAddress, (result: any[], status: string) => {
        if (status === window.kakao.maps.services.Status.OK && result[0]) {
          const next = {
            lat: Number(result[0].y),
            lng: Number(result[0].x),
          };
          const nextCenter = new window.kakao.maps.LatLng(next.lat, next.lng);
          marker.setPosition(nextCenter);
          map.setCenter(nextCenter);
          setMapCenter(next);
        }
      });
    }

    return () => {
      document.body.removeChild(infowindowContent);
    };
  }, [scriptLoaded]);


  return (
    <>
      <Script
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT_KEY}&autoload=false&libraries=services`}
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
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 text-[#333] text-sm font-sans px-4 sm:px-6 lg:px-8 py-5 relative">
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
                href={`https://map.kakao.com/link/search/${encodeURIComponent(officeAddress)}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="로드뷰"
                className="text-black no-underline"
              >
                로드뷰
              </a>
              <a
                href={`https://map.kakao.com/link/to/${encodeURIComponent(officeName)},${mapCenter.lat},${mapCenter.lng}`}
                target="_blank"
                rel="noopener noreferrer"
                aria-label="길찾기"
                className="text-black no-underline"
              >
                길찾기
              </a>
              <a
                href={`https://map.kakao.com/link/search/${encodeURIComponent(officeAddress)}`}
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
        <div className="md:col-span-2 bg-white rounded border border-gray-200 p-4 sm:p-5 md:p-6 leading-relaxed h-full">
          <h2 className="text-base font-semibold text-gray-900 mb-4">주소</h2>
          <p>
            경기도 성남시 수정구 위례서로 24,<br />
            행복빌딩 5층 502호
          </p>
          <p className="mt-2 text-gray-600">
            (우) 13647<br />
            (지번) 창곡동 557-3
          </p>

          <h2 className="text-base font-semibold text-gray-900 mt-6 mb-2">방문 안내</h2>
          <ul className="space-y-1">
            <li>건물명: 행복빌딩</li>
            <li>층/호수: 5층 502호</li>
            <li>정확한 동선은 하단 길찾기 버튼을 이용해 주세요.</li>
          </ul>

          <h2 className="text-base font-semibold text-gray-900 mt-6 mb-2">영업시간</h2>
          <p>
            평일: 10:00 ~ 17:00<br />
            토/일/공휴일: 휴무
          </p>

          <div className="mt-5 text-right">
            <a
              href={`https://map.kakao.com/link/to/${encodeURIComponent(officeName)},${mapCenter.lat},${mapCenter.lng}`}
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
