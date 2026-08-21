//import { useState } from 'react'
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import { Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import LeaderBoardPage from './pages/LeaderBoardPage';
import SubmitExperimentPage from './pages/SubmitExperimentPage';
import ModelPage from './pages/ModelPage';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import VerificationEmailPage from './pages/VerificationEmailPage';
import EmailSentPage from './pages/EmailSentPage';
import DatasetPage from './pages/DatasetPage';
import ProfilePage from './pages/ProfilePage';
import UsersPage from './pages/UsersPage';


function App() {
    return (
        <Routes>
            <Route element={<Layout />}>

                <Route path='/' element={<HomePage />} />

                <Route path='/leaderboard' element={
                    <ProtectedRoute>
                        <LeaderBoardPage />
                    </ProtectedRoute>} />

                <Route path='/experiment' element={
                    <ProtectedRoute>
                        <SubmitExperimentPage />
                    </ProtectedRoute>} />
                    
                <Route path='/model' element={
                    <ProtectedRoute>
                        <ModelPage />
                    </ProtectedRoute>} />

                <Route path='/datasets' element={
                    <ProtectedRoute>
                        <DatasetPage />
                    </ProtectedRoute>} />

                <Route path='/profile' element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>} />

                <Route path='/users' element={
                    <ProtectedRoute>
                        <UsersPage />
                    </ProtectedRoute>} />
            </Route>

            <Route path='/register' element={<RegisterPage />} />
            <Route path='/verify-email' element={<VerificationEmailPage />} />
            <Route path='/email-sent' element={<EmailSentPage />} />
            <Route path='/login' element={<LoginPage />} />
            
        </Routes>
    );
}  

export default App;
