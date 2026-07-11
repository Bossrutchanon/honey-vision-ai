import React, { useState, useRef } from 'react';
import { 
  Upload, AlertCircle, CheckCircle2, Droplet, 
  Activity, Utensils, Coffee, Heart, Printer, 
  RotateCcw, Loader2, ShieldCheck, FileText, Camera,
  BadgeCheck, Sparkles, Check, Globe
} from 'lucide-react';

// === ข้อมูลคำแปล (Dictionary) ===
const translations = {
  th: {
    appTitle: "ระบบวิเคราะห์คุณภาพน้ำผึ้ง",
    appDesc: "อัพโหลดภาพถ่ายน้ำผึ้งของคุณ เพื่อประเมินชนิด คุณลักษณะ และความเป็นธรรมชาติเบื้องต้นด้วยเทคโนโลยี AI",
    uploadTitle: "คลิกเพื่อเลือกรูปภาพน้ำผึ้ง",
    uploadDesc: "รองรับไฟล์ JPG, PNG, HEIC (ขนาดไม่เกิน 10MB)",
    uploadBtn: "อัพโหลดรูปภาพ",
    noteTitle: "ข้อควรทราบก่อนใช้งาน",
    note1Title: "ประเมินเบื้องต้นเท่านั้น",
    note1Desc: "ผลลัพธ์จาก AI ไม่สามารถใช้ยืนยันผลแทนห้องปฏิบัติการ (Lab) ได้",
    note2Title: "คำแนะนำการถ่ายภาพ",
    note2Desc: "ควรถ่ายในแสงธรรมชาติ โฟกัสชัดเจน ไม่มีแสงสะท้อนรบกวนมากเกินไป",
    loadingTitle: "กำลังประมวลผลรูปภาพ...",
    loadingDesc: "AI กำลังวิเคราะห์คุณลักษณะและประเมินข้อมูล",
    reportTitle: "รายงานผลการวิเคราะห์",
    reportBy: "วิเคราะห์โดย AI",
    predTitle: "ชนิดน้ำผึ้งที่คาดว่าเป็น",
    concTitle: "ข้อสรุปการประเมิน",
    concFrom: "จากผลการวิเคราะห์ มีความเป็นไปได้สูงสุดที่จะเป็น",
    concProb: "ที่ระดับความน่าจะเป็น",
    concReason: "เหตุผลประเมิน:",
    physTitle: "คุณลักษณะทางกายภาพ",
    physColor: "สี (Color)",
    physClarity: "ความใส (Clarity)",
    physVisc: "ความหนืด (Viscosity)",
    natTitle: "ประเมินความเป็นธรรมชาติ",
    natDesc: "ประเมินจากคุณภาพเนื้อผิวสัมผัสและสี",
    benTitle: "ประโยชน์",
    useTitle: "การนำไปใช้",
    disclaimerLabel: "คำแนะนำและข้อจำกัด:",
    disclaimerText: "ผลลัพธ์นี้ประเมินจากการจำลองโครงสร้างภาพถ่ายด้วยระบบ AI ไม่สามารถใช้เป็นเอกสารอ้างอิงเพื่อยืนยันชนิดหรือความแท้ของน้ำผึ้งได้ หากต้องการผลการทดสอบที่แม่นยำ 100% เพื่อใช้ในเชิงพาณิชย์ กรุณาส่งตัวอย่างตรวจที่ห้องปฏิบัติการที่ได้รับการรับรองมาตรฐาน",
    printBtn: "ดาวน์โหลดรายงาน PDF",
    newBtn: "วิเคราะห์ภาพใหม่",
    errNoKey: "ไม่พบ API Key ระบบกำลังแสดงข้อมูลจำลองเพื่อการทดสอบ UI",
    aiLangInstruction: "ตอบกลับเป็นภาษาไทยเท่านั้น"
  },
  en: {
    appTitle: "Honey Quality Analysis",
    appDesc: "Upload your honey photo for a preliminary AI assessment of its type, characteristics, and naturalness.",
    uploadTitle: "Click to select a honey image",
    uploadDesc: "Supports JPG, PNG, HEIC (Max 10MB)",
    uploadBtn: "Upload Image",
    noteTitle: "Important Notes",
    note1Title: "Preliminary Assessment Only",
    note1Desc: "AI results cannot be used as a substitute for official laboratory tests.",
    note2Title: "Photography Guidelines",
    note2Desc: "Shoot in natural light with clear focus. Avoid excessive glare or reflections.",
    loadingTitle: "Analyzing Image...",
    loadingDesc: "AI is extracting characteristics and evaluating data.",
    reportTitle: "Analysis Report",
    reportBy: "Analyzed by AI",
    predTitle: "Predicted Honey Type",
    concTitle: "Assessment Conclusion",
    concFrom: "Based on the analysis, it is highly likely to be",
    concProb: "with a probability of",
    concReason: "Reasoning:",
    physTitle: "Physical Characteristics",
    physColor: "Color",
    physClarity: "Clarity",
    physVisc: "Viscosity",
    natTitle: "Naturalness Assessment",
    natDesc: "Evaluated from visual texture and color quality",
    benTitle: "Benefits",
    useTitle: "Usage",
    disclaimerLabel: "Disclaimer:",
    disclaimerText: "This result is based on an AI visual structural evaluation and cannot be used as a legal reference to confirm the type or authenticity of the honey. For 100% accurate commercial results, please submit samples to a certified laboratory.",
    printBtn: "Download PDF Report",
    newBtn: "Analyze New Image",
    errNoKey: "API Key not found. Displaying mock data for UI testing.",
    aiLangInstruction: "Respond strictly in English language."
  },
  zh: {
    appTitle: "蜂蜜质量分析系统",
    appDesc: "上传您的蜂蜜照片，AI将对其类型、特征和自然度进行初步评估。",
    uploadTitle: "点击选择蜂蜜图片",
    uploadDesc: "支持 JPG, PNG, HEIC (最大 10MB)",
    uploadBtn: "上传图片",
    noteTitle: "使用前须知",
    note1Title: "仅供初步评估",
    note1Desc: "AI 结果不能代替官方实验室的检测结果。",
    note2Title: "拍摄指南",
    note2Desc: "请在自然光下拍摄，确保对焦清晰，避免过多的反光。",
    loadingTitle: "正在分析图片...",
    loadingDesc: "AI 正在提取特征并评估数据。",
    reportTitle: "分析报告",
    reportBy: "由 AI 分析",
    predTitle: "预测蜂蜜类型",
    concTitle: "评估结论",
    concFrom: "根据分析，它极有可能是",
    concProb: "可能性为",
    concReason: "评估理由:",
    physTitle: "物理特征",
    physColor: "颜色",
    physClarity: "清晰度",
    physVisc: "粘稠度",
    natTitle: "自然度评估",
    natDesc: "根据视觉纹理和颜色质量评估",
    benTitle: "好处",
    useTitle: "使用方法",
    disclaimerLabel: "免责声明:",
    disclaimerText: "此结果基于 AI 视觉结构评估，不能作为确认蜂蜜类型或真伪的法律参考。如需 100% 准确的商业测试结果，请将样品提交给认证实验室。",
    printBtn: "下载 PDF 报告",
    newBtn: "分析新图片",
    errNoKey: "未找到 API 密钥。显示模拟数据以进行 UI 测试。",
    aiLangInstruction: "必须使用简体中文回答。"
  }
};

