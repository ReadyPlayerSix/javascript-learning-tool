"use client";

import React, { useState, useEffect } from 'react';

const EnhancedMethodExplorer = () => {
    // Original state declarations plus our new display preferences
    const [inputType, setInputType] = useState('string');
    const [inputText, setInputText] = useState('The quick brown fox jumps over the lazy dog');
    const [selectedMethods, setSelectedMethods] = useState([]);
    const [results, setResults] = useState('Initial text will appear here after modifications');
    const [error, setError] = useState('');
    const [showPracticalUses, setShowPracticalUses] = useState(true);
    const [showAsFunction, setShowAsFunction] = useState(false);
  
    // Restore the valuable input guides
    const inputGuides = {
      string: {
        title: "Working with Strings",
        example: '"Hello World" or "Any text in quotes"',
        description: "In JavaScript, strings are sequences of characters enclosed in quotes. They can include letters, numbers, and special characters. Strings are immutable, meaning once created, their values cannot be changed - any method that appears to modify a string actually returns a new string.",
        valid: true
      },
      array: {
        title: "Working with Arrays",
        example: '["apple", "banana", "orange"] or [1, 2, 3]',
        description: "Arrays in JavaScript are ordered collections that can hold any type of value. They are zero-indexed and can dynamically grow or shrink. They come with powerful built-in methods for manipulation.",
        valid: inputText.startsWith('[') && inputText.endsWith(']')
      },
      object: {
        title: "Working with Objects",
        example: '{"name": "John", "age": 30}',
        description: "JavaScript objects are collections of key-value pairs. Keys must be strings, but values can be of any type. Objects are the fundamental building blocks of JavaScript and are used extensively in modern web development.",
        valid: inputText.startsWith('{') && inputText.endsWith('}')
      }
    };
  
    // Enhanced method definitions with new example formats
    const methodsByType = {
      string: {
        basics: {
          toUpperCase: {
            name: '.toUpperCase()',
            description: 'Converts all characters in a string to uppercase letters. This is particularly useful for standardizing text for comparisons or display purposes.',
            basicExample: (input) => `// Direct method usage
  const text = "${input}";
  const upper = text.toUpperCase();`,
            functionExample: (input) => `// Function implementation
  function convertToUpperCase(text) {
      return text.toUpperCase();
  }
  
  // Usage
  const input = "${input}";
  const result = convertToUpperCase(input);`,
            practicalUses: [
              {
                title: "Case-insensitive Comparison",
                code: `// Compare strings ignoring case
  function compareStrings(str1, str2) {
      return str1.toUpperCase() === str2.toUpperCase();
  }`
              },
              {
                title: "Text Standardization",
                code: `// Standardize display of important information
  function formatHeaderText(text) {
      return text.toUpperCase();
  }`
              }
            ],
            operation: (input) => input.toUpperCase(),
            nestingLevel: 1,
            canNestAfter: ['toLowerCase']
          },
          // ... other methods with similar structure
        }
      }
    };
  
    // Keep the existing useEffect logic...
    useEffect(() => {
      try {
        let currentValue = inputText;
        
        if (selectedMethods.length === 0) {
          setResults('Select methods to see their effects on the input text');
          return;
        }
  
        const executionSteps = [`Initial input: ${currentValue}`];
        selectedMethods.forEach((methodKey, index) => {
          for (const category of Object.values(methodsByType[inputType])) {
            for (const [key, methodDef] of Object.entries(category)) {
              if (key === methodKey) {
                currentValue = methodDef.operation(currentValue);
                executionSteps.push(`Step ${index + 1} - ${methodDef.name}: ${currentValue}`);
              }
            }
          }
        });
  
        setResults(executionSteps.join('\n\n'));
        setError('');
      } catch (err) {
        setError(err.message);
      }
    }, [selectedMethods, inputText, inputType]);
  
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-[1400px] mx-auto grid grid-cols-12 gap-8">
          {/* Left Column - Input and Controls */}
          <div className="col-span-4 space-y-6">
            {/* Educational Guide Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">
                {inputGuides[inputType].title}
              </h2>
              <div className="prose max-w-none">
                <p className="text-gray-600 mb-4">
                  {inputGuides[inputType].description}
                </p>
                <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                  <h4 className="font-semibold text-blue-800 mb-2">Example Format:</h4>
                  <code className="text-blue-900 bg-blue-100 px-2 py-1 rounded">
                    {inputGuides[inputType].example}
                  </code>
                </div>
              </div>
            </div>
  
            {/* Type Selection Buttons */}
            <div className="flex gap-4">
              {['string', 'array', 'object'].map(type => (
                <button
                  key={type}
                  className={`flex-1 px-6 py-3 rounded-lg text-lg font-medium transition-colors ${
                    inputType === type 
                      ? 'bg-blue-600 text-white shadow-lg' 
                      : 'bg-white text-gray-700 hover:bg-gray-50 shadow'
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
  
            {/* Input Section with Text Area */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Input</h3>
              <textarea
                className={`w-full p-4 border rounded-lg text-gray-800 min-h-32 font-mono ${
                  !inputGuides[inputType].valid ? 'border-red-500' : 'border-gray-300'
                }`}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder={`Enter your ${inputType} here...`}
              />
              {!inputGuides[inputType].valid && (
                <p className="text-red-500 mt-2">
                  Input format doesn't match the expected {inputType} format
                </p>
              )}
            </div>
  
            {/* Display Preference Toggles */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Display Preferences</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Show Practical Uses</span>
                  <button
                    onClick={() => setShowPracticalUses(!showPracticalUses)}
                    className={`px-4 py-2 rounded-lg ${
                      showPracticalUses 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {showPracticalUses ? 'Hide' : 'Show'}
                  </button>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-700">Show as Function</span>
                  <button
                    onClick={() => setShowAsFunction(!showAsFunction)}
                    className={`px-4 py-2 rounded-lg ${
                      showAsFunction 
                        ? 'bg-blue-600 text-white' 
                        : 'bg-gray-200 text-gray-700'
                    }`}
                  >
                    {showAsFunction ? 'Hide' : 'Show'}
                  </button>
                </div>
              </div>
            </div>
  
            {/* Method Selection */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-semibold text-gray-800 mb-4">Available Methods</h3>
              {methodsByType[inputType] && Object.entries(methodsByType[inputType]).map(([category, methods]) => (
                <div key={category} className="mb-6 last:mb-0">
                  <h4 className="text-lg font-semibold text-gray-700 mb-3 capitalize">
                    {category}
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    {Object.entries(methods).map(([key, method]) => {
                      const isSelected = selectedMethods.includes(key);
                      const nestingIndex = selectedMethods.indexOf(key);
                      return (
                        <button
                          key={key}
                          className={`
                            px-4 py-2 rounded-lg text-base transition-colors relative
                            ${isSelected
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            }
                          `}
                          onClick={() => {
                            setSelectedMethods(prev => {
                              if (prev.includes(key)) {
                                const index = prev.indexOf(key);
                                return prev.slice(0, index);
                              }
                              return [...prev, key];
                            });
                          }}
                        >
                          {method.name}
                          {isSelected && (
                            <span className="absolute -top-2 -right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs">
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
  
          {/* Right Column - Results and Method Details */}
          <div className="col-span-8 space-y-6">
            {/* Results Section */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Results</h2>
              {error ? (
                <div className="bg-red-50 border-l-4 border-red-500 p-4 text-red-700 mb-4">
                  <p className="font-medium">Error</p>
                  <p>{error}</p>
                </div>
              ) : null}
              <pre className="bg-gray-50 p-6 rounded-lg overflow-x-auto font-mono text-sm text-gray-800 min-h-[40vh]">
                <code>{results}</code>
              </pre>
            </div>
  
            {/* Methods and Manipulations in Use */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-semibold text-gray-800 mb-4">Methods and Manipulations in Use</h2>
              {selectedMethods.map((methodKey) => {
                const method = Object.values(methodsByType[inputType])
                  .flatMap(category => Object.entries(category))
                  .find(([key]) => key === methodKey)?.[1];
                
                if (!method) return null;
  
                return (
                  <div key={methodKey} className="mb-6 last:mb-0">
                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                      <h4 className="font-semibold text-blue-800 mb-2">{method.name}</h4>
                      <pre className="bg-blue-100 p-4 rounded overflow-x-auto">
                        <code className="text-blue-900">
                          {showAsFunction 
                            ? method.functionExample(inputText)
                            : method.basicExample(inputText)}
                        </code>
                      </pre>
                      {showPracticalUses && method.practicalUses && (
                        <div className="mt-4">
                          <h5 className="font-semibold text-blue-800 mb-2">Practical Uses:</h5>
                          {method.practicalUses.map((use, index) => (
                            <div key={index} className="mb-4 last:mb-0">
                              <h6 className="text-blue-700 mb-1">{use.title}</h6>
                              <pre className="bg-blue-100 p-2 rounded overflow-x-auto">
                                <code className="text-blue-900">{use.code}</code>
                              </pre>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  };
  
  export default EnhancedMethodExplorer;