// import { storage } from '@/lib/storage';

// export default async function DebugPage() {
//   // This is server-side, so we can access storage directly
//   const allPastes = storage.getAllPastes();

//   return (
//     <div className="min-h-screen p-8 bg-gray-50">
//       <div className="max-w-6xl mx-auto">
//         <div className="mb-8">
//           <h1 className="text-3xl font-bold text-gray-800 mb-2">Debug: All Pastes</h1>
//           <p className="text-gray-600">Total pastes: {allPastes.length}</p>
//           <a href="/" className="text-blue-600 hover:underline mt-4 inline-block">
//             ← Back to home
//           </a>
//         </div>

//         {allPastes.length === 0 ? (
//           <div className="bg-white rounded-lg shadow p-6 text-center">
//             <p className="text-gray-500">No pastes in storage</p>
//           </div>
//         ) : (
//           <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//             {allPastes.map((paste) => (
//               <div key={paste.id} className="bg-white rounded-lg shadow p-4 border border-gray-200">
//                 <div className="mb-3">
//                   <div className="flex justify-between items-start">
//                     <h3 className="font-mono font-semibold text-gray-800">{paste.id}</h3>
//                     <span className={`text-xs px-2 py-1 rounded ${
//                       paste.maxViews !== null && paste.views >= paste.maxViews 
//                         ? 'bg-red-100 text-red-800'
//                         : paste.expiresAt && paste.expiresAt < new Date()
//                         ? 'bg-red-100 text-red-800'
//                         : 'bg-green-100 text-green-800'
//                     }`}>
//                       {paste.maxViews !== null && paste.views >= paste.maxViews 
//                         ? 'Views Exhausted'
//                         : paste.expiresAt && paste.expiresAt < new Date()
//                         ? 'Expired'
//                         : 'Active'}
//                     </span>
//                   </div>
//                   <p className="text-xs text-gray-500 mt-1">
//                     Created: {paste.createdAt.toLocaleString()}
//                   </p>
//                 </div>

//                 <div className="text-sm space-y-1 mb-4">
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Views:</span>
//                     <span className="font-medium">
//                       {paste.views}{paste.maxViews !== null ? ` / ${paste.maxViews}` : ' / ∞'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Expires:</span>
//                     <span className={paste.expiresAt && paste.expiresAt < new Date() ? 'text-red-600' : ''}>
//                       {paste.expiresAt ? paste.expiresAt.toLocaleString() : 'Never'}
//                     </span>
//                   </div>
//                   <div className="flex justify-between">
//                     <span className="text-gray-600">Content preview:</span>
//                     <span className="text-gray-800 truncate max-w-[150px]">
//                       {paste.content.substring(0, 30)}
//                       {paste.content.length > 30 ? '...' : ''}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="pt-3 border-t border-gray-100">
//                   <a
//                     href={`/p/${paste.id}`}
//                     className="block text-center px-3 py-2 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm"
//                     target="_blank"
//                   >
//                     View Paste
//                   </a>
//                 </div>
//               </div>
//             ))}
//           </div>
//         )}
//       </div>
//     </div>
//   );
// }