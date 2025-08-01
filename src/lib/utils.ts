import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { getItem } from '../asyncStorage';
import { Alert } from 'react-native';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export async function checkAuth(): Promise<boolean> {
  const token = await getItem<string>('token');
  return !!token;
}

export function showToast(message: string) {
  Alert.alert('SQA Earning', message);
}
