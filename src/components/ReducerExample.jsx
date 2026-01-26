import React, { useReducer } from 'react';

// Reducer to manage wizard state
const wizardReducer = (state, action) => {
  switch (action.type) {
    case 'NEXT':
      return { ...state, currentStep: state.currentStep + 1 };
    case 'PREVIOUS':
      return { ...state, currentStep: state.currentStep - 1 };
    case 'SET_FIELD':
      return { ...state, [action.field]: action.value };
    default:
      return state;
  }
};

const initialState = {
  currentStep: 1,
  name: '',
  age: '',
  email: '',
};

const StepWizard = () => {
  const [state, dispatch] = useReducer(wizardReducer, initialState);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    dispatch({ type: 'SET_FIELD', field: name, value });
  };

  const handleNext = () => {
    dispatch({ type: 'NEXT' });
  };

  const handlePrevious = () => {
    dispatch({ type: 'PREVIOUS' });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold text-center mb-6">
        Step {state.currentStep}
      </h1>
      <div className="mb-6">
        {state.currentStep === 1 && (
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              id="name"
              name="name"
              value={state.name}
              onChange={handleInputChange}
              placeholder="Enter your name"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {state.currentStep === 2 && (
          <div>
            <label htmlFor="age" className="block text-sm font-medium text-gray-700 mb-2">
              Age
            </label>
            <input
              id="age"
              name="age"
              value={state.age}
              onChange={handleInputChange}
              placeholder="Enter your age"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
        {state.currentStep === 3 && (
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              id="email"
              name="email"
              value={state.email}
              onChange={handleInputChange}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}
      </div>
      <div className="flex justify-between">
        <button
          onClick={handlePrevious}
          disabled={state.currentStep === 1}
          className={`px-4 py-2 rounded-md text-white ${
            state.currentStep === 1
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Previous
        </button>
        <button
          onClick={handleNext}
          disabled={state.currentStep === 3}
          className={`px-4 py-2 rounded-md text-white ${
            state.currentStep === 3
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600'
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default StepWizard;