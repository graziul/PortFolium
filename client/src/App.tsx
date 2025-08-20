import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "./components/ui/theme-provider"
import { Toaster } from "./components/ui/toaster"
import { AuthProvider } from "./contexts/AuthContext"
import { Login } from "./pages/Login"
import { Register } from "./pages/Register"
import { ProtectedRoute } from "./components/ProtectedRoute"
import { Layout } from "./components/Layout"
import { BlankPage } from "./pages/BlankPage"
import { Home } from "./pages/Home"
import { Projects } from "./pages/Projects"
import { ProjectTracker } from "./pages/ProjectTracker"
import { Blog } from "./pages/Blog"
import { BlogPostPage } from "./pages/BlogPost"
import { Skills } from "./pages/Skills"
import { About } from "./pages/About"
import { Contact } from "./pages/Contact"

function App() {
  return (
  <AuthProvider>
    <ThemeProvider defaultTheme="light" storageKey="ui-theme">
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<ProtectedRoute><Layout /></ProtectedRoute>}>
            <Route index element={<Home />} />
            <Route path="projects" element={<Projects />} />
            <Route path="project-tracker" element={<ProjectTracker />} />
            <Route path="blog" element={<Blog />} />
            <Route path="blog/:id" element={<BlogPostPage />} />
            <Route path="skills" element={<Skills />} />
            <Route path="about" element={<About />} />
            <Route path="contact" element={<Contact />} />
          </Route>
          <Route path="*" element={<BlankPage />} />
        </Routes>
      </Router>
      <Toaster />
    </ThemeProvider>
  </AuthProvider>
  )
}

export default App