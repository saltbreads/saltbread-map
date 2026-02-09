/**
 *  탭 key를 리터럴 유니온으로 고정
 * - 오타/실수 방지
 * - 샵 상세에서 허용되는 탭 범위를 타입으로 보호
 */
export type ShopDetailTabKey = "home" | "menu" | "review" | "photo";

/**
 *  탭 버튼 1개를 정의하는 "데이터 모델"
 * - UI를 하드코딩하지 않고 items 배열로 제어(순서/갯수/비활성/카운트 등)
 */
export type ShopDetailTabItem = {
  key: ShopDetailTabKey; // 어떤 탭인지(내부 로직 기준값)
  label: string; // 사용자에게 보이는 텍스트
  count?: number; // 탭 옆 카운트(리뷰/사진 개수 등, 있을 때만 렌더)
  disabled?: boolean; // 데이터 없거나 미구현 기능이면 비활성화
};
