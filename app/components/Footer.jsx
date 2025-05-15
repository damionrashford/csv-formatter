export default function Footer() {
  return (
    <footer className="footer">
      <span>© {new Date().getFullYear()} CSV Formatter</span>
      <a href="https://github.com/damionrashford/csv-formatter" target="_blank" rel="noopener noreferrer">GitHub</a>
    </footer>
  );
}
