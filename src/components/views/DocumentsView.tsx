import React, { useState } from 'react';
import { FileText, Search, Upload, Download, Tag, Folder, Plus } from 'lucide-react';
import { SystemState, ERPDocument } from '../../types';
import { createAuditLog } from '../../lib/storage';

interface DocumentsViewProps {
  state: SystemState;
  currentUser: any;
  onUpdateState: (updater: (prev: SystemState) => SystemState) => void;
}

export const DocumentsView: React.FC<DocumentsViewProps> = ({ state, currentUser, onUpdateState }) => {
  const { documents } = state;
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [showUploadModal, setShowUploadModal] = useState(false);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<ERPDocument['category']>('Contract');
  const [description, setDescription] = useState('');

  const categories = ['All', 'Contract', 'Invoice', 'Receipt', 'Payroll File', 'Audit Report', 'Employee File', 'Tax Document'];

  const handleUploadDocument = (e: React.FormEvent) => {
    e.preventDefault();
    const newDoc: ERPDocument = {
      id: 'doc-' + Date.now(),
      title,
      category,
      uploadedBy: currentUser.name,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: (Math.random() * 5 + 1).toFixed(1) + ' MB',
      fileType: 'PDF',
      tags: [category, 'Executive', 'Confidential'],
      description: description || 'Uploaded corporate document'
    };

    onUpdateState((prev) => {
      const audit = createAuditLog(
        currentUser,
        'Document Vault',
        'Upload Document',
        `Uploaded corporate file: ${newDoc.title} (${newDoc.category})`,
        'Approved'
      );
      return {
        ...prev,
        documents: [newDoc, ...prev.documents],
        auditLogs: [audit, ...prev.auditLogs]
      };
    });

    setShowUploadModal(false);
    setTitle('');
    setDescription('');
  };

  const filteredDocs = documents.filter((doc) => {
    const matchesCat = selectedCategory === 'All' || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      doc.tags.some((t) => t.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCat && matchesSearch;
  });

  return (
    <div className="p-6 space-y-6 bg-slate-950 text-slate-100 min-h-screen">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-800 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <FileText className="w-6 h-6 text-amber-400" />
            <h1 className="text-xl font-extrabold text-slate-100">Enterprise Document Vault & Records Repository</h1>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Store, categorize, and search contracts, invoices, tax documents & payroll files
          </p>
        </div>

        <button
          onClick={() => setShowUploadModal(true)}
          className="flex items-center space-x-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold px-3 py-1.5 rounded-lg text-xs shadow-md"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Document</span>
        </button>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-slate-900 p-3 rounded-xl border border-slate-800 text-xs">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Search documents by title, description, or tags..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-800 border border-slate-700 rounded-lg pl-9 pr-3 py-1.5 text-xs text-slate-200"
          />
        </div>

        <div className="flex items-center space-x-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-colors ${
                selectedCategory === cat ? 'bg-amber-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Documents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredDocs.map((doc) => (
          <div key={doc.id} className="bg-slate-900 border border-slate-800 rounded-2xl p-4 shadow-md space-y-3">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-3">
                <div className="p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-amber-400">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <span className="bg-slate-800 text-slate-300 px-2 py-0.5 rounded text-[10px] font-mono">
                    {doc.category}
                  </span>
                  <h3 className="font-bold text-sm text-slate-100 line-clamp-1 mt-1">{doc.title}</h3>
                </div>
              </div>
            </div>

            <p className="text-xs text-slate-400 line-clamp-2">{doc.description}</p>

            <div className="flex flex-wrap gap-1">
              {doc.tags.map((t, idx) => (
                <span key={idx} className="bg-slate-950 text-slate-400 text-[9px] px-2 py-0.5 rounded border border-slate-800">
                  #{t}
                </span>
              ))}
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] text-slate-500">
              <span>{doc.uploadedBy} • {doc.uploadDate}</span>
              <span className="font-mono text-slate-400">{doc.fileSize} ({doc.fileType})</span>
            </div>
          </div>
        ))}
      </div>

      {/* Upload Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-xs">
          <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-100 flex items-center space-x-2">
              <Upload className="w-5 h-5 text-amber-400" />
              <span>Upload Document to Vault</span>
            </h3>

            <form onSubmit={handleUploadDocument} className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Document Title</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                  required
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as any)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200"
                >
                  <option value="Contract">Contract</option>
                  <option value="Invoice">Invoice</option>
                  <option value="Receipt">Receipt</option>
                  <option value="Payroll File">Payroll File</option>
                  <option value="Audit Report">Audit Report</option>
                  <option value="Employee File">Employee File</option>
                  <option value="Tax Document">Tax Document</option>
                </select>
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Description</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg p-2 text-slate-200 h-20"
                />
              </div>

              <div className="flex justify-end space-x-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-lg"
                >
                  Cancel
                </button>
                <button type="submit" className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg">
                  Upload Now
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
