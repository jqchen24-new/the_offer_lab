export function PageContainer({ children }: { children: React.ReactNode }) {
  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {children}
    </main>
  );
}
