import { GitHubBanner, Refine} from "@refinedev/core";
import { DevtoolsPanel, DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";

import routerProvider, {
  DocumentTitleHandler,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import {BrowserRouter, Outlet, Route, Routes} from "react-router";
import "./App.css";
import { Toaster } from "./components/refine-ui/notification/toaster";
import { useNotificationProvider } from "./components/refine-ui/notification/use-notification-provider";
import { ThemeProvider } from "./components/refine-ui/theme/theme-provider";
import { dataProvider } from "./providers/data.ts";
import Dashboard from "@/pages/dashboard.tsx";
import {Layout} from "@/components/refine-ui/layout/layout.tsx";
import SubjectsList from "@/pages/subjects/list.tsx";
import SubjectsCreate from "@/pages/subjects/create.tsx";
import DepartmentsList from "@/pages/departments/list.tsx";
import DepartmentsCreate from "@/pages/departments/create.tsx";
import UsersList from "@/pages/users/list.tsx";
import ClassesList from "@/pages/classes/list.tsx";
import ClassesCreate from "@/pages/classes/create.tsx";
import ClassesShow from "@/pages/classes/show.tsx";
import {BookOpen, GraduationCap, Home, Users, Building} from 'lucide-react';

function App() {
  return (
    <BrowserRouter>

      <RefineKbarProvider>
        <ThemeProvider>
          <DevtoolsProvider>
            <Refine
              dataProvider={dataProvider}
              notificationProvider={useNotificationProvider()}
              routerProvider={routerProvider}
              options={{
                syncWithLocation: true,
                warnWhenUnsavedChanges: true,
                projectId: "NSAtia-EZ5W1h-jgNueN",
              }}
              resources={[
                  {
                      name: 'dashboard',
                      list: '/',
                      meta: {label: 'Home', icon: <Home/>}
                  },
                  {
                      name: 'users',
                      list: '/users',
                      meta: {label: 'Users', icon: <Users/>}
                  },
                  {
                      name: 'departments',
                      list: '/departments',
                      create: '/departments/create',
                      meta: {label: 'Departments', icon: <Building/>}
                  },
                  {
                      name:'subjects',
                      list: '/subjects',
                      create: '/subjects/create',
                      meta: {label: 'Subjects', icon: <BookOpen/>}
                  },
                  {
                      name:'classes',
                      list: '/classes',
                      create: '/classes/create',
                      show: '/classes/show/:id',
                      meta: {label: 'Classes', icon: <GraduationCap/>}
                  }
              ]}
            >
              <Routes>
                  <Route element={
                      <Layout>
                          <Outlet/>
                      </Layout>

                  }>
                      <Route path="/" element={<Dashboard/>} />

                      <Route path="users">
                          <Route index element={<UsersList/>}/>
                      </Route>

                      <Route path="departments">
                          <Route index element={<DepartmentsList/>}/>
                          <Route path="create" element={<DepartmentsCreate/>}/>
                      </Route>

                      <Route path="subjects">
                          <Route index element={<SubjectsList/>}/>
                          <Route path="create" element={<SubjectsCreate/>}/>
                      </Route>

                      <Route path="classes">
                          <Route index element={<ClassesList/>}/>
                          <Route path="create" element={<ClassesCreate/>}/>
                          <Route path="show/:id" element={<ClassesShow/>}/>
                      </Route>
                  </Route>

              </Routes>
              <Toaster />
              <RefineKbar />
              <UnsavedChangesNotifier />
              <DocumentTitleHandler />
            </Refine>
            <DevtoolsPanel />
          </DevtoolsProvider>
        </ThemeProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
