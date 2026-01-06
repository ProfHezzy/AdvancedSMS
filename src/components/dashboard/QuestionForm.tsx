'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { Plus, Trash2, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { createQuestion, updateQuestion } from '@/actions/managed-questions';

interface QuestionFormProps {
    assessmentId: string;
    existingQuestion?: any;
    onSuccess: () => void;
    onCancel: () => void;
}

export default function QuestionForm({ assessmentId, existingQuestion, onSuccess, onCancel }: QuestionFormProps) {
    const [isLoading, setIsLoading] = useState(false);
    const [formData, setFormData] = useState({
        text: existingQuestion?.text || '',
        type: existingQuestion?.type || 'MULTIPLE_CHOICE',
        points: existingQuestion?.points?.toString() || '1.0',
        correctAnswer: existingQuestion?.correctAnswer || '',
        options: existingQuestion?.options || ['', '', '', ''],
    });

    const handleOptionChange = (index: number, value: string) => {
        const newOptions = [...formData.options];
        newOptions[index] = value;
        setFormData({ ...formData, options: newOptions });
    };

    const addOption = () => {
        setFormData({ ...formData, options: [...formData.options, ''] });
    };

    const removeOption = (index: number) => {
        const newOptions = formData.options.filter((_: any, i: number) => i !== index);
        setFormData({ ...formData, options: newOptions });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        const data = {
            ...formData,
            assessmentId,
            points: parseFloat(formData.points),
        };

        console.log('[QuestionForm] Submitting:', data);

        const res = existingQuestion
            ? await updateQuestion(existingQuestion.id, data)
            : await createQuestion(data);

        if (res.success) {
            toast.success(existingQuestion ? 'Question updated' : 'Question added! You can add another below.');

            if (!existingQuestion) {
                // If adding new, reset but KEEP open for next question
                setFormData({
                    text: '',
                    type: formData.type, // Keep same type for convenience
                    points: formData.points, // Keep same points
                    correctAnswer: '',
                    options: ['', '', '', ''],
                });
            }
            onSuccess(); // This will refresh the list in parent
        } else {
            toast.error(res.error || 'Operation failed');
        }
        setIsLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <Card className="border-brand-100 shadow-sm overflow-hidden">
                <CardContent className="p-6 space-y-4">
                    <div className="space-y-2">
                        <label className="text-xs font-black uppercase tracking-widest text-gray-500">Question Text</label>
                        <Textarea
                            value={formData.text}
                            onChange={e => setFormData({ ...formData, text: e.target.value })}
                            placeholder="Enter the question here..."
                            className="min-h-[100px] font-medium"
                            required
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Type</label>
                            <select
                                className="w-full h-10 px-3 rounded-lg border border-brand-100 bg-white font-medium outline-none focus:ring-2 focus:ring-brand-500/20"
                                value={formData.type}
                                onChange={e => setFormData({ ...formData, type: e.target.value })}
                            >
                                <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                                <option value="THEORY">Theory / Essay</option>
                            </select>
                        </div>
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Points</label>
                            <Input
                                type="number"
                                step="0.5"
                                value={formData.points}
                                onChange={e => setFormData({ ...formData, points: e.target.value })}
                                className="h-10"
                            />
                        </div>
                    </div>

                    {formData.type === 'MULTIPLE_CHOICE' && (
                        <div className="space-y-4 pt-4 border-t border-brand-50">
                            <div className="flex items-center justify-between">
                                <label className="text-xs font-black uppercase tracking-widest text-gray-500">Options & Correct Answer</label>
                                <Button type="button" variant="ghost" size="sm" onClick={addOption} className="h-8 text-brand-600 font-bold">
                                    <Plus className="w-3.5 h-3.5 mr-1" /> Add Option
                                </Button>
                            </div>
                            <div className="space-y-3">
                                {formData.options.map((opt: string, idx: number) => (
                                    <div key={idx} className="flex gap-3 items-center">
                                        <button
                                            type="button"
                                            onClick={() => setFormData({ ...formData, correctAnswer: idx.toString() })}
                                            className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 border-2 transition-all ${formData.correctAnswer === idx.toString()
                                                ? "bg-brand-600 border-brand-600 text-white"
                                                : "border-brand-200 text-transparent"
                                                }`}
                                        >
                                            <CheckCircle2 className="w-4 h-4" />
                                        </button>
                                        <Input
                                            value={opt}
                                            onChange={e => handleOptionChange(idx, e.target.value)}
                                            placeholder={`Option ${idx + 1}`}
                                            className="h-10 flex-1"
                                            required={formData.type === 'MULTIPLE_CHOICE'}
                                        />
                                        {formData.options.length > 2 && (
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => removeOption(idx)}
                                                className="h-10 w-10 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                            </Button>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {formData.type === 'THEORY' && (
                        <div className="space-y-2 pt-2">
                            <label className="text-xs font-black uppercase tracking-widest text-gray-500">Keywords / Ideal Answer (Optional)</label>
                            <Textarea
                                value={formData.correctAnswer}
                                onChange={e => setFormData({ ...formData, correctAnswer: e.target.value })}
                                placeholder="Enter key points or the ideal answer for easier grading..."
                                className="min-h-[80px]"
                            />
                        </div>
                    )}

                    <div className="pt-4 flex justify-end gap-3 border-t border-brand-50 mt-4">
                        <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading} className="font-black uppercase tracking-widest text-xs h-11">
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isLoading} className="bg-brand-600 hover:bg-brand-700 text-white font-black px-8 h-11 rounded-xl shadow-lg shadow-brand-600/20">
                            {isLoading ? 'Saving...' : existingQuestion ? 'Update Question' : 'Save Question'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </form>
    );
}
