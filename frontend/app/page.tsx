import CsvUploader from '@/components/CsvUploader';
import Link from 'next/link';

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 text-gray-900">
          CSV Location Visualizer
        </h1>
        <p className="text-center text-gray-600 mb-8">
          Upload your CSV with location data to see it on an interactive 3D Earth
        </p>
        
        <CsvUploader />
        
        <div className="text-center mt-6">
          <Link 
            href="/map" 
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            View Map →
          </Link>
        </div>
      </div>
    </main>
  );
}
