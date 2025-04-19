'use client';

import { useState } from 'react';

export default function WorkDetailsModal({ work, onClose }) {
  const [activeTab, setActiveTab] = useState('details');

  if (!work) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex justify-between items-center border-b p-4">
          <h2 className="text-xl font-bold">{work.title}</h2>
          <button 
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="border-b">
          <nav className="flex">
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'details' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('details')}
            >
              Details
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'notes' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('notes')}
            >
              Notes
            </button>
            <button 
              className={`px-4 py-2 font-medium ${activeTab === 'documents' ? 'text-blue-600 border-b-2 border-blue-600' : 'text-gray-500'}`}
              onClick={() => setActiveTab('documents')}
            >
              Documents
            </button>
          </nav>
        </div>
        
        <div className="overflow-auto p-4 flex-grow">
          {activeTab === 'details' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-500">Work ID</p>
                  <p className="font-medium">{work.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Department</p>
                  <p className="font-medium">{work.department}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Region</p>
                  <p className="font-medium">{work.region}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Status</p>
                  <p className="font-medium capitalize">{work.status}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Assigned Officer</p>
                  <p className="font-medium">{work.assignedOfficerName}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Priority</p>
                  <p className="font-medium capitalize">{work.priority}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Start Date</p>
                  <p className="font-medium">{work.startDate}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Due Date</p>
                  <p className="font-medium">{work.dueDate}</p>
                </div>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Description</p>
                <p className="mt-1">{work.description}</p>
              </div>
              
              <div>
                <p className="text-sm text-gray-500">Progress</p>
                <div className="w-full bg-gray-200 rounded-full h-2.5 mt-1">
                  <div 
                    className="bg-blue-600 h-2.5 rounded-full" 
                    style={{ width: `${work.progress}%` }}
                  ></div>
                </div>
                <p className="text-right text-sm text-gray-500 mt-1">{work.progress}%</p>
              </div>
            </div>
          )}
          
          {activeTab === 'notes' && (
            <div>
              <div className="space-y-4">
                {work.notes && work.notes.length > 0 ? (
                  work.notes.map((note, index) => (
                    <div key={index} className="border p-3 rounded">
                      <div className="flex justify-between text-sm text-gray-500 mb-1">
                        <span>{note.author}</span>
                        <span>{note.date}</span>
                      </div>
                      <p>{note.content}</p>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No notes available.</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Add New Note</h3>
                <textarea 
                  className="w-full p-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows="3"
                  placeholder="Enter your note here..."
                ></textarea>
                <button 
                  className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  Add Note
                </button>
              </div>
            </div>
          )}
          
          {activeTab === 'documents' && (
            <div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {work.documents && work.documents.length > 0 ? (
                  work.documents.map((doc, index) => (
                    <div key={index} className="border p-3 rounded flex items-center">
                      <div className="mr-3">
                        {doc.type === 'pdf' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        {doc.type === 'docx' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-blue-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                        )}
                        {doc.type === 'image' && (
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-green-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                        )}
                      </div>
                      <div className="flex-grow">
                        <p className="font-medium">{doc.name}</p>
                        <p className="text-sm text-gray-500">Uploaded: {doc.uploadDate}</p>
                      </div>
                      <button className="text-blue-500 hover:text-blue-700">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                        </svg>
                      </button>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500">No documents available.</p>
                )}
              </div>
              
              <div className="mt-6">
                <h3 className="font-medium mb-2">Upload New Document</h3>
                <div className="flex items-center">
                  <input
                    type="file"
                    className="w-full p-2 border rounded"
                  />
                  <button 
                    className="ml-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                  >
                    Upload
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <div className="border-t p-4 flex justify-end">
          <button 
            onClick={onClose}
            className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400 mr-2"
          >
            Close
          </button>
          <button 
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Update
          </button>
        </div>
      </div>
    </div>
  );
}
