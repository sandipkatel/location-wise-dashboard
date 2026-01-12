import CsvUploader from '@/components/CsvUploader';

export default function UploadPage() {
  return (
    <main className="min-h-screen bg-gray-100 py-12 px-4">
      <div className="container mx-auto">
        <h1 className="text-4xl font-bold text-center mb-8 text-gray-900">
          CSV File Upload
        </h1>
        <CsvUploader />
      </div>
    </main>
  );
}