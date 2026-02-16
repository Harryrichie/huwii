import React from 'react';

export const Logo = ({ className, ...props }: React.SVGProps<SVGSVGElement>) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 140 40"
    fill="none"
    stroke="currentColor"
    strokeWidth="5"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    {...props}
  >
    {/* H */}
    <path d="M10 10 V30 M10 20 H25 M25 10 V30" />
    {/* U */}
    <path d="M40 10 V25 Q40 30 47.5 30 Q55 30 55 25 V10" />
    {/* W */}
    <path d="M70 10 L74 30 L79 18 L84 30 L88 10" />
    {/* I */}
    <path d="M103 10 V30" />
    {/* I */}
    <path d="M118 10 V30" />
  </svg>
);