'use client'

import React,{useState,useEffect,useRef} from 'react'
import { Document, Page } from 'react-pdf';
import pdfjsLib from 'pdfjs-dist';

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


export default const PdfViewer: React.FC<{ file: File }> = ({ file }) => {
    const [numPages, setNumPages] = useState<number | null>(null);
    const [pageNumber, setPageNumber] = useState(1);
    const [error, setError] = useState<string | null>(null);
  
    useEffect(() => {
      const loadPdf = async () => {
        try {
          const pdf = await Document.load(URL.createObjectURL(file));
          setNumPages(pdf.numPages);
        } catch (error) {
          console.error('Error loading PDF:', error);
          setError('Failed to load PDF');
        }
      };
      loadPdf();
    }, [file]);
  
    const onDocumentLoadSuccess = ({ numPages }: { numPages: number }) => {
      setNumPages(numPages);
    };
  
    const changePage = (offset: number) => {
      setPageNumber(prevPageNumber => prevPageNumber + offset);
    };
  
    const previousPage = () => changePage(-1);
    const nextPage = () => changePage(1);
  
    if (error) {
      return <p>{error}</p>;
    }
  
    return (
      <div className="pdf-viewer">
        <Document file={URL.createObjectURL(file)} onLoadSuccess={onDocumentLoadSuccess}>
          <Page pageNumber={pageNumber} />
        </Document>
        <div className="page-controls">
          <button onClick={previousPage}>Previous</button>
          <span>Page {pageNumber || (numPages ? 1 : 0)} of {numPages || '?'}</span>
          <button onClick={nextPage}>Next</button>
        </div>
      </div>
    );
  };

  