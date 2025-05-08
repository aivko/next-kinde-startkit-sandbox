"use client";

import React from "react";
import { Document, Page } from "@react-pdf/renderer";
import dynamic from "next/dynamic";

const PDFViewer = dynamic(
  () => import("@react-pdf/renderer").then((mod) => mod.PDFViewer),
  {
    ssr: false,
    loading: () => <p>...</p>,
  },
);

// comment
export default function PdfViewer({ pdfUrl }) {
  return (
    <PDFViewer width="100%" height="800px" url={pdfUrl} src={pdfUrl}>
      <Document width="100%">
        <Page pageNumber={1} />
      </Document>
    </PDFViewer>
  )
}