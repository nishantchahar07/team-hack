export interface FormData {
    name: string;
    age: string;
    gender: string;
    condition: string;
    urgency: string;
    location: string;
    date: string;
    time: string;
}

export interface Step {
    id: number;
    title: string;
    icon: any;
    active: boolean;
}

export interface Notification {
    id: number;
    message: string;
    type: 'success' | 'info' | 'warning';
}

export interface NurseData {
    id: string;
    name: string;
    specialization: string;
    experienceYears: number;
    language: string;
    gender: string;
    phone: string;
    email: string;
    available: boolean;
    Location: {
        id: string;
        lat: number;
        lng: number;
        address: string;
    };
}

export interface NavigationItem {
    label: string;
    icon: any;
    color: string;
}