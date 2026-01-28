// 'use client';

// import { useState, useEffect } from 'react';

// export default function TestModeToggle() {
//   const [isTestMode, setIsTestMode] = useState(false);
//   const [testTime, setTestTime] = useState<string>('');
//   const [testOffset, setTestOffset] = useState<string>('60'); // 60 seconds offset
//   const [isExpanded, setIsExpanded] = useState(false);

//   // Load test mode state from localStorage
//   useEffect(() => {
//     const saved = localStorage.getItem('pastebin-test-mode');
//     if (saved === 'enabled') {
//       setIsTestMode(true);
//       setIsExpanded(true); // Auto-expand when test mode is enabled
//     }
    
//     // Set default test time to now + offset
//     const defaultTime = new Date(Date.now() + 60000); // 60 seconds from now
//     setTestTime(defaultTime.toISOString());
//   }, []);

//   const toggleTestMode = () => {
//     const newState = !isTestMode;
//     setIsTestMode(newState);
//     setIsExpanded(newState); // Expand when enabling
//     localStorage.setItem('pastebin-test-mode', newState ? 'enabled' : 'disabled');
    
//     if (newState) {
//       // Set test time when enabling
//       const offset = parseInt(testOffset) * 1000;
//       const newTestTime = new Date(Date.now() + offset);
//       setTestTime(newTestTime.toISOString());
//     }
//   };

//   const updateTestTime = () => {
//     const offset = parseInt(testOffset) * 1000;
//     const newTestTime = new Date(Date.now() + offset);
//     setTestTime(newTestTime.toISOString());
//   };

//   const copyTestHeaders = () => {
//     const headers = {
//       'x-test-now-ms': new Date(testTime).getTime().toString()
//     };
    
//     const text = Object.entries(headers)
//       .map(([key, value]) => `${key}: ${value}`)
//       .join('\n');
    
//     navigator.clipboard.writeText(text);
//     alert('Test headers copied to clipboard! Use with: curl -H "x-test-now-ms: ..."');
//   };

//   // If test mode is disabled, show a prominent floating button
//   if (!isTestMode) {
//     return (
//       <div className="fixed bottom-6 right-6 z-50">
//         <button
//           onClick={toggleTestMode}
//           className="flex items-center gap-2 px-4 py-3 bg-gradient-to-r from-yellow-500 to-orange-500 text-white rounded-lg shadow-lg hover:from-yellow-600 hover:to-orange-600 focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:ring-offset-2 animate-pulse"
//         >
//           <span className="text-lg">🔧</span>
//           <span className="font-semibold">Enable Test Mode</span>
//         </button>
//       </div>
//     );
//   }

//   // If test mode is enabled, show the expanded panel
//   return (
//     <div className="fixed bottom-6 right-6 z-50 w-96 bg-white rounded-xl shadow-2xl border-2 border-yellow-400 overflow-hidden">
//       {/* Header */}
//       <div 
//         className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 cursor-pointer"
//         onClick={() => setIsExpanded(!isExpanded)}
//       >
//         <div className="flex justify-between items-center">
//           <div className="flex items-center gap-2">
//             <span className="text-xl">🔧</span>
//             <div>
//               <h3 className="font-bold text-gray-900">Test Mode ACTIVE</h3>
//               <p className="text-xs text-gray-800">Click to {isExpanded ? 'collapse' : 'expand'}</p>
//             </div>
//           </div>
//           <div className="flex items-center gap-3">
//             <span className="px-3 py-1 bg-green-600 text-white text-xs font-bold rounded-full">
//               TEST_MODE=1
//             </span>
//             <button
//               onClick={(e) => {
//                 e.stopPropagation();
//                 toggleTestMode();
//               }}
//               className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700"
//             >
//               Disable
//             </button>
//           </div>
//         </div>
//       </div>
      
//       {/* Content - Only show when expanded */}
//       {isExpanded && (
//         <div className="p-4 space-y-4">
//           {/* Test Time Controls */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               ⏰ Test Time Offset
//             </label>
//             <div className="flex gap-2">
//               <input
//                 type="number"
//                 value={testOffset}
//                 onChange={(e) => setTestOffset(e.target.value)}
//                 className="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm"
//                 min="0"
//                 step="1"
//                 placeholder="Seconds in future"
//               />
//               <button
//                 onClick={updateTestTime}
//                 className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
//               >
//                 Update
//               </button>
//             </div>
//             <div className="text-xs text-gray-500">
//               Current test time: {testTime ? new Date(testTime).toLocaleString() : 'Not set'}
//             </div>
//           </div>
          
//           {/* Quick Presets */}
//           <div className="space-y-2">
//             <label className="block text-sm font-medium text-gray-700">
//               ⚡ Quick Presets
//             </label>
//             <div className="grid grid-cols-3 gap-2">
//               {[
//                 { label: '1 min', seconds: 60 },
//                 { label: '5 min', seconds: 300 },
//                 { label: '1 hour', seconds: 3600 },
//               ].map((preset) => (
//                 <button
//                   key={preset.label}
//                   onClick={() => {
//                     setTestOffset(preset.seconds.toString());
//                     updateTestTime();
//                   }}
//                   className="px-3 py-2 bg-gray-100 text-gray-700 rounded hover:bg-gray-200 text-sm"
//                 >
//                   {preset.label}
//                 </button>
//               ))}
//             </div>
//           </div>
          
//           {/* Copy Headers Button */}
//           <button
//             onClick={copyTestHeaders}
//             className="w-full px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-lg font-semibold hover:from-green-600 hover:to-emerald-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 flex items-center justify-center gap-2"
//           >
//             <span>📋</span>
//             <span>Copy Test Headers</span>
//           </button>
          
//           {/* Usage Instructions */}
//           <div className="bg-gray-50 p-3 rounded-lg border border-gray-200">
//             <h4 className="font-medium text-gray-800 text-sm mb-2">📖 How to Use:</h4>
//             <ol className="text-xs text-gray-600 space-y-1 list-decimal pl-4">
//               <li>Copy headers above</li>
//               <li>Use with curl: <code>curl -H "x-test-now-ms: ..."</code></li>
//               <li>Test TTL expiry without waiting</li>
//             </ol>
//           </div>
          
//           {/* Test Endpoints */}
//           <div className="text-xs text-gray-500">
//             <p className="font-medium mb-1">🔗 Test Endpoints:</p>
//             <div className="space-y-1">
//               <a 
//                 href="/api/test-mode" 
//                 target="_blank"
//                 className="text-blue-600 hover:underline block"
//               >
//                 GET /api/test-mode
//               </a>
//               <a 
//                 href="/api/test/ttl" 
//                 target="_blank"
//                 className="text-blue-600 hover:underline block"
//               >
//                 GET /api/test/ttl
//               </a>
//               <a 
//                 href="/api/test/combined" 
//                 target="_blank"
//                 className="text-blue-600 hover:underline block"
//               >
//                 GET /api/test/combined
//               </a>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }