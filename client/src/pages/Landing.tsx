import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import AuthModal from "@/components/AuthModal";
import ContactForm from "@/components/ContactForm";
import Layout from "@/components/Layout";
import { usePortfolio } from "@/hooks/usePortfolio";
import {
  Code,
  Smartphone,
  Cloud,
  TrendingUp,
  Shield,
  HeadphonesIcon,
  Check,
  Star,
  Mail,
  Phone,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  Calendar,
} from "lucide-react";

export default function Landing() {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const { portfolio, isLoading: portfolioLoading } = usePortfolio();

  // Manejar navegación automática cuando hay hash en la URL
  useEffect(() => {
    const hash = window.location.hash.replace('#', '');
    if (hash) {
      // Pequeño delay para asegurar que el DOM esté listo
      setTimeout(() => {
        const element = document.getElementById(hash);
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, []);
  

  const openAuthModal = (mode: "login" | "register") => {
    setAuthMode(mode);
    setShowAuthModal(true);
  };

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  const services = [
    {
      icon: Code,
      title: "Aplicaciones Web",
      description: "Desarrollo de aplicaciones web modernas con React, Node.js y las últimas tecnologías.",
      features: ["Single Page Applications (SPA)", "APIs RESTful", "Base de datos PostgreSQL"],
    },
    {
      icon: Smartphone,
      title: "Apps Móviles",
      description: "Aplicaciones móviles nativas e híbridas para iOS y Android con diseño intuitivo.",
      features: ["React Native", "Notificaciones Push", "Integración con APIs"],
    },
    {
      icon: Cloud,
      title: "Cloud & DevOps",
      description: "Implementación en la nube con arquitecturas escalables y seguras.",
      features: ["AWS / Google Cloud", "Docker & Kubernetes", "CI/CD Pipeline"],
    },
    {
      icon: TrendingUp,
      title: "Business Intelligence",
      description: "Dashboards y reportes inteligentes para la toma de decisiones estratégicas.",
      features: ["Visualizaciones avanzadas", "Reportes automatizados", "Integración de datos"],
    },
    {
      icon: Shield,
      title: "Ciberseguridad",
      description: "Protegemos tu aplicación con las mejores prácticas de seguridad.",
      features: ["Autenticación JWT", "Encriptación SSL", "Auditorías de seguridad"],
    },
    {
      icon: HeadphonesIcon,
      title: "Soporte & Mantenimiento",
      description: "Soporte técnico continuo y mantenimiento preventivo de tus aplicaciones.",
      features: ["Soporte 24/7", "Actualizaciones regulares", "Monitoreo proactivo"],
    },
  ];

  return (
    <Layout onAuthClick={openAuthModal}>
      {/* Hero Section */}
      <section id="inicio" className="pt-24 pb-16 px-4 sm:px-6 lg:px-8 gradient-bg relative overflow-hidden">
        <div className="absolute inset-0 bg-primary/5"></div>
        <div className="max-w-7xl mx-auto relative z-10">
          <motion.div 
            className="text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="font-sans text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-6 tracking-tight drop-shadow-2xl">
              <span className="block text-white font-extrabold drop-shadow-2xl">Desarrollo de Software</span>
              <span className="block text-white font-extrabold drop-shadow-2xl">a Medida</span>
            </h1>
            <p className="text-xl sm:text-2xl text-white mb-8 max-w-3xl mx-auto leading-relaxed font-semibold drop-shadow-xl">
              Transformamos tus ideas en aplicaciones web y móviles profesionales. 
              Compra completa o únete como partner y genera ingresos.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Button 
                size="lg"
                onClick={() => scrollToSection('contacto')}
                className="bg-white text-primary hover:bg-gray-100 hover:text-primary transition-all duration-200 transform hover:scale-105 font-semibold shadow-lg px-8 py-3"
                data-testid="button-quote"
              >
                Solicitar Cotización
              </Button>
              <Button 
                size="lg"
                onClick={() => scrollToSection('precios')}
                className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary transition-all duration-200 font-semibold backdrop-blur-sm px-8 py-3 shadow-lg"
                data-testid="button-pricing"
              >
                Ver Modalidades
              </Button>
            </div>
          </motion.div>

          {/* Hero Stats */}
          <motion.div 
            className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div className="text-center glass-effect p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">50+</div>
              <div className="text-white/90 font-medium drop-shadow-sm">Proyectos Completados</div>
            </div>
            <div className="text-center glass-effect p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">98%</div>
              <div className="text-white/90 font-medium drop-shadow-sm">Satisfacción del Cliente</div>
            </div>
            <div className="text-center glass-effect p-6 rounded-lg">
              <div className="text-3xl font-bold text-white mb-2 drop-shadow-md">24/7</div>
              <div className="text-white/90 font-medium drop-shadow-sm">Soporte Técnico</div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Services Section */}
      <section id="servicios" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Nuestros Servicios
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Ofrecemos soluciones tecnológicas completas para hacer crecer tu negocio
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl group hover-lift bg-card/80 backdrop-blur-sm border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors duration-300">
                      <service.icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-6">{service.description}</p>
                    <ul className="space-y-2">
                      {service.features.map((feature, featureIndex) => (
                        <li key={featureIndex} className="flex items-center text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-primary mr-2 flex-shrink-0" />
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Portfolio Section */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Nuestros Últimos Trabajos
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-medium">
              Conoce algunos de los proyectos exitosos que hemos desarrollado para nuestros clientes
            </p>
          </motion.div>

          <motion.div 
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
          >
            {portfolioLoading ? (
              // Loading skeletons
              Array.from({ length: 6 }).map((_, index) => (
                <div key={index} className="rounded-xl bg-card border border-border/50 overflow-hidden">
                  <div className="aspect-video bg-muted animate-pulse"></div>
                  <div className="p-6 space-y-3">
                    <div className="flex justify-between">
                      <div className="h-6 bg-muted rounded animate-pulse w-20"></div>
                      <div className="flex space-x-2">
                        <div className="h-5 bg-muted rounded animate-pulse w-12"></div>
                        <div className="h-5 bg-muted rounded animate-pulse w-16"></div>
                      </div>
                    </div>
                    <div className="h-6 bg-muted rounded animate-pulse w-3/4"></div>
                    <div className="h-16 bg-muted rounded animate-pulse"></div>
                    <div className="flex justify-between">
                      <div className="h-4 bg-muted rounded animate-pulse w-32"></div>
                      <div className="h-8 bg-muted rounded animate-pulse w-20"></div>
                    </div>
                  </div>
                </div>
              ))
            ) : portfolio && portfolio.length > 0 ? (
              // Dynamic portfolio items
              portfolio.filter(item => item.isActive).slice(0, 6).map((item, index) => {
                const technologies = JSON.parse(item.technologies || '[]');
                return (
                  <div key={item.id} className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover-lift">
                    <div className="aspect-video overflow-hidden">
                      <img 
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        onError={(e) => {
                          e.currentTarget.src = "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop";
                        }}
                      />
                    </div>
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <Badge variant="secondary" className="bg-primary/10 text-primary">{item.category}</Badge>
                        <div className="flex space-x-2">
                          {technologies.slice(0, 2).map((tech: string, techIndex: number) => (
                            <Badge key={techIndex} variant="outline" className="text-xs">{tech}</Badge>
                          ))}
                        </div>
                      </div>
                      <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                      <p className="text-sm text-muted-foreground mb-4 line-clamp-3">
                        {item.description}
                      </p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-muted-foreground">
                          Completado en {new Date(item.completedAt).getFullYear()}
                        </span>
                        {item.demoUrl ? (
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            className="text-primary hover:text-primary/80"
                            onClick={() => window.open(item.demoUrl!, '_blank')}
                          >
                            Ver demo →
                          </Button>
                        ) : (
                          <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                            Ver detalles →
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // Fallback static items
              [
                {
                  image: "https://images.unsplash.com/photo-1563986768609-322da13575f3?w=600&h=400&fit=crop",
                  category: "E-commerce",
                  technologies: ["React", "Node.js"],
                  title: "Tienda Online Premium",
                  description: "Plataforma completa de e-commerce con carrito de compras, pagos integrados y panel administrativo.",
                  year: "2024"
                },
                {
                  image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
                  category: "Dashboard",
                  technologies: ["Vue.js", "Python"],
                  title: "Panel de Analytics",
                  description: "Dashboard interactivo con métricas en tiempo real, reportes automatizados y visualizaciones avanzadas.",
                  year: "2024"
                },
                {
                  image: "https://images.unsplash.com/photo-1512941937669-90a1b58e7e9c?w=600&h=400&fit=crop",
                  category: "Mobile App",
                  technologies: ["React Native", "Firebase"],
                  title: "App de Delivery",
                  description: "Aplicación móvil completa para delivery con geolocalización, pagos y seguimiento en tiempo real.",
                  year: "2023"
                },
                {
                  image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
                  category: "CRM",
                  technologies: ["Angular", "PostgreSQL"],
                  title: "Sistema CRM Empresarial",
                  description: "Plataforma de gestión de clientes con automatización de ventas y seguimiento de leads.",
                  year: "2023"
                },
                {
                  image: "https://images.unsplash.com/photo-1551434678-e076c223a692?w=600&h=400&fit=crop",
                  category: "E-learning",
                  technologies: ["Next.js", "MongoDB"],
                  title: "Plataforma Educativa",
                  description: "Sistema de aprendizaje online con videos, evaluaciones y certificaciones automáticas.",
                  year: "2023"
                },
                {
                  image: "https://images.unsplash.com/photo-1518186285589-2f7649de83e0?w=600&h=400&fit=crop",
                  category: "Cloud",
                  technologies: ["AWS", "Docker"],
                  title: "Infraestructura Cloud",
                  description: "Migración completa a la nube con arquitectura escalable y alta disponibilidad.",
                  year: "2024"
                }
              ].map((item, index) => (
                <div key={index} className="group relative overflow-hidden rounded-xl bg-card border border-border/50 hover:border-primary/50 transition-all duration-300 hover:shadow-xl hover-lift">
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  </div>
                  <div className="p-6">
                    <div className="flex items-center justify-between mb-3">
                      <Badge variant="secondary" className="bg-primary/10 text-primary">{item.category}</Badge>
                      <div className="flex space-x-2">
                        {item.technologies.map((tech, techIndex) => (
                          <Badge key={techIndex} variant="outline" className="text-xs">{tech}</Badge>
                        ))}
                      </div>
                    </div>
                    <h3 className="text-lg font-semibold text-foreground mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      {item.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">Completado en {item.year}</span>
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary/80">
                        Ver detalles →
                      </Button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </motion.div>

          <motion.div 
            className="text-center mt-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <p className="text-muted-foreground mb-6">
              ¿Quieres ver tu proyecto aquí? Contáctanos y hagamos realidad tu idea.
            </p>
            <Button 
              onClick={() => scrollToSection('contacto')}
              className="bg-primary text-white hover:bg-primary/90 font-semibold"
            >
              Comenzar mi Proyecto
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Pricing Section */}
      <section id="precios" className="py-16 px-4 sm:px-6 lg:px-8 bg-muted/30">
        <div className="max-w-7xl mx-auto">
          <motion.div 
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              Modalidades de Trabajo
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Elige la modalidad que mejor se adapte a tus necesidades y objetivos
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {/* Compra Completa */}
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:border-primary/50 transition-all duration-300 hover:shadow-xl">
                <CardHeader>
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Compra Completa</CardTitle>
                    <Badge variant="secondary">Tradicional</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Recibe el código fuente completo y propiedad total del proyecto
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      $2,500 - $15,000
                      <span className="text-lg font-normal text-muted-foreground ml-2">USD</span>
                    </div>
                    <p className="text-sm text-muted-foreground">Precio según complejidad</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {[
                      "Código fuente completo incluido",
                      "Propiedad intelectual total", 
                      "Documentación técnica completa",
                      "3 meses de soporte incluido",
                      "Capacitación del equipo",
                      "Deployment en tu servidor"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <CheckCircle className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-primary text-white hover:bg-primary/90 font-semibold shadow-md" 
                    onClick={() => scrollToSection('contacto')}
                    data-testid="button-contact-complete"
                  >
                    Solicitar Cotización
                  </Button>
                </CardContent>
              </Card>
            </motion.div>

            {/* Partnership */}
            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              viewport={{ once: true }}
            >
              <Card className="h-full border-2 border-primary hover:border-primary/70 transition-all duration-300 hover:shadow-xl relative">
                {/* Popular Badge */}
                <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                  <Badge className="bg-primary text-primary-foreground">
                    Más Popular
                  </Badge>
                </div>

                <CardHeader className="pt-8">
                  <div className="flex items-center justify-between mb-4">
                    <CardTitle className="text-2xl">Partnership</CardTitle>
                    <Badge variant="outline" className="border-primary text-primary">Innovador</Badge>
                  </div>
                  <p className="text-muted-foreground">
                    Paga menos, conviértete en partner y genera ingresos revendendolo
                  </p>
                </CardHeader>
                <CardContent>
                  <div className="mb-6">
                    <div className="text-3xl font-bold text-primary mb-2">
                      40% - 60%
                      <span className="text-lg font-normal text-muted-foreground ml-2">Descuento</span>
                    </div>
                    <p className="text-sm text-muted-foreground">+ comisiones por ventas</p>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {[
                      "Precio reducido inicial",
                      "Código de referido único",
                      "20-40% comisión por venta",
                      "Dashboard de ganancias",
                      "Sistema de licencias",
                      "Soporte y marketing incluido"
                    ].map((feature, index) => (
                      <li key={index} className="flex items-start">
                        <Star className="h-5 w-5 text-primary mt-0.5 mr-3 flex-shrink-0" />
                        <span className="text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button 
                    className="w-full bg-primary text-white hover:bg-primary/90 font-semibold shadow-md" 
                    onClick={() => scrollToSection('contacto')}
                    data-testid="button-contact-partner"
                  >
                    Convertirse en Partner
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Additional Info */}
          <motion.div 
            className="mt-12 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card className="inline-block">
              <CardContent className="p-6">
                <p className="text-sm text-muted-foreground mb-2">
                  💡 <strong>Facturación A disponible</strong> para mayor confianza empresarial
                </p>
                <p className="text-sm text-muted-foreground">
                  Todos los proyectos incluyen garantía de 6 meses y actualizaciones de seguridad
                </p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contacto" className="py-16 px-4 sm:px-6 lg:px-8 bg-background">
        <div className="max-w-4xl mx-auto">
          <motion.div 
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <h2 className="font-sans text-3xl sm:text-4xl font-bold text-foreground mb-4 tracking-tight">
              ¿Listo para comenzar?
            </h2>
            <p className="text-xl text-muted-foreground">
              Cuéntanos sobre tu proyecto y te responderemos en menos de 24 horas
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
          >
            <Card>
              <CardContent className="p-8">
                <ContactForm />
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-muted/30 py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            {/* Company Info */}
            <div className="col-span-1 md:col-span-2">
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <Code className="h-4 w-4 text-primary-foreground" />
                </div>
                <span className="text-xl font-bold text-foreground">SoftwarePar</span>
              </div>
              <p className="text-muted-foreground mb-6 max-w-md">
                Especialistas en desarrollo de software a medida en Argentina. 
                Transformamos ideas en aplicaciones exitosas.
              </p>
              <div className="flex space-x-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-linkedin text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-twitter text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-github text-xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                  <i className="fab fa-instagram text-xl"></i>
                </a>
              </div>
            </div>

            {/* Services */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Servicios</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li><a href="#" className="hover:text-primary transition-colors">Aplicaciones Web</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Apps Móviles</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Cloud & DevOps</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Business Intelligence</a></li>
                <li><a href="#" className="hover:text-primary transition-colors">Ciberseguridad</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="text-foreground font-semibold mb-4">Contacto</h4>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <Mail className="h-4 w-4 mr-2 text-primary" />
                  info@softwarepar.lat
                </li>
                <li className="flex items-center">
                  <Phone className="h-4 w-4 mr-2 text-primary" />
                  +54 11 1234-5678
                </li>
                <li className="flex items-center">
                  <MapPin className="h-4 w-4 mr-2 text-primary" />
                  Buenos Aires, Argentina
                </li>
                <li className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-primary" />
                  Lun - Vie: 9:00 - 18:00
                </li>
              </ul>
            </div>
          </div>

          {/* Payment Methods & Partners */}
          <div className="border-t border-border mt-12 pt-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
              {/* QR AFIP */}
              <div className="text-center lg:text-left">
                <h5 className="text-foreground font-semibold mb-3">Facturación Legal</h5>
                <div className="flex items-center justify-center lg:justify-start space-x-4">
                  <div className="w-16 h-16 bg-white p-2 rounded-lg border">
                    <img 
                      src="https://www.afip.gob.ar/images/f960/AFIP.jpg" 
                      alt="QR AFIP" 
                      className="w-full h-full object-contain"
                      onError={(e) => {
                        e.currentTarget.src = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='64' height='64' viewBox='0 0 24 24' fill='none' stroke='%23333' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Crect x='3' y='3' width='18' height='18' rx='2' ry='2'/%3E%3Cpath d='m9 9 3 3 3-3M12 12v9'/%3E%3C/svg%3E";
                      }}
                    />
                  </div>
                  <div className="text-sm text-muted-foreground">
                    <p>Inscripto en AFIP</p>
                    <p>Monotributo</p>
                    <p>CUIT: 27-12345678-9</p>
                  </div>
                </div>
              </div>

              {/* Payment Methods */}
              <div className="text-center">
                <h5 className="text-foreground font-semibold mb-3">Medios de Pago</h5>
                <div className="flex items-center justify-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <img 
                      src="https://logoeps.com/wp-content/uploads/2013/03/visa-vector-logo.png" 
                      alt="Visa" 
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <img 
                      src="https://logos-world.net/wp-content/uploads/2020/09/Mastercard-Logo.png" 
                      alt="Mastercard" 
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <img 
                      src="https://logoeps.com/wp-content/uploads/2014/01/american-express-vector-logo.png" 
                      alt="American Express" 
                      className="h-8 object-contain"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                  </div>
                </div>
                <div className="mt-2">
                  <Badge variant="outline" className="text-xs">
                    Mercado Pago
                  </Badge>
                  <Badge variant="outline" className="text-xs ml-2">
                    Transferencia
                  </Badge>
                </div>
              </div>

              {/* Technology Partners */}
              <div className="text-center lg:text-right">
                <h5 className="text-foreground font-semibold mb-3">Partners Tecnológicos</h5>
                <div className="flex items-center justify-center lg:justify-end space-x-4">
                  <div className="flex flex-col items-center space-y-2">
                    <div className="flex items-center space-x-3">
                      <img 
                        src="https://cdn.worldvectorlogo.com/logos/aws-2.svg" 
                        alt="AWS" 
                        className="h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <img 
                        src="https://cdn.worldvectorlogo.com/logos/google-cloud-1.svg" 
                        alt="Google Cloud" 
                        className="h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                      <img 
                        src="https://cdn.worldvectorlogo.com/logos/microsoft-azure-2.svg" 
                        alt="Microsoft Azure" 
                        className="h-8 object-contain"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        Replit Partner
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        Vercel Partner
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="border-t border-border mt-8 pt-8 text-center text-muted-foreground">
            <p>&copy; 2024 SoftwarePar. Todos los derechos reservados.</p>
            <p className="mt-2">
              <a href="/terminos" className="hover:text-primary transition-colors">Términos de Servicio</a>
              <span className="mx-2">•</span>
              <a href="/privacidad" className="hover:text-primary transition-colors">Política de Privacidad</a>
              <span className="mx-2">•</span>
              <a href="/cookies" className="hover:text-primary transition-colors">Cookies</a>
            </p>
          </div>
        </div>
      </footer>

      <AuthModal 
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
        mode={authMode}
        onModeChange={setAuthMode}
      />
    </Layout>
  );
}
