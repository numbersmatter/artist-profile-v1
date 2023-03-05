



export default function TextField(
  props:{
    errorText? :string,
    fieldId: string,
    defaultValue: string,
    label: string,
  }
) {

  return (
    <div className="sm:col-span-6">
      <label htmlFor="about" className="block text-sm font-medium leading-6 text-gray-900">
        {props.label}
      </label>
      <div className="mt-2">
        <input
          id={props.fieldId}
          name={props.fieldId}
          className="block w-full rounded-md px-3 border-1 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:py-1.5 sm:text-sm sm:leading-6"
          defaultValue={props.defaultValue}
        />
      </div>
      {
        props.errorText ?
        <p className="mt-2 text-sm text-gray-500">Write a few sentences about yourself.</p>
        :<p> &nbsp;</p>
      }
    </div>);
}