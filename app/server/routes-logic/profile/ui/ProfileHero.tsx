import { Link } from "@remix-run/react";


export interface IProfileHero {
 heroImage:string,
 heroText:string,
}

export default function ProfileHero(props: IProfileHero) {
  const { heroImage, heroText} = props;

  
  return(
    <div className="relative">
    
    <div className="mx-auto max-w-7xl lg:grid lg:grid-cols-12 lg:gap-x-8 lg:px-8">
    <div className="px-6 pt-10 pb-24 sm:pb-32 lg:col-span-7 lg:px-0 lg:pt-48 lg:pb-56 xl:col-span-6">
      <div className="mx-auto max-w-2xl lg:mx-0">
        <div className="hidden sm:mt-32 sm:flex lg:mt-16">
    
        </div>
        <h1 className="mt-24 text-4xl font-bold tracking-tight text-white sm:mt-10 sm:text-6xl">
         {heroText}
        </h1>
        <p className="mt-6 text-lg leading-8 text-gray-600">
          
        </p>
        <div className="mt-10 flex items-center gap-x-6">
          <Link
            to="#open-forms"
            className="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
            >
            Get started
          </Link>
          <Link to="#faq" className="text-sm font-semibold leading-6 text-slate-100">
            Learn More In My FAQ <span aria-hidden="true">→</span>
          </Link>
        </div>
      </div>
    </div>
    <div className="relative  lg:col-span-5 lg:-mr-8 xl:absolute xl:inset-0 xl:left-1/2 xl:mr-0">
      <img
        className="rounded-xl aspect-[3/2] w-full bg-gray-50 object-cover lg:absolute lg:inset-0 lg:aspect-auto lg:h-full"
        src={heroImage}
        alt="" />
    </div>
  </div>
  </div>
        )
}

