import { SidebarProvider } from "@/components/ui/sidebar";

export default function MakePredictionsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <div className="flex h-full">
        <div className="w-full">{children}</div>
      </div>
    </SidebarProvider>
  );
}
