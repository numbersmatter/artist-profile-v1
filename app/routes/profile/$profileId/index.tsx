import type { LoaderArgs } from "@remix-run/node"
import { useLoaderData } from "@remix-run/react"
import { db } from "~/server/db.server"
import { getOpenOpportunities, getProfileFAQs } from "~/server/routes-logic/profile/profile.server"
import OpportunityCard from "~/server/routes-logic/profile/ui/OpportunityCard"
import ProfileFaq from "~/server/routes-logic/profile/ui/ProfileFAQ"
import ProfileHero from "~/server/routes-logic/profile/ui/ProfileHero"
const faqNotionRaw = [
  {
    id: 1,
    question: "Can I commission you?",
    answer:
      "Absolutely! I usually open a certain number of commission slots once every month or two. When I do open, I’ll make posts on my Patreon, Discord servers, Twitter, FurAffinity, & Inbunny with instructions on how to submit a request. I open a form, you send in your idea, and if it’s something I really want to make, I’ll agree to make your commission.",
  },

  {
    id: 2,
    question: "Can I include your characters in my commission?",
    answer:
      "Yes, people often commission my characters to be paired with theirs, and it’s always okay. Mila, Lantha, Buttons, Milo, and all my other characters are okay to be commissioned. The only exception is Snowball, the white cat. She requires that you go on a date with her first (In other words, you must commission a normal Safe-for-Work drawing with her first without any sex, then you may request as many nsfw pics with her after that as you want.)",
  },
  {
    id: 3,
    question: "How much does a commission this cost?  subquestion how much does each component cost?",
    answer:
      "There are 3 main factors that determine price: how many characters, how detailed are the characters, and how detailed in the scenery? More characters costs more in general. For example: Small characters like small un-evolved pokemon cost less than larger and more detailed characters like final-evolution pokemon. Also, characters with complex fur color patterns will cost more.",
  },
  {
    id: 4,
    question: "Pur-furred commissions subjects.  I like drawing the following so I’m more likely to accept these kinds of commissions.",
    answer:
      "Size difference, Fellatio, Ball-worship, Rimjobs, …",
  },
  {
    id: 5,
    question: "Thing’s that I’m ok with drawing.  I’m ok with drawing the following, but they are not my favorite.  I may still accept these commissions?",
    answer:
      "Vaginal penetration, Anal penetration, light Watersports, Kissing, …",
  },
  {
    id: 6,
    question: "Things I won’t draw.  Do not attempt to commission these things, they will be rejected outright.",
    answer:
      "Gore, Death, Fecal play, Underaged, …",
  },
  {
    id: 7,
    question: "What are the restrictions for posting the commission ?  ex. Can I post the commission once it is finished?  Can I post the commission at site x or in x discord server?",
    answer:
      "You can post works-in-progress & finished commission pieces anywhere you want and whenever you want, even if I haven’t posted them anywhere public yet. ",
  },
  {
    id: 8,
    question: "Can I use your characters in a commission from another artist?",
    answer:
      "Yes, and you can draw them yourself if you would like. Draw them with any kink you desire, nothing is off-limits. It’s you and your fantasies, so go wild. And feel free to show me as well! I love fan art!",
  },
  {
    id: 9,
    question: "Can I commission a comic from you?",
    answer:
      "It depends. If you want 1-2 comic pages from me, then that can be done like a normal commission - you can send in a form response explaining how many panels you want. I might even do 3 pages for a normal commission depending on how many panels you want. However, if you want anything that is 4 pages or longer, you can send me a DM telling me your idea and I will decide if I want to make it. I can make comics be as long as you want them, the only thing that matters is if I want to make it too & how much you’re willing to spend. It’s best to send me a DM giving me your idea first, including your expectations, like you want certain kinks to show up at minimum.",
  },
  {
    id: 10,
    question: "Can I commission an animation from you?",
    answer:
      "It depends. You can send in your idea for an animation like a normal commission request using my form when commission slots are open, and if it seems do-able for me, I would accept it.",
  },
]

export async function loader({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  // const faqs = await getProfileFAQs("milachu92");
  const homepageRef = db.assets(profileId).doc("homepage");
  const homepageSnap = await homepageRef.get();
  const homepageData = homepageSnap.data();

  const homepageDefault = {
    heroImage: "https://images.unsplash.com/photo-1606607291535-b0adfbf7424f?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=387&q=80",
    faq: [],
  }

  const homepageDisplay = homepageData ?? homepageDefault

  const opportunities = await getOpenOpportunities(profileId)

  // const heroSection = {

  //   image1: "",
  //   image2: "https://firebasestorage.googleapis.com/v0/b/component-sites.appspot.com/o/user%2Fpq1caOfoOYMMljX8AXEmPQZEDij2%2FpublicImages%2F99435634-34D8-4696-A006-C0B0C5879155.png?alt=media&token=9fb7dcaa-8227-4d5e-9056-75e85d712ee8"
  // }


  // const faqNotion = faqNotionRaw.map((faq)=> ({
  //   profileId: "milachu92",
  //   faqQuestion: faq.question,
  //   faqAnswer: faq.answer,
  //   faqId: faq.id.toString(),
  // }))

  // const homepageRef = db.assets(profileId).doc("homepage");
  // const homepageData= {
  //   faq: faqNotion,
  //   heroImage: heroSection.image2
  // }
  // await homepageRef.set(homepageData)


  return {
    opportunities,
    homepageDisplay,

  }

}


export default function ProfileMain() {
  const { opportunities, homepageDisplay } = useLoaderData<typeof loader>()



  return (
    <div className="space-y-4">
      <ProfileHero heroText={homepageDisplay.heroText} heroImage={homepageDisplay.heroImage} />

      <div id="open-forms" className="relative">

        <div className="mx-auto max-w-7xl py-5  grid grid-cols-1 gap-y-4 ">
          {
            opportunities.length > 0 ? <>
              <h2 className="mx-auto text-4xl py-3 text-white">Open Forms</h2>
              {
                opportunities.map((opportunity) => {
                  const linkUrl = `tos/${opportunity.opportunityId}`
                  return <OpportunityCard
                    key={opportunity.opportunityId}
                    name={opportunity.name}
                    text={opportunity.text}
                    linkUrl={linkUrl}
                  />

                }
                )
              }
            </>
              :
              <img className='h-72 mx-auto w-auto max-w-lg ' alt="Closed Sign" src={homepageDisplay.closedImage} />
          }

        </div>
      </div>

      {
        homepageDisplay.faq.length > 0
          ?
          <div className=" max-w-2xl mx-auto">
            <ProfileFaq faqs={homepageDisplay.faq} />
          </div>
          : null
      }





    </div>
  )
}
