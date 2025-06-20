type Props = {
  params: { uni: string };
};

export default async function UniversityPage({ params }: Props) {
  const { uni } = await params;
  console.log('Slug: ', uni)
  return (
    <h1>Uni: {uni}</h1>
  )
}
