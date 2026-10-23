export function PageSkeleton() {
  return (
    <div className="mx-auto w-full max-w-[1400px] px-4 py-8">
      <div className="h-10 w-64 rounded-[10px] bg-surface" />
      <div className="mt-4 h-5 w-full max-w-md rounded-[10px] bg-surface" />
      <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {["a", "b", "c", "d", "e", "f"].map((key) => (
          <div key={key} className="aspect-[4/5] rounded-[16px] bg-surface" />
        ))}
      </div>
    </div>
  )
}
