'use client';

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Plus,
    Upload,
    Trash2,
    Edit2,
    FileText,
    HelpCircle,
    ChevronDown,
    ChevronUp
} from 'lucide-react';
import { toast } from 'sonner';
import { getAssessmentQuestions, deleteQuestion, importQuestions } from '@/actions/managed-questions';
import QuestionForm from './QuestionForm';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from '@/components/ui/textarea';

interface QuestionBankProps {
    assessmentId: string;
}

export default function QuestionBank({ assessmentId }: QuestionBankProps) {
    const [questions, setQuestions] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [showForm, setShowForm] = useState(false);
    const [editingQuestion, setEditingQuestion] = useState<any>(null);
    const [isImportOpen, setIsImportOpen] = useState(false);
    const [importData, setImportData] = useState('');
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        fetchQuestions();
    }, [assessmentId]);

    async function fetchQuestions() {
        setIsLoading(true);
        const res = await getAssessmentQuestions(assessmentId);
        if (res.success && res.data) {
            setQuestions(res.data);
        }
        setIsLoading(false);
    }

    const handleDelete = async (id: string) => {
        if (!confirm('Permanent delete?')) return;
        const res = await deleteQuestion(id);
        if (res.success) {
            toast.success('Deleted');
            fetchQuestions();
        } else {
            toast.error('Failed to delete');
        }
    };

    const handleImport = async () => {
        try {
            // Text Import Logic (already exists)
            let parsed = [];
            try {
                parsed = JSON.parse(importData);
            } catch (e) {
                const lines = importData.trim().split('\n');
                parsed = lines.map(line => {
                    const parts = line.split('|');
                    return {
                        text: parts[0]?.trim(),
                        options: parts[1]?.split(',').map(o => o.trim()) || [],
                        correctAnswer: parts[2]?.trim(),
                        points: parseFloat(parts[3]) || 1.0,
                        type: 'MULTIPLE_CHOICE'
                    };
                }).filter(q => q.text);
            }

            if (parsed.length === 0) throw new Error('No valid questions found');

            const res = await importQuestions(assessmentId, parsed);
            if (res.success) {
                toast.success(`Imported ${res.count} questions`);
                setIsImportOpen(false);
                setImportData('');
                fetchQuestions();
            } else {
                toast.error(res.error);
            }
        } catch (error: any) {
            toast.error('Format error: Please use valid JSON or the Pipe (|) format.');
        }
    };

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        const fileName = file.name.toLowerCase();

        toast.info(`Processing ${file.name}...`);

        reader.onload = async (event) => {
            try {
                const data = event.target?.result;
                let questionsToImport: any[] = [];

                if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls')) {
                    const XLSX = await import('xlsx');
                    const workbook = XLSX.read(data, { type: 'array' });
                    const sheetName = workbook.SheetNames[0];
                    const sheet = workbook.Sheets[sheetName];
                    const jsonData: any[] = XLSX.utils.sheet_to_json(sheet);

                    questionsToImport = jsonData.map(row => ({
                        text: row.Question || row.question || row.Text || row.text,
                        options: [row.Option1, row.Option2, row.Option3, row.Option4].filter(Boolean),
                        correctAnswer: (row.CorrectAnswer || row.Answer || row.correctIndex)?.toString(),
                        points: parseFloat(row.Points || row.points) || 1.0,
                        type: (row.Type || row.type)?.toUpperCase() === 'THEORY' ? 'THEORY' : 'MULTIPLE_CHOICE'
                    })).filter(q => q.text);

                } else if (fileName.endsWith('.docx')) {
                    const mammoth = await import('mammoth');
                    const result = await mammoth.extractRawText({ arrayBuffer: data as ArrayBuffer });
                    const text = result.value;

                    // Parse word text assuming the Pipe format: Question | Opt1, Opt2 | CorrectIdx | Points
                    const lines = text.split('\n').filter(l => l.trim().includes('|'));
                    questionsToImport = lines.map(line => {
                        const parts = line.split('|');
                        return {
                            text: parts[0]?.trim(),
                            options: parts[1]?.split(',').map(o => o.trim()) || [],
                            correctAnswer: parts[2]?.trim(),
                            points: parseFloat(parts[3]) || 1.0,
                            type: 'MULTIPLE_CHOICE'
                        };
                    });
                } else {
                    toast.error('Unsupported file format. Please use .xlsx, .xls, or .docx');
                    return;
                }

                if (questionsToImport.length > 0) {
                    const res = await importQuestions(assessmentId, questionsToImport);
                    if (res.success) {
                        toast.success(`Successfully imported ${res.count} questions from ${file.name}`);
                        fetchQuestions();
                        setIsImportOpen(false);
                    } else {
                        toast.error(res.error);
                    }
                } else {
                    toast.error('No questions found in file matching the required format.');
                }
            } catch (error) {
                console.error('File parsing error:', error);
                toast.error('Failed to parse file. Please ensure it follows the template.');
            }
        };

        if (fileName.endsWith('.xlsx') || fileName.endsWith('.xls') || fileName.endsWith('.docx')) {
            reader.readAsArrayBuffer(file);
        } else {
            toast.error('Please upload an Excel or Word file.');
        }

        // Reset input
        e.target.value = '';
    };

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center bg-white p-6 rounded-3xl border border-brand-100 shadow-sm">
                <div>
                    <h2 className="text-2xl font-black text-gray-900 uppercase tracking-tight">Question Bank</h2>
                    <p className="text-sm text-gray-500 font-medium">Currently {questions.length} questions in this assessment.</p>
                </div>
                <div className="flex gap-3">
                    <Dialog open={isImportOpen} onOpenChange={setIsImportOpen}>
                        <DialogTrigger asChild>
                            <Button variant="outline" className="h-11 px-6 rounded-xl border-brand-100 text-brand-600 font-bold gap-2 hover:bg-brand-50">
                                <Upload className="w-5 h-5" />
                                Bulk Import
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[600px]">
                            <DialogHeader>
                                <DialogTitle className="font-black uppercase tracking-tight">Bulk Question Import</DialogTitle>
                                <DialogDescription className="font-medium">
                                    Choose a file or paste raw content. Supports **Excel (.xlsx, .xls)** and **Word (.docx)**.
                                </DialogDescription>
                            </DialogHeader>

                            <div className="py-6 space-y-6">
                                <div className="p-6 rounded-2xl bg-brand-50 border border-brand-100 space-y-4">
                                    <div className="flex items-center justify-between">
                                        <h4 className="text-xs font-black uppercase tracking-widest text-brand-700">Option 1: Upload File</h4>
                                        <input
                                            type="file"
                                            ref={fileInputRef}
                                            onChange={handleFileUpload}
                                            className="hidden"
                                            accept=".xlsx,.xls,.docx"
                                        />
                                        <Button
                                            onClick={() => fileInputRef.current?.click()}
                                            className="bg-white border-2 border-brand-200 text-brand-700 hover:bg-brand-50 font-black h-10 px-6 rounded-xl"
                                        >
                                            Choose Excel/Word File
                                        </Button>
                                    </div>
                                    <div className="text-[10px] space-y-1 font-bold text-brand-600/60 leading-relaxed uppercase tracking-tight">
                                        <p>• Excel: Use columns "Question", "Option1", "Option2", "Option3", "Option4", "CorrectAnswer", "Points"</p>
                                        <p>• Word: One question per line using Pipe format: Question | Opt1, Opt2 | Answer | Pts</p>
                                    </div>
                                </div>

                                <div className="relative">
                                    <div className="absolute inset-0 flex items-center">
                                        <span className="w-full border-t border-brand-100" />
                                    </div>
                                    <div className="relative flex justify-center text-[10px] font-black uppercase">
                                        <span className="bg-white px-2 text-muted-foreground">Or Option 2: Paste Raw Text</span>
                                    </div>
                                </div>

                                <Textarea
                                    className="min-h-[150px] font-mono text-xs p-4 rounded-xl border-brand-100"
                                    placeholder='Example: 2+2=? | 2, 4, 6 | 1 | 2.0'
                                    value={importData}
                                    onChange={e => setImportData(e.target.value)}
                                />
                            </div>
                            <DialogFooter>
                                <Button onClick={handleImport} disabled={!importData.trim()} className="bg-brand-600 hover:bg-brand-700 text-white font-black w-full h-12 rounded-xl shadow-lg shadow-brand-600/20">
                                    Import Pasted Content
                                </Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>

                    <Button
                        onClick={() => { setShowForm(true); setEditingQuestion(null); }}
                        className="h-11 px-8 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-black shadow-lg shadow-brand-600/20 gap-2"
                        disabled={showForm}
                    >
                        <Plus className="w-5 h-5" />
                        Add Manually
                    </Button>
                </div>
            </div>

            {showForm && (
                <div className="animate-in slide-in-from-top duration-300">
                    <QuestionForm
                        assessmentId={assessmentId}
                        existingQuestion={editingQuestion}
                        onSuccess={() => { setShowForm(false); fetchQuestions(); }}
                        onCancel={() => setShowForm(false)}
                    />
                </div>
            )}

            <div className="space-y-4">
                {isLoading ? (
                    <div className="p-20 text-center animate-pulse text-brand-200 font-black uppercase tracking-widest">
                        Accessing Question Records...
                    </div>
                ) : questions.length > 0 ? (
                    questions.map((q, i) => (
                        <Card key={q.id} className="glass border-none shadow-soft group hover:shadow-medium transition-all">
                            <CardContent className="p-6">
                                <div className="flex justify-between gap-6">
                                    <div className="flex-1 space-y-4">
                                        <div className="flex items-center gap-3">
                                            <span className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center text-brand-700 font-black text-xs">
                                                {i + 1}
                                            </span>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase tracking-widest ${q.type === 'THEORY' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                                                }`}>
                                                {q.type}
                                            </span>
                                            <span className="text-xs font-bold text-gray-400">Points: {q.points}</span>
                                        </div>

                                        <h3 className="text-lg font-bold text-gray-900">{q.text}</h3>

                                        {q.type === 'MULTIPLE_CHOICE' && q.options && (
                                            <div className="grid grid-cols-2 gap-3 mt-4">
                                                {q.options.map((opt: string, idx: number) => (
                                                    <div key={idx} className={`p-3 rounded-xl border text-sm font-medium flex items-center gap-3 ${q.correctAnswer === idx.toString()
                                                        ? "bg-green-50 border-green-200 text-green-700"
                                                        : "bg-white/50 border-brand-50 text-gray-600"
                                                        }`}>
                                                        <div className={`w-2 h-2 rounded-full ${q.correctAnswer === idx.toString() ? "bg-green-500" : "bg-gray-200"}`} />
                                                        {opt}
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                        {q.type === 'THEORY' && q.correctAnswer && (
                                            <div className="p-4 rounded-xl bg-amber-50/50 border border-amber-100 text-sm italic text-amber-800">
                                                <span className="font-black uppercase text-[10px] block mb-1 not-italic opacity-50">Grading Key</span>
                                                {q.correctAnswer}
                                            </div>
                                        )}
                                    </div>

                                    <div className="flex flex-col gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => { setEditingQuestion(q); setShowForm(true); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
                                            className="h-10 w-10 text-brand-300 hover:text-brand-600 hover:bg-brand-50"
                                        >
                                            <Edit2 className="w-4 h-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            onClick={() => handleDelete(q.id)}
                                            className="h-10 w-10 text-rose-300 hover:text-rose-600 hover:bg-rose-50"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </Button>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))
                ) : (
                    <div className="p-20 text-center bg-white/50 backdrop-blur rounded-[32px] border-2 border-dashed border-brand-100 flex flex-col items-center gap-6">
                        <HelpCircle className="w-12 h-12 text-brand-100" />
                        <h3 className="text-xl font-black text-gray-800 uppercase tracking-widest">Empty Question Bank</h3>
                        <p className="text-muted-foreground font-medium max-w-xs mx-auto mt-2 italic">
                            No questions found for this assessment. Add them manually or import a batch.
                        </p>
                    </div>
                )}
            </div>
        </div>
    );
}
