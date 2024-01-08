import Header from './Header';

const Layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col h-screen p-5">
      <Header />
      {children}
    </div>
  );
};

export default Layout;
