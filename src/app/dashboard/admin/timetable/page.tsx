'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Calendar, Trash2, Plus, Clock, Save, Info } from 'lucide-react';
import { getAllClasses, getAllSubjects, createTimetableEntry, deleteTimetableEntry } from '@/actions/timetable';
import { getTimetable } from '@/actions/academic';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const DAYS = ['MONDAY', 'TUESDAY', 'WEDNESDAY', 'THURSDAY', 'FRIDAY'];

export default function AdminTimetablePage() {
    const [selectedClassId, setSelectedClassId] = useState<string>('');
    const [classes, setClasses] = useState<any[]>([]);
    const [subjects, setSubjects] = useState<any[]>([]);
    const [timetable, setTimetable] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isSaving, setIsSaving] = useState(false);

    // Form State
    const [formDay, setFormDay] = useState('MONDAY');
    const [formSubject, setFormSubject] = useState('');
    const [formStart, setFormStart] = useState('08:00');
    const [formEnd, setFormEnd] = useState('09:00');
    const [formRoom, setFormRoom] = useState('');
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    // Filtered subjects for the selected class
    const [filteredSubjects, setFilteredSubjects] = useState<any[]>([]);

    useEffect(() => {
        if (selectedClassId && classes.length > 0) {
            const currentClass = classes.find(c => c.id === selectedClassId);
            if (currentClass?.subjects) {
                setFilteredSubjects(currentClass.subjects);
            } else {
                setFilteredSubjects(subjects); // Fallback to all if none mapped
            }
        }
    }, [selectedClassId, classes, subjects]);

    useEffect(() => {
        loadMetadata();
    }, []);

    useEffect(() => {
        if (selectedClassId) {
            loadTimetable(selectedClassId);
        } else {
            setTimetable([]);
        }
    }, [selectedClassId]);

    async function loadMetadata() {
        console.log("Loading metadata...");
        try {
            const [c, s] = await Promise.all([getAllClasses(), getAllSubjects()]);
            console.log("Classes fetched:", c);
            console.log("Subjects fetched:", s);

            if (c.success) {
                setClasses(c.data || []);
            } else {
                console.error("Failed to fetch classes:", c.error);
                toast.error("Failed to load classes");
            }

            if (s.success) {
                setSubjects(s.data || []);
            }
        } catch (err) {
            console.error("Error loading metadata:", err);
            toast.error("Unexpected error loading data");
        }
    }

    async function loadTimetable(classId: string) {
        setIsLoading(true);
        const res = await getTimetable(classId);
        if (res.success && res.data) {
            setTimetable(res.data);
        }
        setIsLoading(false);
    }

    async function handleAddEntry() {
        if (!selectedClassId || !formSubject || !formStart || !formEnd) {
            toast.error("Please fill all required fields");
            return;
        }

        setIsSaving(true);
        const res = await createTimetableEntry({
            classId: selectedClassId,
            subjectId: formSubject,
            dayOfWeek: formDay as any,
            startTime: formStart,
            endTime: formEnd,
            room: formRoom || 'Classroom'
        });

        if (res.success) {
            toast.success("Entry added successfully");
            loadTimetable(selectedClassId);
            setIsDialogOpen(false);
            setFormSubject('');
        } else {
            toast.error(res.error || "Failed to add entry");
        }
        setIsSaving(false);
    }

    async function handleDelete(id: string) {
        if (confirm("Are you sure you want to delete this slot?")) {
            const res = await deleteTimetableEntry(id);
            if (res.success) {
                toast.success("Deleted successfully");
                loadTimetable(selectedClassId);
            } else {
                toast.error("Failed to delete");
            }
        }
    }

    const dayMapInverse: { [key: number]: string } = {
        1: 'MONDAY', 2: 'TUESDAY', 3: 'WEDNESDAY', 4: 'THURSDAY', 5: 'FRIDAY', 6: 'SATURDAY', 7: 'SUNDAY'
    };

    const getEntriesForDay = (dayStr: string) => {
        return timetable.filter(t => dayMapInverse[t.dayOfWeek] === dayStr);
    };

    return (
        <div className="p-8 space-y-8 animate-fade-in text-gray-900 max-w-[1600px] mx-auto">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-4xl font-black bg-gradient-to-r from-brand-600 to-brand-800 bg-clip-text text-transparent uppercase tracking-tight">
                        Timetable Management
                    </h1>
                    <p className="text-muted-foreground mt-2 font-medium">
                        Configure weekly schedules for all classes.
                    </p>
                </div>

                <div className="w-full md:w-72">
                    <Select
                        value={selectedClassId}
                        onChange={(e) => setSelectedClassId(e.target.value)}
                    >
                        <option value="" disabled>Select a Class</option>
                        {classes.map(c => (
                            <option key={c.id} value={c.id}>
                                {c.name}
                            </option>
                        ))}
                    </Select>
                </div>
            </div>

            {!selectedClassId ? (
                <div className="h-[60vh] flex flex-col items-center justify-center p-10 bg-white/50 backdrop-blur rounded-3xl border-2 border-dashed border-brand-100/50">
                    <div className="w-20 h-20 rounded-full bg-brand-50 flex items-center justify-center mb-6 animate-bounce-slow">
                        <Calendar className="w-10 h-10 text-brand-300" />
                    </div>
                    <h3 className="text-2xl font-black text-brand-800 uppercase tracking-widest text-center">Select a Class</h3>
                    <p className="text-muted-foreground font-medium mt-2 max-w-md text-center">
                        Choose a class from the dropdown above to view and edit their weekly schedule.
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
                    {DAYS.map(day => (
                        <Card key={day} className="border-none shadow-soft flex flex-col h-full bg-white/60 backdrop-blur-xl">
                            <CardHeader className="bg-brand-50/50 py-4 border-b border-brand-50 flex flex-row items-center justify-between sticky top-0 z-10">
                                <CardTitle className="text-sm font-black text-brand-700 uppercase tracking-widest">
                                    {day}
                                </CardTitle>
                                <Dialog open={isDialogOpen && formDay === day} onOpenChange={(open) => {
                                    setIsDialogOpen(open);
                                    if (open) setFormDay(day);
                                }}>
                                    <DialogTrigger asChild>
                                        <Button size="icon" variant="ghost" className="h-8 w-8 rounded-lg hover:bg-brand-100 text-brand-600">
                                            <Plus className="w-4 h-4" />
                                        </Button>
                                    </DialogTrigger>
                                    <DialogContent className="glass border-white/20 backdrop-blur-2xl">
                                        <DialogHeader>
                                            <DialogTitle className="text-2xl font-black text-brand-800">Add Slot ({day})</DialogTitle>
                                        </DialogHeader>
                                        <div className="space-y-4 py-4">
                                            <div className="space-y-2">
                                                <Label className="font-bold text-gray-700">Subject</Label>
                                                <Select value={formSubject} onChange={(e) => setFormSubject(e.target.value)}>
                                                    <option value="" disabled>Select Subject</option>
                                                    {filteredSubjects.map(s => (
                                                        <option key={s.id} value={s.id}>{s.name}</option>
                                                    ))}
                                                </Select>
                                            </div>
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-gray-700">Start Time</Label>
                                                    <Input type="time" value={formStart} onChange={e => setFormStart(e.target.value)} className="h-11 bg-white/80" />
                                                </div>
                                                <div className="space-y-2">
                                                    <Label className="font-bold text-gray-700">End Time</Label>
                                                    <Input type="time" value={formEnd} onChange={e => setFormEnd(e.target.value)} className="h-11 bg-white/80" />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label className="font-bold text-gray-700">Room (Optional)</Label>
                                                <Input value={formRoom} onChange={e => setFormRoom(e.target.value)} placeholder="e.g. Lab 1" className="h-11 bg-white/80" />
                                            </div>
                                            <Button onClick={handleAddEntry} disabled={isSaving} className="w-full h-12 bg-brand-600 hover:bg-brand-700 text-white font-bold text-lg shadow-lg">
                                                {isSaving ? 'Saving...' : 'Add to Timetable'}
                                            </Button>
                                        </div>
                                    </DialogContent>
                                </Dialog>
                            </CardHeader>
                            <CardContent className="p-4 space-y-3 flex-1 overflow-y-auto min-h-[500px]">
                                {getEntriesForDay(day).length === 0 ? (
                                    <div className="h-full flex flex-col items-center justify-center text-center opacity-40">
                                        <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-2">
                                            <Clock className="w-6 h-6 text-brand-300" />
                                        </div>
                                        <p className="text-xs font-bold text-gray-400 uppercase">No Classes</p>
                                    </div>
                                ) : (
                                    getEntriesForDay(day).map(entry => (
                                        <div key={entry.id} className="p-3 rounded-xl bg-white border border-brand-100 shadow-sm hover:shadow-md transition-all group relative">
                                            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                                <Button size="icon" variant="ghost" className="h-6 w-6 text-red-500 hover:bg-red-50 rounded-full" onClick={() => handleDelete(entry.id)}>
                                                    <Trash2 className="w-3.5 h-3.5" />
                                                </Button>
                                            </div>
                                            <div className="flex items-center gap-2 mb-2">
                                                <Badge variant="outline" className="bg-brand-50 text-brand-700 border-brand-100 font-bold px-2 py-0.5 text-[10px]">
                                                    {entry.startTime} - {entry.endTime}
                                                </Badge>
                                            </div>
                                            <h4 className="font-black text-gray-800 text-sm mb-1">{entry.subject.name}</h4>
                                            {entry.room && (
                                                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest flex items-center gap-1">
                                                    Slot: {entry.room}
                                                </p>
                                            )}
                                        </div>
                                    ))
                                )}
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
