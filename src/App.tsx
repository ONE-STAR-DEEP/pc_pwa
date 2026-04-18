import { PenLine, RefreshCcw } from 'lucide-react'
import { DataTable } from './components/Datatable'
import { columns } from './components/TableColumns'
import { Button } from './components/ui/button'
import type { Invoice } from './lib/types/DataTypes'
import { useState, useEffect } from 'react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { BrowserRouter, Link, Route, Routes } from 'react-router-dom'
import Discrepancy from './pages/discrepancy'

import {
  Field,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"

function Home() {
  const [data, setData] = useState<Invoice[]>([])
  const [open, setOpen] = useState(false)
  const [msg, setMsg] = useState("")
  const [Vno, setVno] = useState("")

  const fetchNewInvoices = async () => {
    try {
      const res = await fetch(`http://localhost:4000/invoices/new`)
      const data = await res.json()
      setData(data)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setData([])
    }
  }

  const fetchInvoices = async () => {
    try {
      const res = await fetch(`http://localhost:4000/invoice/complete/${Vno}`)
      const data = await res.json()
      setData(data)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setData([])
    }
  }

  const syncInvoices = async () => {
    try {
      const res = await fetch(`http://localhost:4000/invoice/insert/${Vno}`)
      const data = await res.json()
      setMsg(data.message)
      setOpen(true)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setData([])
    }
  }

  useEffect(() => {
    fetchNewInvoices()
  }, [])

  return (
    <div className='p-2 w-full my-4 space-y-4'>
      <section className='w-full flex border rounded-2xl p-4 items-center justify-between'>
        <h5>Today's Activity</h5>

        <div className='flex gap-4 items-center'>

          <Field>
            
            <Input 
            id="Vno" 
            type="text"
            value={Vno}
            placeholder="Vno"
            className='max-w-40 h-8 border-primary/50 border-2'
            onChange={(e)=>{setVno(e.target.value)}}
            />
          </Field>
          <Button onClick={fetchInvoices}>Fetch</Button>
          
          <Button onClick={() => syncInvoices()}>
            <RefreshCcw /> Sync Live
          </Button>

          <Link className="flex items-center gap-1 bg-primary py-1 px-3 rounded-full text-white" to="/discrepancy">
            <PenLine size={16} />
            Discrepancy
          </Link>

          {/* <Button onClick={() => fetchInvoices()}>
            <RefreshCcw /> Refresh
          </Button> */}

        </div>

      </section>

      <section className="rounded-2xl">
        <div className="flex items-center justify-between">
          <h5 className="text-xl m-4 font-semibold tracking-tight">
            Pending Bills {data.length}
          </h5>

        </div>

        <div className="rounded-xl bg-card px-4 pb-4">

          <DataTable data={data || []} columns={columns} />

        </div>
      </section>

      <AlertDialog open={open} onOpenChange={setOpen}>
        <AlertDialogHeader>
          <AlertDialogTitle>
            
          </AlertDialogTitle>
        </AlertDialogHeader>
        <AlertDialogContent className='rounded-md border-2 border-gray-700/50 bg-gray-100'>
          <AlertDialogHeader>
            <p className='text-2xl font-semibold'>
              Alert
            </p>
            {/* <AlertDialogTitle className='text-black'>Alert</AlertDialogTitle> */}
            <AlertDialogDescription className='text-gray-700 font-semibold'>
              {msg}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogAction className='rounded-lg'>Close</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

    </div>
  )
}


function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Use your existing home directly */}
        <Route path="/" element={<Home />} />

        {/* Add only this new page */}
        <Route path="/discrepancy" element={<Discrepancy />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
