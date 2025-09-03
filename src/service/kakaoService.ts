// services/kakaoService.ts
export const fetchAddressCoords = async () => {
  const query = "송파대로22길 5-20";
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/kakao/search-address?query=${encodeURIComponent(query)}`);
  if (!res.ok) throw new Error("주소 검색 실패");
  const data = await res.json();
  console.log("전체 응답 data:", data);
  return data.documents[0]; // 가장 첫 결과 사용
};