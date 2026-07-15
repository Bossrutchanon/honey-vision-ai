// force rebuild

import { useState, useRef, useEffect, type ChangeEvent } from 'react';
import { GoogleGenerativeAI } from '@google/generative-ai';
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import { 
  Upload, AlertCircle, CheckCircle2, Droplet, 
  Activity, Utensils, Coffee, Heart, 
  RotateCcw, Loader2, ShieldCheck, FileText, Camera,
  BadgeCheck, Sparkles, Check, Globe
} from 'lucide-react';

// === ข้อมูลคำแปล (Dictionary) ===
type TranslationStrings = {
  appTitle: string;
  appDesc: string;
  uploadTitle: string;
  uploadDesc: string;
  uploadAction: string;
  downloadPNG: string;
  downloadPDF: string;
  downloadReport: string;
  downloadModalTitle: string;
  uploadBtn: string;
  noteTitle: string;
  note1Title: string;
  note1Desc: string;
  note2Title: string;
  note2Desc: string;
  loadingTitle: string;
  loadingDesc: string;
  reportTitle: string;
  reportBy: string;
  predTitle: string;
  concTitle: string;
  concFrom: string;
  concProb: string;
  concReason: string;
  physTitle: string;
  physColor: string;
  physClarity: string;
  physVisc: string;
  natTitle: string;
  natDesc: string;
  benTitle: string;
  useTitle: string;
  disclaimerLabel: string;
  disclaimerText: string;
  printBtn: string;
  newBtn: string;
  errNoKey: string;
  aiLangInstruction: string;
  aiSystemInstruction: string;
  brandShort: string;
  errReadFile: string;
  errorDailyTitle: string;
  errorRateTitle: string;
  errorGeneralTitle: string;
  errorDailyDesc: string;
  errorRateDesc: string;
  errorGeneralDesc: string;
  modalAcknowledge: string;
  benefits: string[];
  usages: string[];
};
const translations: Record<'th' | 'en' | 'zh', TranslationStrings> = {
  th: {
    appTitle: "ระบบวิเคราะห์คุณภาพน้ำผึ้ง",
    appDesc: "อัพโหลดภาพถ่ายน้ำผึ้งของคุณ เพื่อประเมินชนิด คุณลักษณะ และความเป็นธรรมชาติเบื้องต้นด้วยเทคโนโลยี AI",
    uploadTitle: "คลิกเพื่อเลือกรูปภาพน้ำผึ้ง",
    uploadDesc: "รองรับไฟล์ JPG, PNG, HEIC (ขนาดไม่เกิน 10MB)",
    uploadAction: 'ถ่ายรูปหรืออัปโหลดภาพน้ำผึ้ง',
    downloadPNG: 'ดาวน์โหลดเป็นรูปภาพ (PNG)',
    downloadPDF: 'ดาวน์โหลดเป็นเอกสาร (PDF)',
    downloadReport: 'ดาวน์โหลดใบรายงานผล',
    downloadModalTitle: 'เลือกรูปแบบไฟล์ดาวน์โหลด',
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
    ,
    aiSystemInstruction: "ให้วิเคราะห์และตอบกลับผลลัพธ์ทั้งหมด (รวมถึงชื่อประเภทน้ำผึ้ง, เปอร์เซ็นต์ความมั่นใจ, และเหตุผลการประเมิน) เป็นภาษาไทยเท่านั้น ห้ามมีภาษาอื่นปน",
    brandShort: "Honey Dee Big Bee Farm",
    errReadFile: 'ไม่สามารถอ่านไฟล์ภาพได้ กรุณาลองใหม่',
    errorDailyTitle: 'ขออภัยค่ะ',
    errorRateTitle: 'ระบบหนาแน่นชั่วคราว',
    errorGeneralTitle: 'เกิดข้อผิดพลาด',
    errorDailyDesc: 'สิทธิ์การใช้งานฟรีในวันนี้เต็มแล้ว\nกรุณากลับมาลองใหม่อีกครั้งในวันพรุ่งนี้นะคะ',
    errorRateDesc: 'มีการส่งข้อมูลถี่เกินไปในขณะนี้\nกรุณารอสักครู่แล้วลองใหม่อีกครั้งค่ะ',
    errorGeneralDesc: 'ไม่สามารถประมวลผลรูปภาพได้ในขณะนี้\nกรุณาตรวจสอบและลองใหม่อีกครั้งค่ะ',
    modalAcknowledge: 'รับทราบ',
    benefits: ['ดีต่อระบบภูมิคุ้มกัน', 'ช่วยลดการอักเสบ', 'บำรุงผิวพรรณ', 'ให้พลังงานอย่างยาวนาน'],
    usages: ['ชงกับชา', 'ราดแพนเค้ก', 'หมักเนื้อ', 'พอกหน้า']
  },
  en: {
    appTitle: "Honey Quality Analysis",
    appDesc: "Upload your honey photo for a preliminary AI assessment of its type, characteristics, and naturalness.",
    uploadTitle: "Click to select a honey image",
    uploadDesc: "Supports JPG, PNG, HEIC (Max 10MB)",
    uploadAction: 'Take photo or upload your honey image',
    downloadPNG: 'Download as Image (PNG)',
    downloadPDF: 'Download as Document (PDF)',
    downloadReport: 'Download Report',
    downloadModalTitle: 'Choose file format to download',
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
    ,
    aiSystemInstruction: "Analyze and respond with all results (including honey type names, confidence percentages, and reasons) ONLY in English. Do not include any other language.",
    brandShort: "Honey Dee Big Bee Farm",
    errReadFile: 'Unable to read the image file. Please try again.',
    errorDailyTitle: 'Sorry',
    errorRateTitle: 'Temporary congestion',
    errorGeneralTitle: 'An error occurred',
    errorDailyDesc: 'Free usage quota for today has been exhausted.\nPlease try again tomorrow.',
    errorRateDesc: 'The system is currently busy.\nPlease wait a moment and try again.',
    errorGeneralDesc: 'Unable to process the image right now.\nPlease check and try again.',
    modalAcknowledge: 'OK',
    benefits: ['Supports immune health', 'Reduces inflammation', 'Nourishes skin', 'Provides long-lasting energy'],
    usages: ['Stir into tea', 'Drizzle on pancakes', 'Marinate meat', 'Apply as a face mask']
  },
  zh: {
    appTitle: "蜂蜜质量分析系统",
    appDesc: "上传您的蜂蜜照片，AI将对其类型、特征和自然度进行初步评估。",
    uploadTitle: "点击选择蜂蜜图片",
    uploadDesc: "支持 JPG, PNG, HEIC (最大 10MB)",
    uploadAction: '拍照或上传您的蜂蜜图片',
    downloadPNG: '下载为图片 (PNG)',
    downloadPDF: '下载为文档 (PDF)',
    downloadReport: '下载分析报告',
    downloadModalTitle: '选择要下载的文件格式',
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
    ,
    aiSystemInstruction: "请分析并将所有结果（包括蜂蜜类型名称、置信度百分比和评估理由）仅以简体中文完整返回，禁止混用其他语言。",
    brandShort: "Honey Dee Big Bee Farm",
    errReadFile: '无法读取图像文件，请重试。',
    errorDailyTitle: '抱歉',
    errorRateTitle: '系统繁忙',
    errorGeneralTitle: '发生错误',
    errorDailyDesc: '今天的免费使用额度已用完。\n请明天再试。',
    errorRateDesc: '系统当前负载较高。\n请稍候再试。',
    errorGeneralDesc: '当前无法处理图像。\n请检查后重试。',
    modalAcknowledge: '知道了',
    benefits: ['支持免疫健康', '减少炎症', '滋养皮肤', '提供持久能量'],
    usages: ['加入茶中', '淋在煎饼上', '腌制肉类', '做面膜使用']
  }
};


