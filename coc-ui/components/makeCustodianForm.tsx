"use client";

import { useFormik } from 'formik'
import { useCreateCustodianMutation } from '@/lib/features/custodians/custodianApiSlice'

const MakeCustodian: React.FC = () => {
  const [createCustodian, { isLoading, isError, error }] = useCreateCustodianMutation();

  const formik = useFormik({
    initialValues: {
      address: '',
      name: '',
    },
    onSubmit: async (values) => {
      try {
        await createCustodian(values).unwrap();
        alert('Custodian created successfully!');
        formik.resetForm();
      } catch (err) {
        console.error('Error creating custodian:', err);
        alert('Error creating custodian');
      }
    },
  });

  return (
    <form onSubmit={formik.handleSubmit} className="space-y-4">
      <div>
        <label htmlFor="address" className="block text-sm font-medium text-gray-700">
          Address
        </label>
        <input
          id="address"
          name="address"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.address}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <div>
        <label htmlFor="name" className="block text-sm font-medium text-gray-700">
          Name
        </label>
        <input
          id="name"
          name="name"
          type="text"
          onChange={formik.handleChange}
          value={formik.values.name}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        />
      </div>
      <button
        type="submit"
        disabled={isLoading}
        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {isLoading ? 'Creating...' : 'Create Custodian'}
      </button>
      {isError && <div className="text-red-500">{error.toString()}</div>}
    </form>
  );
};

export default MakeCustodian;