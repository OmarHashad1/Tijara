"use client";

import { useState } from "react";
import {
  keepPreviousData,
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { toast } from "sonner";
import {
  adminBanUser,
  adminHardDeleteUser,
  adminListUsers,
  adminRestoreUser,
  adminSoftDeleteUser,
  adminUnbanUser,
} from "@/lib/api/admin";
import { apiErrorMessage } from "@/lib/api/client";
import type { Role } from "@/lib/api/types";
import { CatalogPagination } from "@/components/catalog/catalog-pagination";

function useUserAction<TInput>(
  mutationFn: (input: TInput) => Promise<void>,
  successMessage: string,
) {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin", "users"] });
      toast.success(successMessage);
    },
    onError: (error) => toast.error(apiErrorMessage(error)),
  });
}

export default function AdminUsersPage() {
  const [search, setSearch] = useState("");
  const [role, setRole] = useState<Role | "all">("all");
  const [page, setPage] = useState(1);

  const { data, isPending } = useQuery({
    queryKey: ["admin", "users", search, role, page],
    queryFn: () =>
      adminListUsers({
        search: search || undefined,
        role: role === "all" ? undefined : role,
        page,
        size: 15,
      }),
    placeholderData: keepPreviousData,
  });

  const banMutation = useUserAction(adminBanUser, "User banned.");
  const unbanMutation = useUserAction(adminUnbanUser, "User unbanned.");
  const softDeleteMutation = useUserAction(adminSoftDeleteUser, "User deleted.");
  const hardDeleteMutation = useUserAction(
    adminHardDeleteUser,
    "User permanently deleted.",
  );
  const restoreMutation = useUserAction(adminRestoreUser, "User restored.");

  function banWithReason(userId: string) {
    const banReason = window.prompt("Reason for the ban (min 5 characters):");
    if (banReason && banReason.length >= 5) {
      banMutation.mutate({ userId, banReason });
    } else if (banReason !== null) {
      toast.error("Ban reason must be at least 5 characters.");
    }
  }

  function hardDeleteWithConfirm(userId: string) {
    if (window.confirm("Permanently delete this user? This cannot be undone.")) {
      hardDeleteMutation.mutate(userId);
    }
  }

  return (
    <>
      <header className="mb-8">
        <h1 className="type-display-md">Users</h1>
      </header>

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <input
          type="search"
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          placeholder="Search name or email…"
          className="type-caption min-h-10 w-64 rounded-md border border-hairline-light bg-canvas-light px-3 outline-none placeholder:text-shade-40 focus:border-ink"
        />
        {(["all", "user", "admin"] as const).map((filter) => (
          <button
            key={filter}
            type="button"
            onClick={() => {
              setRole(filter);
              setPage(1);
            }}
            className={`type-eyebrow rounded-full px-3.5 py-2 transition-colors ${
              role === filter
                ? "bg-aloe text-ink"
                : "bg-shade-30 text-ink hover:bg-aloe/60"
            }`}
          >
            {filter}
          </button>
        ))}
      </div>

      <div className="overflow-x-auto rounded-lg border border-hairline-light bg-canvas-light">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-hairline-light">
              {["User", "Role", "Status", "Actions"].map((heading) => (
                <th key={heading} className="type-eyebrow px-4 py-3 text-shade-50">
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-hairline-light">
            {isPending
              ? Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan={4} className="px-4 py-4">
                      <div className="h-5 animate-pulse rounded bg-canvas-cream" />
                    </td>
                  </tr>
                ))
              : data?.docs.map((user) => {
                  const banned = user.status === "BANNED";
                  const deleted = Boolean(user.deletedAt);
                  return (
                    <tr key={user._id}>
                      <td className="px-4 py-3">
                        <p className="type-caption text-ink">
                          {user.firstName} {user.lastName}
                        </p>
                        <p className="type-micro text-shade-50">{user.email}</p>
                      </td>
                      <td className="type-caption px-4 py-3">{user.role}</td>
                      <td className="px-4 py-3">
                        <span
                          className={`type-eyebrow rounded-full px-2.5 py-1 ${
                            deleted
                              ? "bg-shade-30 text-shade-60"
                              : banned
                                ? "bg-shade-70 text-on-primary"
                                : "bg-pistachio text-ink"
                          }`}
                        >
                          {deleted ? "deleted" : banned ? "banned" : user.status}
                        </span>
                        {banned && user.banReason && (
                          <p className="type-micro mt-1 max-w-48 text-shade-50">
                            {user.banReason}
                          </p>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex flex-wrap gap-3">
                          {deleted ? (
                            <ActionLink
                              label="Restore"
                              onClick={() => restoreMutation.mutate(user._id)}
                            />
                          ) : (
                            <>
                              {banned ? (
                                <ActionLink
                                  label="Unban"
                                  onClick={() => unbanMutation.mutate(user._id)}
                                />
                              ) : (
                                <ActionLink
                                  label="Ban"
                                  onClick={() => banWithReason(user._id)}
                                />
                              )}
                              <ActionLink
                                label="Delete"
                                onClick={() =>
                                  softDeleteMutation.mutate(user._id)
                                }
                              />
                            </>
                          )}
                          <ActionLink
                            label="Hard delete"
                            onClick={() => hardDeleteWithConfirm(user._id)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
          </tbody>
        </table>
        {data && data.docs.length === 0 && (
          <p className="type-caption px-4 py-8 text-center text-shade-50">
            No users match these filters.
          </p>
        )}
      </div>

      {data && (
        <CatalogPagination
          meta={data.meta}
          currentPage={page}
          onPageChange={setPage}
        />
      )}
    </>
  );
}

function ActionLink({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="type-caption text-shade-50 underline-offset-2 hover:text-ink hover:underline"
    >
      {label}
    </button>
  );
}
