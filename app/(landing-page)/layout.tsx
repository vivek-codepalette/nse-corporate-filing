export default function RootLayout({
    children,
  }: Readonly<{
    children: React.ReactNode;
  }>) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        {children}
      </div>
    );
  }