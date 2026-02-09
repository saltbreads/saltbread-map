/**
 * 이미지가 하나도 없을 때 보여주는 플레이스홀더 컴포넌트
 */
export function EmptyGallery({ text }: { text: string }) {
  return (
    <div className="flex h-full w-full items-center justify-center bg-zinc-50 text-sm text-zinc-500">
      📷 {text}
    </div>
  );
}
