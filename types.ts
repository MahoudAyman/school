
export type Department = 'ACCOUNTING' | 'BIS' | 'MANAGEMENT';

export interface Student {
  id: string;
  national_id: string;
  full_name: string;
  department: Department;
  level: number;
  gpa: number;
  attendance_rate: number;
  total_credits: number;
  email?: string;
}

export interface Grade {
  course_name: string;
  score: number;
  max_score: number;
  grade_letter: string;
}

export interface ScheduleItem {
  day: string;
  time: string;
  course: string;
  room: string;
}

export interface ExamItem {
  course_name: string;
  exam_date: string;
  exam_time: string;
  room: string;
}

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: 'news' | 'event' | 'deadline';
  created_at: string;
}

export interface FinanceRecord {
  total_fees: number;
  paid_amount: number;
  status: 'paid' | 'partial' | 'unpaid';
  due_date: string;
}

export interface Material {
  id: string;
  title: string;
  type: string;
  format: string;
  size: string;
  date: string;
  // Added optional url property to support material downloads/previews
  url?: string;
}

export interface Message {
  role: 'user' | 'model';
  text: string;
}