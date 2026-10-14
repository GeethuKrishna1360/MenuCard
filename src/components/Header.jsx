export default function Header() {
  return (
    <header className="flex items-center justify-between">
      <a
        className="text-lg font-bold tracking-tight text-stone-900"
        href="/"
        aria-label="MenuCard home"
      >
        MenuCard<span className="text-orange-600">.</span>
      </a>
      <span className="rounded-full border border-stone-200 bg-white px-3 py-1 text-xs font-medium text-stone-500">
        React + Tailwind
      </span>
    </header>
  );
}
