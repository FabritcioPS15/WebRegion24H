'use client';

export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`animate-pulse bg-gray-200 ${className}`} />
  );
}

export default function LoadingSkeleton() {
  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="flex items-center gap-4 mb-8 border-b-2 border-gray-100 pb-4">
        <Skeleton className="h-4 w-32" />
        <div className="flex-1 h-[1px] bg-gray-100" />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main News Skeleton */}
        <div className="lg:col-span-2">
          <div className="relative h-[400px] md:h-[600px] bg-gray-100 border border-gray-200">
            <div className="absolute bottom-0 left-0 right-0 p-10">
              <Skeleton className="h-6 w-24 mb-6" />
              <Skeleton className="h-12 w-3/4 mb-4" />
              <Skeleton className="h-12 w-1/2 mb-6" />
              <Skeleton className="h-4 w-32" />
            </div>
          </div>
        </div>

        {/* Side News Skeletons */}
        <div className="flex flex-col gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex gap-4 border-b-2 border-gray-100 pb-6">
              <div className="flex-1">
                <Skeleton className="h-3 w-20 mb-2" />
                <Skeleton className="h-6 w-full mb-2" />
                <Skeleton className="h-4 w-3/4" />
              </div>
              <Skeleton className="w-24 h-24 shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