type Prediction = { type: string; percentage: number };

type LocalizedAnalysis = {
  type: string;
  reason: string;
  color: string;
  clarity: string;
  viscosity: string;
  predictions: Prediction[];
  benefits: string[];
  usages: string[];
};

type AnalysisResult = {
  naturalnessScore: number;
  resultsByLanguage: Record<'th' | 'en' | 'zh', LocalizedAnalysis>;
};

export default function App() {
  const [lang, setLang] = useState<'th' | 'en' | 'zh'>('th');
  const [screen, setScreen] = useState<'home' | 'analyzing' | 'result'>('home');
  const [imageSrc, setImageSrc] = useState<string>('');
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorType, setErrorType] = useState<'daily' | 'rate' | 'general' | null>(null);
  const [isErrorModalOpen, setIsErrorModalOpen] = useState(false);
  const isAnalyzing = useRef(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const t = translations[lang];
  const activeAnalysis = analysisResult?.resultsByLanguage[lang] ?? null;
  const reportRef = useRef<HTMLDivElement | null>(null);
  const imageUrlRef = useRef<string | null>(null);
  const [isDownloadModalOpen, setIsDownloadModalOpen] = useState(false);

  const revokePreviewUrl = () => {
    if (imageUrlRef.current) {
      URL.revokeObjectURL(imageUrlRef.current);
      imageUrlRef.current = null;
    }
  };

  const loadPreviewImage = (src: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve();
      img.onerror = () => reject(new Error('Image preview failed to load'));
      img.src = src;
    });
  };

  const readFileAsDataURL = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(new Error('Unable to read image file'));
      reader.readAsDataURL(file);
    });
  };

  useEffect(() => {
    return () => {
      revokePreviewUrl();
    };
  }, []);

  // ฟังก์ชันปิด Error Modal และล้างค่าต่าง ๆ
  const handleCloseErrorModal = () => {
    setIsErrorModalOpen(false);
    setErrorType(null);
    setError(null);
    revokePreviewUrl();
    setImageSrc('');
    setScreen('home');
  };

  // ฟังก์ชันย่อขนาดภาพ ป้องกันเว็บค้าง
  const compressImage = (base64Str: string, maxWidth = 800, maxHeight = 800): Promise<string> => {
    return new Promise((resolve) => {
      const img = new Image();
      img.src = base64Str;
      img.onload = () => {
        const canvas = document.createElement('canvas');
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
        const ctx = canvas.getContext('2d');
        if (!ctx) return resolve(base64Str);
        ctx.drawImage(img, 0, 0, width, height);
        resolve(canvas.toDataURL('image/jpeg', 0.8));
      };
      img.onerror = () => resolve(base64Str);
    });
  };

  const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      e.preventDefault();
      const file = e.target.files?.[0];
      if (!file || isAnalyzing.current) return;

      revokePreviewUrl();
      setError(null);
      setIsLoading(true);
      setScreen('home');

      const previewUrl = URL.createObjectURL(file);
      imageUrlRef.current = previewUrl;
      await loadPreviewImage(previewUrl);
      setImageSrc(previewUrl);
      setScreen('analyzing');
      isAnalyzing.current = true;

      const base64String = await readFileAsDataURL(file);
      if (!base64String) {
        throw new Error('No image data available');
      }

      const compressedBase64 = await compressImage(base64String);
      const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string;
      if (!apiKey) {
        setError(t.errNoKey);
        setScreen('home');
        setIsLoading(false);
        isAnalyzing.current = false;
        return;
      }

      const genAI = new GoogleGenerativeAI(apiKey);
      const model = genAI.getGenerativeModel({ model: 'gemini-3.5-flash' });

      const prompt = `You are an expert AI in honey analysis for "Honey Dee Big Bee Farm".
Analyze this honey image and estimate the top 3 possible honey types.
Respond ONLY with a JSON object containing localized results in Thai (th), English (en), and Simplified Chinese (zh).
Do not include any text outside the JSON object.

Expected JSON structure:
{
  "naturalnessScore": number,
  "th": {
    "type": "Honey type name in Thai",
    "reason": "Short assessment reason in Thai",
    "color": "Color description in Thai",
    "clarity": "Clarity description in Thai",
    "viscosity": "Viscosity description in Thai",
    "predictions": [
      {"type": "Honey type 1 in Thai", "percentage": number},
      {"type": "Honey type 2 in Thai", "percentage": number},
      {"type": "Honey type 3 in Thai", "percentage": number}
    ],
    "benefits": ["Benefit 1 in Thai", "Benefit 2 in Thai", "Benefit 3 in Thai", "Benefit 4 in Thai"],
    "usages": ["Usage 1 in Thai", "Usage 2 in Thai", "Usage 3 in Thai", "Usage 4 in Thai"]
  },
  "en": {
    "type": "Honey type name in English",
    "reason": "Short assessment reason in English",
    "color": "Color description in English",
    "clarity": "Clarity description in English",
    "viscosity": "Viscosity description in English",
    "predictions": [
      {"type": "Honey type 1 in English", "percentage": number},
      {"type": "Honey type 2 in English", "percentage": number},
      {"type": "Honey type 3 in English", "percentage": number}
    ],
    "benefits": ["Benefit 1 in English", "Benefit 2 in English", "Benefit 3 in English", "Benefit 4 in English"],
    "usages": ["Usage 1 in English", "Usage 2 in English", "Usage 3 in English", "Usage 4 in English"]
  },
  "zh": {
    "type": "蜂蜜类型名称（中文）",
    "reason": "简短评估理由（中文）",
    "color": "颜色描述（中文）",
    "clarity": "清晰度描述（中文）",
    "viscosity": "粘稠度描述（中文）",
    "predictions": [
      {"type": "蜂蜜类型1（中文）", "percentage": number},
      {"type": "蜂蜜类型2（中文）", "percentage": number},
      {"type": "蜂蜜类型3（中文）", "percentage": number}
    ],
    "benefits": ["好处1（中文）", "好处2（中文）", "好处3（中文）", "好处4（中文）"],
    "usages": ["使用方式1（中文）", "使用方式2（中文）", "使用方式3（中文）", "使用方式4（中文）"]
  }
}`;

      const mimeMatch = compressedBase64.match(/data:(.*?);base64/) || [];
      const mimeType = (mimeMatch as string[])[1] ?? 'image/jpeg';
      const base64Data = compressedBase64.split(',')[1] ?? '';

      const response = await model.generateContent({
        contents: [
          { role: 'system', parts: [{ text: 'Return only valid JSON for the requested schema in Thai, English, and Chinese.' }] },
          { role: 'user', parts: [ { text: prompt }, { inlineData: { mimeType, data: base64Data } } ] }
        ],
        generationConfig: { responseMimeType: 'application/json' }
      });

      const text = response?.response?.text?.() || '';
      if (!text) {
        throw new Error('No data returned');
      }

      const cleanText = text.replace(/```json/g, '').replace(/```/g, '').trim();
      const parsedData = JSON.parse(cleanText);

      const getLocalized = (langKey: 'th' | 'en' | 'zh') => {
        const raw = parsedData[langKey] || {};
        return {
          type: String(raw.type || '-'),
          reason: String(raw.reason || '-'),
          color: String(raw.color || '-'),
          clarity: String(raw.clarity || '-'),
          viscosity: String(raw.viscosity || '-'),
          predictions: Array.isArray(raw.predictions)
            ? raw.predictions.map((item: any) => ({ type: String(item.type || '-'), percentage: Number(item.percentage || 0) }))
            : [{ type: '-', percentage: 0 }],
          benefits: Array.isArray(raw.benefits) && raw.benefits.length > 0 ? raw.benefits.map(String) : t.benefits,
          usages: Array.isArray(raw.usages) && raw.usages.length > 0 ? raw.usages.map(String) : t.usages
        };
      };

      const safeData: AnalysisResult = {
        naturalnessScore: Number(parsedData.naturalnessScore ?? 0),
        resultsByLanguage: {
          th: getLocalized('th'),
          en: getLocalized('en'),
          zh: getLocalized('zh')
        }
      };

      setAnalysisResult(safeData);
      setIsLoading(false);
      setScreen('result');
    } catch (err) {
      console.error('Image upload or AI analysis failed:', err);
      const errorMessage = (err as Error)?.message || '';
      if (errorMessage.includes('limit: 0') || errorMessage.includes('Quota exceeded')) {
        setErrorType('daily');
      } else if (errorMessage.includes('Please retry in') || errorMessage.includes('429')) {
        setErrorType('rate');
      } else {
        setErrorType('general');
      }
      setError(t.errReadFile);
      setScreen('home');
      setIsErrorModalOpen(true);
      setIsLoading(false);
      isAnalyzing.current = false;
    } finally {
      isAnalyzing.current = false;
    }
  };

  const downloadPNG = async () => {
    const reportNode = document.querySelector<HTMLDivElement>('#honey-report-card');
    if (!reportNode) return;
    try {
      const canvas = await html2canvas(reportNode, { useCORS: true, scale: 2, backgroundColor: '#ffffff' });
      const dataUrl = canvas.toDataURL('image/png');
      const link = document.createElement('a');
      link.href = dataUrl;
      link.download = `${t.brandShort.replace(/\s+/g, '_')}_${lang}_report.png`;
      document.body.appendChild(link);
      link.click();
      link.remove();
      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error('PNG download failed', err);
      setError((err as Error)?.message || 'Download failed');
    }
  };

  const downloadPDF = async () => {
    const reportNode = document.querySelector<HTMLDivElement>('#honey-report-card');
    if (!reportNode) return;
    try {
      const canvas = await html2canvas(reportNode, { useCORS: true, scale: 2, backgroundColor: '#ffffff' });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({ unit: 'pt', format: 'a4' });
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const img = new Image();
      img.src = imgData;
      await new Promise((res) => (img.onload = res));
      const imgW = img.width;
      const imgH = img.height;
      const ratio = Math.min(pageWidth / imgW, pageHeight / imgH);
      const width = imgW * ratio;
      const height = imgH * ratio;
      const x = (pageWidth - width) / 2;
      const y = (pageHeight - height) / 2;
      pdf.addImage(imgData, 'PNG', x, y, width, height);
      pdf.save(`${t.brandShort.replace(/\s+/g, '_')}_${lang}_report.pdf`);
      setIsDownloadModalOpen(false);
    } catch (err) {
      console.error('PDF download failed', err);
      setError((err as Error)?.message || 'Download failed');
    }
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
                     onError={(e) => { (e.currentTarget as HTMLImageElement).style.display = 'none'; }}
            />
            <div className="hidden bg-gradient-to-br from-amber-400 to-amber-600 p-2 rounded-xl shadow-sm items-center justify-center">
              <Droplet className="text-white w-5 h-5 sm:w-7 sm:h-7 fill-white" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-base sm:text-2xl font-bold text-slate-900 leading-tight whitespace-nowrap">{t.appTitle}</h1>
              <p className="text-[9px] sm:text-xs font-bold text-amber-600 uppercase tracking-widest leading-tight mt-0.5 whitespace-nowrap">
                {t.brandShort}
              </p>
            </div>
          </div>
          
          <div className="shrink-0 ml-2">
            <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 hover:border-amber-400 px-2 sm:px-3 py-1.5 rounded-full shadow-sm transition-colors cursor-pointer">
              <Globe className="w-4 h-4 text-amber-600 hidden sm:block" />
              <select 
                value={lang} 
                onChange={(e: ChangeEvent<HTMLSelectElement>) => setLang(e.target.value as 'th' | 'en' | 'zh')}
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
                  className="bg-white border-2 border-dashed border-amber-300 hover:border-amber-500 hover:bg-amber-50/80 transition-all rounded-3xl p-8 sm:p-14 flex flex-col items-center justify-center cursor-pointer min-h-[250px] shadow-sm group"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="flex items-center gap-3 p-4 sm:p-5 rounded-full mb-4 sm:mb-6 group-hover:scale-110 transition-transform duration-300" style={{ backgroundColor: '#fff7ed' }}>
                    <Camera className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#f59e0b' }} />
                    <Upload className="w-6 h-6 sm:w-8 sm:h-8" style={{ color: '#f59e0b' }} />
                  </div>
                  <h3 className="text-lg sm:text-xl font-bold text-slate-900 mb-2 text-center">{t.uploadAction}</h3>
                  <p className="text-slate-400 text-xs sm:text-sm text-center">{t.uploadDesc}</p>
                  
                  <button
                    className="mt-6 sm:mt-8 bg-amber-500 hover:bg-amber-600 text-white px-8 py-3 rounded-full font-medium shadow-md shadow-amber-500/20 transition-all text-sm sm:text-base w-full sm:w-auto disabled:cursor-not-allowed disabled:bg-amber-300"
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isLoading}
                  >
                    {t.uploadBtn}
                  </button>
                </div>
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={(event) => {
                    handleImageUpload(event);
                    event.target.value = '';
                  }}
                />
                {imageSrc && (
                  <div className="mt-6 rounded-3xl overflow-hidden border border-slate-200 bg-slate-50">
                    <img src={imageSrc} alt="Selected honey" className="w-full h-auto object-cover" />
                    {errorType && (
                      <div className="p-4 bg-gradient-to-r from-red-50 to-orange-50 border-t border-red-200">
                        <div className="flex items-start gap-3 px-2 py-3 bg-white rounded-2xl border border-red-100 shadow-sm">
                          <span className="text-lg leading-none mt-0.5">
                            {errorType === 'daily' ? '⚠️' : errorType === 'rate' ? '⏳' : '❌'}
                          </span>
                          <div className="text-sm text-red-700 font-medium leading-relaxed">
                            {errorType === 'daily' && `⚠️ ${t.errorDailyDesc.split('\n')[0]}`}
                            {errorType === 'rate' && `⏳ ${t.errorRateDesc.split('\n')[0]}`}
                            {errorType === 'general' && `❌ ${t.errorGeneralDesc.split('\n')[0]}`}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}
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

        {/* Download selection modal */}
        {isDownloadModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-2xl p-6 w-11/12 max-w-md shadow-xl">
              <h3 className="text-lg font-bold mb-4">{t.downloadModalTitle}</h3>
              <div className="flex gap-3">
                <button onClick={() => downloadPNG()} className="flex-1 bg-amber-600 hover:bg-amber-700 text-white px-4 py-3 rounded-lg">{t.downloadPNG}</button>
                <button onClick={() => downloadPDF()} className="flex-1 bg-slate-900 hover:bg-slate-800 text-white px-4 py-3 rounded-lg">{t.downloadPDF}</button>
              </div>
              <div className="mt-4 text-right">
                <button onClick={() => setIsDownloadModalOpen(false)} className="text-sm text-slate-600">Cancel</button>
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
        {screen === 'result' && analysisResult && activeAnalysis && (
          <div className="animate-in fade-in max-w-3xl mx-auto bg-white rounded-[2rem] shadow-xl overflow-hidden border border-slate-200 print:shadow-none print:border-none print:w-full print:rounded-none">
            
            <div id="honey-report-card" ref={reportRef} style={{ backgroundColor: '#ffffff', padding:'24px', display:'flex', flexDirection:'column', gap:'30px' }}>
              <div style={{ display:'flex', flexDirection:'column', gap:'20px' }}>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'20px', alignItems:'center' }}>
                  <div style={{ width:'120px', height:'120px', borderRadius:'24px', overflow:'hidden', boxShadow:'0 18px 30px rgba(0,0,0,0.08)', border:'4px solid #ffffff' }}>
                    <img src={imageSrc} alt="Honey" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  </div>
                  <div style={{ minWidth:'220px', flex:'1' }}>
                    <h2 style={{ margin:'0 0 10px 0', fontSize:'28px', lineHeight:1.1, fontWeight:800, color:'#0f172a' }}>{t.reportTitle}</h2>
                    <p style={{ margin:0, color:'#475569', fontSize:'15px', lineHeight:1.7 }}>{t.reportBy} • {t.brandShort}</p>
                  </div>
                </div>

                <section style={{ display:'flex', flexDirection:'column', gap:'18px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'12px' }}>
                    <FileText style={{ width:20, height:20, color:'#334155' }} />
                    <h3 style={{ margin:0, fontSize:'20px', fontWeight:700, color:'#0f172a' }}>{t.predTitle}</h3>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                    {activeAnalysis.predictions.map((item, idx) => (
                      <div key={idx} style={{ display:'flex', flexWrap:'wrap', gap:'12px', alignItems:'center' }}>
                        <div style={{ flex:'1 1 220px', display:'flex', justifyContent:'space-between', gap:'10px', minWidth:'180px' }}>
                          <span style={{ fontSize:'14px', fontWeight:600, color:'#334155' }}>{item.type}</span>
                          <span style={{ fontSize:'14px', fontWeight:700, color:'#0f172a' }}>{item.percentage}%</span>
                        </div>
                        <div style={{ flex:'1 1 160px', minWidth:'160px', height:'12px', backgroundColor:'#e2e8f0', borderRadius:'9999px', overflow:'hidden' }}>
                          <div style={{ width:`${item.percentage}%`, height:'100%', backgroundColor: idx === 0 ? '#f59e0b' : idx === 1 ? '#fbbf24' : '#cbd5e1', borderRadius:'9999px' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

                <section style={{ position:'relative', background:'linear-gradient(135deg,#fffbeb 0%,#fff7ed 100%)', border:'1px solid #f1f5f9', borderRadius:'24px', padding:'24px', overflow:'hidden' }}>
                  <div style={{ position:'absolute', right:'-24px', top:'-24px', opacity:0.05, pointerEvents:'none' }}>
                    <BadgeCheck style={{ width:'160px', height:'160px', color:'#92400e' }} />
                  </div>
                  <div style={{ position:'relative', zIndex:1 }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'16px' }}>
                      <Sparkles style={{ width:20, height:20, color:'#f59e0b' }} />
                      <h3 style={{ margin:0, fontSize:'18px', fontWeight:700, color:'#92400e' }}>{t.concTitle}</h3>
                    </div>
                    <p style={{ margin:0, fontSize:'15px', lineHeight:1.75, color:'#92400e' }}>
                      {t.concFrom} <b style={{ backgroundColor:'rgba(254,243,199,0.6)', padding:'0 8px', borderRadius:'6px', color:'#78350f' }}>{activeAnalysis.predictions[0]?.type}</b> {t.concProb} <b style={{ color:'#b45309', fontSize:'18px' }}>{activeAnalysis.predictions[0]?.percentage}%</b>
                    </p>
                    <p style={{ margin:'16px 0 0 0', color:'#92400e', fontSize:'14px', lineHeight:1.8, borderTop:'1px solid rgba(226,232,240,0.6)', paddingTop:'16px' }}>
                      <b>{t.concReason}</b> {activeAnalysis.reason}
                    </p>
                  </div>
                </section>

                <section style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                  <div style={{ backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'24px', padding:'24px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'20px' }}>
                      <Activity style={{ width:20, height:20, color:'#2563eb' }} />
                      <h4 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#0f172a' }}>{t.physTitle}</h4>
                    </div>
                    <div style={{ display:'grid', gap:'14px' }}>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:'10px', borderBottom:'1px solid #e2e8f0', paddingBottom:'12px' }}>
                        <span style={{ color:'#64748b', fontSize:'14px' }}>{t.physColor}</span>
                        <span style={{ color:'#0f172a', fontWeight:600, fontSize:'14px', textAlign:'right' }}>{activeAnalysis.color}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:'10px', borderBottom:'1px solid #e2e8f0', paddingBottom:'12px' }}>
                        <span style={{ color:'#64748b', fontSize:'14px' }}>{t.physClarity}</span>
                        <span style={{ color:'#0f172a', fontWeight:600, fontSize:'14px', textAlign:'right' }}>{activeAnalysis.clarity}</span>
                      </div>
                      <div style={{ display:'flex', justifyContent:'space-between', gap:'10px' }}>
                        <span style={{ color:'#64748b', fontSize:'14px' }}>{t.physVisc}</span>
                        <span style={{ color:'#0f172a', fontWeight:600, fontSize:'14px', textAlign:'right' }}>{activeAnalysis.viscosity}</span>
                      </div>
                    </div>
                  </div>
                  <div style={{ borderRadius:'24px', padding:'24px', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', background:'linear-gradient(135deg,#fb923c 0%,#f59e0b 100%)', color:'#fff' }}>
                    <h4 style={{ margin:0, fontSize:'14px', fontWeight:600, color:'rgba(255,247,237,0.95)' }}>{t.natTitle}</h4>
                    <div style={{ display:'flex', alignItems:'baseline', gap:'8px', margin:'18px 0' }}>
                      <span style={{ fontSize:'56px', lineHeight:1, fontWeight:900 }}>{analysisResult.naturalnessScore}</span>
                      <span style={{ fontSize:'24px', fontWeight:700, opacity:0.9 }}>%</span>
                    </div>
                    <p style={{ margin:0, textAlign:'center', fontSize:'13px', lineHeight:1.6, color:'rgba(255,255,255,0.92)', backgroundColor:'rgba(0,0,0,0.08)', padding:'8px 14px', borderRadius:'999px' }}>{t.natDesc}</p>
                  </div>
                </section>

                <section style={{ borderTop:'1px solid #e2e8f0', paddingTop:'28px' }}>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'20px' }}>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                        <Heart style={{ width:20, height:20, color:'#f43f5e' }} />
                        <h4 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#0f172a' }}>{t.benTitle}</h4>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                        {activeAnalysis.benefits.map((item:string, idx:number) => (
                          <div key={idx} style={{ display:'flex', gap:'12px', alignItems:'flex-start', backgroundColor:'#ecfdf5', border:'1px solid #d1fae5', borderRadius:'18px', padding:'14px' }}>
                            <Check style={{ width:20, height:20, color:'#16a34a', flexShrink:0, marginTop:'2px' }} />
                            <span style={{ margin:0, color:'#0f172a', fontSize:'14px', lineHeight:1.7 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'18px' }}>
                        <Utensils style={{ width:20, height:20, color:'#f97316' }} />
                        <h4 style={{ margin:0, fontSize:'16px', fontWeight:700, color:'#0f172a' }}>{t.useTitle}</h4>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:'14px' }}>
                        {activeAnalysis.usages.map((item:string, idx:number) => (
                          <div key={idx} style={{ display:'flex', gap:'12px', alignItems:'flex-start', backgroundColor:'#ffedd5', border:'1px solid #fed7aa', borderRadius:'18px', padding:'14px' }}>
                            <Coffee style={{ width:20, height:20, color:'#d97706', flexShrink:0, marginTop:'2px' }} />
                            <span style={{ margin:0, color:'#0f172a', fontSize:'14px', lineHeight:1.7 }}>{item}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </section>

                <section style={{ display:'flex', gap:'12px', alignItems:'flex-start', backgroundColor:'#f8fafc', border:'1px solid #e2e8f0', borderRadius:'20px', padding:'18px' }}>
                  <ShieldCheck style={{ width:22, height:22, color:'#64748b', flexShrink:0, marginTop:'2px' }} />
                  <p style={{ margin:0, fontSize:'13px', lineHeight:1.8, color:'#475569' }}><b style={{ color:'#0f172a' }}>{t.disclaimerLabel}</b> {t.disclaimerText}</p>
                </section>
              </div>
            </div>

            <div className="p-6 md:p-8 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row justify-center gap-4 print:hidden">
               <div className="flex gap-3 w-full sm:w-auto">
                 <button
                   onClick={() => { setScreen('home'); setAnalysisResult(null); setImageSrc(''); }}
                   className="w-full sm:w-auto flex items-center justify-center gap-2 bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 px-8 py-3.5 rounded-full font-medium transition-colors shadow-sm text-sm sm:text-base"
                 >
                   <RotateCcw className="w-5 h-5" /> {t.newBtn}
                 </button>
               </div>
               <div className="flex gap-3 w-full sm:w-auto">
                 <button
                   onClick={() => setIsDownloadModalOpen(true)}
                   className="w-full sm:w-auto flex items-center justify-center gap-2 bg-amber-600 hover:bg-amber-700 text-white px-8 py-3.5 rounded-full font-medium transition-colors shadow-lg shadow-amber-600/20 text-sm sm:text-base"
                 >
                   {t.downloadReport}
                 </button>
               </div>
            </div>

          </div>
        )}

      </main>

      {/* CUSTOM ERROR MODAL */}
      {isErrorModalOpen && errorType && (
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          {/* Backdrop with blur */}
          <div 
            className="absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity duration-300"
            onClick={handleCloseErrorModal}
          />
          
          {/* Modal content */}
          <div className="relative bg-white rounded-3xl shadow-2xl max-w-sm w-full overflow-hidden animate-in zoom-in-95 fade-in duration-300">
            {/* Header background */}
            <div className={`
              h-2 w-full
              ${errorType === 'daily' ? 'bg-gradient-to-r from-yellow-400 to-orange-400' : 
                errorType === 'rate' ? 'bg-gradient-to-r from-blue-400 to-cyan-400' : 
                'bg-gradient-to-r from-red-400 to-rose-400'}
            `} />
            
            {/* Content */}
            <div className="p-8 text-center">
              <div className={`
                w-16 h-16 mx-auto mb-6 rounded-full flex items-center justify-center text-3xl
                ${errorType === 'daily' ? 'bg-yellow-100' : 
                  errorType === 'rate' ? 'bg-blue-100' : 
                  'bg-red-100'}
              `}>
                {errorType === 'daily' ? '⚠️' : errorType === 'rate' ? '⏳' : '❌'}
              </div>

              <h2 className="text-2xl font-bold text-slate-900 mb-3">
                {errorType === 'daily' && t.errorDailyTitle}
                {errorType === 'rate' && t.errorRateTitle}
                {errorType === 'general' && t.errorGeneralTitle}
              </h2>

              <p className="text-slate-600 leading-relaxed text-base mb-8 whitespace-pre-line">
                {errorType === 'daily' && t.errorDailyDesc}
                {errorType === 'rate' && t.errorRateDesc}
                {errorType === 'general' && t.errorGeneralDesc}
              </p>

              {/* Button */}
              <button
                onClick={handleCloseErrorModal}
                className={`
                  w-full py-3.5 px-6 rounded-full font-semibold text-white transition-all
                  ${errorType === 'daily' ? 'bg-amber-500 hover:bg-amber-600 shadow-lg shadow-amber-500/30' : 
                    errorType === 'rate' ? 'bg-blue-500 hover:bg-blue-600 shadow-lg shadow-blue-500/30' : 
                    'bg-red-500 hover:bg-red-600 shadow-lg shadow-red-500/30'}
                `}
              >
                {t.modalAcknowledge}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}