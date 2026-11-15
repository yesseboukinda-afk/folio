import DotSpinner from "@/components/ui/dot-spinner";

export default function Loading() {
    return (
        <main className="grid min-h-[50vh] place-items-center px-6 py-16">
            <div
                role="status"
                aria-label="Chargement en cours"
                className="rounded-full bg-white p-3 shadow-sm"
            >
                <DotSpinner className="text-violet-700" />
            </div>
        </main>
    );
}
