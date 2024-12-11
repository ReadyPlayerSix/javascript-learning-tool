"use client";

// Imports go here
import React, { useState, useEffect } from 'react';

const EnhancedMethodExplorer = () => {

  // State declarations go here
  const [inputType, setInputType] = useState('string');
  const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog');
  const [selectedMethods, setSelectedMethods] = useState([]);
  const [results, setResults] = useState('Initial text will appear here after modifications');
  const [error, setError] = useState('');

  // Helper constants and objects go here
  const inputGuides = {
    string: {
      example: '"Hello World" or "Any text in quotes"',
      description: "Simple text enclosed in quotes. Can include letters, numbers, and special characters.",
      valid: true
    },
    array: {
      example: '["apple", "banana", "orange"] or [1, 2, 3]',
      description: "A list of items separated by commas, enclosed in square brackets. All items should be of the same type.",
      valid: inputText.startsWith('[') && inputText.endsWith(']')
    },
    object: {
      example: '{"name": "John", "age": 30}',
      description: "Key-value pairs enclosed in curly braces. Keys must be strings, values can be any type.",
      valid: inputText.startsWith('{') && inputText.endsWith('}')
    }
  };

  // Enhanced method definitions with nesting rules
  const methodsByType = {
    string: {
      manipulation: {
        toUpperCase: {
          name: '.toUpperCase()',
          description: 'Converts all characters to uppercase',
          example: `// Basic usage
const text = "Hello World";
const upper = text.toUpperCase();
// Result: "HELLO WORLD"`,
          operation: (input) => input.toUpperCase(),
          nestingLevel: 1,
          canNestAfter: ['toLowerCase'] // Methods that can come before this one
        },
        toLowerCase: {
          name: '.toLowerCase()',
          description: 'Converts all characters to lowercase',
          example: `// Basic usage
const text = "Hello World";
const lower = text.toLowerCase();
// Result: "hello world"`,
          operation: (input) => input.toLowerCase(),
          nestingLevel: 1,
          canNestAfter: ['toUpperCase'] // Methods that can come before this one
        }
      }
    }
  };

  // effects or automation go here
  useEffect(() => {
    try {
      // Start with the initial input
      let currentValue = inputText;
      
      // If no methods are selected, show the initial input
      if (selectedMethods.length === 0) {
        setResults('Initial input: ' + currentValue);
        return;
      }
      
      // Convert input based on type (if needed)
      if (inputType === 'array') {
        try {
          currentValue = JSON.parse(inputText);
          if (!Array.isArray(currentValue)) {
            throw new Error('Input is not a valid array');
          }
        } catch (e) {
          setError('Invalid array format. Please check your input.');
          return;
        }
      } else if (inputType === 'object') {
        try {
          currentValue = JSON.parse(inputText);
          if (typeof currentValue !== 'object' || Array.isArray(currentValue)) {
            throw new Error('Input is not a valid object');
          }
        } catch (e) {
          setError('Invalid object format. Please check your input.');
          return;
        }
      }

      // Keep track of each transformation step
      const executionSteps = [];
      executionSteps.push(`Initial input: ${JSON.stringify(currentValue)}`);

      // Apply each selected method in order
      selectedMethods.forEach((methodKey, index) => {
        let method;
        // Find the selected method in our methodsByType object
        for (const category of Object.values(methodsByType[inputType])) {
          for (const [key, methodDef] of Object.entries(category)) {
            if (key === methodKey) {
              method = methodDef;
              break;
            }
          }
        }

        if (method) {
          try {
            // Apply the transformation
            currentValue = method.operation(currentValue);
            // Record this step
            executionSteps.push(`Step ${index + 1} - ${method.name}: ${JSON.stringify(currentValue)}`);
          } catch (e) {
            throw new Error(`Error applying ${method.name}: ${e.message}`);
          }
        }
      });

      // Show all steps in the results
      setResults(executionSteps.join('\n\n'));
      setError('');
      
    } catch (err) {
      setError(err.message);
      setResults('Error occurred during execution');
    }
  }, [selectedMethods, inputText, inputType]);

  // Check if a method can be added to the current chain
  const canAddMethod = (methodKey) => {
    if (selectedMethods.length === 0) return true;
    
    const lastMethod = selectedMethods[selectedMethods.length - 1];
    for (const categoryMethods of Object.values(methodsByType[inputType])) {
      if (methodKey in categoryMethods) {
        const method = categoryMethods[methodKey];
        if (!method.canNestAfter.includes(lastMethod)) {
          setError(`${method.name} cannot be nested after ${lastMethod}`);
          return false;
        }
      }
    }
    return true;
  };

  // Modified method selection handler
  const handleMethodSelect = (methodKey) => {
    setSelectedMethods(prev => {
      if (prev.includes(methodKey)) {
        // Remove this method and all methods after it
        const index = prev.indexOf(methodKey);
        return prev.slice(0, index);
      } else if (canAddMethod(methodKey)) {
        return [...prev, methodKey];
      }
      return prev;
    });
  };

  // Rest of the component remains similar, but with updated return JSX:
  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-[1400px] mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="w-full lg:w-[600px] space-y-6">
            {/* Input Type Selection */}
            <div className="flex gap-4 w-full">
              {['string', 'array', 'object'].map(type => (
                <button
                  key={type}
                  className={`w-48 px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
                    inputType === type 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                  onClick={() => {
                    setInputType(type);
                    setSelectedMethods([]);
                  }}
                >
                  {type}
                </button>
              ))}
            </div>

            {/* Input Format Guide */}
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-lg">
              <h3 className="font-semibold text-blue-800 mb-2">Input Format Guide</h3>
              <p className="text-blue-900 mb-2">Example: {inputGuides[inputType].example}</p>
              <p className="text-blue-800">{inputGuides[inputType].description}</p>
            </div>

            {/* Input Section */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Input</h2>
              <textarea
                className={`w-full p-4 border rounded-lg text-gray-800 min-h-40 font-mono ${
                  !inputGuides[inputType].valid ? 'border-red-500' : 'border-gray-300'
                }`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={inputType === 'object' ? '{"key": "value"}' : 'Enter your text here'}
              />
              {!inputGuides[inputType].valid && (
                <p className="text-red-500 mt-2">
                  Input format doesn't match the expected {inputType} format
                </p>
              )}
            </div>

            {/* Method Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6 w-full">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Available Methods</h2>
              {methodsByType[inputType] && Object.entries(methodsByType[inputType]).map(([category, methods]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h3 className="text-lg font-semibold text-gray-800 mb-4 capitalize">{category}</h3>
                  <div className="flex flex-wrap gap-3">
                    {Object.entries(methods).map(([key, method]) => {
                      const isSelected = selectedMethods.includes(key);
                      const nestingIndex = selectedMethods.indexOf(key);
                      return (
                        <button
                          key={key}
                          className={`
                            w-48 px-4 py-2 rounded-lg text-base transition-colors
                            relative
                            ${isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                            }
                          `}
                          onClick={() => handleMethodSelect(key)}
                        >
                          {method.name}
                          {isSelected && (
                            <span className="absolute top-0 right-0 transform -translate-y-1/2 translate-x-1/2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
                              {nestingIndex + 1}
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right column remains the same */}
          <div className="w-full lg:w-[600px] space-y-6">
  {/* Documentation section (which you already have) */}
  
  {/* Add this Results section back */}
  <div className="bg-white rounded-lg shadow-lg p-6 w-full">
    <h2 className="text-xl font-semibold text-gray-800 mb-4">Results</h2>
    {error ? (
      <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700">
        <p className="font-medium">Error</p>
        <p>{error}</p>
      </div>
    ) : (
      <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto font-mono text-sm text-gray-800 min-h-40">
        <code>{results}</code>
      </pre>
    )}
  </div>
</div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedMethodExplorer;