import { Map } from "lucide-react";

export default function Header() {
  return (
    <div className="border-b border-slate-700 bg-slate-900/50 backdrop-blur">
      <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            <Map className="w-8 h-8 text-cyan-400" />
            <h1 className="text-3xl font-bold text-white">
              Location Dashboard
            </h1>
          </div>
      </div>
    </div>
  );
}
