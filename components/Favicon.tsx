import { useState } from "react";
import { Globe } from "lucide-react";
import Image from "next/image";
import { getFaviconUrl } from "@/lib/lib";

export default function Favicon({
  url,
  size = 20,
}: {
  url: string;
  size?: number;
}) {
  const [failed, setFailed] = useState(false);

  if (failed) {
    return <Globe size={size} className="text-muted-foreground" />;
  }

  return (
    <Image
      src={getFaviconUrl(url, size * 2)}
      alt=""
      width={size}
      height={size}
      onError={() => setFailed(true)}
    />
  );
}
