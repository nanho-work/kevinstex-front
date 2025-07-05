'use client';

export default function LocationMap() {
  return (
    <div
      className="grid grid-cols-1 md:grid-cols-3 gap-6"
      style={{
        font: 'normal normal 400 12px/normal dotum, sans-serif',
        color: '#333',
        position: 'relative',
        padding: '20px',
      }}
    >
      {/* 지도 (좌측) */}
      <div className="md:col-span-2">
        <div style={{ height: '360px' }}>
          <a
            href="https://map.kakao.com/?urlX=527017.000000002&urlY=1108027.9999999993&itemId=324566193&q=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&srcid=324566193&map_type=TYPE_MAP&from=roughmap"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img
              className="map"
              src="http://t1.daumcdn.net/roughmap/imgmap/e0087656b86ebf9b83c23bb6d3592b7bc07709c14fd45cacdfb55c3493620865"
              width="100%"
              height="360px"
              style={{ border: '1px solid #ccc' }}
              alt="디 케빈즈 택스랩 지도"
            />
          </a>
        </div>

        <div
          style={{
            overflow: 'hidden',
            padding: '7px 11px',
            border: '1px solid rgba(0, 0, 0, 0.1)',
            borderRadius: '0 0 2px 2px',
            backgroundColor: 'rgb(249, 249, 249)',
            marginTop: '4px',
          }}
        >
          <a href="https://map.kakao.com" target="_blank" rel="noopener noreferrer" style={{ float: 'left' }}>
            <img
              src="//t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png"
              width="72"
              height="16"
              alt="카카오맵"
              style={{ display: 'block' }}
            />
          </a>
          <div style={{ float: 'right', fontSize: '11px' }}>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://map.kakao.com/?from=roughmap&srcid=324566193&confirmid=324566193&q=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&rv=on"
              style={{ marginRight: '8px', color: '#000', textDecoration: 'none' }}
            >
              로드뷰
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://map.kakao.com/?from=roughmap&eName=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&eX=527017.000000002&eY=1108027.9999999993"
              style={{ marginRight: '8px', color: '#000', textDecoration: 'none' }}
            >
              길찾기
            </a>
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://map.kakao.com?map_type=TYPE_MAP&from=roughmap&srcid=324566193&itemId=324566193&q=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&urlX=527017.000000002&urlY=1108027.9999999993"
              style={{ color: '#000', textDecoration: 'none' }}
            >
              지도 크게 보기
            </a>
          </div>
        </div>
      </div>

      {/* 안내 정보 (우측) */}
      <div className="md:col-span-1 bg-opacity-70 rounded shadow overflow-auto">
        <div
          style={{
            padding: '20px',
            borderRadius: '10px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
            fontFamily: 'sans-serif',
            lineHeight: 1.6,
            height: '100%',
            backgroundColor: '#fff',
          }}
        >
          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1D4ED8', marginBottom: '10px' }}>📍 주소</h2>
          <p>서울 송파구 송파대로22길 5-20, 1층 101호</p>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1D4ED8', margin: '20px 0 10px' }}>🚇 지하철 이용 시</h2>
          <p>문정역 1번 출구에서 도보 약 3분 (약 213m)</p>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1D4ED8', margin: '20px 0 10px' }}>🕒 영업시간</h2>
          <p>
            평일: 10:00 ~ 17:00<br />
            토/일/공휴일: 휴무
          </p>

          <h2 style={{ fontSize: '16px', fontWeight: 'bold', color: '#1D4ED8', margin: '20px 0 10px' }}>🗺️ 찾아오시는 길</h2>
          <p>
            문정역 1번 출구에서 나와 약 100m 직진 후 첫 골목에서 우회전합니다.<br />
            약 50m 걷다 송파대로 22길로 다시 좌회전하여 100m 정도 직진하면 도착입니다.<br />
            전체 도보 시간은 약 3분입니다.
          </p>

          <div style={{ marginTop: '20px', textAlign: 'right' }}>
            <a
              href="https://map.kakao.com/link/to/THE KEVIN'S TAX LAB,37.488268,127.122150"
              target="_blank"
              style={{ color: '#1D4ED8', fontSize: '14px', textDecoration: 'underline' }}
              rel="noopener noreferrer"
            >
              길찾기 바로가기
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}