//typings

export interface Task {
  service: Service;
  employee: Employee;
  start: Date; //yyyy-MM-dd hh:mm:ss
  end: Date; //yyyy-MM-dd hh:mm:ss
}

interface Appointment {
  tasks: Task[];
  starting: Date; //yyyy-MM-dd hh:mm:ss
  is_done: boolean;
}

interface Client {
  firstname: string;
  lastname: string;
  date_birth: Date;
  email: string; //unique
  password: string;
  preferences: { bestEmployee: Employee; bestService: Service };
  appointments: Appointment[];
  created_at: Date; //yyyy-MM-dd hh:mm:ss
  updated_at: Date; //yyyy-MM-dd hh:mm:ss
}

export interface Employee {
  firstname: string;
  lastname: string;
  availability: Date; //yyyy-MM-dd hh:mm:ss
}

export interface Service {
  _id: string;
  title: string;
  description: string;
  price: number; // in Ar
  duration: number; // in hours
}
