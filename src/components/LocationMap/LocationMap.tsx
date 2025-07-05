'use client';

export default function LocationMap() {
  return (
    <div
      style={{
        font: 'normal normal 400 12px/normal dotum, sans-serif',
        width: '640px',
        height: '392px',
        color: '#333',
        position: 'relative',
      }}
    >
      <div style={{ height: '360px' }}>
        <a
          href="https://map.kakao.com/?urlX=527017.000000002&urlY=1108027.9999999993&itemId=324566193&q=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&srcid=324566193&map_type=TYPE_MAP&from=roughmap"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            className="map"
            src="http://t1.daumcdn.net/roughmap/imgmap/e0087656b86ebf9b83c23bb6d3592b7bc07709c14fd45cacdfb55c3493620865"
            width="638px"
            height="358px"
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
        }}
      >
        <a href="https://map.kakao.com" target="_blank" rel="noopener noreferrer" style={{ float: 'left' }}>
          <img
            src="//t1.daumcdn.net/localimg/localimages/07/2018/pc/common/logo_kakaomap.png"
            width="72"
            height="16"
            alt="카카오맵"
            style={{ display: 'block', width: '72px', height: '16px' }}
          />
        </a>
        <div style={{ float: 'right', position: 'relative', top: '1px', fontSize: '11px' }}>
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://map.kakao.com/?from=roughmap&srcid=324566193&confirmid=324566193&q=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&rv=on"
            style={{
              float: 'left',
              height: '15px',
              paddingTop: '1px',
              lineHeight: '15px',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            로드뷰
          </a>
          <span
            style={{
              width: '1px',
              padding: 0,
              margin: '0 8px',
              height: '11px',
              verticalAlign: 'top',
              position: 'relative',
              top: '2px',
              borderLeft: '1px solid #d0d0d0',
              float: 'left',
            }}
          />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://map.kakao.com/?from=roughmap&eName=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&eX=527017.000000002&eY=1108027.9999999993"
            style={{
              float: 'left',
              height: '15px',
              paddingTop: '1px',
              lineHeight: '15px',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            길찾기
          </a>
          <span
            style={{
              width: '1px',
              padding: 0,
              margin: '0 8px',
              height: '11px',
              verticalAlign: 'top',
              position: 'relative',
              top: '2px',
              borderLeft: '1px solid #d0d0d0',
              float: 'left',
            }}
          />
          <a
            target="_blank"
            rel="noopener noreferrer"
            href="https://map.kakao.com?map_type=TYPE_MAP&from=roughmap&srcid=324566193&itemId=324566193&q=%EB%94%94%20%EC%BC%80%EB%B9%88%EC%A6%88%20%ED%83%9D%EC%8A%A4%EB%9E%A9&urlX=527017.000000002&urlY=1108027.9999999993"
            style={{
              float: 'left',
              height: '15px',
              paddingTop: '1px',
              lineHeight: '15px',
              color: '#000',
              textDecoration: 'none',
            }}
          >
            지도 크게 보기
          </a>
        </div>
      </div>
    </div>
  );
}