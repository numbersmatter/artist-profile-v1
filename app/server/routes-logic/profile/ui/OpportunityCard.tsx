import { Link } from "@remix-run/react";


export default function OpportunityCard(props: {name:string, text:string}) {
  const { name, text} = props;
  return (
    <div className="max-w-lg mx-auto rounded-lg shadow-lg overflow-hidden lg:max-w-none lg:flex">
    <div className="flex-1 bg-white px-6 py-8 lg:p-12">
      <h3 className="text-2xl font-extrabold text-green-700 sm:text-3xl"> {name}</h3>
      <p className="mt-6 text-base text-gray-500">
        { text}
      </p>
      <div className="mt-8">
        <div className="flex items-center">
          <h4 className="flex-shrink-0 pr-4 bg-white text-sm tracking-wider font-semibold uppercase text-indigo-600">
            {/* What's included */}
          </h4>
          <div className="flex-1 border-t-2 border-gray-200" />
        </div>
        {/* <ul role="list" className="mt-8 space-y-5 lg:space-y-0 lg:grid lg:grid-cols-2 lg:gap-x-8 lg:gap-y-5">
          {includedFeatures.map((feature) => (
            <li key={feature} className="flex items-start lg:col-span-1">
              <div className="flex-shrink-0">
                <CheckCircleIcon className="h-5 w-5 text-green-400" aria-hidden="true" />
              </div>
              <p className="ml-3 text-sm text-gray-700">{feature}</p>
            </li>
          ))}
        </ul> */}
      </div>
    </div>
    <div className="py-8 px-6 text-center bg-gray-50 lg:flex-shrink-0 lg:flex lg:flex-col lg:justify-center lg:p-12">
      {/* <p className="text-lg leading-6 font-medium text-gray-900">Starting at</p>
      <div className="mt-4 flex items-center justify-center text-5xl font-extrabold text-green-900">
        <span>$70</span>
        <span className="ml-3 text-xl font-medium text-gray-500">USD</span>
      </div> */}
      <p className="mt-4 text-sm">
        {/* <a href="#" className="font-medium text-gray-500 underline">
          Learn about commission policy
        </a> */}
      </p>
      <div className="mt-6">
        <div className="rounded-md shadow">
          <Link
            to={"placeholder"}
            className="flex items-center justify-center px-5 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-gray-900"
          >
            Start Form
          </Link>
        </div>
      </div>
      <div className="mt-4 text-sm">
        {/* <a href="#" className="font-medium text-gray-900">
          See Gallary <span className="font-normal text-gray-500">twitter</span>
        </a> */}
      </div>
    </div>
  </div>
  );
}