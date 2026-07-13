"use client";

import { useQuery } from "@tanstack/react-query";
import { api } from "@/lib/api/client";

/** Presigned URLs expire server-side (~15 min) — refresh well before that. */
const ASSET_STALE_MS = 10 * 60_000;

/**
 * Resolves a stored S3 key to a presigned URL via GET /public/<key>
 * (answers `{message, url}`). Keys are the only supported source — when the
 * backend or S3 errors, `url` stays undefined and the caller renders its
 * placeholder.
 */
export function useAssetUrl(assetKey?: string | null): {
  url?: string;
  isResolving: boolean;
} {
  const { data, isPending } = useQuery({
    queryKey: ["asset", assetKey],
    queryFn: async () => {
      const res = await api.get<{ url: string }>(
        `/public/${encodeURI(assetKey!)}`,
      );
      return res.data.url;
    },
    enabled: Boolean(assetKey),
    staleTime: ASSET_STALE_MS,
    retry: 1,
  });

  if (!assetKey) return { url: undefined, isResolving: false };
  return { url: data, isResolving: isPending };
}
