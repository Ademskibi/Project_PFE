import React from 'react';

const Unauthorized = () => {
  const redirectToHome = () => {
    window.location.href = '/'; // You can replace this with a router navigation if needed
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <div className="text-center bg-white p-8 rounded-lg shadow-xl max-w-sm w-full">
        <h1 className="text-4xl font-bold text-red-500 mb-4">403 - Forbidden</h1>
        <p className="text-lg text-gray-700 mb-6">You are not authorized to access this page.</p>
        <button
          onClick={redirectToHome}
          className="px-6 py-3 text-lg text-white bg-blue-500 rounded-md hover:bg-blue-600 transition duration-300"
        >
          Go to Homepage
        </button>
      </div>
    </div>
  );
};

export default Unauthorized;
