export function meta() {
  return [
    { title: "CSV Formatter" },
    { name: "description", content: "Upload, format, and download CSV files in your browser." },
  ];
}

export default function Home() {
  return (
    <div className="welcome">
      <h2>Welcome to CSV Formatter</h2>
      <p>Upload your CSV file, configure formatting options, and download your results instantly. 100% browser-based, no data leaves your device.</p>
    </div>
  );
}
