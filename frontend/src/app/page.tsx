"use client"
import Header from "@/app/(components)/Header";
import Hero from "@/app/(components)/Hero";


export default function Home() {
  // const tryConnection = async (): Promise<void> => {
  //   try {
  //     const response: Response = await fetch('/api/ping');

  //     if (!response.ok) {
  //       throw new Error(`HTTP error! status: ${response.status}`);
  //     }

  //     const data = await response.json();
  //     console.log(data);
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   }
  // };
  return (
    <main className="min-h-screen bg-white px-4 py-12 h-screen pt-20">
      <Header />
      <Hero
        title="Цифровая платформа для ВУЗов"
        subtitle="Упростите управление сайтом. Откажитесь от старых решений. Перейдите на UniPlatform."
        ctalabel="Попробовать бесплатно"
      />
      {/* <button onClick={() => tryConnection()}>Ping</button> */}
    </main>
  );
}

