// global.d.ts
export {};

declare global {
  interface Window {
    snap?: {
      pay: (
        token: string,
        params?: {
          onSuccess?: (result: any) => void;
          onPending?: (result: any) => void;
          onError?: (result: any) => void;
          onClose?: () => void;
          // tambahkan sesuai kebutuhan
          [k: string]: any;
        }
      ) => void;
    };
  }
}
