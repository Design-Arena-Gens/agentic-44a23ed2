'use client'

import { useState, useEffect } from 'react'

interface Expense {
  id: string
  description: string
  amount: number
  category: string
  date: string
}

export default function Home() {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [description, setDescription] = useState('')
  const [amount, setAmount] = useState('')
  const [category, setCategory] = useState('Food')
  const [date, setDate] = useState('')

  useEffect(() => {
    const stored = localStorage.getItem('expenses')
    if (stored) {
      setExpenses(JSON.parse(stored))
    }
    setDate(new Date().toISOString().split('T')[0])
  }, [])

  useEffect(() => {
    if (expenses.length > 0) {
      localStorage.setItem('expenses', JSON.stringify(expenses))
    }
  }, [expenses])

  const addExpense = (e: React.FormEvent) => {
    e.preventDefault()
    if (!description || !amount) return

    const newExpense: Expense = {
      id: Date.now().toString(),
      description,
      amount: parseFloat(amount),
      category,
      date
    }

    setExpenses([newExpense, ...expenses])
    setDescription('')
    setAmount('')
    setCategory('Food')
    setDate(new Date().toISOString().split('T')[0])
  }

  const deleteExpense = (id: string) => {
    const updated = expenses.filter(exp => exp.id !== id)
    setExpenses(updated)
    localStorage.setItem('expenses', JSON.stringify(updated))
  }

  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const thisMonthExpenses = expenses.filter(exp => {
    const expDate = new Date(exp.date)
    const now = new Date()
    return expDate.getMonth() === now.getMonth() && expDate.getFullYear() === now.getFullYear()
  }).reduce((sum, exp) => sum + exp.amount, 0)

  const categoryTotals = expenses.reduce((acc, exp) => {
    acc[exp.category] = (acc[exp.category] || 0) + exp.amount
    return acc
  }, {} as Record<string, number>)

  const topCategory = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1])[0]

  return (
    <div className="container">
      <div className="header">
        <h1>💰 Expense Dashboard</h1>
        <p>Track and manage your personal expenses</p>
      </div>

      <div className="dashboard">
        <div className="card">
          <h2>Total Expenses</h2>
          <div className="amount negative">${totalExpenses.toFixed(2)}</div>
          <div className="label">All time</div>
        </div>

        <div className="card">
          <h2>This Month</h2>
          <div className="amount neutral">${thisMonthExpenses.toFixed(2)}</div>
          <div className="label">{new Date().toLocaleString('default', { month: 'long' })}</div>
        </div>

        <div className="card">
          <h2>Top Category</h2>
          <div className="amount positive">
            {topCategory ? topCategory[0] : 'None'}
          </div>
          <div className="label">
            {topCategory ? `$${topCategory[1].toFixed(2)}` : 'No expenses yet'}
          </div>
        </div>
      </div>

      <div className="add-expense">
        <h2>Add New Expense</h2>
        <form className="form" onSubmit={addExpense}>
          <div className="form-group">
            <label>Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Coffee, groceries, etc."
              required
            />
          </div>

          <div className="form-group">
            <label>Amount</label>
            <input
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="0.00"
              step="0.01"
              min="0"
              required
            />
          </div>

          <div className="form-group">
            <label>Category</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="Food">Food</option>
              <option value="Transportation">Transportation</option>
              <option value="Entertainment">Entertainment</option>
              <option value="Shopping">Shopping</option>
              <option value="Bills">Bills</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Other">Other</option>
            </select>
          </div>

          <div className="form-group">
            <label>Date</label>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn">
            Add Expense
          </button>
        </form>
      </div>

      <div className="expenses-list">
        <h2>Recent Expenses</h2>
        {expenses.length === 0 ? (
          <div className="empty-state">No expenses yet. Add your first expense above!</div>
        ) : (
          expenses.map((expense) => (
            <div key={expense.id} className="expense-item">
              <div className="expense-info">
                <div className="expense-description">{expense.description}</div>
                <div className="expense-meta">
                  <span className="category-badge">{expense.category}</span>
                  <span>{new Date(expense.date).toLocaleDateString()}</span>
                </div>
              </div>
              <div className="expense-amount">${expense.amount.toFixed(2)}</div>
              <button
                className="delete-btn"
                onClick={() => deleteExpense(expense.id)}
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  )
}
