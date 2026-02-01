import { mockCreators } from "@/lib/mock/data";
import { CreatorProfileClient } from "./creator-profile-client";

// Required for static export with dynamic routes
export function generateStaticParams() {
  return mockCreators.map((creator) => ({
    id: creator.id,
  }));
}

export default function CreatorProfilePage({
  params,
}: {
  params: { id: string };
}) {
  const creator = mockCreators.find((c) => c.id === params.id);

  if (!creator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-400">Creator not found</p>
      </div>
    );
  }

  return <CreatorProfileClient creator={creator} />;
}
