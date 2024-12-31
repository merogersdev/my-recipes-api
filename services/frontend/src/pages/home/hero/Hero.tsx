type HeroProps = {
  title: string;
  tagline: string;
};

import "./Hero.scss";

export default function Hero({ title, tagline }: HeroProps) {
  return <section className="hero">Hero</section>;
}
