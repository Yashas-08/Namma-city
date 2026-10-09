'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Building2,
  Users2,
  ClipboardList,
  Plus,
  CheckCircle2,
  XCircle,
  Phone,
  X,
  Edit2,
} from 'lucide-react';

export default function AdminDepartmentsPage() {
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [deptName, setDeptName] = useState('');
  const [deptCode, setDeptCode] = useState('');
  const [contactDetails, setContactDetails] = useState('');
  const [saving, setSaving] = useState(false);

  const loadDepartments = async () => {
    try {
      const res = await api.getAdminDepartments();
      setDepartments(res || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDepartments();
  }, []);

  const handleCreateDepartment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!deptName.trim() || !deptCode.trim()) return;

    setSaving(true);
    try {
      await api.createAdminDepartment({
        name: deptName.trim(),
        code: deptCode.trim().toUpperCase(),
        contactDetails: contactDetails.trim() || undefined,
      });
      setDeptName('');
      setDeptCode('');
      setContactDetails('');
      setShowAddModal(false);
      await loadDepartments();
      alert('Department added successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to create department');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleActive = async (dept: any) => {
    try {
      await api.updateAdminDepartment(dept.id, { active: !dept.active });
      await loadDepartments();
    } catch (e: any) {
      alert(e.message || 'Failed to update department status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#172322]">Municipal Departments Registry</h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Configure civic divisions, operational mandates, and field team jurisdictions
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125452] shadow-xs transition-colors w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add Department</span>
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {loading ? (
          <div className="col-span-full bg-white p-12 rounded-2xl border border-[#DCE4E2] text-center text-xs text-[#687674]">
            Loading municipal departments...
          </div>
        ) : (
          departments.map((dept) => (
            <div
              key={dept.id}
              className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-black bg-[#176B68]/10 text-[#176B68]">
                    {dept.code}
                  </span>
                  <button
                    onClick={() => handleToggleActive(dept)}
                    className={`px-2 py-0.5 rounded text-[10px] font-bold transition-colors ${
                      dept.active
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                        : 'bg-slate-100 text-[#687674]'
                    }`}
                  >
                    {dept.active ? 'ACTIVE' : 'INACTIVE'}
                  </button>
                </div>

                <h3 className="text-sm font-bold text-[#172322]">{dept.name}</h3>
                {dept.contactDetails && (
                  <p className="text-[11px] text-[#687674] mt-1 flex items-center gap-1">
                    <Phone className="w-3 h-3 text-[#176B68]" />
                    <span>{dept.contactDetails}</span>
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-[#DCE4E2] grid grid-cols-2 gap-2 text-center text-xs">
                <div className="bg-[#F7F9F8] p-2 rounded-xl border border-[#DCE4E2]">
                  <div className="font-extrabold text-[#172322]">{dept._count?.staffMembers || 0}</div>
                  <div className="text-[10px] text-[#687674]">Staff Officers</div>
                </div>
                <div className="bg-[#F7F9F8] p-2 rounded-xl border border-[#DCE4E2]">
                  <div className="font-extrabold text-[#176B68]">{dept._count?.requests || 0}</div>
                  <div className="text-[10px] text-[#687674]">Grievances</div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add Department Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Add Municipal Department</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateDepartment} className="pt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#172322] block mb-1">Department Name</label>
                <input
                  type="text"
                  required
                  value={deptName}
                  onChange={(e) => setDeptName(e.target.value)}
                  placeholder="e.g. Public Health & Vector Control"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Department Code</label>
                <input
                  type="text"
                  required
                  value={deptCode}
                  onChange={(e) => setDeptCode(e.target.value)}
                  placeholder="e.g. BBMP_HEALTH"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68] uppercase"
                />
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Helpdesk Contact / Phone</label>
                <input
                  type="text"
                  value={contactDetails}
                  onChange={(e) => setContactDetails(e.target.value)}
                  placeholder="e.g. 080-22221188 / health@bbmp.gov.in"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#176B68] text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Create Department
                </button>
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2.5 border border-[#DCE4E2] text-xs font-semibold rounded-xl text-[#687674]"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
