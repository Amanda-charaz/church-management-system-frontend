import React, { useEffect, useState } from 'react'
import Sidebar from '../components/Sidebar'
import API from '../api/axios'
import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import * as XLSX from 'xlsx'

const Reports = () => {
  const [members, setMembers] = useState<any[]>([])
  const [visitors, setVisitors] = useState<any[]>([])
  const [finances, setFinances] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAll()
  }, [])

  const fetchAll = async () => {
    try {
      const [membersRes, visitorsRes, financesRes] = await Promise.all([
        API.get('/members'),
        API.get('/visitors'),
        API.get('/finances')
      ])
      setMembers(membersRes.data.members || [])
      setVisitors(visitorsRes.data.visitors || [])
      setFinances(financesRes.data.finances || [])
    } catch (err) {
      console.error('Error fetching data:', err)
    } finally {
      setLoading(false)
    }
  }

  // --- PDF EXPORTS ---
  const exportMembersPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(26, 42, 74)
    doc.text('Apostolic Faith Mission', 14, 20)
    doc.setFontSize(13)
    doc.text('Members Report', 14, 30)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38)
    autoTable(doc, {
      startY: 45,
      head: [['Name', 'Phone', 'Email', 'Department', 'Status', 'Baptized']],
      body: members.map(m => [
        `${m.firstName} ${m.lastName}`,
        m.phone || '-',
        m.email || '-',
        m.department || '-',
        m.approved ? 'Approved' : 'Pending',
        m.baptized ? 'Yes' : 'No'
      ]),
      headStyles: { fillColor: [26, 42, 74] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    })
    doc.save('AFM_Members_Report.pdf')
  }

  const exportVisitorsPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(26, 42, 74)
    doc.text('Apostolic Faith Mission', 14, 20)
    doc.setFontSize(13)
    doc.text('Visitors Report', 14, 30)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38)
    autoTable(doc, {
      startY: 45,
      head: [['Name', 'Phone', 'Email', 'Date Visited']],
      body: visitors.map(v => [
        `${v.firstName} ${v.lastName}`,
        v.phone || '-',
        v.email || '-',
        new Date(v.createdAt).toLocaleDateString()
      ]),
      headStyles: { fillColor: [26, 42, 74] },
      alternateRowStyles: { fillColor: [245, 247, 250] }
    })
    doc.save('AFM_Visitors_Report.pdf')
  }

  const exportFinancesPDF = () => {
    const doc = new jsPDF()
    doc.setFontSize(18)
    doc.setTextColor(26, 42, 74)
    doc.text('Apostolic Faith Mission', 14, 20)
    doc.setFontSize(13)
    doc.text('Finance Report', 14, 30)
    doc.setFontSize(10)
    doc.setTextColor(100)
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 38)

    const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + f.amount, 0)
    const totalExpense = finances.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + f.amount, 0)
    doc.text(`Total Income: $${totalIncome.toLocaleString()}   Total Expenses: $${totalExpense.toLocaleString()}   Balance: $${(totalIncome - totalExpense).toLocaleString()}`, 14, 46)

    autoTable(doc, {
      startY: 54,
      head: [['Date', 'Description', 'Type', 'Amount']],
      body: finances.map(f => [
        new Date(f.date || f.createdAt).toLocaleDateString(),
        f.description || '-',
        f.type,
        `$${Number(f.amount).toLocaleString()}`
      ]),
      headStyles: { fillColor: [26, 42, 74] },
      alternateRowStyles: { fillColor: [245, 247, 250] },
      bodyStyles: { },
      didParseCell: (data: any) => {
        if (data.column.index === 2) {
          data.cell.styles.textColor = data.cell.raw === 'INCOME' ? [22, 163, 74] : [220, 38, 38]
        }
      }
    })
    doc.save('AFM_Finance_Report.pdf')
  }

  // --- EXCEL EXPORTS ---
  const exportMembersExcel = () => {
    const data = members.map(m => ({
      'First Name': m.firstName,
      'Last Name': m.lastName,
      'Phone': m.phone || '',
      'Email': m.email || '',
      'Department': m.department || '',
      'Address': m.address || '',
      'Status': m.approved ? 'Approved' : 'Pending',
      'Baptized': m.baptized ? 'Yes' : 'No'
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Members')
    XLSX.writeFile(wb, 'AFM_Members_Report.xlsx')
  }

  const exportVisitorsExcel = () => {
    const data = visitors.map(v => ({
      'First Name': v.firstName,
      'Last Name': v.lastName,
      'Phone': v.phone || '',
      'Email': v.email || '',
      'Date Visited': new Date(v.createdAt).toLocaleDateString()
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Visitors')
    XLSX.writeFile(wb, 'AFM_Visitors_Report.xlsx')
  }

  const exportFinancesExcel = () => {
    const data = finances.map(f => ({
      'Date': new Date(f.date || f.createdAt).toLocaleDateString(),
      'Description': f.description || '',
      'Type': f.type,
      'Amount': f.amount
    }))
    const ws = XLSX.utils.json_to_sheet(data)
    const wb = XLSX.utils.book_new()
    XLSX.utils.book_append_sheet(wb, ws, 'Finances')
    XLSX.writeFile(wb, 'AFM_Finance_Report.xlsx')
  }

  const totalIncome = finances.filter(f => f.type === 'INCOME').reduce((sum, f) => sum + f.amount, 0)
  const totalExpense = finances.filter(f => f.type === 'EXPENSE').reduce((sum, f) => sum + f.amount, 0)

  const reports = [
    {
      title: 'Members Report',
      icon: '👥',
      count: members.length,
      label: 'Total Members',
      color: '#1a2a4a',
      onPDF: exportMembersPDF,
      onExcel: exportMembersExcel
    },
    {
      title: 'Visitors Report',
      icon: '🙏',
      count: visitors.length,
      label: 'Total Visitors',
      color: '#e67e22',
      onPDF: exportVisitorsPDF,
      onExcel: exportVisitorsExcel
    },
    {
      title: 'Finance Report',
      icon: '💰',
      count: `$${(totalIncome - totalExpense).toLocaleString()}`,
      label: 'Current Balance',
      color: '#16a34a',
      onPDF: exportFinancesPDF,
      onExcel: exportFinancesExcel
    }
  ]

  return (
    <div style={{ display: 'flex', fontFamily: 'Arial, sans-serif' }}>
      <Sidebar />
      <div style={{ marginLeft: '240px', flex: 1, background: '#f0f4f8', minHeight: '100vh' }}>

        {/* Header */}
        <div style={{
          background: 'white', padding: '16px 32px',
          display: 'flex', justifyContent: 'space-between',
          alignItems: 'center', borderBottom: '1px solid #e5e7eb'
        }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '24px', color: '#1a2a4a' }}>Reports</h1>
            <p style={{ margin: 0, color: '#6b7280', fontSize: '14px' }}>Export church data to PDF or Excel</p>
          </div>
        </div>

        <div style={{ padding: '32px' }}>
          {loading ? (
            <div style={{ textAlign: 'center', padding: '60px', color: '#6b7280' }}>Loading data...</div>
          ) : (
            <>
              {/* Stats Summary */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px', marginBottom: '32px' }}>
                {[
                  { label: 'Total Members', value: members.length, icon: '👥', color: '#1a2a4a' },
                  { label: 'Total Visitors', value: visitors.length, icon: '🙏', color: '#e67e22' },
                  { label: 'Balance', value: `$${(totalIncome - totalExpense).toLocaleString()}`, icon: '💰', color: '#16a34a' }
                ].map((stat, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: '12px', padding: '24px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    borderLeft: `4px solid ${stat.color}`
                  }}>
                    <div style={{ fontSize: '32px', marginBottom: '8px' }}>{stat.icon}</div>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: stat.color }}>{stat.value}</div>
                    <div style={{ color: '#6b7280', fontSize: '14px' }}>{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* Report Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '24px' }}>
                {reports.map((report, i) => (
                  <div key={i} style={{
                    background: 'white', borderRadius: '16px', padding: '28px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                    border: '1px solid #e5e7eb'
                  }}>
                    <div style={{ fontSize: '48px', marginBottom: '16px' }}>{report.icon}</div>
                    <h3 style={{ color: '#1a2a4a', fontSize: '20px', margin: '0 0 8px' }}>{report.title}</h3>
                    <div style={{ fontSize: '28px', fontWeight: 'bold', color: report.color, marginBottom: '4px' }}>{report.count}</div>
                    <div style={{ color: '#6b7280', fontSize: '13px', marginBottom: '24px' }}>{report.label}</div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button onClick={report.onPDF} style={{
                        flex: 1, padding: '10px', background: '#1a2a4a', color: 'white',
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '13px'
                      }}>📄 PDF</button>
                      <button onClick={report.onExcel} style={{
                        flex: 1, padding: '10px', background: '#16a34a', color: 'white',
                        border: 'none', borderRadius: '8px', cursor: 'pointer',
                        fontWeight: 'bold', fontSize: '13px'
                      }}>📊 Excel</button>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  )
}

export default Reports