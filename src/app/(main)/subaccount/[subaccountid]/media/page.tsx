import MediaContent from "@/components/media/media-content";
import MediaHeading from "@/components/media/media-heading";
import { getAllMedia } from "@/lib/queries";

export default async function Media({
  params,
}: {
  params: { subaccountid: string };
}) {
  const { subaccountid } = params;

  const media = await getAllMedia(subaccountid);
  return (
    <div className="container py-6 space-y-4 h-full">
      <MediaHeading subaccountid={subaccountid} />
      <MediaContent media={media} />
    </div>
  );
}
