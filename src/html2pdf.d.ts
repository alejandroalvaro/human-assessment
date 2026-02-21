declare module 'html2pdf.js' {
  interface Html2PdfOptions {
    margin?: number | [number, number] | [number, number, number, number];
    filename?: string;
    image?: { type?: string; quality?: number };
    enableLinks?: boolean;
    html2canvas?: object;
    jsPDF?: { unit?: string; format?: string | [number, number]; orientation?: 'portrait' | 'landscape' };
    pagebreak?: { mode?: string[]; before?: string[]; after?: string[]; avoid?: string[] };
  }

  interface Html2PdfWorker {
    from(src: HTMLElement | string): this;
    set(options: Html2PdfOptions): this;
    save(filename?: string): Promise<void>;
    then<T>(onFulfilled?: (value: unknown) => T): Promise<T>;
  }

  interface Html2PdfStatic {
    (): Html2PdfWorker;
  }

  const html2pdf: Html2PdfStatic;
  export default html2pdf;
}
