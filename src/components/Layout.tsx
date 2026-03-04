import  { type PropsWithChildren } from "react";
import Header from "./Header";

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
    <div className="bg-linear-to-br from-background to-muted">
      <Header />
      <main className="min-h-screen container mx-auto px-4 py-6">
        {children}
      </main>
      <footer className="border-t backdrop-blur-xl py-4 supports-backdrop-filter:bg-background/60">
        <div className="container mx-auto text-center py-4 text-gray-400">
          <p>Made with 💖 by Msd</p>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Layout;
