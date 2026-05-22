import type { MDXComponents } from "mdx/types";

export function useMDXComponents(components: MDXComponents): MDXComponents {
  return {
    h1: ({ children }) => (
      <h1 className="mt-12 text-3xl font-medium tracking-tight sm:text-4xl">
        {children}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-10 text-2xl font-medium tracking-tight">{children}</h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-8 text-xl font-medium tracking-tight">{children}</h3>
    ),
    p: ({ children }) => (
      <p className="mt-5 leading-relaxed text-[var(--color-fg)]">{children}</p>
    ),
    ul: ({ children }) => (
      <ul className="mt-5 list-disc space-y-2 pl-6 marker:text-[var(--color-fg-dim)]">
        {children}
      </ul>
    ),
    ol: ({ children }) => (
      <ol className="mt-5 list-decimal space-y-2 pl-6 marker:text-[var(--color-fg-dim)]">
        {children}
      </ol>
    ),
    a: ({ href, children }) => (
      <a
        href={href}
        className="text-[var(--color-accent)] underline decoration-[var(--color-accent-soft)] underline-offset-4 transition-colors hover:decoration-[var(--color-accent)]"
      >
        {children}
      </a>
    ),
    code: ({ children }) => (
      <code className="rounded-sm bg-[var(--color-surface)] px-1.5 py-0.5 font-mono text-[0.9em] text-[var(--color-fg)]">
        {children}
      </code>
    ),
    pre: ({ children }) => (
      <pre className="mt-5 overflow-x-auto rounded-sm border border-[var(--color-border)] bg-[var(--color-surface)] p-4 font-mono text-sm leading-relaxed">
        {children}
      </pre>
    ),
    blockquote: ({ children }) => (
      <blockquote className="mt-5 border-l-2 border-[var(--color-accent)] pl-4 text-[var(--color-fg-muted)] italic">
        {children}
      </blockquote>
    ),
    hr: () => <hr className="my-10 border-[var(--color-border)]" />,
    ...components,
  };
}
