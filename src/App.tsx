import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { FormProvider } from "./forms/FormProvider.tsx";
import { AppLayout } from "./layout/AppLayout.tsx";
import { FormBuilderPage } from "./pages/admin/FormBuilderPage.tsx";
import { FormEditorPage } from "./pages/admin/FormEditorPage.tsx";
import { FillFormPage } from "./pages/user/FillFormPage.tsx";
import { FormsPage } from "./pages/user/FormsPage.tsx";
import { RoleProvider } from "./role/RoleProvider.tsx";
import { ColorModeProvider } from "./theme/ColorModeProvider.tsx";

export default function App() {
  return (
    <ColorModeProvider>
      <RoleProvider>
        <FormProvider>
          <BrowserRouter>
            <Routes>
              <Route element={<AppLayout />}>
                <Route path="/" element={<Navigate to="/admin/forms" replace />} />
                <Route path="/admin/forms" element={<FormBuilderPage />} />
                <Route path="/forms" element={<FormsPage />} />
                <Route path="/forms/:formId" element={<FillFormPage />} />
              </Route>
              <Route path="/admin/forms/new" element={<FormEditorPage />} />
              <Route path="/admin/forms/:formId/edit" element={<FormEditorPage />} />
            </Routes>
          </BrowserRouter>
        </FormProvider>
      </RoleProvider>
    </ColorModeProvider>
  );
}
