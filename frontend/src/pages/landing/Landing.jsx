import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function LandingPage() {
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem("vitacare-theme") === "dark";
  });
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const root = document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("vitacare-theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("vitacare-theme", "light");
    }
  }, [darkMode]);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const features = [
    { icon: "🗓️", title: "Agenda de Citas", desc: "Registro y control diario de la agenda. Confirmación automática para el paciente." },
    { icon: "👤", title: "Registro de Pacientes", desc: "Ficha digital completa con número de historial autogenerado (HC-0001...)." },
    { icon: "📋", title: "Historial Clínico", desc: "Acceso inmediato al historial de citas, diagnósticos y observaciones del médico." },
    { icon: "📊", title: "Reportes y Estadísticas", desc: "Dashboard con métricas de atención. Exporta reportes en PDF con un clic." },
    { icon: "🤖", title: "Asistente Virtual", desc: "Chatbot que orienta al paciente hacia el especialista correcto según sus síntomas." },
    { icon: "🔒", title: "Seguridad con Roles", desc: "Acceso diferenciado para admin, doctor, admisión y paciente con JWT." },
  ];

  const especialidades = [
    { icon: "🩺", name: "Medicina General" },
    { icon: "❤️", name: "Cardiología" },
    { icon: "👶", name: "Pediatría" },
    { icon: "🦴", name: "Traumatología" },
    { icon: "🧠", name: "Neurología" },
    { icon: "🌸", name: "Ginecología" },
    { icon: "🔬", name: "Dermatología" },
    { icon: "🦷", name: "Odontología" },
    { icon: "👁️", name: "Oftalmología" },
    { icon: "🥗", name: "Nutrición" },
    { icon: "🧩", name: "Psicología" },
    { icon: "➕", name: "Ver Más" },
  ];

  const steps = [
    { num: "01", title: "Regístrate", desc: "Crea tu cuenta como paciente con tu DNI en segundos." },
    { num: "02", title: "Elige especialidad", desc: "Selecciona el médico y la fecha disponible." },
    { num: "03", title: "Confirma tu cita", desc: "Recibe confirmación automática al instante." },
    { num: "04", title: "Asiste y listo", desc: "El doctor tiene todo tu historial preparado." },
  ];

  return (
    <div className={`min-h-screen font-sans transition-colors duration-300 ${darkMode ? "bg-gray-950 text-white" : "bg-white text-gray-900"}`}>

      {/* NAVBAR */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? (darkMode ? "bg-gray-900/95 shadow-lg shadow-black/20" : "bg-white/95 shadow-lg shadow-gray-200/60") : "bg-transparent"} backdrop-blur-md`}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-sm">V</span>
            </div>
            <span className={`text-xl font-bold tracking-tight ${darkMode ? "text-white" : "text-gray-900"}`}>
              Vita<span className="text-teal-500">Care</span>
            </span>
          </div>

          <div className="hidden md:flex items-center gap-8">
            {["Funcionalidades", "Especialidades", "Cómo funciona", "Acerca de"].map((item) => (
              <a key={item}
                href={`#${item.toLowerCase().replace(/\s+/g, "-").replace(/[áéíóú]/g, (c) => ({ á:"a",é:"e",í:"i",ó:"o",ú:"u" })[c])}`}
                className={`text-sm font-medium transition-colors ${darkMode ? "text-gray-300 hover:text-teal-400" : "text-gray-600 hover:text-teal-600"}`}>
                {item}
              </a>
            ))}
          </div>

          <div className="flex items-center gap-3">
            <button onClick={() => setDarkMode(!darkMode)}
              className={`w-12 h-6 rounded-full relative transition-colors duration-300 ${darkMode ? "bg-teal-500" : "bg-gray-200"}`}
              aria-label="Cambiar tema">
              <span className={`absolute top-0.5 w-5 h-5 rounded-full transition-all duration-300 flex items-center justify-center text-xs ${darkMode ? "left-6 bg-gray-900" : "left-0.5 bg-white"}`}>
                {darkMode ? "🌙" : "☀️"}
              </span>
            </button>
            <button onClick={() => navigate("/login")}
              className={`hidden md:block text-sm font-medium px-4 py-2 rounded-lg transition-colors ${darkMode ? "text-gray-300 hover:text-white" : "text-gray-600 hover:text-gray-900"}`}>
              Iniciar sesión
            </button>
            <button onClick={() => navigate("/login")}
              className="text-sm font-semibold px-5 py-2 rounded-lg bg-teal-500 text-white hover:bg-teal-600 transition-colors shadow-md shadow-teal-500/25">
              Comenzar gratis
            </button>
            <button onClick={() => setMenuOpen(!menuOpen)} className="md:hidden p-1">
              <div className={`w-5 h-0.5 mb-1 transition-all ${darkMode ? "bg-white" : "bg-gray-800"} ${menuOpen ? "rotate-45 translate-y-1.5" : ""}`} />
              <div className={`w-5 h-0.5 mb-1 transition-all ${darkMode ? "bg-white" : "bg-gray-800"} ${menuOpen ? "opacity-0" : ""}`} />
              <div className={`w-5 h-0.5 transition-all ${darkMode ? "bg-white" : "bg-gray-800"} ${menuOpen ? "-rotate-45 -translate-y-1.5" : ""}`} />
            </button>
          </div>
        </div>

        {menuOpen && (
          <div className={`md:hidden px-6 pb-4 flex flex-col gap-3 ${darkMode ? "bg-gray-900" : "bg-white"}`}>
            {["Funcionalidades", "Especialidades", "Cómo funciona", "Acerca de"].map((item) => (
              <a key={item} href="#" onClick={() => setMenuOpen(false)}
                className={`text-sm font-medium py-2 ${darkMode ? "text-gray-300" : "text-gray-600"}`}>{item}</a>
            ))}
            <button onClick={() => navigate("/login")}
              className={`text-sm font-medium py-2 text-left ${darkMode ? "text-gray-300" : "text-gray-600"}`}>
              Iniciar sesión
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className={`min-h-screen flex items-center pt-16 px-6 relative overflow-hidden ${darkMode ? "bg-gradient-to-br from-gray-950 via-gray-900 to-teal-950" : "bg-gradient-to-br from-white via-teal-50/40 to-cyan-50"}`}>
        <div className="absolute top-20 right-10 w-72 h-72 rounded-full bg-teal-500/5 blur-3xl pointer-events-none" />
        <div className="absolute bottom-20 left-10 w-48 h-48 rounded-full bg-cyan-500/5 blur-3xl pointer-events-none" />

        <div className="max-w-6xl mx-auto w-full grid md:grid-cols-2 gap-12 items-center py-16">
          <div>
            <span className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-6 ${darkMode ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-teal-50 text-teal-700 border border-teal-200"}`}>
              Centro de Salud Jorge Chávez — Juliaca
            </span>
            <h1 className={`text-4xl md:text-5xl font-bold leading-tight mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Gestión de citas médicas <span className="text-teal-500">inteligente</span> y sin filas
            </h1>
            <p className={`text-lg leading-relaxed mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              VitaCare digitaliza el registro de pacientes, la programación de citas y los historiales clínicos, eliminando el papeleo y reduciendo los tiempos de espera.
            </p>
            <div className="flex flex-wrap gap-4">
              <button onClick={() => navigate("/login")}
                className="px-7 py-3.5 rounded-xl bg-teal-500 text-white font-semibold hover:bg-teal-600 transition-all shadow-lg shadow-teal-500/30 hover:-translate-y-0.5">
                Solicitar cita →
              </button>
              <button onClick={() => navigate("/login")}
                className={`px-7 py-3.5 rounded-xl font-semibold border transition-all hover:-translate-y-0.5 ${darkMode ? "border-gray-700 text-gray-300 hover:border-gray-500 hover:text-white" : "border-gray-200 text-gray-700 hover:border-gray-300"}`}>
                Acceso personal
              </button>
            </div>
            <div className="mt-12 flex flex-wrap gap-8">
              {[{ num: "50+", label: "Pacientes diarios" }, { num: "6", label: "Especialidades" }, { num: "100%", label: "Digital y en línea" }].map((s) => (
                <div key={s.label}>
                  <div className="text-2xl font-bold text-teal-500">{s.num}</div>
                  <div className={`text-sm ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative hidden md:block">
            <div className={`rounded-2xl p-6 shadow-2xl border ${darkMode ? "bg-gray-800/60 border-gray-700/60 backdrop-blur-sm" : "bg-white border-gray-100 shadow-gray-100/80"}`}>
              <div className={`flex items-center gap-3 mb-5 pb-5 border-b ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <div className="w-10 h-10 rounded-full bg-teal-500/15 flex items-center justify-center text-teal-500 font-bold">JC</div>
                <div>
                  <div className={`font-semibold text-sm ${darkMode ? "text-white" : "text-gray-900"}`}>Dr. Jorge Chávez</div>
                  <div className={`text-xs ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Medicina General</div>
                </div>
                <span className="ml-auto text-xs px-2 py-1 rounded-full bg-teal-500/10 text-teal-500 font-medium">Disponible</span>
              </div>
              {[
                { label: "Paciente", val: "María López García" },
                { label: "DNI", val: "45678901" },
                { label: "Fecha", val: "Hoy, 10:30 AM" },
                { label: "N° Historial", val: "HC-0024" },
              ].map((r) => (
                <div key={r.label} className={`flex justify-between text-sm py-2 border-b last:border-0 ${darkMode ? "border-gray-700/60 text-gray-400" : "border-gray-50 text-gray-500"}`}>
                  <span>{r.label}</span>
                  <span className={`font-medium ${darkMode ? "text-white" : "text-gray-900"}`}>{r.val}</span>
                </div>
              ))}
              <button className="mt-5 w-full py-2.5 rounded-lg bg-teal-500 text-white text-sm font-semibold hover:bg-teal-600 transition-colors">
                ✓ Cita confirmada
              </button>
            </div>
            <div className={`absolute -bottom-4 -left-4 rounded-xl px-4 py-3 shadow-lg text-sm font-medium flex items-center gap-2 ${darkMode ? "bg-gray-800 border border-gray-700 text-gray-300" : "bg-white border border-gray-100 text-gray-700 shadow-gray-100/80"}`}>
              <span className="w-2 h-2 rounded-full bg-teal-500 animate-pulse" />
              Sistema en línea 24/7
            </div>
          </div>
        </div>
      </section>

      {/* FEATURES */}
      <section id="funcionalidades" className={`py-24 px-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-xs font-semibold tracking-widest uppercase ${darkMode ? "text-teal-400" : "text-teal-600"}`}>Funcionalidades</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Todo lo que necesita el centro de salud</h2>
            <p className={`mt-4 max-w-xl mx-auto ${darkMode ? "text-gray-400" : "text-gray-500"}`}>Una plataforma completa que automatiza los procesos administrativos y clínicos.</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f) => (
              <div key={f.title}
                className={`rounded-2xl p-6 border transition-all hover:-translate-y-1 hover:shadow-lg ${darkMode ? "bg-gray-800/50 border-gray-700/60 hover:border-teal-500/30 hover:shadow-teal-500/5" : "bg-white border-gray-100 hover:border-teal-200 hover:shadow-teal-50"}`}>
                <div className="text-3xl mb-4">{f.icon}</div>
                <h3 className={`font-bold text-lg mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{f.title}</h3>
                <p className={`text-sm leading-relaxed ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ESPECIALIDADES */}
      <section id="especialidades" className={`py-24 px-6 ${darkMode ? "bg-gray-950" : "bg-white"}`}>
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <span className={`inline-block text-xs font-semibold tracking-widest uppercase px-3 py-1 rounded-full mb-4 ${darkMode ? "bg-teal-500/10 text-teal-400 border border-teal-500/20" : "bg-teal-50 text-teal-700 border border-teal-200"}`}>
              Especialidades
            </span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>
              Atención médica especializada
            </h2>
            <p className={`mt-4 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Profesionales en diversas áreas para cuidar tu salud integral
            </p>
          </div>
          <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
            {especialidades.map((esp) => (
              <button
                key={esp.name}
                onClick={() => navigate("/login")}
                className={`flex flex-col items-center justify-center gap-3 p-4 rounded-2xl border transition-all hover:-translate-y-1 hover:shadow-md ${
                  esp.name === "Ver Más"
                    ? darkMode
                      ? "border-dashed border-gray-600 text-gray-400 hover:border-teal-500 hover:text-teal-400"
                      : "border-dashed border-gray-300 text-gray-400 hover:border-teal-400 hover:text-teal-600"
                    : darkMode
                    ? "bg-gray-800/50 border-gray-700/60 hover:border-teal-500/40 hover:shadow-teal-500/5"
                    : "bg-white border-gray-200 hover:border-teal-300 hover:shadow-teal-50"
                }`}
              >
                <span className="text-3xl">{esp.icon}</span>
                <span className={`text-xs font-medium text-center leading-tight ${
                  esp.name === "Ver Más"
                    ? darkMode ? "text-gray-400" : "text-gray-400"
                    : darkMode ? "text-gray-300" : "text-gray-700"
                }`}>
                  {esp.name}
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* HOW IT WORKS */}
      <section id="como-funciona" className={`py-24 px-6 ${darkMode ? "bg-gray-900" : "bg-gray-50"}`}>
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className={`text-xs font-semibold tracking-widest uppercase ${darkMode ? "text-teal-400" : "text-teal-600"}`}>Cómo funciona</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-3 ${darkMode ? "text-white" : "text-gray-900"}`}>Agenda tu cita en 4 pasos</h2>
          </div>
          <div className="grid md:grid-cols-4 gap-6">
            {steps.map((s, i) => (
              <div key={s.num} className="relative text-center">
                {i < steps.length - 1 && (
                  <div className={`hidden md:block absolute top-8 left-1/2 w-full h-px ${darkMode ? "bg-gray-700" : "bg-gray-200"}`} />
                )}
                <div className="relative z-10 inline-flex w-16 h-16 rounded-full items-center justify-center mb-4 bg-teal-500/10 border-2 border-teal-500/30">
                  <span className="text-teal-500 font-bold text-lg">{s.num}</span>
                </div>
                <h3 className={`font-bold mb-2 ${darkMode ? "text-white" : "text-gray-900"}`}>{s.title}</h3>
                <p className={`text-sm ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ABOUT */}
      <section id="acerca-de" className={`py-24 px-6 ${darkMode ? "bg-gray-900" : "bg-teal-50/50"}`}>
        <div className="max-w-5xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          <div>
            <span className={`text-xs font-semibold tracking-widest uppercase ${darkMode ? "text-teal-400" : "text-teal-600"}`}>Acerca de</span>
            <h2 className={`text-3xl md:text-4xl font-bold mt-3 mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Centro de Salud Jorge Chávez, Juliaca</h2>
            <p className={`leading-relaxed mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Somos una institución comprometida con brindar servicios de salud integral a la población de Juliaca y zonas aledañas, con énfasis en madres gestantes, niños y adultos mayores.
            </p>
            <p className={`leading-relaxed mb-8 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              VitaCare nace para modernizar nuestra gestión administrativa, eliminar el papeleo y garantizar una atención más rápida, organizada y de calidad para toda la comunidad.
            </p>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: "Reducción de papel", val: "70–90%" },
                { label: "Ahorro mensual est.", val: "S/. 765" },
                { label: "Relación B/C", val: "2.99" },
                { label: "Recuperación inversión", val: "≈ 4 meses" },
              ].map((m) => (
                <div key={m.label} className={`rounded-xl p-4 ${darkMode ? "bg-gray-800 border border-gray-700" : "bg-white border border-gray-100"}`}>
                  <div className="text-xl font-bold text-teal-500">{m.val}</div>
                  <div className={`text-xs mt-1 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>{m.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className={`rounded-2xl p-8 border ${darkMode ? "bg-gray-800/50 border-gray-700" : "bg-white border-gray-100"}`}>
            <h3 className={`font-bold text-lg mb-6 ${darkMode ? "text-white" : "text-gray-900"}`}>Información del establecimiento</h3>
            {[
              { icon: "📍", label: "Dirección", val: "Jr. Ancash N° 179, Juliaca" },
              { icon: "📞", label: "Teléfono", val: "(051) 331445" },
              { icon: "✉️", label: "Correo", val: "csjorgechavez@gmail.com" },
              { icon: "🏥", label: "Tipo", val: "Atención primaria en salud" },
              { icon: "🕐", label: "Horario", val: "Lun – Sab, 8:00 AM – 5:00 PM" },
            ].map((item) => (
              <div key={item.label} className={`flex gap-3 py-3 border-b last:border-0 ${darkMode ? "border-gray-700" : "border-gray-100"}`}>
                <span className="text-xl">{item.icon}</span>
                <div>
                  <div className={`text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>{item.label}</div>
                  <div className={`text-sm font-medium ${darkMode ? "text-gray-200" : "text-gray-700"}`}>{item.val}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className={`py-20 px-6 text-center ${darkMode ? "bg-gradient-to-br from-teal-900/30 to-gray-900" : "bg-gradient-to-br from-teal-500 to-cyan-600"}`}>
        <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">¿Listo para modernizar la atención?</h2>
        <p className="text-teal-100 mb-8 max-w-md mx-auto">
          Únete al Centro de Salud Jorge Chávez y agenda tu cita médica en segundos, sin filas y desde cualquier dispositivo.
        </p>
        <div className="flex flex-wrap gap-4 justify-center">
          <button onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-xl bg-white text-teal-600 font-bold hover:bg-teal-50 transition-all shadow-lg shadow-black/10 hover:-translate-y-0.5">
            Solicitar cita ahora →
          </button>
          <button onClick={() => navigate("/login")}
            className="px-8 py-3.5 rounded-xl border-2 border-white/40 text-white font-semibold hover:bg-white/10 transition-all hover:-translate-y-0.5">
            Acceso para personal
          </button>
        </div>
      </section>

      {/* FOOTER */}
      <footer className={`py-10 px-6 border-t ${darkMode ? "bg-gray-950 border-gray-800" : "bg-gray-50 border-gray-200"}`}>
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-teal-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">V</span>
            </div>
            <span className={`font-bold ${darkMode ? "text-white" : "text-gray-900"}`}>
              Vita<span className="text-teal-500">Care</span>
            </span>
          </div>
          <p className={`text-sm text-center ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
            © 2026 VitaCare — Centro de Salud Jorge Chávez, Juliaca, Perú. Desarrollado por Nilber Romario Quispe Aquino.
          </p>
          <button onClick={() => navigate("/login")}
            className="text-sm text-teal-500 font-medium hover:text-teal-400 transition-colors">
            Iniciar sesión →
          </button>
        </div>
      </footer>
    </div>
  );
}