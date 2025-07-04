import { ProtectedRoute } from "@/component/protected-route";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <ProtectedRoute>{children}</ProtectedRoute>;
}
