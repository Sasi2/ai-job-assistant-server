// Import required packages
const express = require('express');
const cors = require('cors');
const axios = require('axios');
require('dotenv').config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3001;

// Gemini API function
async function makeGeminiRequest(prompt) {
  try {
    console.log('Making request to Gemini API...');
    const response = await axios.post(`https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent?key=${process.env.GOOGLE_API_KEY}`, {
      contents: [{
        parts: [{ text: prompt }]
      }],
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2000,
      }
    }, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Gemini API response status:', response.status);
    return response.data.candidates[0].content.parts[0].text;
  } catch (error) {
    console.error('Gemini API error details:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
}

// Middleware
app.use(cors({
  origin: [
    'http://localhost:3000',
    'https://timely-custard-661bde.netlify.app'
  ],
  credentials: true
}));

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Bootcamp skills database (from your syllabus)
const bootcampSkills = {
  frontend: [
    'HTML5', 'CSS3', 'JavaScript ES6', 'React.js', 'Bootstrap', 'Flexbox', 
    'CSS Grid', 'Responsive Design', 'DOM Manipulation', 'jQuery', 
    'Web Design', 'UI/UX Design', 'JSX', 'React Hooks', 'React Components'
  ],
  backend: [
    'Node.js', 'Express.js', 'RESTful APIs', 'MongoDB', 'PostgreSQL', 'SQL', 
    'EJS', 'Authentication', 'Security', 'Encryption', 'OAuth 2.0', 'Sessions', 
    'Cookies', 'bcrypt', 'Passport.js', 'Middleware', 'MVC Architecture'
  ],
  tools: [
    'Git', 'GitHub', 'Command Line', 'Unix/Linux', 'NPM', 'Version Control',
    'Deployment', 'Heroku', 'GitHub Pages', 'Environment Variables', 
    'Bash Commands', 'Terminal'
  ],
  web3: [
    'Blockchain', 'Web3', 'Motoko', 'Internet Computer', 'Smart Contracts',
    'Cryptocurrency', 'NFTs', 'dApps', 'Canisters', 'Cycles Wallet'
  ],
  general: [
    'Problem Solving', 'Debugging', 'Testing', 'Code Review', 'Agile Development',
    'Full-Stack Development', 'Database Design', 'API Integration', 'CRUD Operations',
    'Data Modeling', 'Error Handling'
  ]
};

// Helper function to get all skills as a flat array
const getAllSkills = () => {
  return [
    ...bootcampSkills.frontend,
    ...bootcampSkills.backend,
    ...bootcampSkills.tools,
    ...bootcampSkills.web3,
    ...bootcampSkills.general
  ];
};

// Routes

// Health check route
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'AI Job Assistant Server is running with Gemini AI!',
    timestamp: new Date().toISOString(),
    apiProvider: 'Google Gemini'
  });
});

// Get available skills route
app.get('/api/skills', (req, res) => {
  res.json({
    success: true,
    skills: bootcampSkills,
    totalSkills: getAllSkills().length
  });
});

