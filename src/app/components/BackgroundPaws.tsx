'use client';

export default function BackgroundPaws({ children }: { children: React.ReactNode }) {
    return (
        <div className="relative min-h-screen w-full p-6 flex justify-center bg-paws-gradient">
            <div aria-hidden className="pointer-events-none absolute inset-0 bg-paws-pattern opacity-[0.06]" />

            <div className="relative ">{children}</div>
        </div>
    );
}
