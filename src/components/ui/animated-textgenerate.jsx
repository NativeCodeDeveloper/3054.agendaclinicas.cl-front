import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

/**
 * AnimatedTextGenerate
 * Un componente profesional para animar la aparición de texto letra por letra, con soporte para blur, highlight y links.
 */
export function AnimatedTextGenerate({
  text = "",
  className = "",
  textClassName = "",
  blurEffect = false,
  speed = 1,
  highlightWords = [],
  highlightClassName = "",
  linkWords = [],
  linkHrefs = [],
  linkClassNames = [],
}) {
  const [displayed, setDisplayed] = useState(0);
  const chars = text.split("");

  useEffect(() => {
    setDisplayed(0);
    if (!text) return;
    const interval = setInterval(() => {
      setDisplayed((prev) => {
        if (prev < chars.length) return prev + 1;
        clearInterval(interval);
        return prev;
      });
    }, 18 / speed);
    return () => clearInterval(interval);
    // eslint-disable-next-line
  }, [text, speed]);

  // Highlight and link logic
  function renderWord(word, i) {
    // Highlight
    if (highlightWords.includes(word)) {
      return (
        <span key={i} className={highlightClassName}>{word}</span>
      );
    }
    // Link
    const linkIdx = linkWords.findIndex((w) => w.toLowerCase() === word.toLowerCase());
    if (linkIdx !== -1 && linkHrefs[linkIdx]) {
      return (
        <a
          key={i}
          href={linkHrefs[linkIdx]}
          className={linkClassNames[linkIdx] || "underline text-blue-500"}
        >
          {word}
        </a>
      );
    }
    return word;
  }

  // Render animated text with optional blur effect
  const visibleText = chars.slice(0, displayed).join("");
  const restText = chars.slice(displayed).join("");

  // Split visibleText into words for highlight/link
  const visibleWords = visibleText.split(/(\s+)/).map((w, i) => renderWord(w, i));

  return (
    <span className={className}>
      <span className={textClassName}>
        {visibleWords}
        {blurEffect && restText && (
          <span className="blur-sm opacity-40 select-none">{restText}</span>
        )}
      </span>
    </span>
  );
}

AnimatedTextGenerate.propTypes = {
  text: PropTypes.string,
  className: PropTypes.string,
  textClassName: PropTypes.string,
  blurEffect: PropTypes.bool,
  speed: PropTypes.number,
  highlightWords: PropTypes.arrayOf(PropTypes.string),
  highlightClassName: PropTypes.string,
  linkWords: PropTypes.arrayOf(PropTypes.string),
  linkHrefs: PropTypes.arrayOf(PropTypes.string),
  linkClassNames: PropTypes.arrayOf(PropTypes.string),
};
