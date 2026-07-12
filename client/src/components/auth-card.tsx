/** Centered transactional-track panel shared by every auth page. */
export function AuthCard({
  eyebrow,
  title,
  subtitle,
  children,
}: {
  eyebrow: string;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center bg-canvas-cream px-6 py-16 md:py-24">
      <div className="w-full max-w-md rounded-lg border border-hairline-light bg-canvas-light p-8 shadow-elev-3 md:p-10">
        <p className="type-eyebrow mb-3 text-shade-50">{eyebrow}</p>
        <h1 className="type-heading-xl">{title}</h1>
        {subtitle && (
          <p className="type-body-md mt-2 text-shade-50">{subtitle}</p>
        )}
        <div className="mt-8">{children}</div>
      </div>
    </div>
  );
}
