"use client";

import { useState } from "react";
import Link from "next/link";
import { StatusPill } from "../../components/StatusPill";

export default function StyleGuide() {
  const [isLoading, setIsLoading] = useState(false);

  return (
    <main className="mx-auto max-w-6xl p-8">
      <Link href="/" className="text-blue-600 mb-4 inline-block">&larr; Back to Home</Link>
      <h1 className="text-4xl font-bold mb-8">Style Guide</h1>

      {/* Typography */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Typography</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-1">Heading 1</p>
            <h1 className="text-4xl font-bold">The quick brown fox jumps over the lazy dog</h1>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Heading 2</p>
            <h2 className="text-2xl font-semibold">The quick brown fox jumps over the lazy dog</h2>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Heading 3</p>
            <h3 className="text-xl font-medium">The quick brown fox jumps over the lazy dog</h3>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Body Text</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-1">Small Text</p>
            <p className="text-sm">Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
          </div>
        </div>
      </section>

      {/* Colors */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Colors</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <div className="h-24 bg-blue-600 rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Primary Blue</p>
            <p className="text-xs text-gray-500">bg-blue-600</p>
          </div>
          <div>
            <div className="h-24 bg-green-600 rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Success Green</p>
            <p className="text-xs text-gray-500">bg-green-600</p>
          </div>
          <div>
            <div className="h-24 bg-indigo-600 rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Indigo</p>
            <p className="text-xs text-gray-500">bg-indigo-600</p>
          </div>
          <div>
            <div className="h-24 bg-red-600 rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Error Red</p>
            <p className="text-xs text-gray-500">bg-red-600</p>
          </div>
          <div>
            <div className="h-24 bg-gray-100 rounded-lg mb-2 border"></div>
            <p className="text-sm font-medium">Gray 100</p>
            <p className="text-xs text-gray-500">bg-gray-100</p>
          </div>
          <div>
            <div className="h-24 bg-gray-600 rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Gray 600</p>
            <p className="text-xs text-gray-500">bg-gray-600</p>
          </div>
          <div>
            <div className="h-24 bg-gray-900 rounded-lg mb-2"></div>
            <p className="text-sm font-medium">Gray 900</p>
            <p className="text-xs text-gray-500">bg-gray-900</p>
          </div>
          <div>
            <div className="h-24 bg-white rounded-lg mb-2 border"></div>
            <p className="text-sm font-medium">White</p>
            <p className="text-xs text-gray-500">bg-white</p>
          </div>
        </div>
      </section>

      {/* Buttons */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Buttons</h2>
        <div className="space-y-4">
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-4 py-2 rounded">Primary Button</button>
            <button className="bg-green-600 text-white px-4 py-2 rounded">Success Button</button>
            <button className="bg-indigo-600 text-white px-4 py-2 rounded">Indigo Button</button>
            <button className="bg-red-600 text-white px-4 py-2 rounded">Danger Button</button>
            <button className="bg-gray-600 text-white px-4 py-2 rounded">Secondary Button</button>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded">Outline Primary</button>
            <button className="border border-gray-400 text-gray-600 px-4 py-2 rounded">Outline Secondary</button>
          </div>
          <div className="flex flex-wrap gap-4">
            <button className="bg-blue-600 text-white px-6 py-3 rounded text-lg">Large Button</button>
            <button className="bg-blue-600 text-white px-3 py-1 rounded text-sm">Small Button</button>
          </div>
          <div>
            <button 
              className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50 disabled:cursor-not-allowed"
              disabled
            >
              Disabled Button
            </button>
          </div>
          <div>
            <button
              onClick={() => setIsLoading(!isLoading)}
              className="bg-blue-600 text-white px-4 py-2 rounded inline-flex items-center"
            >
              {isLoading && (
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              )}
              {isLoading ? "Loading..." : "Click to Load"}
            </button>
          </div>
        </div>
      </section>

      {/* Form Elements */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Form Elements</h2>
        <div className="space-y-6 max-w-md">
          <div>
            <label className="block text-sm font-medium mb-1">Text Input</label>
            <input type="text" placeholder="Enter text..." className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Select Dropdown</label>
            <select className="w-full border px-3 py-2 rounded">
              <option>Option 1</option>
              <option>Option 2</option>
              <option>Option 3</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">Textarea</label>
            <textarea rows={3} placeholder="Enter message..." className="w-full border px-3 py-2 rounded" />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">File Input</label>
            <input type="file" className="w-full" />
          </div>
          <div className="space-y-2">
            <label className="flex items-center">
              <input type="checkbox" className="mr-2" />
              <span className="text-sm">Checkbox option</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="radio" className="mr-2" />
              <span className="text-sm">Radio option 1</span>
            </label>
            <label className="flex items-center">
              <input type="radio" name="radio" className="mr-2" />
              <span className="text-sm">Radio option 2</span>
            </label>
          </div>
        </div>
      </section>

      {/* Status Pills */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Status Pills</h2>
        <div className="flex gap-2">
          <StatusPill label="queued" count={5} />
          <StatusPill label="rendering" count={2} />
          <StatusPill label="done" count={10} />
          <StatusPill label="error" count={1} />
        </div>
      </section>

      {/* Cards */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Cards</h2>
        <div className="grid md:grid-cols-3 gap-4">
          <div className="border rounded-lg p-4">
            <h3 className="font-semibold mb-2">Basic Card</h3>
            <p className="text-sm text-gray-600">This is a simple card with a border.</p>
          </div>
          <div className="border rounded-lg p-4 shadow-md">
            <h3 className="font-semibold mb-2">Shadow Card</h3>
            <p className="text-sm text-gray-600">This card has a shadow effect.</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold mb-2">Filled Card</h3>
            <p className="text-sm text-gray-600">This card has a background color.</p>
          </div>
        </div>
      </section>

      {/* Alerts */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Alerts</h2>
        <div className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded">
            <strong>Info:</strong> This is an informational message.
          </div>
          <div className="bg-green-50 border border-green-200 text-green-800 px-4 py-3 rounded">
            <strong>Success:</strong> Operation completed successfully!
          </div>
          <div className="bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-3 rounded">
            <strong>Warning:</strong> Please review before proceeding.
          </div>
          <div className="bg-red-50 border border-red-200 text-red-800 px-4 py-3 rounded">
            <strong>Error:</strong> Something went wrong.
          </div>
        </div>
      </section>

      {/* Tables */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Tables</h2>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr className="border-b">
                <th className="text-left px-4 py-2">Name</th>
                <th className="text-left px-4 py-2">Email</th>
                <th className="text-left px-4 py-2">Status</th>
                <th className="text-left px-4 py-2">Action</th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-b">
                <td className="px-4 py-2">John Doe</td>
                <td className="px-4 py-2">john@example.com</td>
                <td className="px-4 py-2"><StatusPill label="done" count={1} /></td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
              <tr className="border-b">
                <td className="px-4 py-2">Jane Smith</td>
                <td className="px-4 py-2">jane@example.com</td>
                <td className="px-4 py-2"><StatusPill label="rendering" count={1} /></td>
                <td className="px-4 py-2">
                  <button className="text-blue-600 hover:underline">View</button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Video Player Preview */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Video Player</h2>
        <div className="max-w-2xl">
          <div className="bg-gray-200 aspect-video rounded flex items-center justify-center">
            <p className="text-gray-500">Video Player Placeholder</p>
          </div>
        </div>
      </section>

      {/* Spacing */}
      <section className="mb-12">
        <h2 className="text-2xl font-semibold mb-4 border-b pb-2">Spacing</h2>
        <div className="space-y-4">
          <div>
            <p className="text-sm text-gray-500 mb-2">Padding Examples</p>
            <div className="flex gap-4">
              <div className="bg-gray-200 p-2 rounded">p-2</div>
              <div className="bg-gray-200 p-4 rounded">p-4</div>
              <div className="bg-gray-200 p-6 rounded">p-6</div>
              <div className="bg-gray-200 p-8 rounded">p-8</div>
            </div>
          </div>
          <div>
            <p className="text-sm text-gray-500 mb-2">Margin Examples</p>
            <div className="bg-gray-100 p-4 rounded">
              <div className="bg-gray-300 p-2 mb-2 rounded">mb-2</div>
              <div className="bg-gray-300 p-2 mb-4 rounded">mb-4</div>
              <div className="bg-gray-300 p-2 rounded">mb-0</div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}