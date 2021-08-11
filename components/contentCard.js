export default function Example({ children }) {
  return (
    <div className="bg-white px-4 py-5 border-b border-gray-200 sm:px-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900">
        Job Postings
      </h3>
      {children}
    </div>
  );
}
