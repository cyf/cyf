"use client";
import useScroll from "@/lib/hooks/use-scroll";

export default function Footer() {
  const scrolled = useScroll(65);

  return (
    <div
      className={`fixed bottom-0 w-full ${
        !scrolled
          ? "border-b border-gray-200 bg-white/50 backdrop-blur-xl"
          : "bg-white/0"
      } py-5 text-center`}
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
