/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { useEffect, useMemo, useState } from 'react';
import { db, auth } from '@/lib/firebaseConfig';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  DocumentData,
} from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import NavbarAdmin from '@/app/navbaradmin';

// ====== Types you’ll likely already have on user side; re-declared here for clarity ======
type QueueItem = {
  id: string;
  name: string;
  queueNumber: string | number;
  createdAt?: any; // Firestore Timestamp atau Date
};

type Tugas = {
  id: string;
  userId?: string;
  workerId?: string;
  workerName?: string;
  description?: string;
  fileName?: string;
  fileUrl?: string;
  deadline?: any;
  createdAt?: any;

  // Flow status
  status?: 'pending' | 'acc' | 'decline';
  declineReason?: string;

  // Progress + payment
  progress?: number; // 0..100
  statusProgress?: string; // e.g. "Task Completed"
  nominal?: number;
  statusPembayaran?: 'success' | 'pending' | 'failure' | string;
};

type Payment = {
  id: string;            // Firestore doc id = orderId atau random
  orderId: string;
  taskId: string;
  nominal: number;
  fee?: number;
  totalReceived?: number;
  status: string;        // "pending" | "success" | "settlement" | "capture" | "expire" | "deny" | "cancel" | ...
  createdAt?: any;
};

// ====== Helpers ======
const fmt = (d?: any) => {
  try {
    const date =
      d && typeof d.toDate === 'function' ? d.toDate() :
      d instanceof Date ? d :
      d?.seconds ? new Date(d.seconds * 1000) :
      d ? new Date(d) : null;
    return date ? date.toLocaleString() : '-';
  } catch {
    return '-';
  }
};

const money = (n?: number) =>
  typeof n === 'number' ? `Rp ${n.toLocaleString('id-ID')}` : '-';

