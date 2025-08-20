const express = require('express');
const router = express.Router();
const Project = require('../models/Project');

// Get all projects
router.get('/', async (req, res) => {
  try {
    console.log('Projects API: Fetching all projects');
    const projects = await Project.find().sort({ createdAt: -1 });
    console.log(`Projects API: Found ${projects.length} projects`);
    
    // Log project analysis for debugging missing features
    projects.forEach((project, index) => {
      console.log(`Projects API: Project ${index + 1} data:`, {
        id: project._id,
        title: project.title,
        status: project.status,
        hasEnthusiasmLevel: !!project.enthusiasmLevel,
        hasPaperUrl: !!project.paperUrl,
        hasMediaCoverage: !!(project.mediaCoverage && project.mediaCoverage.length > 0),
        archived: !!project.archived
      });
    });
    
    res.json({ projects });
  } catch (error) {
    console.error('Projects API: Error fetching projects:', error);
    res.status(500).json({ error: 'Failed to fetch projects' });
  }
});

// Get single project by ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Projects API: Fetching project by ID:', id);
    
    const project = await Project.findById(id);
    if (!project) {
      console.log('Projects API: Project not found:', id);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Projects API: Project found:', {
      id: project._id,
      title: project.title,
      hasEnthusiasmLevel: !!project.enthusiasmLevel,
      hasPaperUrl: !!project.paperUrl,
      hasMediaCoverage: !!(project.mediaCoverage && project.mediaCoverage.length > 0)
    });
    
    res.json({ project });
  } catch (error) {
    console.error('Projects API: Error fetching project by ID:', error);
    res.status(500).json({ error: 'Failed to fetch project' });
  }
});

// Create new project
router.post('/', async (req, res) => {
  try {
    console.log('Projects API: Creating new project with data:', req.body);
    
    const projectData = {
      ...req.body,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const project = new Project(projectData);
    const savedProject = await project.save();
    
    console.log('Projects API: Project created successfully:', {
      id: savedProject._id,
      title: savedProject.title,
      status: savedProject.status
    });
    
    res.status(201).json({ project: savedProject });
  } catch (error) {
    console.error('Projects API: Error creating project:', error);
    res.status(400).json({ error: error.message || 'Failed to create project' });
  }
});

// Update project
router.put('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Projects API: Updating project:', id, 'with data:', req.body);
    
    const updateData = {
      ...req.body,
      updatedAt: new Date()
    };
    
    const project = await Project.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );
    
    if (!project) {
      console.log('Projects API: Project not found for update:', id);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Projects API: Project updated successfully:', {
      id: project._id,
      title: project.title,
      status: project.status,
      archived: project.archived
    });
    
    res.json({ project });
  } catch (error) {
    console.error('Projects API: Error updating project:', error);
    res.status(400).json({ error: error.message || 'Failed to update project' });
  }
});

// Delete project
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Projects API: Deleting project:', id);
    
    const project = await Project.findByIdAndDelete(id);
    
    if (!project) {
      console.log('Projects API: Project not found for deletion:', id);
      return res.status(404).json({ error: 'Project not found' });
    }
    
    console.log('Projects API: Project deleted successfully:', {
      id: project._id,
      title: project.title
    });
    
    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Projects API: Error deleting project:', error);
    res.status(500).json({ error: 'Failed to delete project' });
  }
});

