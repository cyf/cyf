export default function Footer() {
  return (
    <div
      className="absolute w-full border-b border-gray-200 py-5 text-center"
    >
      <p className="text-gray-500">
        Source code hosted on{" "}
        <a
          className="font-medium text-gray-800 underline transition-colors"
          href="https://github.com/cyf"
          target="_blank"
          rel="noopener noreferrer"
        >
          GitHub
        </a>
      </p>
    </div>
  );
}
