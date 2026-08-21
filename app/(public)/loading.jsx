export default function Loading() {
    return (
        <div className="min-h-screen bg-white">
            {/* Skeleton Banner */}
            <div className="h-10 bg-slate-50 animate-pulse" />

            {/* Skeleton Navbar */}
            <div className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-6">
                <div className="w-32 h-8 bg-slate-100 rounded-lg animate-pulse" />
                <div className="flex gap-4">
                    <div className="w-10 h-10 bg-slate-50 rounded-xl animate-pulse" />
                    <div className="w-10 h-10 bg-slate-50 rounded-xl animate-pulse" />
                </div>
            </div>

            <div className="max-w-7xl mx-auto px-6 py-12">
                {/* Skeleton Hero/Content */}
                <div className="w-full h-[400px] bg-slate-50 rounded-[2.5rem] animate-pulse mb-12" />

                {/* Skeleton Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                    {[1, 2, 3, 4].map((i) => (
                        <div key={i} className="space-y-4">
                            <div className="aspect-[4/5] bg-slate-50 rounded-3xl animate-pulse" />
                            <div className="h-4 bg-slate-50 rounded w-2/3 animate-pulse" />
                            <div className="h-4 bg-slate-50 rounded w-1/2 animate-pulse" />
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
