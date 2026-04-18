export interface Invoice {
  id: string;
  name: string;
  address: string;
  address1: string;
  address2: string;
  Tel: string;
  "GST No.": string;
  Vno: string;
  DLNO: string;
  DLNO1: string;
  "Bill No": string;
  Dated: string; // you can switch to Date if you parse it
  "No Of Items": number;
  "Made By": string;
  "Print By": string;
  "Make Time": string;
  "Gross Amt": number;
  "Disc. Amt": number;
  "Taxable Amt.": number;
  "Tax Amt": number;
  "Net Amount": number;
  "Inv Amt": number;
  discrepancy: string;
  status: string;
  recipt: string;
}

export type BillItem = {
  id: string;
  Qty: number | string;
  PACK: string;
  COMPANY: string;
  PARTICULARS: string;
  "HSN CODE": string;
  "Batch No.": string;
  "Exp.": string;
  "MRP.": string;   
  Rate: string; 
  "DIS%": string;
  Tax: string;
  old_Qty?: number
};