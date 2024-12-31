import { Link } from "react-router-dom";

import type { MouseEventHandler, ReactNode } from "react";

import "./Buttons.scss";

type ButtonProps = {
  children: ReactNode;
  onClick: MouseEventHandler;
  style: "primary" | "secondary" | "outline";
  size: "sm" | "lg";
};

type LinkButtonProps = {
  children: ReactNode;
  to: string;
  style: "primary" | "secondary" | "outline";
  size: "sm" | "lg";
};

export function Button({ children, onClick, style, size }: ButtonProps) {
  return (
    <button
      role="button"
      onClick={onClick}
      className={`button button--${style} button--${size}`}
    >
      {children}
    </button>
  );
}

export function LinkButton({ children, to, style, size }: LinkButtonProps) {
  return (
    <Link
      role="button"
      to={to}
      className={`button button--${style} button--${size}`}
    >
      {children}
    </Link>
  );
}