// Main analysis route
app.post('/api/analyze', async (req, res) => {
  try {
    const { resume, jobDescription } = req.body;

    // Validation
    if (!resume || !jobDescription) {
      return res.status(400).json({
        success: false,
        error: 'Both resume and job description are required'
      });
    }

    if (!process.env.GOOGLE_API_KEY) {
      return res.status(500).json({
        success: false,
        error: 'Google API key is not configured on the server'
      });
    }

    // Prepare the AI prompt
    const allSkills = getAllSkills();
    const prompt = `You are a professional career advisor specializing in web development bootcamp graduates. 

Analyze this resume against the job description and provide specific, actionable suggestions.

IMPORTANT CONSTRAINTS:
- ONLY suggest skills from this bootcamp curriculum: ${allSkills.join(', ')}
- Focus on realistic improvements a bootcamp graduate can implement
- Be specific and actionable in your suggestions
- Consider the applicant's current skill level from a coding bootcamp

RESUME:
${resume}

JOB DESCRIPTION:
${jobDescription}

Please analyze and return a JSON response with this EXACT structure (no additional text):
{
  "matchingSkills": ["skill1", "skill2"],
  "missingSkills": ["skill1", "skill2"],
  "improvements": [
    {
      "category": "Technical Skills",
      "suggestion": "Add a React project showcasing component lifecycle methods",
      "priority": "high",
      "skillsInvolved": ["React.js", "JavaScript ES6"]
    },
    {
      "category": "Experience Description", 
      "suggestion": "Quantify your database work with MongoDB",
      "priority": "medium",
      "skillsInvolved": ["MongoDB", "Database Design"]
    }
  ],
  "overallMatch": "75%",
  "summary": "Your bootcamp background aligns well with this role. Focus on highlighting your full-stack projects.",
  "recommendedProjects": [
    "Build a CRUD application with React and Node.js",
    "Create a portfolio website showcasing your Bootstrap skills"
  ]
}`;

    // Use Gemini API (much better free limits)
    console.log('Making Gemini API request...');
    const aiResponse = await makeGeminiRequest(prompt);
    console.log('Gemini API request completed successfully');

    // Parse the AI response
    let analysis;
    try {
      // Clean the response in case there's extra text
      const cleanResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      analysis = JSON.parse(cleanResponse);
    } catch (parseError) {
      console.error('Failed to parse AI response:', parseError);
      console.log('Raw AI response:', aiResponse);
      return res.status(500).json({
        success: false,
        error: 'Failed to parse AI response. Please try again.'
      });
    }

    // Add some server-side enhancements
    const enhancedAnalysis = {
      ...analysis,
      analysisDate: new Date().toISOString(),
      skillsBreakdown: categorizeSkills(analysis.matchingSkills || [], analysis.missingSkills || []),
      confidence: calculateConfidence(analysis.matchingSkills || [], analysis.missingSkills || []),
      aiProvider: 'Google Gemini'
    };

    res.json({
      success: true,
      data: enhancedAnalysis
    });

  } catch (error) {
    console.error('Analysis error:', error);
    
    if (error.response?.status === 401) {
      return res.status(500).json({
        success: false,
        error: 'Invalid Google API key configuration'
      });
    }
    
    if (error.response?.status === 429) {
      return res.status(429).json({
        success: false,
        error: 'Google API rate limit exceeded. Please try again later.'
      });
    }

    if (error.response?.status === 400) {
      return res.status(400).json({
        success: false,
        error: 'Invalid request to Google API. Please check your input.'
      });
    }

    res.status(500).json({
      success: false,
      error: 'Analysis failed. Please try again.',
      details: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
});

// Helper function to categorize skills
function categorizeSkills(matching, missing) {
  const categorize = (skills) => {
    const categorized = {
      frontend: [],
      backend: [],
      tools: [],
      web3: [],
      general: []
    };

    skills.forEach(skill => {
      for (const [category, skillList] of Object.entries(bootcampSkills)) {
        if (skillList.includes(skill)) {
          categorized[category].push(skill);
          break;
        }
      }
    });

    return categorized;
  };

  return {
    matching: categorize(matching),
    missing: categorize(missing)
  };
}

// Helper function to calculate confidence score
function calculateConfidence(matching, missing) {
  const total = matching.length + missing.length;
  if (total === 0) return 0;
  
  const matchPercentage = (matching.length / total) * 100;
  let confidence = 'low';
  
  if (matchPercentage >= 80) confidence = 'high';
  else if (matchPercentage >= 60) confidence = 'medium';
  
  return {
    level: confidence,
    percentage: Math.round(matchPercentage),
    matchingCount: matching.length,
    totalRelevantSkills: total
  };
}

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: 'Internal server error',
    details: process.env.NODE_ENV === 'development' ? err.message : undefined
  });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    error: 'Endpoint not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
🚀 AI Job Assistant Server is running!
📍 Port: ${PORT}
🌍 Environment: ${process.env.NODE_ENV || 'development'}
🤖 AI Provider: Google Gemini
🔑 Google API: ${process.env.GOOGLE_API_KEY ? '✓ Configured' : '✗ Missing'}
📅 Started: ${new Date().toLocaleString()}
  `);
});

module.exports = app;
