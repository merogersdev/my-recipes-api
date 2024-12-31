import type { ReactNode } from "react";

type TypographyProps = {
  children: ReactNode;
};

import "./Typography.scss";

export function H1({ children }: TypographyProps) {
  return <h1 className="typography__h1">{children}</h1>;
}

export function H2({ children }: TypographyProps) {
  return <h2 className="typography__h2">{children}</h2>;
}

export function H3({ children }: TypographyProps) {
  return <h3 className="typography__h3">{children}</h3>;
}

export function H4({ children }: TypographyProps) {
  return <h4 className="typography__h4">{children}</h4>;
}

export function H5({ children }: TypographyProps) {
  return <h5 className="typography__h5">{children}</h5>;
}

export function H6({ children }: TypographyProps) {
  return <h6 className="typography__h6">{children}</h6>;
}

export function P({ children }: TypographyProps) {
  return <p className="typography__p">{children}</p>;
}
