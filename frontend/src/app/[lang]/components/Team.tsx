
'use client';
import { useState } from "react"
import { getStrapiMedia } from "../utils/api-helpers"
import Image from "next/image"
import classNames from "classnames"
import { SiTwitter, SiMastodon, SiGithub } from "react-icons/si"
import { AiFillHome } from "react-icons/ai"
const NEXT_DEMO_MODE = process.env.NEXT_PUBLIC_DEMO_MODE

const Icons = {
  twitter: SiTwitter,
  mastodon: SiMastodon,
  github: SiGithub,
  website: AiFillHome,
}

const IconLink = ({ url, icon, name }) => {
  const Icon = Icons[icon]
  return (
    <li>
      <a
        href={url}
        aria-label={`${name} ${icon}`}
        className={classNames(
          "[&>*]:focus-visible:btn-focus [&>*]:dark:focus-visible:btn-focus-dark text-zinc-700 hover:text-gray-900 dark:text-zinc-400 dark:hover:text-white",
          {
            "hover:text-[#563ACC] dark:hover:text-[#563ACC]":
              icon === "mastodon",
          },
          {
            "hover:text-[#00acee] dark:hover:text-[#00acee]":
              icon === "twitter",
          }
        )}
      >
        <Icon className="h-5 w-5" />
      </a>
    </li>
  )
}

const TeamMember = ({ data }) => {
  const [isLoading, setLoading] = useState(true)
  const { name, title, links, picture } = data

  return (
    <div className="w-5/12 break-words text-center text-gray-500 md:max-w-[15rem] dark:text-gray-400">
      <div className="relative mx-auto mb-4 h-28 w-28 md:h-36 md:w-36">
        {picture && (
          <Image
            fill={true}
            sizes="(max-width: 768px) 33vw, 150px"
            src={getStrapiMedia(picture?.data?.attributes?.url)}
            alt={`${name} picture`}
            className={classNames(
              "rounded-full object-cover duration-500 ease-in-out",
              {
                "scale-110 animate-pulse bg-zinc-400 blur-xl dark:bg-zinc-700":
                  isLoading,
              },
              { "scale-100 blur-0": !isLoading }
            )}
            onLoad={() => setLoading(false)}
          />
        )}
      </div>
      <h3 className="mb-1 text-lg font-bold tracking-tight text-gray-900 md:text-xl dark:text-white">
        {name}
      </h3>
      <p>{title}</p>
      <ul className="mt-4 flex flex-wrap justify-center gap-4">
        {links.length > 0 &&
          links.map(({ url, icon }, id) => (
            <IconLink url={url} icon={icon} name={name} key={id} />
          ))}
      </ul>
    </div>
  )
}

const Team = ({ data }) => {
  const { title, description, teamMember } = data
  return (
    <section className="bg-white dark:bg-black">
      <div className="mx-auto max-w-screen-xl px-4 py-8 text-center lg:px-6 lg:py-16">
        <div className="mx-auto mb-8 max-w-screen-sm lg:mb-16">
          <h2
            className="mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white"
            id="team"
          >
            {title}
          </h2>
          <p className="prose text-gray-500 sm:text-xl dark:text-gray-400">
            {description}
          </p>
        </div>
        <div className="flex shrink flex-row flex-wrap content-center justify-center gap-8 lg:gap-16 ">
          {teamMember.map((d) => (
            <TeamMember data={d} key={d.id} />
          ))}
        </div>
      </div>
    </section>
  )
}

export default Team
