"use client"
import Link from "next/link";

type HeroProps={
    title: string;
    subtitle: string;
    ctalabel?: string;
}

export default function Hero({title, subtitle, ctalabel='Начать'}: HeroProps) {
  return (
    <section className="text-center max-w-3xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
          {title}
        </h1>
        <p className="text-lg text-gray-600 mb-8">
          {subtitle}
        </p>
        <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition cursor-pointer">
          <Link href='/signup'>
            {ctalabel}
          </Link>
        </button>
    </section>
  );
}



