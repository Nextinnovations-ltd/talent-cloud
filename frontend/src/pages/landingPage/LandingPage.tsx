import { useEffect, useState, useRef } from "react"
import { motion, useScroll, useTransform, AnimatePresence, useMotionValue } from "framer-motion"
import {
  Globe,
  ArrowRight,
  Menu,
  X,
  Check,
  Building,
  Users,
  Briefcase,
  Shield,
  FileText,
  Clock,
  Search,
  MapPin,
  Star,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import { Card, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Link } from "react-router-dom"
import SVG from "@/assets/Login/talent_svg.svg"
import SVGLogo from "@/assets/Login/talent_logo.svg"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"




export default function LandingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [scrollY, setScrollY] = useState(0)
  const { scrollYProgress } = useScroll()
  const [searchQuery, setSearchQuery] = useState("")
  const heroRef = useRef(null)
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_mousePosition, setMousePosition] = useState({ x: 0, y: 0 })
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [_cursorVariant, setCursorVariant] = useState("default")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedLocation, setSelectedLocation] = useState("all")

  // Cursor animations
  const cursorX = useMotionValue(-100)
  const cursorY = useMotionValue(-100)


  // Parallax effect for hero section
  const y = useTransform(scrollYProgress, [0, 0.5], [0, 300])
  const opacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const scale = useTransform(scrollYProgress, [0, 0.2], [1, 0.95])

  // Text reveal animation
  const textReveal = {
    hidden: { y: 100, opacity: 0 },
    visible: (i = 0) => ({
      y: 0,
      opacity: 1,
      transition: {
        delay: 0.1 * i,
        duration: 0.8,
        ease: [0.215, 0.61, 0.355, 1],
      },
    }),
  }

  // Handle scroll for navbar transparency
  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  // Handle mouse movement for custom cursor
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e
      cursorX.set(clientX - 16)
      cursorY.set(clientY - 16)
      setMousePosition({ x: clientX, y: clientY })
    }

    window.addEventListener("mousemove", handleMouseMove)
    return () => window.removeEventListener("mousemove", handleMouseMove)
  }, [cursorX, cursorY])



  const enterButton = () => setCursorVariant("button")
  const enterText = () => setCursorVariant("text")
  const leaveButton = () => setCursorVariant("default")
  const leaveText = () => setCursorVariant("default")

  // Sample job data
  const jobs = [
    {
      id: 1,
      title: "Senior Frontend Developer",
      company: "TechCorp Global",
      location: "Yangon",
      type: "Full-time",
      category: "frontend",
      salary: "$800-1200",
      skills: ["React", "TypeScript", "Next.js"],
      description: "Join our global team to build cutting-edge web applications using modern React ecosystem.",
      rating: 4.8,
      applicants: 12,
    },
    {
      id: 2,
      title: "UI/UX Designer",
      company: "DesignStudio Inc",
      location: "Mandalay",
      type: "Full-time",
      category: "design",
      salary: "$600-900",
      skills: ["Figma", "Adobe XD", "Prototyping"],
      description: "Create beautiful and intuitive user experiences for international clients.",
      rating: 4.9,
      applicants: 8,
    },
    {
      id: 3,
      title: "Full Stack Developer",
      company: "StartupXYZ",
      location: "Yangon",
      type: "Contract",
      category: "fullstack",
      salary: "$1000-1500",
      skills: ["Python", "Django", "React", "PostgreSQL"],
      description: "Build scalable web applications from frontend to backend for our growing startup.",
      rating: 4.7,
      applicants: 15,
    },
    {
      id: 4,
      title: "Mobile App Developer",
      company: "MobileFirst Ltd",
      location: "Remote",
      type: "Part-time",
      category: "mobile",
      salary: "$500-800",
      skills: ["React Native", "Flutter", "iOS", "Android"],
      description: "Develop cross-platform mobile applications for international markets.",
      rating: 4.6,
      applicants: 6,
    },
    {
      id: 5,
      title: "Backend Developer",
      company: "CloudTech Solutions",
      location: "Yangon",
      type: "Full-time",
      category: "backend",
      salary: "$700-1100",
      skills: ["Node.js", "Express", "MongoDB", "AWS"],
      description: "Build robust backend systems and APIs for enterprise-level applications.",
      rating: 4.8,
      applicants: 10,
    },
    {
      id: 6,
      title: "Graphic Designer",
      company: "Creative Agency",
      location: "Mandalay",
      type: "Full-time",
      category: "design",
      salary: "$400-700",
      skills: ["Photoshop", "Illustrator", "InDesign"],
      description: "Create stunning visual designs for digital and print media for global brands.",
      rating: 4.5,
      applicants: 9,
    },
  ]

  // Filter jobs based on search criteria
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.company.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()))
    const matchesCategory = selectedCategory === "all" || job.category === selectedCategory
    const matchesLocation = selectedLocation === "all" || job.location.toLowerCase() === selectedLocation.toLowerCase()

    return matchesSearch && matchesCategory && matchesLocation
  })

 

  return (
    <div className="relative overflow-hidden bg-white">
      {/* Custom cursor */}

      {/* Navigation */}
      <header
        className={`fixed top-0 w-full z-40 transition-all duration-500 ${
          scrollY > 50 ? "bg-white/90 backdrop-blur-md shadow-sm" : "bg-transparent"
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 md:py-6">
            <div className="flex items-center">
              <Link to="/" className="flex items-center space-x-2">
                <img
                  src={SVGLogo || "/placeholder.svg"}
                  alt="Clouds in the sky"
                  className="object-cover w-[50px] object-center"
                />
              </Link>
            </div>

            {/* Desktop navigation */}
            <nav className="hidden md:flex items-center space-x-8">
              <Link
                to="#services"
                className={`text-sm font-medium ${scrollY > 50 ? "text-gray-700 hover:text-[oklch(48.8%_0.243_264.376)]" : "text-white/90 hover:text-white"}`}
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                Services
              </Link>
              <Link
                to="#how-it-works"
                className={`text-sm font-medium ${scrollY > 50 ? "text-gray-700 hover:text-[oklch(48.8%_0.243_264.376)]" : "text-white/90 hover:text-white"}`}
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                How It Works
              </Link>
              <Link
                to="#faq"
                className={`text-sm font-medium ${scrollY > 50 ? "text-gray-700 hover:text-[oklch(48.8%_0.243_264.376)]" : "text-white/90 hover:text-white"}`}
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                FAQ
              </Link>
              <Link
                to="#success-story"
                className={`text-sm font-medium ${scrollY > 50 ? "text-gray-700 hover:text-[oklch(48.8%_0.243_264.376)]" : "text-white/90 hover:text-white"}`}
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                Success Story
              </Link>
              <Button
               onClick={()=>{window.location.href = "/auth/login"}}
                variant={scrollY > 50 ? "default" : "outline"}
                className={
                  scrollY > 50
                    ? "bg-[oklch(48.8%_0.243_264.376)] hover:bg-[oklch(45%_0.243_264.376)]"
                    : "border-white text-black hover:bg-white/20"
                }
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Contact Us
              </Button>
            </nav>

            {/* Mobile menu button */}
            <div className="md:hidden">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMenuOpen(true)}
                className={scrollY > 50 ? "text-gray-900" : "text-white"}
              >
                <Menu className="h-6 w-6" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            className="fixed inset-0 z-50 bg-white"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            <div className="flex justify-end p-4">
              <Button variant="ghost" size="icon" onClick={() => setIsMenuOpen(false)}>
                <X className="h-6 w-6" />
              </Button>
            </div>
            <nav className="flex flex-col items-center justify-center h-full space-y-8">
              <Link
                to="#services"
                className="text-2xl font-medium text-gray-900 hover:text-[oklch(48.8%_0.243_264.376)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Services
              </Link>
              <Link
                to="#how-it-works"
                className="text-2xl font-medium text-gray-900 hover:text-[oklch(48.8%_0.243_264.376)]"
                onClick={() => setIsMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                to="#faq"
                className="text-2xl font-medium text-gray-900 hover:text-[oklch(48.8%_0.243_264.376)]"
                onClick={() => setIsMenuOpen(false)}
              >
                FAQ
              </Link>
              <Link
                to="#success-story"
                className="text-2xl font-medium text-gray-900 hover:text-[oklch(48.8%_0.243_264.376)]"
                onClick={() => setIsMenuOpen(false)}
              >
                Success Story
              </Link>
              <Button className="mt-4 bg-[oklch(48.8%_0.243_264.376)] hover:bg-[oklch(45%_0.243_264.376)]">
                Contact Us
              </Button>
            </nav>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero Section */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center overflow-hidden">
        {/* Background image with parallax effect */}
        <motion.div className="absolute inset-0 z-0" style={{ y, opacity, scale }}>
          <img
            src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/marc-wieland-zrj-TPjcRLA-unsplash.jpg-4QSiaItvU1h3RPHLctYdzxdTh8lOEV.jpeg"
            alt="Clouds in the sky"
            className="object-cover object-center"
          />
          <div className="absolute inset-0 bg-[oklch(48.8%_0.243_264.376)/0.7] mix-blend-multiply" />
        </motion.div>

        {/* Content */}
        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="inline-block px-4 py-2 mb-8 rounded-full bg-white/10 backdrop-blur-md border border-white/20"
          >
            <span className="text-black text-sm font-medium">Your Myanmar EOR Partner for Global IT Teams</span>
          </motion.div>

          <div className="overflow-hidden mb-4">
            <motion.h1
              variants={textReveal}
              initial="hidden"
              animate="visible"
              className="text-5xl md:text-7xl font-bold mb-8 leading-tight text-white"
            >
              Talent Cloud
            </motion.h1>
          </div>

          <div className="overflow-hidden mb-12">
            <motion.p
              variants={textReveal}
              initial="hidden"
              animate="visible"
              custom={1}
              className="text-xl md:text-2xl max-w-3xl mx-auto text-white/90 font-light"
            >
              Next Innovations for Local Talent. Global Reach. Seamless Compliance.
            </motion.p>
          </div>


          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20 flex flex-wrap justify-center gap-6"
          >
            {["Local Best Talents", "HR/Payroll Support", "Legal Compliance", "Workplace/Office Assets Support"].map(
              (item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 + i * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  whileHover={{ y: -5, backgroundColor: "rgba(255, 255, 255, 0.2)" }}
                  className="px-6 py-3 bg-white/10 backdrop-blur-md rounded-full border border-white/20 flex items-center gap-2 text-white/90"
                  onMouseEnter={enterText}
                  onMouseLeave={leaveText}
                >
                  {item}
                </motion.div>
              ),
            )}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-10 left-0 right-0 flex justify-center"
        >
          <div className="w-8 h-14 border-2 border-white/50 rounded-full flex justify-center">
            <div className="w-1 h-3 bg-white rounded-full mt-3 animate-bounce"></div>
          </div>
        </motion.div>
      </section>

       {/* Job Search Section */}
       <section id="jobs" className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-gray-50 via-white to-blue-50/30">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-8"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-[oklch(48.8%_0.243_264.376)]/10 rounded-full mb-4">
              <Briefcase className="h-4 w-4 text-[oklch(48.8%_0.243_264.376)]" />
              <span className="text-sm font-medium text-[oklch(48.8%_0.243_264.376)]">Featured Opportunities</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-3 text-gray-900">
              Find Your <span className="text-[oklch(48.8%_0.243_264.376)]">Dream Job</span>
            </h2>
            <p className="text-gray-600 max-w-xl mx-auto">Join global teams through our trusted EOR platform</p>
          </motion.div>

          {/* Elegant Search Interface */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-8"
          >
            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(48.8%_0.243_264.376)]/20 to-blue-500/20 rounded-2xl blur-xl"></div>
              <Card className="relative p-3 shadow-xl border-0 bg-white/80 backdrop-blur-sm rounded-2xl">
                <div className="grid grid-cols-1 md:grid-cols-6 gap-2">
                  <div className="relative md:col-span-2">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search jobs, skills..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10 border-0 bg-gray-50/50 focus:bg-white transition-colors"
                    />
                  </div>

                  <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                    <SelectTrigger className="border-0 bg-gray-50/50 focus:bg-white">
                      <SelectValue placeholder="Category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Categories</SelectItem>
                      <SelectItem value="frontend">Frontend</SelectItem>
                      <SelectItem value="backend">Backend</SelectItem>
                      <SelectItem value="fullstack">Full Stack</SelectItem>
                      <SelectItem value="mobile">Mobile</SelectItem>
                      <SelectItem value="design">Design</SelectItem>
                    </SelectContent>
                  </Select>

                  <Select value={selectedLocation} onValueChange={setSelectedLocation}>
                    <SelectTrigger className="border-0 bg-gray-50/50 focus:bg-white">
                      <SelectValue placeholder="Location" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Locations</SelectItem>
                      <SelectItem value="yangon">Yangon</SelectItem>
                      <SelectItem value="mandalay">Mandalay</SelectItem>
                      <SelectItem value="remote">Remote</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    className="md:col-span-2 bg-gradient-to-r from-[oklch(48.8%_0.243_264.376)] to-blue-600 hover:from-[oklch(45%_0.243_264.376)] hover:to-blue-700 shadow-lg hover:shadow-xl transition-all duration-300"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    <Search className="h-4 w-4 mr-2" />
                    Find Jobs
                  </Button>
                </div>
              </Card>
            </div>
          </motion.div>

          {/* Job Stats */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="flex justify-center items-center gap-6 mb-6 text-sm text-gray-600"
          >
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span>{filteredJobs.length} Active Jobs</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4" />
              <span>50+ Companies</span>
            </div>
            <div className="w-1 h-4 bg-gray-300"></div>
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              <span>200+ Hired</span>
            </div>
          </motion.div>

          {/* Featured Jobs Grid */}
          <div className="grid gap-3">
            {filteredJobs.slice(0, 3).map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -2, scale: 1.01 }}
                className="group"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                <Card className="relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white/90 backdrop-blur-sm">
                  {/* Gradient accent */}
                  <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[oklch(48.8%_0.243_264.376)] to-blue-500"></div>

                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <div className="w-10 h-10 bg-gradient-to-br from-[oklch(48.8%_0.243_264.376)]/20 to-blue-500/20 rounded-lg flex items-center justify-center">
                            <Briefcase className="h-5 w-5 text-[oklch(48.8%_0.243_264.376)]" />
                          </div>
                          <div>
                            <h3 className="font-bold text-gray-900 text-lg leading-tight">{job.title}</h3>
                            <p className="text-[oklch(48.8%_0.243_264.376)] font-medium text-sm">{job.company}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-1 bg-yellow-50 px-2 py-1 rounded-full">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span className="text-xs font-medium text-yellow-700">{job.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mb-3 text-xs text-gray-600">
                      <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-full">
                        <MapPin className="h-3 w-3" />
                        <span>{job.location}</span>
                      </div>
                      <Badge variant="secondary" className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                        {job.type}
                      </Badge>
                      <div className="flex items-center gap-1 bg-green-100 px-2 py-1 rounded-full">
                        <span className="text-green-700 font-medium">{job.salary}/mo</span>
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-1 mb-4">
                      {job.skills.slice(0, 3).map((skill, i) => (
                        <span
                          key={i}
                          className="px-2 py-1 bg-[oklch(48.8%_0.243_264.376)]/10 text-[oklch(48.8%_0.243_264.376)] rounded-md text-xs font-medium"
                        >
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 3 && (
                        <span className="px-2 py-1 bg-gray-100 text-gray-600 rounded-md text-xs">
                          +{job.skills.length - 3}
                        </span>
                      )}
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-xs text-gray-500 flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {job.applicants} applied
                      </span>
                      <div className="flex gap-2">
                        <Button variant="ghost" size="sm" className="text-xs h-8 px-3 hover:bg-gray-100">
                          Save
                        </Button>
                        <Button
                          size="sm"
                          className="text-xs h-8 px-4 bg-gradient-to-r from-[oklch(48.8%_0.243_264.376)] to-blue-600 hover:from-[oklch(45%_0.243_264.376)] hover:to-blue-700 shadow-sm"
                        >
                          Apply
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* View All Jobs CTA */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mt-6"
          >
            <div className="relative inline-block">
              <div className="absolute inset-0 bg-gradient-to-r from-[oklch(48.8%_0.243_264.376)]/20 to-blue-500/20 rounded-full blur-lg"></div>
              <Button
                variant="outline"
                size="lg"
                className="relative border-2 border-[oklch(48.8%_0.243_264.376)]/30 text-[oklch(48.8%_0.243_264.376)] hover:bg-[oklch(48.8%_0.243_264.376)] hover:text-white hover:border-[oklch(48.8%_0.243_264.376)] transition-all duration-300 shadow-lg hover:shadow-xl"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Explore All {jobs.length} Opportunities
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
            <p className="text-xs text-gray-500 mt-2">New jobs added daily • Apply with one click</p>
          </motion.div>
        </div>
      </section>

      {/* What is Talent Cloud Section */}
      <section id="about" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[oklch(48.8%_0.243_264.376)]">
              What is Talent Cloud?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Hire Top Developers & Designers in Myanmar — Without Setting Up a Local Entity
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="prose prose-lg max-w-none text-gray-600"
            onMouseEnter={enterText}
            onMouseLeave={leaveText}
          >
            <p>
              Talent Cloud is a trusted Employer of Record (EOR) platform in Myanmar, purpose-built to help global
              companies hire IT professionals—from skilled developers to world-class designers—with full compliance, HR
              support, and infrastructure setup.
            </p>
            <p>
              We take care of everything from legal employment and payroll to workplace setup and asset provisioning, so
              you can focus on scaling your business with top-tier talent from Myanmar.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Why Choose Talent Cloud Section */}
      <section id="services" className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-center mb-20 text-[oklch(48.8%_0.243_264.376)]"
          >
            Why Choose Talent Cloud?
          </motion.h2>

          <div className="grid md:grid-cols-3 gap-12">
            {[
              {
                icon: <Building className="h-8 w-8" />,
                title: "Hire Without a Local Entity",
                description: "No need to open an office in Myanmar—we act as your legal employer.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Specialized in IT Talent",
                description:
                  "We focus exclusively on sourcing and managing Developers, UI/UX designers, and digital creatives.",
              },
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: "Workplace & Equipment Support",
                description:
                  "Need your remote hire to have a laptop, monitor, desk, and a stable internet connection? We take care of all office and asset logistics.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Full HR & Payroll Compliance",
                description: "We manage salaries, benefits and ensure full legal compliance with Myanmar labor laws.",
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "Reliable Legal Infrastructure",
                description:
                  "We handle employment documentations, onboarding, office automation, off boarding, termination, and everything — minimizing your risk and workload.",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Ongoing Management",
                description: "We're your on-the-ground partner in Myanmar—responsive, professional, and proactive.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className="group relative"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                <div className="relative h-full rounded-2xl overflow-hidden transition-all duration-300 bg-white p-8 border border-[oklch(48.8%_0.243_264.376)/0.1] shadow-sm">
                  <div className="absolute top-0 left-0 w-full h-1 bg-[oklch(48.8%_0.243_264.376)] opacity-70"></div>
                  <motion.div
                    whileHover={{ scale: 1.1 }}
                    className="text-5xl mb-6 p-4 inline-block bg-[oklch(48.8%_0.243_264.376)/0.1] rounded-2xl text-[oklch(48.8%_0.243_264.376)]"
                  >
                    {item.icon}
                  </motion.div>
                  <h3 className="text-2xl font-bold mb-4 text-gray-900">{item.title}</h3>
                  <p className="text-gray-600 mb-6">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* What We Offer Section */}
      <section id="how-it-works" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-[oklch(48.8%_0.243_264.376)]"
          >
            What We Offer
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={enterText}
            onMouseLeave={leaveText}
          >
            <Table className="border rounded-lg overflow-hidden">
              <TableHeader className="bg-[oklch(48.8%_0.243_264.376)/0.05]">
                <TableRow>
                  <TableHead className="font-bold text-lg text-[oklch(48.8%_0.243_264.376)]">Feature</TableHead>
                  <TableHead className="font-bold text-lg text-[oklch(48.8%_0.243_264.376)]">Description</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium">EOR Services</TableCell>
                  <TableCell>
                    We hire employees on your behalf and handle all legal employer responsibilities.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Talent Sourcing</TableCell>
                  <TableCell>Access a pre-vetted pool of IT professionals ready to work with global teams.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Workplace & Assets</TableCell>
                  <TableCell>
                    From laptops to workstations, we equip your hires with everything they need to perform.
                  </TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">HR & Admin Support</TableCell>
                  <TableCell>Time-off management, employee relations, and cultural integration support.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Payroll & Tax Compliance</TableCell>
                  <TableCell>On-time salary disbursement, local tax compliance, and statutory contributions.</TableCell>
                </TableRow>
                <TableRow>
                  <TableCell className="font-medium">Ongoing Management</TableCell>
                  <TableCell>
                    We're your on-the-ground partner in Myanmar—responsive, professional, and proactive.
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-20"
          >
            <h3 className="text-2xl font-bold mb-8 text-center text-gray-900">Popular Roles We Support</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {[
                "Frontend / Backend Developers",
                "Full-Stack Developers",
                "UI/UX Designers",
                "Web & Mobile App Developers",
                "Graphic Designers & Motion Artists",
                "DevOps / QA Engineers",
              ].map((role, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.1 * i, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                  className="flex items-start"
                  onMouseEnter={enterText}
                  onMouseLeave={leaveText}
                >
                  <div className="flex-shrink-0 h-6 w-6 rounded-full bg-[oklch(48.8%_0.243_264.376)/0.1] flex items-center justify-center text-[oklch(48.8%_0.243_264.376)] mr-3 mt-0.5">
                    <Check className="h-4 w-4" />
                  </div>
                  <span className="text-gray-700">{role}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Global Teams Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onMouseEnter={enterText}
              onMouseLeave={leaveText}
            >
              <h2 className="text-4xl md:text-5xl font-bold mb-8 text-[oklch(48.8%_0.243_264.376)]">
                Join Global Teams Already Powered by Myanmar Talent
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                With strong English proficiency, affordable rates, and high technical capability, Myanmar professionals
                are making their mark on the global digital economy.
              </p>
              <p className="text-xl text-gray-600 mb-8">Let Talent Cloud be your bridge to this untapped market.</p>
              <Button
                className="bg-[oklch(48.8%_0.243_264.376)] hover:bg-[oklch(45%_0.243_264.376)]"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Contact Us Today
              </Button>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="relative"
            >
              <div className="relative aspect-square max-w-md mx-auto">
                <div className="w-full h-full bg-white rounded-2xl shadow-xl border border-[oklch(48.8%_0.243_264.376)/0.1] flex items-center justify-center overflow-hidden p-8">
                  <img
                    src="/placeholder.svg?height=400&width=400"
                    alt="Myanmar IT professionals"
                    className="object-cover rounded-xl"
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

        {/* Applicant Benefits Section */}
        <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[#fafafa]">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-[oklch(48.8%_0.243_264.376)]">
              Applicant Benefits with Talent Cloud
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Join Global Teams. Work Locally. Thrive Professionally.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <Globe className="h-8 w-8" />,
                title: "Work with Global Companies",
                description:
                  "Get hired by international tech companies without leaving Myanmar. Build an international portfolio and gain experience on global projects.",
              },
              {
                icon: <Shield className="h-8 w-8" />,
                title: "Legally Secure Employment",
                description:
                  "Receive official employment contracts compliant with Myanmar labor law. Talent Cloud handles tax, social security (SSB), and legal documentation.",
              },
              {
                icon: <Users className="h-8 w-8" />,
                title: "Full HR Support",
                description:
                  "Smooth onboarding and documentation verification. Ongoing HR support: leave tracking, performance monitoring, and career guidance.",
              },
              {
                icon: <FileText className="h-8 w-8" />,
                title: "On-Time Salary & Benefits",
                description:
                  "Guaranteed monthly salary disbursement in MMK. Payslips, and statutory contributions provided transparently.",
              },
              {
                icon: <Briefcase className="h-8 w-8" />,
                title: "Workplace & Equipment Provided",
                description:
                  "Access to a fully equipped office space: desk, laptop, stable internet, etc. No need to worry about tech tools—Talent Cloud provides everything needed.",
              },
              {
                icon: <Clock className="h-8 w-8" />,
                title: "Supportive Work Environment",
                description:
                  "Work in a team with bilingual communication support (English, and Japanese). Talent Cloud HR does regular check-ins to support employee welfare.",
              },
              {
                icon: <ArrowRight className="h-8 w-8" />,
                title: "Career Growth Opportunities",
                description:
                  "Get exposed to global work culture and cutting-edge technologies. Opportunities for upskilling and collaborating with senior developers and designers abroad.",
              },
              {
                icon: <Check className="h-8 w-8" />,
                title: "Roles That Match Your Skills",
                description:
                  "Specialization in: Frontend / Backend / Full-Stack Developers, UI/UX Designers, Graphic Designers, Web & Mobile App Developers.",
              },
              {
                icon: <Building className="h-8 w-8" />,
                title: "Modern Tech Stack",
                description:
                  "Projects typically use: Python, Django, React, React Native, PHP, Laravel, WordPress, UI/UX Design tools.",
              },
            ].map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 60 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ delay: index * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -10 }}
                className="group relative"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                <Card className="h-full border border-[oklch(48.8%_0.243_264.376)/0.1] shadow-sm hover:shadow-md transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="absolute top-0 left-0 w-full h-1 bg-[oklch(48.8%_0.243_264.376)] opacity-70"></div>
                    <motion.div
                      whileHover={{ scale: 1.1 }}
                      className="text-5xl mb-6 p-4 inline-block bg-[oklch(48.8%_0.243_264.376)/0.1] rounded-2xl text-[oklch(48.8%_0.243_264.376)]"
                    >
                      {benefit.icon}
                    </motion.div>
                    <h3 className="text-xl font-bold mb-3 text-gray-900">{benefit.title}</h3>
                    <p className="text-gray-600">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 text-center"
          >
            <Link to="/auth/login">
              <Button
                size="lg"
                className="bg-[oklch(48.8%_0.243_264.376)] hover:bg-[oklch(45%_0.243_264.376)]"
                onMouseEnter={enterButton}
                onMouseLeave={leaveButton}
              >
                Start Your Job Search
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-4xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-[oklch(48.8%_0.243_264.376)]"
          >
            Frequently Asked Questions
          </motion.h2>

          <Accordion type="single" collapsible className="space-y-6">
            {[
              {
                question: "How does Next Innovations ensure legal compliance for foreign employers in Myanmar?",
                answer:
                  "We meticulously adhere to Myanmar's labor laws, including: Compliant employment contracts with mandatory clauses, Managing Social Security Board (SSB) contributions and tax withholdings, and staying updated on employment regulations, including the National Conscription Law enforced in 2024, which mandates military service for certain age groups.",
                icon: <Shield className="h-6 w-6" />,
              },
              {
                question: "How does Next Innovations handle for current Myanmar's electricity situation?",
                answer: "Next Innovations provides necessary support for electricity if needed.",
                icon: <Globe className="h-6 w-6" />,
              },
              {
                question: "How does Next Innovations handle employee onboarding and management?",
                answer:
                  "Our comprehensive approach includes: Conducting background checks and verifying qualifications, facilitating smooth onboarding processes, managing payroll, benefits, and compliance documentation, and providing ongoing HR support and performance evaluations.",
                icon: <Users className="h-6 w-6" />,
              },
              {
                question: "What support is available for employees regarding workplace challenges?",
                answer:
                  "We offer: Regular check-ins and feedback sessions, assistance with conflict resolution and workplace issues, and guidance on career development opportunities.",
                icon: <Briefcase className="h-6 w-6" />,
              },
            ].map((faq, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="group"
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                <AccordionItem
                  value={`faq-${idx}`}
                  className="border border-[oklch(48.8%_0.243_264.376)/0.1] rounded-xl overflow-hidden bg-white shadow-sm group-hover:shadow-md transition-all"
                >
                  <AccordionTrigger className="px-6 py-5 hover:no-underline text-lg font-medium group">
                    <div className="flex items-center gap-4">
                      <span className="text-2xl p-2 bg-[oklch(48.8%_0.243_264.376)/0.1] rounded-lg text-[oklch(48.8%_0.243_264.376)]">
                        {faq.icon}
                      </span>
                      <span className="text-gray-900">{faq.question}</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="px-6 pb-5 text-gray-600">
                    <div className="pl-14">{faq.answer}</div>
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
            className="mt-16 text-center"
          >
            <p className="text-gray-600 mb-6">Still have questions?</p>
            <Button
              className="bg-[oklch(48.8%_0.243_264.376)] hover:bg-[oklch(45%_0.243_264.376)]"
              onMouseEnter={enterButton}
              onMouseLeave={leaveButton}
            >
              Contact Our Support Team
            </Button>
          </motion.div>
        </div>
      </section>

     {/* Success Story Section */}
     <section id="success-story" className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-5xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center mb-16"
          >
            <h2 className="text-3xl md:text-5xl font-bold mb-6 text-[oklch(48.8%_0.243_264.376)]">Success Story</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Engineerforce Scales Efficiently in Myanmar with EOR Services
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            onMouseEnter={enterText}
            onMouseLeave={leaveText}
          >
            <Card className="border-[oklch(48.8%_0.243_264.376)/0.2] shadow-lg">
              <CardContent className="p-8">
                <div className="grid md:grid-cols-3 gap-8 mb-8">
                  <div>
                    <h4 className="font-medium text-gray-500 mb-2">Client</h4>
                    <p className="font-bold">Engineerforce Inc. – Tokyo, Japan</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-2">Industry</h4>
                    <p className="font-bold">Software Development and System Integrator (SIer)</p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-500 mb-2">Roles Hired</h4>
                    <p className="font-bold">Software Engineers, Developers (Python, Django, React, Ruby)</p>
                  </div>
                </div>

                <div className="space-y-6">
                  <div>
                    <h3 className="text-xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-3">Challenge</h3>
                    <p className="text-gray-700">
                      Engineerforce, a leading platform connecting top freelance software engineers/developers with
                      global companies, was looking to expand its tech capabilities in Southeast Asia—also in Myanmar.
                      The goal was to hire high-quality developers without establishing a local legal entity, while
                      ensuring full legal compliance, streamlined communication, and payroll support.
                    </p>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-3">Solution</h3>
                    <p className="text-gray-700 mb-4">
                      Official Employer of Record (EOR) for Engineerforce's Myanmar-based hires. We provided:
                    </p>
                    <ul className="list-disc pl-6 space-y-2 text-gray-700">
                      <li>Legally compliant employment contracts and documentation in English.</li>
                      <li>Full HR administration, payroll process</li>
                      <li>Remote and hybrid workplace for required supports.</li>
                      <li>Payroll and legal reporting in English for transparency</li>
                      <li>Support in English, Burmese, and Japanese for seamless communication</li>
                    </ul>
                  </div>

                  <div>
                    <h3 className="text-xl font-bold text-[oklch(48.8%_0.243_264.376)] mb-3">Results</h3>
                    <ul className="space-y-2 text-gray-700">
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Team of local professionals
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        HR and payroll support for salary, or government filing
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Stable operations Support
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Strong collaboration between Myanmar team and Japanese management
                      </li>
                      <li className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-2" />
                        Significant cost savings and zero legal risk
                      </li>
                    </ul>
                  </div>

                  <div className="border-t border-gray-200 pt-6">
                    <div className="space-y-6">
                      <blockquote className="italic text-gray-700 border-l-4 border-[oklch(48.8%_0.243_264.376)] pl-4 py-2">
                        "We highly recommend Next Innovations to companies seeking a comprehensive and effective
                        solution to our recruitment needs."
                      </blockquote>
                      <p className="text-right font-medium">— Iida-san, CEO, Engineerforce Inc.</p>

                      <blockquote className="italic text-gray-700 border-l-4 border-[oklch(48.8%_0.243_264.376)] pl-4 py-2">
                        "I was once employed through their EOR service, and I couldn't have asked for a better
                        experience. Everything, from the onboarding process to payroll and communication was handled
                        smoothly and professionally. They're trying to set a high standard for EOR services in Myanmar
                        with their commitment to efficiency and care."
                      </blockquote>
                      <p className="text-right font-medium">— Min Min Latt, CTO, Engineerforce Inc.</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* Industries Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-4xl md:text-5xl font-bold text-center mb-16 text-[oklch(48.8%_0.243_264.376)]"
          >
            Industries We Serve
          </motion.h2>

          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="text-center"
            onMouseEnter={enterText}
            onMouseLeave={leaveText}
          >
            <div className="inline-block px-8 py-6 bg-[oklch(48.8%_0.243_264.376)/0.1] rounded-2xl">
              <h3 className="text-2xl font-bold text-[oklch(48.8%_0.243_264.376)]">
                Technology & Software Development
              </h3>
              <p className="text-gray-700 mt-2">Developers and Designers</p>
            </div>
          </motion.div>
        </div>
      </section>

    

      {/* CTA Section */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-[oklch(48.8%_0.243_264.376)]">
        <div className="max-w-5xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mb-12"
            onMouseEnter={enterText}
            onMouseLeave={leaveText}
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-6 text-white">
              Ready to Build Your Remote Tech Team in Myanmar?
            </h2>
            <p className="text-xl text-white/80 mb-12 max-w-3xl mx-auto">
              Contact Us Today for a free consultation and talent proposal.
            </p>
          </motion.div>

          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-block"
            onMouseEnter={enterButton}
            onMouseLeave={leaveButton}
          >
            <Button
              size="lg"
              className="bg-white text-[oklch(48.8%_0.243_264.376)] hover:bg-white/90 text-lg px-8 py-6 h-auto rounded-full shadow-xl hover:shadow-2xl hover:shadow-black/20 transition-all duration-300"
            >
              Contact Us
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-12"
          >
            <div className="inline-flex items-center gap-4 px-6 py-3 bg-white/10 backdrop-blur-md rounded-full">
              <span className="text-white">info@talent-cloud.asia</span>
              <span className="text-white/50">•</span>
              <span className="text-white">Based in Yangon, Myanmar</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-16 px-4 sm:px-6 lg:px-8 bg-gray-950 text-gray-400">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-16">
            <div className="col-span-2">
              <div className="flex items-center gap-3 mb-6">
                <img src={SVG || "/placeholder.svg"} />
              </div>
              <p className="text-gray-400 mb-6 max-w-xs">
                Your Myanmar EOR Partner for Global IT Teams. We hire, we manage, you grow.
              </p>
              <div className="flex space-x-4">
                {[...Array(4)].map((_, i) => (
                  <a
                    key={i}
                    href="#"
                    className="w-10 h-10 rounded-full bg-gray-800 flex items-center justify-center text-white hover:bg-[oklch(48.8%_0.243_264.376)] transition-colors"
                    onMouseEnter={enterButton}
                    onMouseLeave={leaveButton}
                  >
                    <span className="sr-only">Social Media</span>
                    <Globe className="h-5 w-5" />
                  </a>
                ))}
              </div>
            </div>

            {[
              {
                title: "Services",
                links: ["EOR Services", "Talent Sourcing", "HR Support", "Payroll Management", "Legal Compliance"],
              },
              {
                title: "Company",
                links: ["About Us", "Blog", "Contact", "Careers"],
              },
            ].map((column, i) => (
              <div key={i}>
                <h4 className="text-white font-semibold mb-4">{column.title}</h4>
                <ul className="space-y-3">
                  {column.links.map((link, j) => (
                    <li key={j}>
                      <a
                        className="text-gray-400 hover:text-white transition-colors"
                        onMouseEnter={enterText}
                        onMouseLeave={leaveText}
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-16 pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center">
            <p className="text-sm">© {new Date().getFullYear()} Talent Cloud. All rights reserved.</p>
            <div className="flex space-x-6 mt-4 md:mt-0">
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                Privacy Policy
              </a>
              <a
                href="#"
                className="text-sm text-gray-400 hover:text-white transition-colors"
                onMouseEnter={enterText}
                onMouseLeave={leaveText}
              >
                Terms of Service
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
