import UserAuthGuard from "@/providers/UserAuthGuard";

export default function UserProfileLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <UserAuthGuard>{children}</UserAuthGuard>;
}
