import { Home } from 'lucide-react'
import { DataTable } from '@/components/Datatable'
import { columns } from '@/components/DiscrepancyTable'
import type { Invoice } from '@/lib/types/DataTypes'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'


export default function Discrepancy() {
  const [data, setData] = useState<Invoice[]>([])

  const fetchInvoices = async () => {
    try {
      const res = await fetch("http://localhost:4000/discrepancyInvoice")

      const data = await res.json()
      setData(data.data)
    } catch (err) {
      console.error("Error fetching invoices:", err)
      setData([])
    }
  }

  useEffect(() => {
    fetchInvoices();

    const refreshTable = () => {
      fetchInvoices();
    };

    window.addEventListener("invoice-resolved", refreshTable);

    return () => {
      window.removeEventListener("invoice-resolved", refreshTable);
    };
  }, []);

  return (
    <div className='p-2 w-full my-4 space-y-4'>
      <section className='w-full flex border rounded-2xl p-4 items-center justify-between'>
        <h5>Today's Activity</h5>

        <div className='flex gap-4 items-center'>

          <Link className="flex items-center gap-1 bg-primary py-1 px-3 rounded-full text-white" to="/">
            <Home size={16} />
            Home
          </Link>
        </div>

      </section>

      <section className="rounded-2xl">
        <div className="flex items-center justify-between">
          <h5 className="text-xl m-4 font-semibold tracking-tight">
            Discrepancy Requests - {data.length}
          </h5>

        </div>

        <div className="rounded-xl bg-card px-4 pb-4">

          <DataTable data={data || []} columns={columns} />

        </div>
      </section>

    </div>
  )
}

