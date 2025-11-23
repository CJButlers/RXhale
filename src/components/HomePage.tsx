import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Patient } from '../types/Patient';
// ... imports from previous HomePage step (Table, Tabs, Badges, etc.)
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table'; //
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs'; //
import { Input } from './ui/input'; //
import { Button } from './ui/button'; //
import { Badge } from './ui/badge'; //
import { Plus, AlertTriangle } from 'lucide-react';

interface HomePageProps {
  onAddPatient: () => void;
  onPatientClick: (id: string) => void;
}

export function HomePage({ onAddPatient, onPatientClick }: HomePageProps) {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // REAL-TIME LISTENER
  useEffect(() => {
    const q = query(collection(db, "patients"), orderBy("lastName"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const patientsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Patient[];
      setPatients(patientsData);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  // Helper Logic
  const getStatus = (p: Patient) => {
    const lastVital = p.vitals?.[p.vitals.length - 1];
    return (lastVital && lastVital.spO2 < 90) ? 'critical' : 'stable';
  };

  // Filter Logic
  const filtered = patients.filter(p => 
    p.lastName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    p.phn.includes(searchQuery)
  );

  // ... Render Logic (Reuse the Table and Tabs layout from previous prompt)
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <Input 
          placeholder="Search patients..." 
          className="max-w-sm bg-white"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <Button onClick={onAddPatient} className="bg-teal-600 hover:bg-teal-700">
          <Plus className="mr-2 h-4 w-4" /> Add Patient
        </Button>
      </div>

      {/* Reusing the Tabs and Table structure from the previous HomePage design */}
      <Tabs defaultValue="all">
        <TabsList>
          <TabsTrigger value="all">All</TabsTrigger>
          <TabsTrigger value="critical">Critical Alert</TabsTrigger>
        </TabsList>
        <TabsContent value="all">
           <div className="rounded-md border bg-white">
             <Table>
               <TableHeader>
                 <TableRow>
                   <TableHead>Name</TableHead>
                   <TableHead>PHN</TableHead>
                   <TableHead>Latest SpO2</TableHead>
                   <TableHead>Status</TableHead>
                 </TableRow>
               </TableHeader>
               <TableBody>
                 {filtered.map(p => (
                   <TableRow key={p.id} onClick={() => onPatientClick(p.id)} className="cursor-pointer">
                     <TableCell>{p.firstName} {p.lastName}</TableCell>
                     <TableCell>{p.phn}</TableCell>
                     <TableCell>
                        {p.vitals?.length ? `${p.vitals[p.vitals.length-1].spO2}%` : '--'}
                     </TableCell>
                     <TableCell>
                       {getStatus(p) === 'critical' ? (
                         <Badge variant="destructive"><AlertTriangle className="w-3 h-3 mr-1"/> Critical</Badge>
                       ) : (
                         <Badge variant="secondary" className="bg-green-100 text-green-800">Stable</Badge>
                       )}
                     </TableCell>
                   </TableRow>
                 ))}
               </TableBody>
             </Table>
           </div>
        </TabsContent>
        {/* Add Critical Tab content filtering by getStatus(p) === 'critical' */}
      </Tabs>
    </div>
  );
}