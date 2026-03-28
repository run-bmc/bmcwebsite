export function GardenDataState({
  title,
  message,
}: {
  title: string;
  message: string;
}) {
  return (
    <section className="garden-surface px-6 py-6 text-center">
      <h2 className="garden-heading text-[2rem] leading-[1.04] text-[#f7f4ee]">{title}</h2>
      <p className="mx-auto mt-3 max-w-2xl text-[15px] leading-7 text-[#d6e1cf]">
        {message}
      </p>
    </section>
  );
}
