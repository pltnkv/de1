import { Navigate, Route, Routes } from 'react-router-dom'
import { HomePage } from '../pages/HomePage'
import { TrainingPage } from '../pages/TrainingPage'
import { ExamPage } from '../pages/ExamPage'
import { StatisticsPage } from '../pages/StatisticsPage'

export default function App() {
  return (
    <div className="app">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/train/:mode" element={<TrainingPage />} />
        <Route path="/exam" element={<ExamPage />} />
        <Route path="/stats" element={<StatisticsPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  )
}
