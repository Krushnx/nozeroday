import Image from "next/image";
import Link from "next/link";

export default function Home() {
  return (
    <div className="flex flex-col flex-1 items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <Link href="/grid" className="flex flex-col items-center justify-center gap-4 rounded-lg border-2 border-zinc-200 bg-white p-8 shadow-md transition hover:border-zinc-300 dark:border-zinc-700 dark:bg-zinc-800 dark:hover:border-zinc-600">
        <Image
          src="https://images.emojiterra.com/google/android-11/512px/1f525.png"
          alt="NoZeroDay Logo"
          width={100}
          height={100}
          className="rounded-full"
        />
        <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
          NoZeroDay
        </h1>
        <p className="text-gray-600 dark:text-gray-400">
          Your personal productivity assistant.
        </p>
      </Link>
    </div>
  );
}
