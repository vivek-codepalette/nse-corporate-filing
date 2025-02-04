import Footer from "@/components/footer";
import Header from "@/components/header";

export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex flex-col h-screen">
        <Header />
        {children}
        <Footer />
      </div>
    );
  }