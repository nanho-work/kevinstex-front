'use client';

import Script from 'next/script';

declare global {
  interface Window {
    kakao: any;
  }
}

export default function LocationMap() {
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
            const container = document.getElementById('map');
            if (!container) {
              console.error('[KAKAO] #map element not found');
              return;
            }

            try {
              const options = {
                center: new window.kakao.maps.LatLng(37.488268, 127.122150),
                level: 3,
              };
              const map = new window.kakao.maps.Map(container, options);
              const marker = new window.kakao.maps.Marker({
                position: options.center,
                map,
                title: '디 케빈즈 택스랩',
              });
              const infowindow = new window.kakao.maps.InfoWindow({
                content: `
                  <div style="font-family:sans-serif;font-size:12px;text-align:left;padding:8px;line-height:1.6">
                    <a href="https://map.naver.com/p/search/%EB%94%94%EC%BC%80%EB%B9%88%EC%A6%88%ED%83%9D%EC%8A%A4%EB%9E%A9/place/1166913410?c=15.00,0,0,0,dh&isCorrectAnswer=true&placePath=/home?from=map&fromPanelNum=1&additionalHeight=76&timestamp=202508041518&locale=ko&svcName=map_pcv5&searchText=%EB%94%94%EC%BC%80%EB%B9%88%EC%A6%88%ED%83%9D%EC%8A%A4%EB%9E%A9"
                       target="_blank" rel="noopener noreferrer">
                      <img src="/logo.png" alt="디 케빈즈 택스랩" style="width: 120px; height: auto; margin-bottom: 6px;" />
                    </a>
                    <div style="font-weight: bold; color: #000">디 케빈즈 택스랩</div>
                    <div style="color: #888;">서울 송파구 송파대로22길 5-20</div>
                    <div style="color: #888;">(우) 05805 &nbsp; (지번) 문정동 53-13</div>
                  </div>
                `,
              });
              infowindow.open(map, marker);
              console.log('[KAKAO] map and marker initialized ✅');
            } catch (err) {
              console.error('[KAKAO] error during map init:', err);
            }
          });
        }}
      />
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-[#333] text-sm font-sans p-5 relative">
        {/* 지도 (좌측) */}
        <div className="md:col-span-2">
          <div id="map" className="min-h-[360px] h-[360px] rounded border border-gray-300" />

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
        <div className="md:col-span-1 bg-white rounded shadow p-5 leading-relaxed h-full">
          <h2 className="text-base font-bold text-blue-700 mb-2">📍 주소</h2>
          <p>서울 송파구 송파대로22길 5-20, 1층 101호</p>

          <h2 className="text-base font-bold text-blue-700 mt-5 mb-2">🚇 지하철 이용 시</h2>
          <p>문정역 1번 출구에서 도보 약 3분 (약 213m)</p>

          <h2 className="text-base font-bold text-blue-700 mt-5 mb-2">🕒 영업시간</h2>
          <p>
            평일: 10:00 ~ 17:00<br />
            토/일/공휴일: 휴무
          </p>

          <h2 className="text-base font-bold text-blue-700 mt-5 mb-2">🗺️ 찾아오시는 길</h2>
          <p>
            문정역 1번 출구에서 나와 약 100m 직진 후 첫 골목에서 우회전합니다.<br />
            약 50m 걷다 송파대로 22길로 다시 좌회전하여 100m 정도 직진하면 도착입니다.<br />
            전체 도보 시간은 약 3분입니다.
          </p>

          <div className="mt-5 text-right">
            <a
              href="https://map.kakao.com/link/to/THE KEVIN'S TAX LAB,37.488268,127.122150"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-700 text-sm underline"
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