// src/lib/types.ts
export interface Task {
  id: string;
  taskId: string;
  name: string;
  reason: string;
  description: string;
  deadline: string;
  status: 'pending' | 'acc' | 'decline'; // Sesuaikan dengan sistem kamu
  declineReason?: string;
  fileUrl?: string;
  fileName?: string;
  progressPercentage?: number;
}




export interface Service {
    id: string;
    serviceName: string;
    description: string;
  }
  
  export interface Message {
    text: string;
    sender: string;
    createdAt: Date;
    queueNumber: string;
  }
  
  export interface UserData {
    uid: string;
    name: string;
    email: string;
    // tambahkan field lain jika ada
  }
  
  export interface WorkerProfile {
    noRekening: string;
    role: string;
    specialRole: string;
    name: string;
    email: string;
    portofolioUrl: string;
    profilePictureUrl: string;
    tasks?: Task[];
    uid: string;
    id: string; // tambahkan ini jika belum
  }

  // export interface Profile {
  //   noRekening: string;
  //   role: string;
  //   specialRole: string;
  //   portofolioFile?: File;
  //   profilePicture?: File;
  // }

  export interface Profile {
    noRekening: string;
    role: string;
    specialRole: string;
    name: string;
    email: string;
    portofolioUrl: string;
    profilePictureUrl: string;
    portofolioFile?: File;
    profilePicture?: File;
    tasks?: Task[];
    uid: string;
    id: string;
  }
  
  