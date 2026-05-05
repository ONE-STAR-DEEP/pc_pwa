"use client"

import type { ColumnDef } from "@tanstack/react-table"
import DiscrepancyPopup from "./disrcepancyPopup"
import type { Invoice } from "@/lib/types/DataTypes"

const formatCurrency = (value: number) =>
    new Intl.NumberFormat("en-IN", {
        style: "currency",
        currency: "INR",
    }).format(value)

export const columns: ColumnDef<Invoice>[] = [
    {
        id: "sno",
        header: () => <div className="w-8 text-center">S.No</div>,
        cell: ({ row }) => {
            return (
                <div className="text-center w-8 font-medium">
                    {row.index + 1}
                </div>
            )
        },
    },
    {
        accessorKey: "GSTVno",
        header: "Bill No.",
    },
    {
        accessorKey: "partyName",
        header: "Name",
        cell: ({ row }) => {
            return (
                <div className="text-left">
                    {row.getValue("partyName")}
                </div>
            )
        },
    },
    {
        accessorKey: "mTime",
        header: "Make Time",
    },
    {
        accessorKey: "Vdt",
        header: "Dated",
        cell: ({ row }) => {
            const date = new Date(row.getValue("Vdt"));

            return date.toLocaleDateString("en-GB")
        },
    },
    {
        accessorKey: "Gross Amt",
        header: () => <div className="text-right">Gross Amt</div>,
        cell: ({ row }) => {
            const value = row.getValue("Gross Amt") as number

            return (
                <div className="text-right font-medium">
                    {formatCurrency(value)}
                </div>
            )
        },
    },
    {
        accessorKey: "Inv Amt",
        header: () => <div className="text-right">Inv Amt</div>,
        cell: ({ row }) => {
            const value = row.getValue("Inv Amt") as number

            return (
                <div className="text-right font-semibold">
                    {formatCurrency(value)}
                </div>
            )
        },
    },
    {
        accessorKey: "NoOfItem",
        header: () => <div className="text-right">No of Items</div>,
        cell: ({ row }) => {
            const value = row.getValue("NoOfItem") as number

            return (
                <div className="text-right font-semibold tabular-nums">
                    {value}
                </div>
            )
        },
    },
    {
        id: "action",
        header: "Action",
        size: 120,
        cell: ({ row }) => {
            const VNo = row.original.Vno;
            const Vtyp = row.original.Vtyp;
            return (
                <div className="flex items-center m-0">
                    <DiscrepancyPopup VNo={VNo} Vtyp={Vtyp}/>
                </div>
            )
        },
    },
]