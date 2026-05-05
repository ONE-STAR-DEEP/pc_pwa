import { Button } from "./ui/button"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Field, FieldGroup } from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import type { BillItem, Invoice } from "@/lib/types/DataTypes"
import { useEffect, useState } from 'react'
import Loader from "./Loader"

const DiscrepancyPopup = ({ VNo, Vtyp }: { VNo: string, Vtyp: string }) => {

  const [open, setOpen] = useState(false);
  const [alertOpen, setAlertOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<BillItem[] | null>(null);
  const [invoice, setInvoice] = useState<Invoice | null>(null);

  const handleResolve = async () => {
    try {
      setLoading(true);
      const res = await fetch(`http://localhost:4000/resolvedInvoice/GSTVno/${invoice?.["Bill No"]}`);
      const data = await res.json();
      if (data.success) {
        window.dispatchEvent(new Event("invoice-resolved"));
        setOpen(false);
      }
    } catch (error) {
      console.error("Error fetching invoice items:", error);
      return { success: false, data: null };
    } finally {
      setLoading(false);
    }
  }

  const fetchdata = async () => {
    try {
      const res = await fetch(`http://localhost:4000/discrepancyInvoice/Vno/${Vtyp}-${VNo}`);
      return await res.json();
    } catch (error) {
      console.error("Error fetching invoice items:", error);
      return { success: false, data: null };
    }
  };

  useEffect(() => {
    const loadData = async () => {
      if (!open) return;
      try {
        const res = await fetchdata();
        console.log(res)

        if (!res.success) {
          alert("Failed to fetch data Try Again");
          setOpen(false);
          return;
        }
        setData(res.items || [])
        setInvoice(res.invoice || null)
      } catch (error) {
        console.log(error);
      }
    }
    loadData();
  }, [open]);

  return (
    <div>
      <Button onClick={() => { setOpen(true) }} className="m-0 h-8">View</Button>

      <Dialog open={open} onOpenChange={setOpen}>
        {loading ?
          <DialogContent
            className="w-full
                    max-w-[95vw]
                    sm:max-w-md
                    lg:max-w-[60vw]
                    min-h-[20vh]
                    max-h-[80vh] 
                    flex flex-col
                    p-4
                    overflow-y-auto
                    rounded-lg
                    "
          >
            <DialogHeader>
              <DialogTitle>
                <p className='text-xl font-semibold text-primary'></p>
              </DialogTitle>
            </DialogHeader>

            <Loader />

          </DialogContent>
          :

          <DialogContent
            className="w-full
                    max-w-[95vw]
                    sm:max-w-md
                    lg:max-w-[60vw]
                    min-h-[20vh]
                    max-h-[80vh] 
                    flex flex-col
                    p-4
                    overflow-y-auto
                    rounded-lg
                    "
          >
            <form className='space-y-4'>
              <DialogHeader>
                <DialogTitle>
                  <p className='text-xl font-semibold text-primary'>Discrepency Reported</p>
                </DialogTitle>
                <DialogDescription>
                  Review discrepancies in invoice details such as quantity or HSN code reported by the reviewer.
                </DialogDescription>
                <h5 className='text-lg font-semibold mt-2'>Invoice No: <span className='text-orange-600'>{invoice?.['Bill No']}</span></h5>
              </DialogHeader>

              <FieldGroup >
                <div className="grid grid-cols-[40px_150px_1fr_100px_100px_150px] gap-4 mb-0">
                  <Label>SNo</Label>
                  <Label>Batch No.</Label>
                  <Label className='min-w-60'>Particular</Label>
                  <Label>Current Qty</Label>
                  <Label>Changed to</Label>
                  <Label>Expiry</Label>
                </div>

                {data?.map((item, index) => (
                  <div key={item.id} className="grid grid-cols-[40px_150px_1fr_100px_100px_150px] gap-4 mb-0">

                    <Input
                      name="Sno"
                      defaultValue={index + 1}
                      disabled
                    />
                    <Field>
                      <Input
                        name="batch"
                        defaultValue={item['Batch No.']}
                        className={`${(item.old_batch_no !== null) && (item['Batch No.'] !== item.old_batch_no) ? "bg-red-300 text-black" : ""}`}
                        disabled
                      />
                    </Field>

                    <Field>
                      <Input
                        name="particular"
                        defaultValue={item.PARTICULARS}
                        disabled
                      />
                    </Field>

                    <Field>
                      <Input
                        name="particular"
                        defaultValue={item.old_Qty ? item.old_Qty : "Unaltered"}
                        disabled
                      />
                    </Field>

                    <Field>
                      <Input
                        name="qty"
                        defaultValue={item.Qty}
                        disabled
                        className={`${(item.old_Qty !== null) && (item.Qty !== item.old_Qty) ? "bg-red-300 text-black" : ""}`}
                      />
                    </Field>

                    <Field>
                      <Input
                        name="expiry"
                        defaultValue={item['Exp.']}
                        disabled
                        className={`${(item.old_expiry !== null) && (item['Exp.'] !== item.old_expiry) ? "bg-red-300 text-black" : ""}`}
                      />
                    </Field>
                  </div>
                ))}
              </FieldGroup>

              <DialogFooter className=''>
                <DialogClose asChild>
                  <Button variant="outline" className="rounded-full border border-black/20" type="button">Close</Button>
                </DialogClose>
                <Button className="rounded-full border border-black/20" onClick={() => { setAlertOpen(true) }} type="button">Resolved</Button>
              </DialogFooter>
            </form>
          </DialogContent>
        }
      </Dialog>

      <AlertDialog open={alertOpen} onOpenChange={setAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="text-red-700!">Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will replace the current invoice with the one having discrepancies resolved. Please make sure to review all changes before proceeding.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel type="button">Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleResolve} type="button">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}

export default DiscrepancyPopup