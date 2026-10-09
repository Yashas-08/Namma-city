'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { MobileShell } from '@/components/layout/MobileShell';
import {
  ChevronLeft,
  X,
  Plus,
  ArrowRight,
  GitFork,
  Lightbulb,
  Trash2,
  Droplets,
  Grid,
  Trees,
  Volume2,
  PawPrint,
  MoreHorizontal,
} from 'lucide-react';

export default function ReportIssueStep1() {
  const router = useRouter();

  const categories = [
    { id: 'ROADS', label: 'Roads &\nFootpaths', icon: GitFork },
    { id: 'STREET_LIGHTS', label: 'Street\nLights', icon: Lightbulb },
    { id: 'GARBAGE', label: 'Garbage &\nCleanliness', icon: Trash2 },
    { id: 'WATER', label: 'Water\nSupply', icon: Droplets },
    { id: 'DRAINAGE', label: 'Drainage', icon: Grid },
    { id: 'PUBLIC_SPACES', label: 'Public\nSpaces', icon: Trees },
    { id: 'NOISE', label: 'Noise\nComplaint', icon: Volume2 },
    { id: 'STRAY_ANIMALS', label: 'Stray\nAnimals', icon: PawPrint },
    { id: 'OTHER', label: 'Other', icon: MoreHorizontal },
  ];

  const [selectedCategory, setSelectedCategory] = useState('ROADS');
  const [description, setDescription] = useState(
    'Large pothole near the 5th cross making it difficult for vehicles to pass.'
  );
  const [photos, setPhotos] = useState<string[]>([
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?w=800&auto=format&fit=crop&q=80',
  ]);
  const [errorMsg, setErrorMsg] = useState('');

  // Load from session if previously started
  useEffect(() => {
    try {
      const saved = sessionStorage.getItem('namma_report_draft');
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.categoryId) setSelectedCategory(parsed.categoryId);
        if (parsed.description) setDescription(parsed.description);
        if (parsed.photos) setPhotos(parsed.photos);
      }
    } catch {
      // ignore
    }
  }, []);

  const handleAddSamplePhoto = () => {
    if (photos.length >= 5) return;
    const samplePhotos = [
      'https://images.unsplash.com/photo-1509114397022-ed747cca3f65?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1605600659908-0ef719419d41?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1585829365295-ab7cd400c167?w=800&auto=format&fit=crop&q=80',
    ];
    const nextPhoto = samplePhotos[photos.length % samplePhotos.length];
    setPhotos([...photos, nextPhoto]);
  };

  const handleRemovePhoto = (index: number) => {
    setPhotos(photos.filter((_, i) => i !== index));
  };

  const handleNext = () => {
    if (!description.trim()) {
      setErrorMsg('Please describe the issue in detail.');
      return;
    }

    const catObj = categories.find((c) => c.id === selectedCategory);
    const draft = {
      categoryId: selectedCategory,
      categoryName: catObj?.label.replace('\n', ' ') || 'Civic Issue',
      title: 'Road maintenance',
      description,
      photos,
      address: 'Koramangala 5th Block, Bengaluru - 560034',
      latitude: 12.9352,
      longitude: 77.6245,
    };

    try {
      sessionStorage.setItem('namma_report_draft', JSON.stringify(draft));
    } catch {
      // ignore
    }

    router.push('/report/location');
  };

  return (
    <MobileShell showBottomNav={false}>
      {/* Header */}
      <div className="px-4 py-3 flex items-center justify-between bg-civic-bg border-b border-[#EAEFEF]">
        <button
          onClick={() => router.push('/home')}
          className="p-1 -ml-1 text-civic-text hover:text-civic-primary transition-colors focus:outline-none"
          aria-label="Back"
        >
          <ChevronLeft className="w-6 h-6 stroke-[2.2]" />
        </button>

        <h1 className="text-base font-bold text-civic-text">Report an Issue</h1>

        <div className="w-6" />
      </div>

      <div className="px-4 py-3 flex-1 flex flex-col gap-5">
        {/* Step Progress Indicator (Matching Reference Screen 4) */}
        <div className="flex items-center justify-center gap-3 py-1 text-xs">
          <div className="flex items-center gap-1.5 px-3 py-1 bg-civic-primary text-white rounded-full font-bold">
            <span className="w-4 h-4 rounded-full bg-white text-civic-primary text-[10px] flex items-center justify-center font-black">
              1
            </span>
            <span>Details</span>
          </div>
          <span className="text-civic-border font-bold">•</span>
          <div className="flex items-center gap-1 text-civic-text-muted font-medium">
            <span>2</span>
            <span>Location</span>
          </div>
          <span className="text-civic-border font-bold">•</span>
          <div className="flex items-center gap-1 text-civic-text-muted font-medium">
            <span>3</span>
            <span>Submit</span>
          </div>
        </div>

        {/* Section 1: Select Category */}
        <section>
          <h2 className="text-xs font-bold text-civic-text uppercase tracking-wider mb-2.5">
            Select Category
          </h2>

          <div className="grid grid-cols-3 gap-2.5">
            {categories.map((cat) => {
              const isSelected = selectedCategory === cat.id;
              const Icon = cat.icon;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`h-20 rounded-xl p-2 flex flex-col items-center justify-center text-center transition-all ${
                    isSelected
                      ? 'bg-civic-primary-light border-2 border-civic-primary text-civic-primary shadow-xs font-bold'
                      : 'bg-white border border-[#E0E7E5] text-civic-text hover:border-civic-primary'
                  }`}
                >
                  <Icon className="w-5 h-5 mb-1.5 stroke-[1.8]" />
                  <span className="text-[10px] leading-tight whitespace-pre-line">
                    {cat.label}
                  </span>
                </button>
              );
            })}
          </div>
        </section>

        {/* Section 2: Add Photos */}
        <section>
          <div className="flex items-center justify-between mb-2">
            <div>
              <h2 className="text-xs font-bold text-civic-text">Add Photos</h2>
              <p className="text-[11px] text-civic-text-muted">Add up to 5 photos</p>
            </div>
            <span className="text-xs font-bold text-civic-primary">
              {photos.length}/5
            </span>
          </div>

          <div className="flex items-center gap-3 overflow-x-auto no-scrollbar py-1">
            {/* Uploaded thumbnails */}
            {photos.map((url, i) => (
              <div
                key={i}
                className="w-20 h-20 rounded-xl bg-slate-100 border border-civic-border relative overflow-hidden shrink-0 shadow-xs group"
              >
                <img
                  src={url}
                  alt={`Upload ${i + 1}`}
                  className="w-full h-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => handleRemovePhoto(i)}
                  className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-civic-error transition-colors"
                  aria-label="Remove photo"
                >
                  <X className="w-3 h-3 stroke-[2.5]" />
                </button>
              </div>
            ))}

            {/* Add Photo Button */}
            {photos.length < 5 && (
              <button
                type="button"
                onClick={handleAddSamplePhoto}
                className="w-20 h-20 rounded-xl border-2 border-dashed border-[#CADBD4] bg-white hover:bg-civic-primary-light/30 flex flex-col items-center justify-center gap-1 text-civic-text-muted hover:text-civic-primary transition-colors shrink-0"
              >
                <Plus className="w-5 h-5" />
                <span className="text-[10px] font-semibold">Add Photo</span>
              </button>
            )}
          </div>
        </section>

        {/* Section 3: Description */}
        <section>
          <div className="flex items-center justify-between mb-1.5">
            <h2 className="text-xs font-bold text-civic-text">Description</h2>
            <span className="text-[11px] text-civic-text-muted">
              {description.length}/500
            </span>
          </div>

          <textarea
            rows={4}
            maxLength={500}
            value={description}
            onChange={(e) => {
              setDescription(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="Describe the issue in detail... (e.g. pothole, broken street light, etc.)"
            className="w-full p-3 bg-white border border-civic-border rounded-xl text-xs text-civic-text placeholder:text-civic-text-muted focus:outline-none focus:border-civic-primary transition-colors shadow-civic resize-none"
          />

          {errorMsg && (
            <p className="text-[11px] text-civic-error font-medium mt-1">
              {errorMsg}
            </p>
          )}
        </section>
      </div>

      {/* Sticky Bottom Action */}
      <div className="p-4 bg-white border-t border-civic-border">
        <button
          onClick={handleNext}
          className="w-full h-12 bg-civic-primary text-white rounded-xl font-bold text-xs flex items-center justify-center gap-2 shadow-sm hover:bg-civic-primary-dark transition-all active:scale-[0.99]"
        >
          <span>Next: Add Location</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </MobileShell>
  );
}
