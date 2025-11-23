import { useForm } from 'react-hook-form';
import { collection, addDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Patient } from '../types/Patient';
import { ChevronLeft } from 'lucide-react';

import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage
} from './ui/form';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Textarea } from './ui/textarea'; //
import { RadioGroup, RadioGroupItem } from './ui/radio-group'; //
import { toast } from 'sonner';

// 1. Update Form Values to include new fields
type PatientFormValues = {
  firstName: string;
  lastName: string;
  phn: string;
  dateOfBirth?: string;
  phoneNumber?: string;
  sex?: 'male' | 'female';
  history?: string; // Using 'history' for the big notes field
};

interface AddPatientPageProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function AddPatientPage({ onBack, onSuccess }: AddPatientPageProps) {
  // 2. Update default values
  const form = useForm<PatientFormValues>({
    defaultValues: {
      firstName: '',
      lastName: '',
      phn: '',
      dateOfBirth: '',
      phoneNumber: '',
      sex: undefined,
      history: ''
    }
  });

  const onSubmit = async (data: PatientFormValues) => {
    try {
      // 3. Construct the full Patient object
      const newPatientData: Omit<Patient, 'id'> = {
        ...data,
        // Ensure these are strings, even if empty
        dateOfBirth: data.dateOfBirth || '',
        phoneNumber: data.phoneNumber || '',
        sex: data.sex || 'other', // Provide a fallback
        history: data.history || '',
        // Add other required fields as empty
        diagnosis: '',
        medication: '',
        previousAppointments: '',
        notes: '',
        vitals: [],
        symptoms: []
      };

      await addDoc(collection(db, "patients"), newPatientData);
      toast.success("Patient added successfully");
      onSuccess();
    } catch (err) {
      console.error(err);
      toast.error("Error saving patient");
    }
  };

  // Reusable style class for inputs to match the design
  const inputClass = "bg-slate-50 border-slate-200 h-12 rounded-xl focus:bg-white focus:ring-2 focus:ring-teal-500 focus:border-transparent";
  const labelClass = "text-slate-700 font-semibold mb-1.5";

  return (
    <div className="max-w-xl mx-auto py-6 px-4">
      {/* Header with Back Arrow */}
      <div className="flex items-center gap-4 mb-8">
        <Button variant="ghost" size="icon" onClick={onBack} className="hover:bg-slate-100 rounded-full">
          <ChevronLeft className="h-6 w-6 text-slate-700" />
        </Button>
        <h1 className="text-3xl font-bold text-slate-900">Add New Patient</h1>
      </div>

      <Form {...form}>
        {/* Removed the white card background and shadow for a clean look */}
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          
          {/* First Name */}
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter first name" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Last Name */}
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Last Name</FormLabel>
                <FormControl>
                  <Input placeholder="Enter last name" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Date of Birth */}
          <FormField
            control={form.control}
            name="dateOfBirth"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Date of Birth</FormLabel>
                <FormControl>
                  {/* Using a simple text input for DD/MM/YYYY as per design */}
                  <Input placeholder="DD / MM / YYYY" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* PHN */}
          <FormField
            control={form.control}
            name="phn"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>PHN (Personal Health Number)</FormLabel>
                <FormControl>
                  <Input placeholder="Enter PHN" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Phone Number */}
          <FormField
            control={form.control}
            name="phoneNumber"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Phone Number</FormLabel>
                <FormControl>
                  <Input placeholder="(555) 000-0000" className={inputClass} {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Sex (Radio Buttons styled as big buttons) */}
          <FormField
            control={form.control}
            name="sex"
            render={({ field }) => (
              <FormItem className="space-y-1.5">
                <FormLabel className={labelClass}>Sex</FormLabel>
                <FormControl>
                  <RadioGroup
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                    className="grid grid-cols-2 gap-4"
                  >
                    {/* Custom style for Radio items to look like big buttons */}
                    {['male', 'female'].map((option) => (
                      <FormItem key={option}>
                        <FormControl>
                          <RadioGroupItem
                            value={option}
                            id={`sex-${option}`}
                            className="peer sr-only" // Hide the actual radio circle
                          />
                        </FormControl>
                        <FormLabel
                          htmlFor={`sex-${option}`}
                          className="flex flex-col items-center justify-center h-14 rounded-xl border-2 border-slate-200 bg-slate-50 cursor-pointer transition-all hover:bg-slate-100 peer-data-[state=checked]:border-teal-600 peer-data-[state=checked]:bg-teal-50 peer-data-[state=checked]:text-teal-800 capitalize font-semibold"
                        >
                          {option}
                        </FormLabel>
                      </FormItem>
                    ))}
                  </RadioGroup>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Medical History / Notes */}
          <FormField
            control={form.control}
            name="history"
            render={({ field }) => (
              <FormItem>
                <FormLabel className={labelClass}>Medical History / Notes</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Add patient medical history, allergies, or notes here..."
                    className={`${inputClass} h-32 py-3 resize-none`}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full h-14 text-lg font-semibold rounded-xl bg-teal-600 hover:bg-teal-700 shadow-lg shadow-teal-600/20 mt-8"
          >
            Save Patient
          </Button>
        </form>
      </Form>
    </div>
  );
}