export default function App() {
  const [lang, setLang] = useState('th'); 
  const [screen, setScreen] = useState('home'); 
  const [imageSrc, setImageSrc] = useState(null);
  const [aiResult, setAiResult] = useState(null);
  const [error, setError] = useState(null);
  const fileInputRef = useRef(null);

  const t = translations[lang];

  // ฟังก์ชันย่อขนาดภาพ ป้องกันเว็บค้าง
  const compressImage = (base64Str, maxWidth = 800, maxHeight = 800) => {
    return new Promise((resolve) => {
      let img = new Image();
      img.src = base64Str;
      img.onload = () => {
        let canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;

        if (width > height) {
          if (width > maxWidth) {
            height *= maxWidth / width;
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width *= maxHeight / height;
            height = maxHeight;
          }
        }
        canvas.width = width;
        canvas.height = height;
        let ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
    });
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setScreen('analyzing'); 
    
    const reader = new FileReader();
    reader.onload = async (event) => {
      const base64String = event.target.result;
      setImageSrc(base64String); 
      const compressedBase64 = await compressImage(base64String);
      analyzeImage(compressedBase64);
    };
    reader.readAsDataURL(file);
  };

  const analyzeImage = async (base64) => {
    setError(null);
    const apiKey = ""; // 🔴 ใส่ API KEY ของคุณตรงนี้เพื่อใช้งานจริง 🔴

    if (!apiKey) {
      showMockData(t.errNoKey);
      return;
    }

    const prompt = `You are an expert AI in honey analysis for "Honey Dee Big Bee Farm". 
    Analyze this honey image and estimate the top 3 possible honey types.
    CRITICAL INSTRUCTION: ${t.aiLangInstruction}. The JSON values MUST be written in the selected language.
    
    Reply ONLY in valid JSON format with this exact structure (keep keys in English):
    {
      "predictions": [
        {"type": "Name of honey type 1", "percentage": number},
        {"type": "Name of honey type 2", "percentage": number},
        {"type": "Name of honey type 3", "percentage": number}
      ],
      "conclusion_reason": "Short explanation of why it is predicted as type 1",
      "characteristics": {
        "color": "Color description",
        "clarity": "Clarity description",
        "viscosity": "Viscosity description"
      },
      "naturalnessScore": number 1-100,
      "benefits": ["Benefit 1", "Benefit 2", "Benefit 3", "Benefit 4"],
      "usages": ["Usage 1", "Usage 2", "Usage 3", "Usage 4"]
    }`;

    const mimeMatch = base64.match(/data:(.*?);base64/);
    const mimeType = mimeMatch ? mimeMatch[1] : "image/jpeg";
    const base64Data = base64.split(',')[1];

    try {
      const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          contents: [{
            role: "user",
            parts: [{ text: prompt }, { inlineData: { mimeType: mimeType, data: base64Data } }]
          }],
          generationConfig: { responseMimeType: "application/json" }
        })
      });

      if (!response.ok) throw new Error(`API Error: ${response.status}`);

      const result = await response.json();
      let text = result.candidates?.[0]?.content?.parts?.[0]?.text;
      
      if (text) {
        text = text.replace(/```json/g, '').replace(/```/g, '').trim();
        const parsedData = JSON.parse(text);
        
        // Fallback ถ้า AI ตอบกลับข้อมูลมาไม่ครบ
        const safeData = {
          predictions: parsedData.predictions || [{type: '-', percentage: 0}],
          conclusion_reason: parsedData.conclusion_reason || "-",
          characteristics: parsedData.characteristics || { color: "-", clarity: "-", viscosity: "-" },
          naturalnessScore: parsedData.naturalnessScore || 0,
          benefits: parsedData.benefits && parsedData.benefits.length > 0 ? parsedData.benefits : ["-"],
          usages: parsedData.usages && parsedData.usages.length > 0 ? parsedData.usages : ["-"]
        };

        setAiResult(safeData);
        setScreen('result');
      } else {
        throw new Error("No data returned");
      }
    } catch (err) {
      console.error("AI Analysis Failed:", err);
      showMockData(t.errNoKey); 
    }
  };

  const showMockData = (errorMessage) => {
    let mockData = {};
    if(lang === 'en') {
      mockData = {
        predictions: [{ type: "Longan Honey", percentage: 81 }, { type: "Coffee Honey", percentage: 12 }, { type: "Wildflower Honey", percentage: 7 }],
        conclusion_reason: "Based on the rich golden-amber color and consistent viscosity, which is a prominent characteristic of pure Longan honey.",
        characteristics: { color: "Golden Amber", clarity: "Medium Clear", viscosity: "Consistently Thick" },
        naturalnessScore: 85,
        benefits: ["Provides natural energy", "Contains antioxidants", "Good sugar substitute", "Great for health enthusiasts"],
        usages: ["Mix with tea/coffee", "Baking", "Cooking", "Skin care products"]
      };
    } else if (lang === 'zh') {
      mockData = {
        predictions: [{ type: "龙眼蜜", percentage: 81 }, { type: "咖啡蜜", percentage: 12 }, { type: "百花蜜", percentage: 7 }],
        conclusion_reason: "基于丰富的金琥珀色和一致的粘稠度，这是纯龙眼蜜的突出特征。",
        characteristics: { color: "金琥珀色", clarity: "中等清澈", viscosity: "持续浓稠" },
        naturalnessScore: 85,
        benefits: ["提供自然能量", "含有抗氧化剂", "良好的糖替代品", "非常适合健康爱好者"],
        usages: ["搭配茶/咖啡", "烘焙", "烹饪", "护肤产品"]
      };
    } else {
      mockData = {
        predictions: [{ type: "น้ำผึ้งดอกลำไย", percentage: 81 }, { type: "น้ำผึ้งดอกกาแฟ", percentage: 12 }, { type: "น้ำผึ้งดอกไม้ป่า", percentage: 7 }],
        conclusion_reason: "ประเมินจากลักษณะสีเหลืองทองอำพันที่เข้มข้น และความหนืดที่สม่ำเสมอ ซึ่งเป็นเอกลักษณ์ที่โดดเด่นของน้ำผึ้งดอกลำไยแท้",
        characteristics: { color: "เหลืองทองอำพัน", clarity: "ใสปานกลาง", viscosity: "ข้นหนืดสม่ำเสมอ" },
        naturalnessScore: 85,
        benefits: ["ให้พลังงานจากธรรมชาติ", "มีสารต้านอนุมูลอิสระ", "ใช้แทนน้ำตาลได้ดี", "เหมาะสำหรับผู้รักสุขภาพ"],
        usages: ["ชงชา / กาแฟ", "เบเกอรี่", "ประกอบอาหาร", "ผลิตภัณฑ์ดูแลผิว"]
      };
    }
    
    setAiResult(mockData);
    setError(errorMessage);
    setScreen('result');
  };

  return (
    <div className="min-h-screen bg-[#f8fafc] font-sans text-slate-800 flex flex-col selection:bg-amber-200">
      
      {/* HEADER WITH LOGO & LANGUAGE SELECTOR */}
      <header className="w-full bg-white border-b border-slate-200 sticky top-0 z-50 shadow-sm print:hidden">
        <div className="max-w-4xl mx-auto px-4 py-3 sm:py-0 sm:h-20 flex items-center justify-between">
          
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <img 
              src="/logo.jpg" 
              alt="Honey Dee Logo" 
              className="w-10 h-10 sm:w-16 sm:h-16 object-contain"
              onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
            />
            <div className="hidden bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl shadow-sm items-center justify-center">
              <Droplet className="text-white w-5 h-5 sm:w-7 sm:h-7 fill-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base sm:text-2xl font-bold text-slate-900 leading-tight whitespace-nowrap">Honey Vision AI</h1>
              <p className="text-[9px] sm:text-xs font-bold text-amber-600 uppercase tracking-widest leading-tight mt-0.5 whitespace-nowrap">
                Honey Dee Big Bee Farm
              </p>
            </div>
          </div>
          
          <div className="shrink-0 ml-2">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 hover:border-amber-400 px-2 sm:px-3 py-1.5 rounded-full shadow-sm transition-colors cursor-pointer">
              <Globe className="w-4 h-4 text-amber-600 hidden sm:block" />
              <select 
                value={lang} 
                onChange={(e) => setLang(e.target.value)}
                className="bg-transparent border-none text-[11px] sm:text-sm font-bold text-amber-900 outline-none cursor-pointer"
              >
                <option value="th">🇹🇭 ไทย</option>
                <option value="en">🇬🇧 EN</option>
                <option value="zh">🇨🇳 中文</option>
              </select>
            </div>
          </div>

        </div>
      </header>

      <main className="flex-1 w-full max-w-4xl mx-auto px-4 sm:px-6 py-6 sm:py-10">
        
        {/* --- SCREEN 1: HOME --- */}
        {screen === 'home' && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold text-slate-900 mb-3 sm:mb-4">{t.appTitle}</h2>
              <p className="text-slate-500 text-sm sm:text-base px-4 max-w-2xl mx-auto leading-relaxed">
                {t.appDesc}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-8 items-start">
              <div className="md:col-span-3 order-1">
                <div 
                  onClick={() => fileInputRef.current.click()}
                  className="bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50/80 transition-all rounded-3xl p-8 sm:p-14 flex flex-col items-center justify-center cursor-pointer min-h-[250px] shadow-sm group"
                >
                  <div className="bg-amber-100 p-4 sm:p-5 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300">
                    <Upload className="w-8 h-8 sm:w-10 sm:h-10 text-amber-600" />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 text-center">{t.uploadTitle}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm text-center">{t.uploadDesc}</p>
                  
                  <button className="mt-6 sm:mt-8 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium shadow-md shadow-amber-500/20 transition-all text-sm sm:text-base w-full sm:w-auto">
                    {t.uploadBtn}
                  </button>
                </div>
                <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handleImageUpload} />
              </div>

              <div className="md:col-span-2 bg-white rounded-3xl p-6 sm:p-8 shadow-sm border border-slate-200 order-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900 flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
                  <AlertCircle className="w-5 h-5 text-amber-500 shrink-0" /> {t.noteTitle}
                </h3>
                <ul className="space-y-5 text-sm sm:text-base text-slate-600">
                  <li className="flex gap-3 items-start">
                    <CheckCircle2 className="w-5 h-5 text-green-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed text-balance">
                      <strong className="text-slate-800 font-semibold block mb-1">{t.note1Title}</strong>
                      {t.note1Desc}
                    </div>
                  </li>
                  <li className="flex gap-3 items-start">
                    <Camera className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                    <div className="leading-relaxed text-balance">
                      <strong className="text-slate-800 font-semibold block mb-1">{t.note2Title}</strong>
                      {t.note2Desc}
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* --- SCREEN 2: LOADING --- */}
        {screen === 'analyzing' && (
          <div className="flex flex-col items-center justify-center py-20 sm:py-32">
            <div className="bg-white p-5 rounded-full shadow-xl border border-amber-100 mb-6 relative">
               <div className="absolute inset-0 border-4 border-amber-200 rounded-full animate-ping opacity-20"></div>
               <Loader2 className="w-10 h-10 text-amber-500 animate-spin relative z-10" />
            </div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-800">{t.loadingTitle}</h2>
            <p className="text-slate-500 text-sm sm:text-base mt-2">{t.loadingDesc}</p>
          </div>
        )}

        {/* --- SCREEN 3: RESULT --- */}
        {screen === 'result' && aiResult && (
          <div className="animate-in fade-in max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full print:rounded-none">
            
            <div className="p-6 md:p-8 border-b border-slate-100 flex flex-col sm:flex-row items-center sm:items-start gap-4 sm:gap-6 bg-slate-50/50">
               <img src={imageSrc} alt="Honey" className="w-24 h-24 sm:w-32 sm:h-32 rounded-2xl object-cover shadow-md border-4 border-white shrink-0" />
               <div className="w-full text-center sm:text-left">
                 {error && (
                  <div className="bg-amber-100/60 text-amber-900 text-xs sm:text-sm p-3 rounded-xl flex items-center justify-center sm:justify-start gap-2 mb-3 border border-amber-200">
                    <AlertCircle className="w-4 h-4 shrink-0" /> <span className="leading-tight">{error}</span>
                  </div>
                 )}
                 <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-2 sm:mt-0">{t.reportTitle}</h2>
                 <p className="text-slate-500 text-sm mt-2 flex items-center justify-center sm:justify-start gap-1.5">
                   {t.reportBy} <span className="hidden sm:inline">•</span> Honey Dee Big Bee Farm
                 </p>
               </div>
            </div>

            <div className="p-6 md:p-8 space-y-8 sm:space-y-10">
              
              <section>
                <h3 className="text-lg font-bold text-slate-900 mb-5 flex items-center gap-2">
                  <FileText className="w-5 h-5 text-slate-600" /> {t.predTitle}
                </h3>
                <div className="space-y-5 px-1 sm:px-2">
                  {aiResult.predictions?.map((item, idx) => (
                    <div key={idx} className="flex flex-col sm:flex-row sm:items-center gap-1.5 sm:gap-4">
                      <div className="flex justify-between sm:w-40 items-center">
                        <span className="text-sm font-semibold text-slate-700">{item.type}</span>
                        <span className="sm:hidden text-sm font-bold text-slate-900">{item.percentage}%</span>
                      </div>
                      <div className="flex-1 h-3 sm:h-3.5 bg-slate-100 rounded-full overflow-hidden w-full">
                        <div 
                          className={`h-full rounded-full transition-all duration-1000 ${idx === 0 ? 'bg-amber-500' : idx === 1 ? 'bg-amber-400' : 'bg-slate-300'}`} 
                          style={{width: `${item.percentage}%`}}
                        ></div>
                      </div>
                      <div className="hidden sm:block w-12 text-right text-sm sm:text-base font-bold text-slate-900">
                        {item.percentage}%
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <section className="bg-gradient-to-br from-amber-50 to-orange-50 border border-amber-200 p-6 rounded-2xl relative overflow-hidden shadow-sm">
                <div className="absolute -right-6 -top-6 opacity-5 mix-blend-multiply pointer-events-none">
                  <BadgeCheck className="w-40 h-40 text-amber-900" />
                </div>
                <h3 className="font-bold text-amber-900 mb-3 flex items-center gap-2 relative z-10 text-lg">
                  <Sparkles className="w-5 h-5 text-amber-600" /> {t.concTitle}
                </h3>
                <div className="relative z-10">
                  <p className="text-sm sm:text-base text-amber-900/95 leading-loose text-balance">
                    {t.concFrom} <b className="bg-amber-200/50 px-2 py-0.5 rounded text-amber-950">{aiResult.predictions?.[0]?.type}</b> {t.concProb} <b className="text-amber-700 text-lg">{aiResult.predictions?.[0]?.percentage}%</b>
                  </p>
                  <p className="text-amber-800/80 mt-3 text-sm leading-relaxed border-t border-amber-200/60 pt-3">
                    <b>{t.concReason}</b> {aiResult.conclusion_reason}
                  </p>
                </div>
              </section>

              <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 sm:gap-6">
                 <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6">
                    <h3 className="text-base font-bold text-slate-800 mb-5 flex items-center gap-2">
                      <Activity className="w-5 h-5 text-blue-600" /> {t.physTitle}
                    </h3>
                    <div className="space-y-4">
                       <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1 border-b border-slate-200 pb-3">
                         <span className="text-slate-500 text-sm sm:text-base w-full sm:w-auto">{t.physColor}</span>
                         <span className="font-semibold text-slate-900 text-sm sm:text-base w-full sm:w-auto text-right break-words">{aiResult.characteristics?.color}</span>
                       </div>
                       <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1 border-b border-slate-200 pb-3">
                         <span className="text-slate-500 text-sm sm:text-base w-full sm:w-auto">{t.physClarity}</span>
                         <span className="font-semibold text-slate-900 text-sm sm:text-base w-full sm:w-auto text-right break-words">{aiResult.characteristics?.clarity}</span>
                       </div>
                       <div className="flex flex-wrap sm:flex-nowrap justify-between gap-1">
                         <span className="text-slate-500 text-sm sm:text-base w-full sm:w-auto">{t.physVisc}</span>
                         <span className="font-semibold text-slate-900 text-sm sm:text-base w-full sm:w-auto text-right break-words">{aiResult.characteristics?.viscosity}</span>
                       </div>
                    </div>
                 </div>

                 <div className="bg-gradient-to-br from-orange-400 to-amber-500 rounded-2xl p-6 text-white flex flex-col justify-center items-center shadow-inner">
                    <h3 className="text-sm sm:text-base font-medium text-amber-50 mb-2">{t.natTitle}</h3>
                    <div className="flex items-baseline gap-1 my-2">
                      <span className="text-6xl sm:text-7xl font-black drop-shadow-sm">{aiResult.naturalnessScore}</span>
                      <span className="text-2xl sm:text-3xl font-bold opacity-80">%</span>
                    </div>
                    <p className="text-xs sm:text-sm text-amber-50 mt-2 text-center bg-black/10 px-3 py-1.5 rounded-full font-medium">
                      {t.natDesc}
                    </p>
                 </div>
              </section>

              <section className="border-t border-slate-100 pt-8">
                 <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 sm:gap-10">
                   <div>
                     <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-2">
                       <Heart className="w-5 h-5 text-rose-500" /> {t.benTitle}
                     </h3>
                     <div className="flex flex-col gap-3">
                       {aiResult.benefits?.map((item, idx) => (
                         <div key={idx} className="flex items-start gap-3 p-3 bg-green-50/70 rounded-xl border border-green-100/50">
                           <Check className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
                           <span className="text-sm sm:text-base text-slate-700 leading-relaxed text-balance break-words w-full">{item}</span>
                         </div>
                       ))}
                     </div>
                   </div>

                   <div>
                     <h3 className="text-base sm:text-lg font-bold text-slate-900 mb-5 flex items-center gap-2 border-b border-slate-100 pb-2">
                       <Utensils className="w-5 h-5 text-orange-500" /> {t.useTitle}
                     </h3>
                     <div className="flex flex-col gap-3">
                       {aiResult.usages?.map((item, idx) => (
                         <div key={idx} className="flex items-start gap-3 p-3 bg-amber-50/70 rounded-xl border border-amber-100/50">
                           <Coffee className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
                           <span className="text-sm sm:text-base text-slate-700 leading-relaxed text-balance break-words w-full">{item}</span>
                         </div>
                       ))}
                     </div>
                   </div>
                 </div>
              </section>

              <section className="bg-slate-50 border border-slate-200 p-5 rounded-2xl flex gap-3 print:bg-white">
                <ShieldCheck className="w-6 h-6 text-slate-400 shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-slate-500 leading-loose">
                  <b className="text-slate-700">{t.disclaimerLabel}</b> {t.disclaimerText}
                </p>
              </section>
            </div>

            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
               <button 
                 onClick={() => window.print()}
                 className="w-full sm:w-auto flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg shadow-slate-900/20 text-sm sm:text-base"
               >
                 <Printer className="w-5 h-5" /> {t.printBtn}
               </button>
               <button 
                 onClick={() => { setScreen('home'); setAiResult(null); }}
                 className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-8 py-3.5 rounded-full font-medium transition-colors shadow-sm text-sm sm:text-base"
               >
                 <RotateCcw className="w-5 h-5" /> {t.newBtn}
               </button>
            </div>

          </div>
        )}

      </main>
    </div>
  );
}