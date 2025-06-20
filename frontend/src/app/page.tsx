"use client"
import Header from "./(components)/Header";
import Hero from "./(components)/Hero";


export default function Home() {
  return (
    <main className="min-h-screen bg-white px-4 py-12">
      <Header />
      <Hero 
      title="Цифровая платформа для ВУЗов"
      subtitle="Упростите управление сайтом. Откажитесь от старых решений. Перейдите на UniPlatform."
      ctalabel="Попробовать бесплатно"
      />
    </main>
  );
}

