import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
import DatasetDetailPage from './pages/DatasetDetailPage';
import RegisterDatasetPage from './pages/RegisterDatasetPage';
import VersionDetailPage from './pages/VersionDetailPage';
import CreateDatasetVersionPage from './pages/CreateDatasetVersionPage';
import CreatePipelinePage from './pages/CreatePipelinePage';
import RegisterModelPage from './pages/RegisterModelPage';
import NotFoundPage from './pages/NotFoundPage';


function App() {
    return (
        <>
        <ToastContainer position = "bottom-right" />
        <Routes>
            <Route element={<Layout />}>

                <Route path='/' element={<HomePage />} />

                <Route path='/leaderboard' element={
                    //<ProtectedRoute>
                        <LeaderBoardPage />
                    //</ProtectedRoute>
                } />

                <Route path='/leaderboard/:datasetId/:versionId/:pipelineId' element={
                    //<ProtectedRoute>
                        <LeaderBoardPage />
                    //</ProtectedRoute>
                } />


                <Route path='/experiment' element={
                    //<ProtectedRoute>
                        <SubmitExperimentPage />
                    //</ProtectedRoute>
                } />

                <Route path='/models' element={
                    //<ProtectedRoute>
                        <ModelPage />
                    //</ProtectedRoute>
                } />

                <Route path='/register-model' element={
                    //<ProtectedRoute>
                        <RegisterModelPage />
                    //</ProtectedRoute>
                }/> 

                <Route path='/datasets/:dataset_uuid' element={
                    //<ProtectedRoute>
                        <DatasetDetailPage />
                    //</ProtectedRoute>
                }/>

                <Route path='/datasets' element={
                    //<ProtectedRoute>
                        <DatasetPage />
                    //</ProtectedRoute>} 
                }/>

                <Route path='/register-dataset' element={
                    //<ProtectedRoute>
                        <RegisterDatasetPage />
                    //</ProtectedRoute>
                }/>

                <Route path='/dataset-versions/:version_uuid' element={
                    //<ProtectedRoute>
                        <VersionDetailPage />
                    //</ProtectedRoute>
                }/>

                <Route path='/datasets/:dataset_uuid/create-version' element={
                    //<ProtectedRoute>
                        <CreateDatasetVersionPage />
                    //</ProtectedRoute>
                }/>

                <Route path='/dataset-versions/:version_uuid/create-pipeline' element={
                    //<ProtectedRoute>
                        <CreatePipelinePage />
                    //</ProtectedRoute>
                }/>

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
            <Route path="*" element={<NotFoundPage />} />
            
        </Routes>
        </>
    );
}  

export default App;