// Seed dummy projects with comprehensive data
router.post('/seed', async (req, res) => {
  try {
    console.log('Projects API: Seeding dummy projects with comprehensive data');
    
    // Clear existing projects
    await Project.deleteMany({});
    console.log('Projects API: Cleared existing projects');
    
    const dummyProjects = [
      {
        title: "AI-Powered Portfolio Optimizer",
        description: "A machine learning system that analyzes market trends and optimizes investment portfolios in real-time using advanced neural networks and sentiment analysis.",
        status: "completed",
        startDate: new Date('2023-01-15'),
        endDate: new Date('2023-06-30'),
        technologies: ["Python", "TensorFlow", "React", "Node.js", "PostgreSQL", "Docker"],
        collaborators: [
          { name: "Dr. Sarah Chen", role: "ML Engineer", email: "sarah.chen@example.com" },
          { name: "Michael Rodriguez", role: "Backend Developer", email: "michael.r@example.com" }
        ],
        githubUrl: "https://github.com/example/ai-portfolio-optimizer",
        liveUrl: "https://ai-portfolio-optimizer.demo.com",
        paperUrl: "https://arxiv.org/abs/2023.12345",
        enthusiasmLevel: "Very High",
        mediaCoverage: [
          {
            title: "Revolutionary AI Portfolio Management System Wins Tech Innovation Award",
            url: "https://techcrunch.com/ai-portfolio-optimizer",
            publication: "TechCrunch",
            date: new Date('2023-07-15')
          },
          {
            title: "How Machine Learning is Transforming Investment Strategies",
            url: "https://forbes.com/ml-investment-strategies",
            publication: "Forbes",
            date: new Date('2023-08-02')
          }
        ],
        archived: false
      },
      {
        title: "Smart City Traffic Management System",
        description: "IoT-based traffic optimization platform that reduces congestion by 35% using real-time data analysis and predictive modeling for urban transportation networks.",
        status: "in-progress",
        startDate: new Date('2023-09-01'),
        technologies: ["IoT", "Python", "Apache Kafka", "MongoDB", "React", "D3.js"],
        collaborators: [
          { name: "Prof. James Wilson", role: "Research Lead", email: "j.wilson@university.edu" },
          { name: "Lisa Park", role: "IoT Specialist", email: "lisa.park@smartcity.com" },
          { name: "Ahmed Hassan", role: "Data Scientist", email: "ahmed.hassan@analytics.com" }
        ],
        githubUrl: "https://github.com/example/smart-traffic-system",
        paperUrl: "https://ieee.org/papers/smart-traffic-2023",
        enthusiasmLevel: "High",
        mediaCoverage: [
          {
            title: "Smart Traffic System Pilot Program Shows Promising Results",
            url: "https://smartcitiesworld.net/traffic-pilot-results",
            publication: "Smart Cities World",
            date: new Date('2023-11-20')
          }
        ],
        archived: false
      },
      {
        title: "Blockchain-Based Supply Chain Tracker",
        description: "Transparent supply chain management solution using blockchain technology to track products from origin to consumer, ensuring authenticity and ethical sourcing.",
        status: "planning",
        startDate: new Date('2024-01-15'),
        technologies: ["Solidity", "Ethereum", "Web3.js", "React", "Node.js", "IPFS"],
        collaborators: [
          { name: "David Kim", role: "Blockchain Developer", email: "david.kim@blockchain.com" },
          { name: "Maria Santos", role: "Supply Chain Expert", email: "maria.santos@logistics.com" }
        ],
        githubUrl: "https://github.com/example/blockchain-supply-chain",
        paperUrl: "https://papers.ssrn.com/blockchain-supply-chain-2024",
        enthusiasmLevel: "Very High",
        mediaCoverage: [],
        archived: false
      },
      {
        title: "Quantum Computing Simulator",
        description: "Educational quantum computing simulator that helps students understand quantum algorithms through interactive visualizations and step-by-step execution.",
        status: "on-hold",
        startDate: new Date('2023-03-01'),
        technologies: ["Python", "Qiskit", "NumPy", "React", "Three.js", "WebGL"],
        collaborators: [
          { name: "Dr. Elena Petrov", role: "Quantum Physicist", email: "elena.petrov@quantumlab.edu" }
        ],
        githubUrl: "https://github.com/example/quantum-simulator",
        liveUrl: "https://quantum-simulator-demo.com",
        paperUrl: "https://quantum-journal.org/papers/simulator-education-2023",
        enthusiasmLevel: "Medium",
        mediaCoverage: [
          {
            title: "Making Quantum Computing Accessible Through Interactive Education",
            url: "https://nature.com/articles/quantum-education-simulator",
            publication: "Nature Education",
            date: new Date('2023-05-10')
          }
        ],
        archived: false
      },
      {
        title: "Renewable Energy Grid Optimizer",
        description: "AI-driven system for optimizing renewable energy distribution across smart grids, maximizing efficiency and minimizing waste through predictive analytics.",
        status: "completed",
        startDate: new Date('2022-08-01'),
        endDate: new Date('2023-02-28'),
        technologies: ["Python", "TensorFlow", "Apache Spark", "Kubernetes", "PostgreSQL", "Grafana"],
        collaborators: [
          { name: "Dr. Robert Green", role: "Energy Systems Engineer", email: "robert.green@energy.com" },
          { name: "Anna Kowalski", role: "Data Engineer", email: "anna.k@dataeng.com" },
          { name: "Carlos Mendez", role: "DevOps Engineer", email: "carlos.mendez@cloud.com" }
        ],
        githubUrl: "https://github.com/example/energy-grid-optimizer",
        paperUrl: "https://ieee.org/papers/renewable-grid-optimization-2023",
        enthusiasmLevel: "High",
        mediaCoverage: [
          {
            title: "AI-Powered Grid Optimization Reduces Energy Waste by 40%",
            url: "https://renewableenergyworld.com/ai-grid-optimization",
            publication: "Renewable Energy World",
            date: new Date('2023-03-15')
          },
          {
            title: "The Future of Smart Grids: Machine Learning Meets Renewable Energy",
            url: "https://spectrum.ieee.org/smart-grid-ml",
            publication: "IEEE Spectrum",
            date: new Date('2023-04-02')
          }
        ],
        archived: false
      },
      {
        title: "Virtual Reality Medical Training Platform",
        description: "Immersive VR platform for medical students to practice surgical procedures in a risk-free environment with haptic feedback and realistic simulations.",
        status: "in-progress",
        startDate: new Date('2023-10-01'),
        technologies: ["Unity", "C#", "Oculus SDK", "Node.js", "MongoDB", "WebRTC"],
        collaborators: [
          { name: "Dr. Jennifer Adams", role: "Medical Advisor", email: "jennifer.adams@medschool.edu" },
          { name: "Tom Anderson", role: "VR Developer", email: "tom.anderson@vrtech.com" },
          { name: "Sophie Turner", role: "UX Designer", email: "sophie.turner@design.com" }
        ],
        githubUrl: "https://github.com/example/vr-medical-training",
        paperUrl: "https://medical-education-journal.com/vr-training-2023",
        enthusiasmLevel: "Very High",
        mediaCoverage: [
          {
            title: "Virtual Reality Revolutionizes Medical Education",
            url: "https://medicalxpress.com/vr-medical-education",
            publication: "Medical Xpress",
            date: new Date('2023-12-01')
          }
        ],
        archived: false
      },
      {
        title: "Automated Code Review Assistant",
        description: "AI-powered tool that automatically reviews code for bugs, security vulnerabilities, and best practices, integrated with popular version control systems.",
        status: "planning",
        startDate: new Date('2024-02-01'),
        technologies: ["Python", "OpenAI GPT", "GitHub API", "Docker", "Redis", "FastAPI"],
        collaborators: [
          { name: "Alex Thompson", role: "AI Engineer", email: "alex.thompson@aidev.com" },
          { name: "Rachel Kim", role: "Security Specialist", email: "rachel.kim@security.com" }
        ],
        githubUrl: "https://github.com/example/ai-code-reviewer",
        enthusiasmLevel: "High",
        mediaCoverage: [],
        archived: false
      },
      {
        title: "Legacy E-commerce Platform",
        description: "An older e-commerce platform built with traditional technologies. This project has been archived as it's no longer actively maintained.",
        status: "completed",
        startDate: new Date('2021-01-01'),
        endDate: new Date('2021-12-31'),
        technologies: ["PHP", "MySQL", "jQuery", "Bootstrap"],
        collaborators: [
          { name: "John Doe", role: "Full Stack Developer", email: "john.doe@legacy.com" }
        ],
        githubUrl: "https://github.com/example/legacy-ecommerce",
        enthusiasmLevel: "Low",
        mediaCoverage: [],
        archived: true
      }
    ];
    
    const createdProjects = await Project.insertMany(dummyProjects);
    console.log(`Projects API: Successfully seeded ${createdProjects.length} dummy projects`);
    
    // Log summary of seeded projects
    const statusCounts = createdProjects.reduce((acc, project) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
    
    console.log('Projects API: Seeded projects summary:', {
      total: createdProjects.length,
      statusDistribution: statusCounts,
      withEnthusiasmLevel: createdProjects.filter(p => p.enthusiasmLevel).length,
      withPaperUrl: createdProjects.filter(p => p.paperUrl).length,
      withMediaCoverage: createdProjects.filter(p => p.mediaCoverage && p.mediaCoverage.length > 0).length,
      archived: createdProjects.filter(p => p.archived).length
    });
    
    res.json({ 
      message: 'Dummy projects seeded successfully', 
      count: createdProjects.length,
      projects: createdProjects 
    });
  } catch (error) {
    console.error('Projects API: Error seeding dummy projects:', error);
    res.status(500).json({ error: 'Failed to seed dummy projects' });
  }
});

module.exports = router;