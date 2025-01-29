import Link from "next/link";

export default function Home() {
  return (
    <main className="w-screen h-screen bg-white font-display relative overflow-hidden">
      <img className="hidden md:block w-screen z-1 absolute bottom-0" src="/lander/pc.svg" alt="background" />
      <img className="md:hidden block w-screen z-1 absolute bottom-0" src="/lander/mobile.svg" alt="background" />

      <div className="flex flex-col items-center justify-center h-[70vh] px-6 md:px-12 relative z-10">
        <h1 className="text-lg text-secondary font-bold text-center mb-8">#HearThem</h1>
        <div className="relative">
        <div className="w-[120px] h-[120px] md:w-[160px] md:h-[160px] rounded-full bg-gradient-to-tr from-primary to-secondary shadow-[0_0_200px] md:shadow-[0_0_300px] shadow-primary mb-8" />
        <div className="rounded-l-full rounded-tr-full rounded-br-lg border-2 border-black absolute md:top-4 top-0 md:-left-26 -left-32 bg-white px-4 py-2">Hi! I am Aphrasis</div>
        </div>
        <h3 className="text-primary font-semibold font-expand">Aphrasis</h3>
        <h2 className="text-xl md:text-4xl text-center mb-6 md:max-w-md max-w-sm font-semibold">Helping through fun and voice-powered learning</h2>
        <Link href="/sign-in" className="bg-primary font-expand text-white px-9 z-20 py-3 rounded-full font-semibold hover:bg-opacity-90 transition-all">
          Sign in
        </Link>
      </div>
    </main>
  );
}
