import type { LoaderArgs } from "@remix-run/node";
interface PageHeader {
  avatar: string,
  profileId: string,
  bannerImage: string,
  displayName: string
}

const pageHeader = {
  avatar: "someUrl",
  bannerImage: "bannerUrl",
  displayName: "Wondering Cat",
};

const faq = {
  question: "Is this a question",
  answer: "Yes that is a question",
  faqId: "one"
}

interface ProfileData {
  faqOrder: string[],
  profileImage: string,
}
const profileDataExample = {
  faqOrder: ["abc", "one", ],
  profileImage: "profileImageUrl"
}

interface FAQ {
  question: string,
  answer: string,
  faqId:string
}

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


const getPageHeader = (profileId: string) => new Promise<PageHeader | undefined>(function (resolve) {
  const sendValue = { ...pageHeader, profileId }
  resolve(sendValue)
})
const getProfileData = (profileId: string) => new Promise<ProfileData | undefined>(function (resolve) {
  const sendValue = { ...profileDataExample, profileId }
  resolve(sendValue)
})


const getFAQbyId = (profileId: string, faqId: string) => new Promise<FAQ | undefined>(function (resolve) {
  const sendValue = { ...faq, faqId }
  resolve(sendValue)
})

const getFAQsbyProfileId = (profileId:string) => new Promise<FAQ[]>(
  function (resolve) {
  const faqs = faqNotionRaw.map((el)=>(
    { question: el.question, 
      answer: el.answer,
      faqId: el.id.toString(),
    }))

  resolve(faqs)
})


// Relationship between the url and database
// when getting data out of the database 3 important elements

// 1) Unique Identify a doc or a list of docs via params

// 2) Consistency of schema i.e. data

// 3) Order Importance







// Singleton
//  unique identify a doc
//  standardize schema
//  order is not important

// Milton
// multiple Singltons with same identifier


// Anderson
// unique identify a list of docs
// standard schema across the list 
// order is derivable via the docs in that list

// Tyler 
// uniquely identify a list of docs
// standard schema across that list
// order of that list is stored in another doc via singleton





export async function loader1({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"

  const pageHeaderData = await getPageHeader(profileId)

  return ({ pageHeaderData });
}


export async function loader2({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const pageHeaderData = await getPageHeader(profileId);
  const profileData = await getProfileData(profileId);

  return ({ pageHeaderData, profileData });
}




// 
// not allowed
// 
export async function loader3({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const pageHeaderData = await getPageHeader(profileId);
  const profileData = await getProfileData(profileId);

  const faqs = profileData?.faqOrder.map(
    async (faqId) => await getFAQbyId(profileId, faqId)
  )

  return ({ pageHeaderData, profileData, faqs });
}







// can convert this to two awaits
export async function loader4({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId";

  // create the promises Milton Pattern
  const pageHeaderDataPromise = getPageHeader(profileId);
  const profileDataPromise = getProfileData(profileId);

  // create array for thoses promises
  const arrayPromises = [pageHeaderDataPromise, profileDataPromise];

  //  first await call acts like singleton
  const [pageHeaderData, profileData] = await Promise.all(arrayPromises)

  //  assuring typescript
  const profileData2 = profileData as ProfileData

  const faqsPromises = profileData2.faqOrder.map(
    (faqId) => getFAQbyId(profileId, faqId)
  )

  // await call
  const FAQs = await Promise.all(faqsPromises)

  return ({ pageHeaderData, profileData, FAQs });
}


export async function loader5({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const pageHeaderData = await getPageHeader(profileId);
  const profileData = await getProfileData(profileId);
  // anderson pattern
  const faqs = await getFAQsbyProfileId(profileId);

  return ({ pageHeaderData, profileData, faqs });
};




export async function loader6({ params }: LoaderArgs) {
  const profileId = params.profileId ?? "no-profileId"
  const pageHeaderData = await getPageHeader(profileId);
  const profileData = await getProfileData(profileId);
  const faqs = await getFAQsbyProfileId(profileId);


  // Tyler pattern
  const orderedFaqs = profileData?.faqOrder.map((faqId)=>
    faqs.find((faq)=> faq.faqId === faqId)
  )

  return ({ pageHeaderData, profileData, orderedFaqs });
}



