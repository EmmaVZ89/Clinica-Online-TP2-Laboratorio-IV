import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';
import * as FileSaver from 'file-saver';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
// import * as XLSX from 'xlsx/xlsx.mjs';
const EXCEL_TYPE =
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
const EXCEL_EXTENSION = '.xlsx';

@Component({
  selector: 'app-informes',
  templateUrl: './informes.component.html',
  styleUrls: ['./informes.component.scss'],
})
export class InformesComponent implements OnInit {
  spinner: boolean = false;
  listaLogs: any[] = [];

  constructor(private authService: AuthService) {}

  ngOnInit(): void {
    this.authService.getUsersLog().subscribe((logs) => {
      this.listaLogs = logs;
      this.listaLogs.forEach((l) => {
        l.fecha = new Date(l.fecha.seconds * 1000);
      });
    });
  }

  // LOGS DE USUARIOS
  descargarPDFLogs() {
    const DATA = document.getElementById('pdflogs');
    const doc = new jsPDF('p', 'pt', 'a4');
    const options = {
      background: 'white',
      scale: 2,
    };
    //@ts-ignore
    html2canvas(DATA, options)
      .then((canvas) => {
        const img = canvas.toDataURL('image/PNG');

        const bufferX = 30;
        const bufferY = 30;
        const imgProps = (doc as any).getImageProperties(img);
        const pdfWidth = doc.internal.pageSize.getWidth() - 2 * bufferX;
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        doc.addImage(
          img,
          'PNG',
          bufferX,
          bufferY,
          pdfWidth,
          pdfHeight,
          undefined,
          'FAST'
        );
        return doc;
      })
      .then((docResult) => {
        docResult.save(`logs_usuarios.pdf`);
      });
  }

  descargarExcelLogs() {
    this.exportAsExcelFile(this.listaLogs, 'logUsuarios');
  }

  exportAsExcelFile(json: any[], excelFileName: string): void {
    const worksheet: XLSX.WorkSheet = XLSX.utils.json_to_sheet(json);
    const workbook: XLSX.WorkBook = {
      Sheets: { data: worksheet },
      SheetNames: ['data'],
    };
    const excelBuffer: any = XLSX.write(workbook, {
      bookType: 'xlsx',
      type: 'array',
    });
    this.saveAsExcelFile(excelBuffer, excelFileName);
  }

  saveAsExcelFile(buffer: any, fileName: string): void {
    const data: Blob = new Blob([buffer], { type: EXCEL_TYPE });
    FileSaver.saveAs(
      data,
      fileName + '_export_' + new Date().getTime() + EXCEL_EXTENSION
    );
  }
}
