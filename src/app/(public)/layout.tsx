import LayoutHeader from "@/components/LayoutHeader";
import LayoutFooter from "@/components/LayoutFooter";
import WhatsAppWidget from "@/components/WhatsAppWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col min-h-screen bg-slate-50">
      <LayoutHeader />
      <main className="flex-grow">{children}</main>
      <LayoutFooter />
      <WhatsAppWidget />
    </div>
  );
}
