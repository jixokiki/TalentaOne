// // src/lib/types.ts
// export interface Task {
//   [x: string]: string | number | Date;
//   id: string;
//   taskId: string;
//   name: string;
//   reason: string;
//   description: string;
//   deadline: string;
//   status: 'pending' | 'acc' | 'decline'; // Sesuaikan dengan sistem kamu
//   declineReason?: string;
//   fileUrl?: string;
//   fileName?: string;
//   progressPercentage?: number;
//    fileTugasAkhir?: string; // ✅ optional
// }




// export interface Service {
//     id: string;
//     serviceName: string;
//     description: string;
//   }
  
//   export interface Message {
//     text: string;
//     sender: string;
//     createdAt: Date;
//     queueNumber: string;
//     senderName?: string;
//     // timestamp: any; // bisa gunakan Timestamp dari Firebase jika ingin lebih spesifik
//   }
// //   type Message = {
// //   text: string;
// //   sender: string;
// //   senderName?: string;
// //   timestamp: any; // bisa gunakan Timestamp dari Firebase jika ingin lebih spesifik
// // };

//   export interface UserData {
//     uid: string;
//     name: string;
//     email: string;
//     // tambahkan field lain jika ada
//   }
  
//   export interface WorkerProfile {
//     [x: string]: any;
//     noRekening: string;
//     role: string;
//     specialRole: string;
//     name: string;
//     email: string;
//     portofolioUrl: string;
//     profilePictureUrl: string;
//     tasks?: Task[];
//     uid: string;
//     id: string; // tambahkan ini jika belum
//   }

//   // export interface Profile {
//   //   noRekening: string;
//   //   role: string;
//   //   specialRole: string;
//   //   portofolioFile?: File;
//   //   profilePicture?: File;
//   // }

//   export interface Profile {
//     achievement: any;
//     noRekening: string;
//     role: string;
//     specialRole: string;
//     name: string;
//     email: string;
//     portofolioUrl: string;
//     profilePictureUrl: string;
//     portofolioFile?: File;
//     profilePicture?: File;
//     tasks?: Task[];
//     uid: string;
//     id: string;
//   }
  
  

// src/lib/types.ts

// src/lib/types.ts

// Tipe dasar yang bisa di-index dan aman untuk field optional
export type Indexable = string | number | Date | boolean | null | undefined;

// (Opsional) Bentuk timestamp mirip Firestore tanpa import library
export type FirestoreTimestampLike = {
  seconds: number;
  nanoseconds: number;
  toDate?: () => Date;
};

export interface Task {
  // Index signature diperluas agar field optional (yang bisa undefined) tidak error TS2411
  [x: string]: Indexable;

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
  fileTugasAkhir?: string; // ✅ optional
}

export interface Service {
  id: string;
  serviceName: string;
  description: string;
}

export interface Message {
  text: string;
  sender: string;
  createdAt: Date; // Jika perlu dukung Timestamp Firestore, bisa ubah ke: Date | FirestoreTimestampLike
  queueNumber: string;
  senderName?: string;
  // timestamp: any; // bisa gunakan Timestamp dari Firebase jika ingin lebih spesifik
}

export interface UserData {
  uid: string;
  name: string;
  email: string;
  // tambahkan field lain jika ada
}

export interface WorkerProfile {
  // Izinkan properti dinamis & array tasks tanpa kena TS2411
  [x: string]: Indexable | Task[];

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

export interface Profile {
  // ✅ Disederhanakan agar aman dirender di JSX:
  // sebelumnya 'Achievement' union terlalu lebar dan memicu TS2322 saat {profile.achievement}
  achievement?: string;

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