const Badge = ({ children, tone = 'gray' }: { children: any; tone?: 'blue' | 'green' | 'red' | 'yellow' | 'gray' }) => {
  const map: Record<string, string> = {
    blue: 'bg-blue-100 text-blue-800 ring-blue-200',
    green: 'bg-emerald-100 text-emerald-800 ring-emerald-200',
    red: 'bg-rose-100 text-rose-800 ring-rose-200',
    yellow: 'bg-amber-100 text-amber-800 ring-amber-200',
    gray: 'bg-gray-100 text-gray-800 ring-gray-200',
  };
  return (
    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ring-1 ${map[tone]}`}>
      {children}
    </span>
  );
};

const Card = ({ title, subtitle, children }: { title: string; subtitle?: string; children: any }) => (
  <div className="group relative overflow-hidden rounded-2xl bg-white/70 backdrop-blur border border-gray-200 shadow-[0_10px_30px_-10px_rgba(0,0,0,0.15)] hover:shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)] transition-shadow">
    <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/0 to-white/10 pointer-events-none" />
    <div className="p-5">
      <div className="flex items-baseline justify-between gap-3">
        <h3 className="text-lg font-bold text-gray-900">{title}</h3>
        {subtitle ? <span className="text-xs text-gray-500">{subtitle}</span> : null}
      </div>
      <div className="mt-3">{children}</div>
    </div>
  </div>
);

const Section = ({ title, children, count }: { title: string; children: any; count?: number }) => (
  <section className="mt-10">
    <div className="mb-4 flex items-center gap-3">
      <h2 className="text-xl font-extrabold tracking-tight">{title}</h2>
      {typeof count === 'number' ? <Badge tone="blue">{count}</Badge> : null}
    </div>
    {children}
  </section>
);

export default function AdminInteractionMonitor() {
  const [ready, setReady] = useState(false);

  // Raw collections
  const [queues, setQueues] = useState<QueueItem[]>([]);
  const [tasks, setTasks] = useState<Tugas[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);

  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const unsubAuth = onAuthStateChanged(auth, (user) => {
      // kamu bisa tambahkan guard “role admin” di sini kalau perlu
      setReady(true);
    });

    // === Realtime: Queues ===
    const qQueues = query(collection(db, 'queues'), orderBy('createdAt', 'desc'));
    const unsubQueues = onSnapshot(qQueues, (snap) => {
      const list: QueueItem[] = snap.docs.map((d) => {
        const v = d.data() as DocumentData;
        return {
          id: d.id,
          name: v.name,
          queueNumber: v.queueNumber,
          createdAt: v.createdAt,
        };
      });
      setQueues(list);
    });

    // === Realtime: Tugas dari user ===
    const qTasks = query(collection(db, 'tugasdariuser'), orderBy('createdAt', 'desc'));
    const unsubTasks = onSnapshot(qTasks, (snap) => {
      const list: Tugas[] = snap.docs.map((d) => {
        const v = d.data() as DocumentData;
        return {
          id: d.id,
          userId: v.userId,
          workerId: v.workerId,
          workerName: v.workerName,
          description: v.description,
          fileName: v.fileName,
          fileUrl: v.fileUrl,
          deadline: v.deadline,
          createdAt: v.createdAt,
          status: v.status,                    // 'pending' | 'acc' | 'decline'
          declineReason: v.declineReason,
          progress: typeof v.progress === 'number' ? v.progress : undefined,
          statusProgress: v.statusProgress,
          nominal: typeof v.nominal === 'number' ? v.nominal : undefined,
          statusPembayaran: v.statusPembayaran,
        };
      });
      setTasks(list);
    });

    // === Realtime: Payments ===
    const qPay = query(collection(db, 'payments'), orderBy('createdAt', 'desc'));
    const unsubPay = onSnapshot(qPay, (snap) => {
      const list: Payment[] = snap.docs.map((d) => {
        const v = d.data() as DocumentData;
        return {
          id: d.id,
          orderId: v.orderId,
          taskId: v.taskId,
          nominal: v.nominal,
          fee: v.fee,
          totalReceived: v.totalReceived,
          status: v.status,
          createdAt: v.createdAt,
        };
      });
      setPayments(list);
    });

    return () => {
      unsubAuth();
      unsubQueues();
      unsubTasks();
      unsubPay();
    };
  }, []);

  // ====== Derived groupings ======
  // 1) Pendaftaran / nomor antrian baru
  const recentQueues = useMemo(() => queues.slice(0, 20), [queues]);

  // 2) Worker dipilih (tugas yang baru dibuat user & sudah punya workerId/workerName)
  const chosenWorker = useMemo(
    () => tasks.filter(t => t.workerId || t.workerName),
    [tasks]
  );

  // 3) Pembayaran
  const paymentsPending = useMemo(
    () => payments.filter(p => ['pending'].includes(p.status?.toLowerCase?.())),
    [payments]
  );
  const paymentsSuccess = useMemo(
    () => payments.filter(p => ['success', 'settlement', 'capture'].includes(p.status?.toLowerCase?.())),
    [payments]
  );
  const paymentsFailed = useMemo(
    () => payments.filter(p =>
      ['expire', 'deny', 'cancel', 'failure', 'failed'].includes(p.status?.toLowerCase?.())
    ),
    [payments]
  );

  // 4) Keputusan tugas
  const decisionsAcc = useMemo(
    () => tasks.filter(t => t.status === 'acc'),
    [tasks]
  );
  const decisionsDecline = useMemo(
    () => tasks.filter(t => t.status === 'decline'),
    [tasks]
  );

  // 5) Selesai tapi belum dibayar
  const completedUnpaid = useMemo(
    () => tasks.filter(t =>
      (t.progress ?? 0) >= 100 &&
      t.statusProgress === 'Task Completed' &&
      (t.statusPembayaran ?? '').toLowerCase() !== 'success'
    ),
    [tasks]
  );

  if (!ready) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
        <div className="mx-auto max-w-7xl p-6">
          <NavbarAdmin />
          <div className="mt-16 text-center text-gray-500">Memuat…</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="mx-auto max-w-7xl p-6">
        <NavbarAdmin />

        {/* Header */}
        <div className="mt-6 rounded-3xl bg-white/60 backdrop-blur border border-gray-200 p-6 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <h1 className="text-3xl font-black tracking-tight">Interaction Monitor</h1>
              <p className="text-sm text-gray-600">
                Semua interaksi user → worker → pembayaran → keputusan — tersaji real-time & terstruktur.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge tone="blue">Queues: {queues.length}</Badge>
              <Badge tone="yellow">Tasks: {tasks.length}</Badge>
              <Badge tone="green">Payments: {payments.length}</Badge>
            </div>
          </div>
        </div>

        {/* 1) Antrian baru */}
        <Section title="Pendaftaran & Nomor Antrian" count={recentQueues.length}>
          {recentQueues.length === 0 ? (
            <Card title="Belum ada data">
              <p className="text-sm text-gray-600">Belum ada pendaftar/nomor antrian terbaru.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {recentQueues.map((q) => (
                <Card key={q.id} title={`#${q.queueNumber}`} subtitle={fmt(q.createdAt)}>
                  <div className="text-sm">
                    <p className="font-medium text-gray-900">{q.name || '-'}</p>
                    <div className="mt-2">
                      <Badge>Queue</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        {/* 2) Worker dipilih */}
        <Section title="Worker Dipilih (Tugas Masuk)" count={chosenWorker.length}>
          {chosenWorker.length === 0 ? (
            <Card title="Belum ada tugas masuk">
              <p className="text-sm text-gray-600">User belum memilih worker atau membuat tugas baru.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {chosenWorker.map((t) => (
                <Card
                  key={t.id}
                  title={t.workerName || '—'}
                  subtitle={fmt(t.createdAt)}
                >
                  <div className="space-y-2 text-sm">
                    <p className="text-gray-800">
                      <span className="font-semibold">Deskripsi: </span>{t.description || '-'}
                    </p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Deadline: </span>{fmt(t.deadline)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge tone="yellow">{t.status ?? 'pending'}</Badge>
                      {typeof t.progress === 'number' && (
                        <span className="text-xs text-gray-500">Progress {t.progress.toFixed(0)}%</span>
                      )}
                    </div>

                    {typeof t.progress === 'number' && (
                      <div className="mt-1 h-2.5 w-full rounded-full bg-gray-200">
                        <div
                          className="h-2.5 rounded-full bg-blue-600 transition-all"
                          style={{ width: `${Math.max(0, Math.min(100, t.progress))}%` }}
                        />
                      </div>
                    )}
                    {t.fileUrl ? (
                      <a
                        href={t.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-2 text-blue-600 hover:underline"
                      >
                        📎 Download File
                      </a>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        {/* 3) Pembayaran */}
        <Section title="Pembayaran (Pending)" count={paymentsPending.length}>
          {paymentsPending.length === 0 ? (
            <Card title="Tidak ada pending">
              <p className="text-sm text-gray-600">Semua pembayaran sedang tidak menunggu.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paymentsPending.map((p) => (
                <Card key={p.id} title={p.orderId} subtitle={fmt(p.createdAt)}>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">TaskID:</span> {p.taskId}</p>
                    <p><span className="font-semibold">Nominal:</span> {money(p.nominal)}</p>
                    <div className="flex items-center gap-2">
                      <Badge tone="yellow">Pending</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        <Section title="Pembayaran (Sukses)" count={paymentsSuccess.length}>
          {paymentsSuccess.length === 0 ? (
            <Card title="Belum ada sukses">
              <p className="text-sm text-gray-600">Belum ada pembayaran sukses tercatat.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paymentsSuccess.map((p) => (
                <Card key={p.id} title={p.orderId} subtitle={fmt(p.createdAt)}>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">TaskID:</span> {p.taskId}</p>
                    <p><span className="font-semibold">Nominal:</span> {money(p.nominal)}</p>
                    <p className="text-gray-600">
                      <span className="font-semibold">Fee:</span> {money(p.fee)}
                      {' • '}
                      <span className="font-semibold">Worker:</span> {money(p.totalReceived)}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge tone="green">Success</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        <Section title="Pembayaran (Gagal / Expired / Ditolak)" count={paymentsFailed.length}>
          {paymentsFailed.length === 0 ? (
            <Card title="Tidak ada yang gagal">
              <p className="text-sm text-gray-600">Belum ada pembayaran gagal/expired/ditolak.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {paymentsFailed.map((p) => (
                <Card key={p.id} title={p.orderId} subtitle={fmt(p.createdAt)}>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">TaskID:</span> {p.taskId}</p>
                    <p><span className="font-semibold">Nominal:</span> {money(p.nominal)}</p>
                    <div className="flex items-center gap-2">
                      <Badge tone="red">{p.status?.toUpperCase?.() || 'FAILED'}</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        {/* 4) Keputusan Tugas */}
        <Section title="Keputusan Tugas – ACC" count={decisionsAcc.length}>
          {decisionsAcc.length === 0 ? (
            <Card title="Belum ada ACC">
              <p className="text-sm text-gray-600">Belum ada tugas yang di-ACC.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {decisionsAcc.map((t) => (
                <Card key={t.id} title={t.workerName || '—'} subtitle={fmt(t.createdAt)}>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Deskripsi:</span> {t.description || '-'}</p>
                    <p><span className="font-semibold">Nominal:</span> {money(t.nominal)}</p>
                    <div className="flex items-center gap-2">
                      <Badge tone="green">ACC</Badge>
                      {t.statusPembayaran ? <Badge tone="blue">Pay: {t.statusPembayaran}</Badge> : null}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        <Section title="Keputusan Tugas – Decline (Alasan)" count={decisionsDecline.length}>
          {decisionsDecline.length === 0 ? (
            <Card title="Tidak ada decline">
              <p className="text-sm text-gray-600">Belum ada penolakan tugas.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {decisionsDecline.map((t) => (
                <Card key={t.id} title={t.workerName || '—'} subtitle={fmt(t.createdAt)}>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Deskripsi:</span> {t.description || '-'}</p>
                    <p className="text-rose-700">
                      <span className="font-semibold">Alasan:</span> {t.declineReason || '-'}
                    </p>
                    <div className="flex items-center gap-2">
                      <Badge tone="red">Decline</Badge>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        {/* 5) Completed but Unpaid */}
        <Section title="Selesai 100% namun Belum Dibayar" count={completedUnpaid.length}>
          {completedUnpaid.length === 0 ? (
            <Card title="Bersih 🙌">
              <p className="text-sm text-gray-600">Tidak ada tugas selesai yang menunggu pembayaran.</p>
            </Card>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {completedUnpaid.map((t) => (
                <Card key={t.id} title={t.workerName || '—'} subtitle={fmt(t.createdAt)}>
                  <div className="space-y-2 text-sm">
                    <p><span className="font-semibold">Deskripsi:</span> {t.description || '-'}</p>
                    <p><span className="font-semibold">Progress:</span> {t.progress?.toFixed(0)}% ({t.statusProgress})</p>
                    <p><span className="font-semibold">Nominal:</span> {money(t.nominal)}</p>
                    <div className="flex items-center gap-2">
                      <Badge tone="yellow">Menunggu User Bayar</Badge>
                      {t.statusPembayaran ? <Badge>Pay: {t.statusPembayaran}</Badge> : null}
                    </div>
                    {t.fileUrl ? (
                      <a
                        href={t.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-block mt-1 text-blue-600 hover:underline"
                      >
                        📎 File Tugas
                      </a>
                    ) : null}
                  </div>
                </Card>
              ))}
            </div>
          )}
        </Section>

        <div className="my-12 text-xs text-gray-500">
          Tips: pastikan field <code>createdAt</code> bertipe Timestamp/Date di setiap koleksi agar sorting akurat.
          Jika Firestore minta index untuk kombinasi <code>where</code>/<code>orderBy</code>, buat index sesuai saran.
        </div>
      </div>
    </div>
  );
}
