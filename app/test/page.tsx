import { Button } from "@/components/ui/Button";

export default function Page() {
  return (
    <div className="p-6 flex flex-wrap gap-3">
      <Button>Primary</Button>
      <Button variant="secondary">Secondary</Button>
      <Button variant="outline">Outline</Button>
      <Button variant="ghost">Ghost</Button>
      <Button variant="danger">Danger</Button>

      <Button size="sm">Small</Button>
      <Button size="lg">Large</Button>
      <Button size="icon" aria-label="profile">
        👤
      </Button>

      <Button isLoading>Loading</Button>
      <Button href="/" variant="outline">
        링크 버튼
      </Button>
    </div>
  );
}
