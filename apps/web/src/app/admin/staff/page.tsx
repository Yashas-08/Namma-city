'use client';

import React, { useEffect, useState } from 'react';
import { api } from '@/lib/api';
import {
  Users2,
  UserPlus,
  Mail,
  Phone,
  MapPin,
  Building2,
  CheckCircle2,
  XCircle,
  X,
  Search,
} from 'lucide-react';

export default function AdminStaffPage() {
  const [staff, setStaff] = useState<any[]>([]);
  const [departments, setDepartments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Invite Staff Modal
  const [showAddModal, setShowAddModal] = useState(false);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [departmentId, setDepartmentId] = useState('');
  const [assignedArea, setAssignedArea] = useState('');
  const [saving, setSaving] = useState(false);

  const loadStaff = async () => {
    try {
      const [staffRes, deptRes] = await Promise.all([
        api.getAdminStaff(),
        api.getAdminDepartments(),
      ]);
      setStaff(staffRes || []);
      setDepartments(deptRes || []);
      if (deptRes && deptRes.length > 0) {
        setDepartmentId(deptRes[0].id);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStaff();
  }, []);

  const handleCreateStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !departmentId) return;

    setSaving(true);
    try {
      await api.createAdminStaff({
        name: name.trim(),
        email: email.trim(),
        phone: phone.trim() || undefined,
        departmentId,
        assignedArea: assignedArea.trim() || undefined,
      });
      setName('');
      setEmail('');
      setPhone('');
      setAssignedArea('');
      setShowAddModal(false);
      await loadStaff();
      alert('Officer account provisioned successfully.');
    } catch (e: any) {
      alert(e.message || 'Failed to create staff account');
    } finally {
      setSaving(false);
    }
  };

  const handleToggleStatus = async (s: any) => {
    try {
      const newStatus = s.userStatus === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';
      await api.updateAdminStaff(s.id, { userStatus: newStatus });
      await loadStaff();
    } catch (e: any) {
      alert(e.message || 'Failed to update status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-5 rounded-2xl border border-[#DCE4E2] shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-[#172322]">Municipal Field Staff Officers</h1>
          <p className="text-xs text-[#687674] mt-0.5">
            Manage field engineers, sanitary inspectors, ward officers, and operational assignments
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-1.5 px-4 py-2 bg-[#176B68] text-white text-xs font-bold rounded-xl hover:bg-[#125452] shadow-xs transition-colors w-fit"
        >
          <UserPlus className="w-4 h-4" />
          <span>Provision Officer</span>
        </button>
      </div>

      <div className="bg-white rounded-2xl border border-[#DCE4E2] shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#F7F9F8] border-b border-[#DCE4E2] text-[#687674] font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3.5 px-5">Officer Name</th>
                <th className="py-3.5 px-5">Contact Details</th>
                <th className="py-3.5 px-5">Department</th>
                <th className="py-3.5 px-5">Assigned Ward / Zone</th>
                <th className="py-3.5 px-5">Active Tasks</th>
                <th className="py-3.5 px-5">Status</th>
                <th className="py-3.5 px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#DCE4E2]">
              {loading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#687674]">
                    Loading staff personnel directory...
                  </td>
                </tr>
              ) : staff.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-[#687674]">
                    No staff members registered.
                  </td>
                </tr>
              ) : (
                staff.map((s) => (
                  <tr key={s.id} className="hover:bg-[#F7F9F8] transition-colors">
                    <td className="py-3.5 px-5">
                      <div className="font-bold text-[#172322] flex items-center gap-2">
                        <div className="w-7 h-7 rounded-full bg-[#176B68] text-white flex items-center justify-center font-bold text-[10px]">
                          {s.name[0]}
                        </div>
                        <span>{s.name}</span>
                      </div>
                      <span className="text-[10px] text-[#687674] ml-9 block">Role: {s.role}</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <div className="text-[#172322] font-medium">{s.email}</div>
                      <div className="text-[10px] text-[#687674]">{s.phone || 'No phone'}</div>
                    </td>
                    <td className="py-3.5 px-5 font-semibold text-[#172322]">
                      {s.departmentName}
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="flex items-center gap-1 text-[#687674] font-medium">
                        <MapPin className="w-3.5 h-3.5 text-[#176B68]" />
                        <span>{s.assignedArea}</span>
                      </span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span className="font-extrabold text-[#176B68]">{s.assignedTasksCount || 0}</span>
                      <span className="text-[10px] text-[#687674] ml-1">tasks</span>
                    </td>
                    <td className="py-3.5 px-5">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          s.userStatus === 'ACTIVE'
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                            : 'bg-slate-100 text-[#687674]'
                        }`}
                      >
                        {s.userStatus || 'ACTIVE'}
                      </span>
                    </td>
                    <td className="py-3.5 px-5 text-right">
                      <button
                        onClick={() => handleToggleStatus(s)}
                        className="px-2.5 py-1 rounded-lg border border-[#DCE4E2] text-xs font-semibold hover:bg-slate-50 transition-colors"
                      >
                        {s.userStatus === 'ACTIVE' ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Provision Staff Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-5 shadow-2xl border border-[#DCE4E2]">
            <div className="flex justify-between items-center pb-3 border-b border-[#DCE4E2]">
              <h3 className="text-sm font-bold text-[#172322]">Provision Field Officer Account</h3>
              <button onClick={() => setShowAddModal(false)} className="text-[#687674] hover:text-[#172322]">
                <X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleCreateStaff} className="pt-4 space-y-3 text-xs">
              <div>
                <label className="font-bold text-[#172322] block mb-1">Full Name</label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. Officer Vinay Kumar"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Official Email</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="e.g. vinay.kumar@bbmp.gov.in"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Official Mobile</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="e.g. +91 94480 55443"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Assigned Department</label>
                <select
                  value={departmentId}
                  onChange={(e) => setDepartmentId(e.target.value)}
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                >
                  {departments.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name} ({d.code})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="font-bold text-[#172322] block mb-1">Ward / Operational Area</label>
                <input
                  type="text"
                  value={assignedArea}
                  onChange={(e) => setAssignedArea(e.target.value)}
                  placeholder="e.g. Ward 174, HSR Sector 2"
                  className="w-full p-2.5 bg-[#F7F9F8] border border-[#DCE4E2] rounded-xl text-xs text-[#172322] focus:outline-none focus:border-[#176B68]"
                />
              </div>

              <div className="flex gap-2 pt-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2.5 bg-[#176B68] text-white font-bold text-xs rounded-xl disabled:opacity-60"
                >
                  Provision Account
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
