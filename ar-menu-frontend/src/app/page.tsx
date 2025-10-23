import Link from "next/link";

export default function HomePage() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold">AR Menu Platform</h1>
      <Link href="/menu/test" className="mt-6 text-xl text-blue-500 underline">
        Go to 3D Model Test Page
      </Link>
    </main>
  );
}