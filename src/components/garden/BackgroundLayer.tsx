export function BackgroundLayer() {
  return (
    <div
      aria-hidden="true"
      className="garden-background absolute inset-0"
      style={{ backgroundImage: "url('/garden-forest-bg.png')" }}
    />
  );
}
