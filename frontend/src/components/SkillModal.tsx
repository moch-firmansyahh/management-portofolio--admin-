import React from "react";

interface Skill {
  id: string;
  name: string;
  logo: string;
  percent: number;
}

interface PopularSkill {
  name: string;
  logo: string;
}

interface SkillModalProps {
  isOpen: boolean;
  isEdit: boolean;
  data: Skill;
  setData: React.Dispatch<React.SetStateAction<Skill>>;
  popularSkills: PopularSkill[];
  onSubmit: (e: React.FormEvent) => void;
  onClose: () => void;
}

export default function SkillModal({
  isOpen,
  isEdit,
  data,
  setData,
  popularSkills,
  onSubmit,
  onClose,
}: SkillModalProps) {
  if (!isOpen) return null;

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const customName = e.target.value;
    
    // Auto-fill logo if customName matches one of our popular skills
    const foundPopular = popularSkills.find(s => s.name.toLowerCase() === customName.toLowerCase());
    let logoVal = data.logo;

    if (foundPopular) {
      logoVal = foundPopular.logo;
    } else {
      if (customName.length > 0) {
        const words = customName.split(" ").filter(w => w);
        if (words.length >= 2) {
          logoVal = (words[0][0] + words[1][0]).toUpperCase().substring(0, 3);
        } else {
          logoVal = customName.substring(0, 3).toUpperCase();
        }
      } else {
        logoVal = "";
      }
    }

    setData(prev => ({
      ...prev,
      name: customName,
      logo: logoVal
    }));
  };

  return (
    <div className="admin-modal-overlay">
      <form onSubmit={onSubmit} className="admin-modal max-w-md w-full bg-white border border-gray-200 p-6 rounded-2xl shadow-2xl space-y-5">
        <h2 className="text-xl font-bold border-b border-gray-150 pb-3 text-gray-900">
          {isEdit ? "Edit Skill" : "Tambah Skill"}
        </h2>
        
        <div className="admin-input-group space-y-1.5">
          <label htmlFor="skill-name" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Nama Skill</label>
          <input
            type="text"
            id="skill-name"
            list="popular-skills"
            value={data.name}
            onChange={handleNameChange}
            placeholder="Pilih atau ketik nama skill..."
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
            required
          />
          <datalist id="popular-skills">
            {popularSkills.map(s => (
              <option key={s.name} value={s.name} />
            ))}
          </datalist>
        </div>

        <div className="admin-input-group space-y-1.5">
          <label htmlFor="skill-logo" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Logo / Singkatan (Maksimal 3 karakter)</label>
          <input
            type="text"
            id="skill-logo"
            value={data.logo}
            onChange={(e) =>
              setData(prev => ({ ...prev, logo: e.target.value.substring(0, 3) }))
            }
            placeholder="Contoh: JS, PY, Re"
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
            required
          />
        </div>

        <div className="admin-input-group space-y-1.5">
          <label htmlFor="skill-percent" className="text-xs font-semibold uppercase tracking-wider text-gray-500">Persentase Penguasaan (%)</label>
          <input
            type="number"
            id="skill-percent"
            min="0"
            max="100"
            value={data.percent}
            onChange={(e) => {
              const val = e.target.value;
              setData(prev => ({
                ...prev,
                percent: val === "" ? "" as any : parseInt(val)
              }));
            }}
            className="w-full rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm text-gray-900 placeholder-gray-400 outline-none focus:border-[#4f46e5] focus:bg-white transition"
            required
          />
        </div>

        <div className="flex gap-3 pt-3 border-t border-gray-150">
          <button
            type="button"
            className="flex-1 rounded-xl border border-gray-200 bg-gray-50 hover:bg-gray-100 py-3 text-sm font-semibold text-gray-700 transition"
            onClick={onClose}
          >
            Kembali
          </button>
          <button 
            type="submit" 
            className="flex-1.5 rounded-xl bg-[#1e1b4b] hover:bg-[#1a1843] py-3 text-sm font-semibold text-white transition"
          >
            Simpan Keahlian
          </button>
        </div>
      </form>
    </div>
  );
}
