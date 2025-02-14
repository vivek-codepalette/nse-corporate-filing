interface ContentWrapperProps {
  children: React.ReactNode;
}

export function ContentWrapper({ children }: ContentWrapperProps) {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6 max-w-7xl mx-auto">
      {children}
    </div>
  );
} 