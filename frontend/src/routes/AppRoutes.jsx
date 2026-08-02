import { Routes, Route } from 'react-router-dom';
import MainLayout from '../layouts/MainLayout';
import Dashboard from '../pages/Dashboard/Dashboard';
import AddTask from '../pages/AddTask/AddTask';
import EditTask from '../pages/EditTask/EditTask';
import TaskDetails from '../pages/TaskDetails/TaskDetails';
import NotFound from '../pages/NotFound/NotFound';

export const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="tasks/new" element={<AddTask />} />
        <Route path="tasks/edit/:id" element={<EditTask />} />
        <Route path="tasks/:id" element={<TaskDetails />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
