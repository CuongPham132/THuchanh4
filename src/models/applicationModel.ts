export interface Application {
    key: number;
    name: string;
    email: string;
    nguyenVong: string;
    reason: string;
    status: 'Pending' | 'Approved' | 'Rejected';
    note?: string;
    log?: string;
  }
  
  const STORAGE_KEY = 'applications';
  
  export const loadApplications = (): Application[] => {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    } catch {
      return [];
    }
  };
  
  export const saveApplications = (apps: Application[]) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(apps));
  };
  
  export const addApplication = (app: Application) => {
    const apps = loadApplications();
    apps.push(app);
    saveApplications(apps);
  };
  