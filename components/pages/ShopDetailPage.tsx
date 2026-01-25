type ShopDetailPageProps = {
  params: {
    id: string;
  };
};

export default function ShopDetailPage({ params }: ShopDetailPageProps) {
  return (
    <main style={{ padding: "24px" }}>
      <h1>Shop Detail Page</h1>
      <p>Shop ID: {params.id}</p>
    </main>
  );
}
