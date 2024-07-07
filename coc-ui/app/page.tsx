import { Link } from "@nextui-org/link";
import { Snippet } from "@nextui-org/snippet";
import { Code } from "@nextui-org/code";
import { button as buttonStyles } from "@nextui-org/theme";

import { siteConfig } from "@/config/site";
import { title, subtitle } from "@/components/primitives";
import { GithubIcon } from "@/components/icons";
import NextLink from "next/link";

export default function Home() {
  return (
    <section className="flex flex-col items-center justify-center gap-2">
      <div className="inline-block max-w-lg text-center justify-center">
        <h1 className={title()}>Track Your Evidence&nbsp;</h1>
        <h1 className={title({ color: "violet" })}>Chain&nbsp;</h1>
        <h1 className={title()}>&nbsp;</h1>
        <br />
        <h1 className={title()}>
          Using Secure, Immutable Blockchain Technology for Unmatched
        </h1>
        <h2 className={subtitle({ class: "mt-4" })}>
          Transparency, Accountability, and Peace of Mind in Evidence
          Management.
        </h2>
      </div>

      <div className="flex gap-3">
        {/* <Link
          isExternal
          className={buttonStyles({
            color: "primary",
            radius: "full",
            variant: "shadow",
          })}
          href={siteConfig.links.docs}
        >
          Documentation
        </Link> */}
        {/* <Link
          isExternal
          className={buttonStyles({ variant: "bordered", radius: "full" })}
          href={siteConfig.links.github}
        >
          <GithubIcon size={20} />
          GitHub
        </Link> */}
      </div>
      <NextLink
        href="/login"
        className="mt-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
      >
        Log in to Get started
      </NextLink>

      {/* <div className="mt-8">
        <Snippet hideCopyButton hideSymbol variant="flat">
          <span>
            Get started by editing <Code color="primary">app/page.tsx</Code>
          </span>
        </Snippet>
      </div> */}
    </section>
  );
}
