import { Route, Routes } from "react-router-dom";
import { Layout } from "./components/Layout";
import { HomePage } from "./pages/HomePage";
import { PremioPage } from "./pages/PremioPage";
import { GalaPage } from "./pages/GalaPage";
import { IngressosPage } from "./pages/IngressosPage";
import { EventoDetalhePage } from "./pages/EventoDetalhePage";

export default function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="o-premio" element={<PremioPage />} />
        <Route path="a-gala" element={<GalaPage />} />
        <Route path="ingressos" element={<IngressosPage />} />
        <Route path="ingressos/:id" element={<EventoDetalhePage />} />
      </Route>
    </Routes>
  );
}
