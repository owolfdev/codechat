import React from "react";
import Link from "next/link";

function Footer() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return (
    <footer className="flex items-center justify-center w-full h-24 border-t">
      <div className="flex sm:flex-row flex-col gap-2 sm:gap-4 justify-center align-center items-center">
        {" "}
        &copy; CodeChat {currentYear}
        <div>
          <Link href="/">Home - </Link>
          <Link href="/about">About - </Link>
          <Link href="/contact">Contact - </Link>{" "}
          <Link href="/privacy">Privacy</Link>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
