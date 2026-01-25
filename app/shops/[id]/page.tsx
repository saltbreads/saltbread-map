import ShopDetailPage from "@/components/pages/ShopDetailPage";

type PageProps = {
  params: {
    id: string;
  };
};

export default function Page({ params }: PageProps) {
  return <ShopDetailPage params={params} />;
}
