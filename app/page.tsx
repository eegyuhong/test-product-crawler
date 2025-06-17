import Header from '@/components/header';
import Main from '@/components/main';
import Footer from '@/components/footer';

export default function Home() {
  return (
    <div className="max-w-5xl max-md:max-w-full mx-auto">
      <Header />
      <Main />
      <Footer />
    </div>
  );
}
