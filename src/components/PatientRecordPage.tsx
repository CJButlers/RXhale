import { useEffect, useState } from 'react';
import { doc, onSnapshot, updateDoc, arrayUnion } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Patient, VitalsLog } from '../types/Patient';
// ... imports (Charts, Cards, etc. from previous prompt)
import { Card, CardContent, CardHeader, CardTitle } from './ui/card'; //
import { Button } from './ui/button'; //
import { ChartContainer, ChartTooltip, ChartTooltipContent } from './ui/chart'; //
import { LineChart, Line, XAxis, YAxis, CartesianGrid } from 'recharts';

interface PatientRecordPageProps {
  patientId: string;
  onBack: () => void;
}

const chartConfig = {
  bpm: { label: "Heart Rate", color: "#ef4444" },
  spO2: { label: "SpO2", color: "#3b82f6" },
};

export function PatientRecordPage({ patientId, onBack }: PatientRecordPageProps) {
  const [patient, setPatient] = useState<Patient | null>(null);

  // 1. REAL-TIME LISTENER for Specific Patient
  useEffect(() => {
    const unsubscribe = onSnapshot(doc(db, "patients", patientId), (doc) => {
      if (doc.exists()) {
        setPatient({ id: doc.id, ...doc.data() } as Patient);
      }
    });
    return unsubscribe;
  }, [patientId]);

  // 2. SIMULATION: Mimic external device sending data to Cloud
  useEffect(() => {
    const interval = setInterval(async () => {
      // Create a fake reading
      const newVital: VitalsLog = {
        date: new Date().toISOString().split('T')[0],
        time: new Date().toLocaleTimeString(),
        spO2: Math.floor(Math.random() * (100 - 88 + 1) + 88), // Random 88-100
        bpm: Math.floor(Math.random() * (110 - 65 + 1) + 65),
        status: 'Normal'
      };

      // Write to Firestore (Cloud)
      // In a real app, your IoT device does this, not the browser.
      await updateDoc(doc(db, "patients", patientId), {
        vitals: arrayUnion(newVital)
      });
    }, 5000); // Every 5 seconds

    return () => clearInterval(interval);
  }, [patientId]);

  if (!patient) return <div>Loading record...</div>;

  // Process Data for Charts (Take last 20)
  const chartData = patient.vitals?.slice(-20) || [];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">{patient.firstName} {patient.lastName}</h1>
        <Button variant="outline" onClick={onBack}>Back to List</Button>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* SpO2 Chart */}
        <Card>
          <CardHeader><CardTitle>Oxygen Saturation (Real-time)</CardTitle></CardHeader>
          <CardContent>
             <div className="h-[200px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="time" tickLine={false} axisLine={false} />
                    <YAxis domain={[80, 100]} hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="spO2" type="monotone" stroke="var(--color-spO2)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
             </div>
          </CardContent>
        </Card>

        {/* Heart Rate Chart */}
        <Card>
          <CardHeader><CardTitle>Heart Rate</CardTitle></CardHeader>
          <CardContent>
             <div className="h-[200px] w-full">
                <ChartContainer config={chartConfig} className="h-full w-full">
                  <LineChart data={chartData}>
                    <CartesianGrid vertical={false} strokeDasharray="3 3"/>
                    <XAxis dataKey="time" tickLine={false} axisLine={false} />
                    <YAxis domain={[50, 140]} hide />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Line dataKey="bpm" type="monotone" stroke="var(--color-bpm)" strokeWidth={2} dot={false} />
                  </LineChart>
                </ChartContainer>
             </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}