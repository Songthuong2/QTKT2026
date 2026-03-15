import { useState, useMemo } from 'react';
import { Search, Printer, FileText, Activity, Zap, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { procedures, Procedure } from './data';

export default function App() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Tất cả');

  const categories = ['Tất cả', 'Siêu âm', 'X-quang', 'CLVT'];

  const filteredProcedures = useMemo(() => {
    return procedures.filter((p) => {
      const matchesSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Tất cả' || p.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#E4E3E0] text-[#141414] font-sans selection:bg-[#141414] selection:text-[#E4E3E0]">
      {/* Header - Hidden on print */}
      <header className="border-b border-[#141414] p-6 md:p-10 sticky top-0 bg-[#E4E3E0]/80 backdrop-blur-md z-20 print:hidden">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <h1 className="font-serif italic text-4xl md:text-5xl tracking-tight mb-2">
              Bệnh viện Đa khoa Sông Thương
            </h1>
            <p className="font-mono text-xs uppercase tracking-widest opacity-60">
              Tra cứu thời gian thực hiện quy trình kỹ thuật
            </p>
          </div>
          <button
            onClick={handlePrint}
            className="flex items-center justify-center gap-2 px-6 py-3 border border-[#141414] hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors rounded-full font-mono text-sm uppercase tracking-wider"
          >
            <Printer size={18} />
            In danh sách
          </button>
        </div>

        {/* Controls */}
        <div className="max-w-7xl mx-auto mt-10 flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 opacity-40" size={20} />
            <input
              type="text"
              placeholder="Tìm kiếm quy trình..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 bg-transparent border-b border-[#141414] focus:outline-none focus:border-b-2 transition-all font-serif text-xl italic"
            />
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-6 py-2 rounded-full border border-[#141414] whitespace-nowrap transition-colors font-mono text-xs uppercase tracking-widest ${
                  selectedCategory === cat ? 'bg-[#141414] text-[#E4E3E0]' : 'hover:bg-[#141414]/5'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>
      </header>

      {/* Print Header - Only visible on print */}
      <div className="hidden print:block p-10 border-b-2 border-[#141414] mb-10">
        <h1 className="text-3xl font-bold uppercase text-center mb-4">Bệnh viện Đa khoa Sông Thương</h1>
        <h2 className="text-xl text-center uppercase mb-6">Danh mục thời gian thực hiện quy trình kỹ thuật</h2>
        <div className="flex justify-between text-sm font-mono">
          <span>Ngày in: {new Date().toLocaleDateString('vi-VN')}</span>
          <span>Phân loại: {selectedCategory}</span>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto p-6 md:p-10">
        <div className="grid grid-cols-1 gap-px bg-[#141414] border border-[#141414]">
          {/* Table Header */}
          <div className="grid grid-cols-[60px_1fr_150px_150px] bg-[#E4E3E0] p-4 font-mono text-[10px] uppercase tracking-widest opacity-50">
            <div>STT</div>
            <div>Tên quy trình kỹ thuật</div>
            <div className="text-center">Phân loại</div>
            <div className="text-right">Thời gian</div>
          </div>

          <AnimatePresence mode="popLayout">
            {filteredProcedures.length > 0 ? (
              filteredProcedures.map((p, index) => (
                <motion.div
                  layout
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  key={p.id}
                  className="grid grid-cols-[60px_1fr_150px_150px] bg-[#E4E3E0] p-4 md:p-6 hover:bg-[#141414] hover:text-[#E4E3E0] transition-colors group cursor-default border-b border-[#141414]/10 last:border-0"
                >
                  <div className="font-mono text-sm opacity-40 group-hover:opacity-100">{p.id}</div>
                  <div className="font-serif text-lg md:text-xl italic pr-4">{p.name}</div>
                  <div className="flex items-center justify-center">
                    <span className="px-3 py-1 rounded-full border border-[#141414] group-hover:border-[#E4E3E0] font-mono text-[10px] uppercase tracking-tighter">
                      {p.category}
                    </span>
                  </div>
                  <div className="font-mono text-sm text-right flex items-center justify-end gap-2">
                    <Activity size={14} className="opacity-40" />
                    {p.time}
                  </div>
                </motion.div>
              ))
            ) : (
              <div className="bg-[#E4E3E0] p-20 text-center">
                <p className="font-serif italic text-2xl opacity-40">Không tìm thấy quy trình nào phù hợp...</p>
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Footer info */}
        <div className="mt-20 border-t border-[#141414] pt-10 grid grid-cols-1 md:grid-cols-3 gap-10 opacity-60 print:hidden">
          <div className="flex gap-4">
            <Zap size={24} className="shrink-0" />
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest mb-2">Cơ sở pháp lý</h3>
              <p className="text-sm leading-relaxed">Dựa trên Quyết định số 2775/QĐ-BYT ngày 29/8/2025 của Bộ Y tế và các văn bản liên quan tại Bệnh viện Đa khoa Sông Thương.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <Info size={24} className="shrink-0" />
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest mb-2">Ghi chú</h3>
              <p className="text-sm leading-relaxed">Thời gian thực hiện có thể thay đổi tùy theo tình trạng cụ thể của người bệnh và điều kiện thực tế tại bệnh viện.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <FileText size={24} className="shrink-0" />
            <div>
              <h3 className="font-mono text-[10px] uppercase tracking-widest mb-2">Cập nhật</h3>
              <p className="text-sm leading-relaxed">Quy trình được rà soát và cập nhật định kỳ nhằm đáp ứng tốt nhất yêu cầu chuyên môn.</p>
            </div>
          </div>
        </div>
      </main>

      <footer className="p-10 text-center font-mono text-[10px] uppercase tracking-[0.2em] opacity-30 mt-20 border-t border-[#141414]/10 print:hidden">
        &copy; 2026 Bệnh viện Đa khoa Sông Thương - Bắc Giang
      </footer>

      {/* Global Styles for Print */}
      <style>{`
        @media print {
          body {
            background: white !important;
            color: black !important;
          }
          .min-h-screen {
            background: white !important;
          }
          main {
            padding: 0 !important;
            max-width: 100% !important;
          }
          .grid {
            background: transparent !important;
            border: none !important;
          }
          .bg-[#E4E3E0] {
            background: white !important;
          }
          .border-b {
            border-bottom: 1px solid #eee !important;
          }
          .grid-cols-[60px_1fr_150px_150px] {
            grid-template-cols: 40px 1fr 100px 100px !important;
          }
        }
      `}</style>
    </div>
  );
}
