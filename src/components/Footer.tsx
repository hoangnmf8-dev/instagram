import React from 'react'
import { ChevronDown } from 'lucide-react';

interface LinkItem {
  id: number,
  title: string,
  link: string
}
export default function Footer() {
  const listLink: LinkItem[] = [
    {
      id: 1,
      title: "Meta",
      link: "l.instagram.com/?u=https%3A%2F%2Fabout.meta.com%2F&e=AT24Qb5IK9j2ZzQbzu0MToWJCLSgjwIuc8Y1Km4G2Eu1J0g6TiekmLFfO7N3hyWV9F4rT-CV3c7Uz-9T1mGA3bvu66znq3v1&s=1"
    },
    {
      id: 2,
      title: "About",
      link: "l.instagram.com/?u=https%3A%2F%2Fabout.instagram.com%2F&e=AT38S3oLRtNvgfxRnpISnUkQbGslGXxnkOxpn-N5BS0pzm76707If_2zNqGr3XjWPphr2a1ilFV2B25LbvsahsGidPIVFEsm&s=1"
    },
    {
      id: 3,
      title: "Blog",
      link: "l.instagram.com/?u=https%3A%2F%2Fabout.instagram.com%2Fblog%2F&e=AT1tVKwzXwLAD093SFqibPExfalm6oZ77fuzGULnuAQ2_uGs--98E4brfeyyGd2FUTev3Fm8dmTppv-IcHfd-ri2qKAw8HBr&s=1"
    },
    {
      id: 4,
      title: "Jobs",
      link: "l.instagram.com/?u=https%3A%2F%2Fabout.instagram.com%2Fabout-us%2Fcareers&e=AT0fTdbzfhnWteGfypliDsT4LM5SQeeHnVfuxfsF-5wNUtT5AuPTJ6kvPMxpOTRNq1t9ZG8rDzw8_ET4IoUI3LOw-YKkS7BO&s=1"
    },
    {
      id: 5,
      title: "Help",
      link: "https://help.instagram.com/"
    },
    {
      id: 6,
      title: "API",
      link: "https://developers.facebook.com/docs/instagram-platform"
    },
    {
      id: 7,
      title: "Privacy",
      link: "https://privacycenter.instagram.com/policy/?entry_point=ig_help_center_data_policy_redirect"
    },
    {
      id: 8,
      title: "Terms",
      link: "https://help.instagram.com/581066165581870/"
    },
    {
      id: 9,
      title: "Locations",
      link: "https://www.instagram.com/explore/locations/"
    },
    {
      id: 10,
      title: "Instagram Lite",
      link: "https://www.instagram.com/web/lite/"
    },
    {
      id: 11,
      title: "Meta AI",
      link: "https://www.meta.ai/?utm_source=foa_web_footer"
    },
    {
      id: 12,
      title: "Threads",
      link: "https://www.threads.com/"
    },
    {
      id: 13,
      title: "Contact Uploading & Non Users",
      link: "/login"
    },
    {
      id: 14,
      title: "Meta Verified",
      link: "https://www.instagram.com/accounts/login/?next=https%3A%2F%2Fwww.instagram.com%2Faccounts%2Fmeta_verified%2F%3Fentrypoint%3Dweb_footer%26__coig_login%3D1#"
    },
  ]
  return (
    <div className='flex flex-col mt-6'>
      <div className='flex justify-center gap-3'>
        {listLink.map(item => <a key={item.id} href={item.link} target='_blank' className='text-secondary text-[12px] font-light hover:underline'>{item.title}</a>)}
      </div>
      <div className='flex justify-center gap-3 mt-4'>
        <a href="/login" className='flex items-center text-secondary text-[12px] font-light'>English<ChevronDown className='text-secondary w-4 aspect-square font-light'/></a>
        <span className='flex items-center text-secondary text-[12px] font-light'>© 2026 Instagram from Meta</span>
      </div>
    </div>
  )
}
