# Contributing to PortFolium

Thank you for your interest in contributing to PortFolium! This document provides guidelines and information for contributors.

## 🤝 How to Contribute

### Types of Contributions

We welcome several types of contributions:

- **Bug Reports**: Help us identify and fix issues
- **Feature Requests**: Suggest new features or improvements
- **Code Contributions**: Submit bug fixes, new features, or improvements
- **Documentation**: Improve or add to our documentation
- **Testing**: Help test new features and report issues
- **Design**: Contribute to UI/UX improvements

## 🚀 Getting Started

### Prerequisites

Before contributing, ensure you have:

- Node.js (v16 or higher)
- MongoDB (v4.4 or higher)
- Git
- A GitHub account

### Setting Up Development Environment

1. **Fork the Repository**
   ```bash
   # Fork the repo on GitHub, then clone your fork
   git clone https://github.com/yourusername/portfolium.git
   cd portfolium
   ```

2. **Add Upstream Remote**
   ```bash
   git remote add upstream https://github.com/originalowner/portfolium.git
   ```

3. **Install Dependencies**
   ```bash
   npm install
   ```

4. **Set Up Environment**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your local configuration
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

## 📋 Development Guidelines

### Code Style

We use consistent coding standards across the project:

#### Frontend (React/TypeScript)
- Use TypeScript for all new components
- Follow React hooks patterns
- Use functional components over class components
- Implement proper error boundaries
- Use Tailwind CSS for styling
- Follow the existing component structure

#### Backend (Node.js/Express)
- Use ES6+ features
- Follow RESTful API conventions
- Implement proper error handling
- Use async/await over callbacks
- Add comprehensive logging
- Follow the MVC pattern (Models, Routes, Services)

#### General Guidelines
- Write self-documenting code with clear variable names
- Add comments for complex logic
- Keep functions small and focused
- Use meaningful commit messages
- Write tests for new features

### Project Structure

Follow the established project structure:

```
portfolium/
├── client/                 # React frontend
│   ├── src/
│   │   ├── api/           # API request functions
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── contexts/      # React contexts
│   │   └── hooks/         # Custom hooks
│
├── server/                # Express backend
│   ├── models/           # Database schemas
│   ├── routes/           # API routes
│   ├── services/         # Business logic
│   ├── middleware/       # Express middleware
│   └── utils/            # Utility functions
```

### Naming Conventions

- **Files**: Use camelCase for JavaScript/TypeScript files
- **Components**: Use PascalCase for React components
- **Variables**: Use camelCase for variables and functions
- **Constants**: Use UPPER_SNAKE_CASE for constants
- **Database**: Use camelCase for field names

## 🐛 Bug Reports

### Before Submitting a Bug Report

1. Check if the bug has already been reported
2. Ensure you're using the latest version
3. Test with a clean installation if possible

### How to Submit a Bug Report

Create an issue with the following information:

**Title**: Clear, descriptive title

**Description**:
- Steps to reproduce the bug
- Expected behavior
- Actual behavior
- Screenshots (if applicable)
- Error messages or logs

**Environment**:
- OS and version
- Node.js version
- Browser (if frontend issue)
- MongoDB version

**Template**:
```markdown
## Bug Description
Brief description of the bug

## Steps to Reproduce
1. Go to '...'
2. Click on '...'
3. See error

## Expected Behavior
What should happen

## Actual Behavior
What actually happens

## Environment
- OS: [e.g., Ubuntu 20.04]
- Node.js: [e.g., v18.17.0]
- Browser: [e.g., Chrome 91.0]

## Additional Context
Any other relevant information
```

## 💡 Feature Requests

### Before Submitting a Feature Request

1. Check if the feature has already been requested
2. Consider if the feature fits the project's scope
3. Think about how it would benefit other users

### How to Submit a Feature Request

Create an issue with:

**Title**: Clear feature description

**Description**:
- Problem the feature would solve
- Proposed solution
- Alternative solutions considered
- Additional context or mockups

## 🔧 Code Contributions

### Workflow

1. **Create a Branch**
   ```bash
   git checkout -b feature/your-feature-name
   # or
   git checkout -b fix/bug-description
   ```

2. **Make Changes**
   - Write code following our guidelines
   - Add tests for new functionality
   - Update documentation if needed

3. **Test Your Changes**
   ```bash
   # Run tests
   npm test

   # Test the application manually
   npm run dev
   ```

4. **Commit Changes**
   ```bash
   git add .
   git commit -m "feat: add new feature description"
   ```

5. **Push and Create PR**
   ```bash
   git push origin feature/your-feature-name
   ```

### Commit Message Format

Use conventional commits format:

```
type(scope): description

[optional body]

[optional footer]
```

**Types**:
- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples**:
```
feat(auth): add password reset functionality
fix(projects): resolve drag and drop issue
docs(api): update authentication endpoints
```

### Pull Request Guidelines

#### Before Submitting

- Ensure your code follows the style guidelines
- Add tests for new features
- Update documentation
- Rebase your branch on the latest main branch
- Test your changes thoroughly

#### PR Description Template

```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Documentation update
- [ ] Refactoring
- [ ] Other (please describe)

## Testing
- [ ] Tests pass locally
- [ ] Added tests for new functionality
- [ ] Manually tested the changes

## Screenshots (if applicable)
Add screenshots for UI changes

## Checklist
- [ ] Code follows style guidelines
- [ ] Self-review completed
- [ ] Documentation updated
- [ ] No breaking changes (or documented)
```

#### Review Process

1. Automated checks must pass
2. At least one maintainer review required
3. Address feedback promptly
4. Maintain clean commit history

## 🧪 Testing

### Running Tests

```bash
# Run all tests
npm test

# Run frontend tests
cd client && npm test

# Run backend tests
cd server && npm test

# Run tests in watch mode
npm run test:watch
```

### Writing Tests

#### Frontend Tests
- Use React Testing Library
- Test user interactions, not implementation details
- Mock API calls appropriately

#### Backend Tests
- Use Jest and Supertest
- Test API endpoints
- Mock database operations
- Test error scenarios

### Test Structure

```javascript
describe('Component/Feature Name', () => {
  beforeEach(() => {
    // Setup
  });

  afterEach(() => {
    // Cleanup
  });

  it('should do something specific', () => {
    // Test implementation
  });
});
```

## 📚 Documentation

### Types of Documentation

- **API Documentation**: Update when adding/changing endpoints
- **Component Documentation**: Document props and usage
- **Setup Guides**: Keep installation instructions current
- **Troubleshooting**: Add common issues and solutions

### Documentation Style

- Use clear, concise language
- Include code examples
- Add screenshots for UI features
- Keep information up-to-date

## 🎨 Design Contributions

### Design Guidelines

- Follow existing design patterns
- Ensure accessibility (WCAG 2.1 AA)
- Test on multiple screen sizes
- Use the established color palette
- Maintain consistent spacing and typography

### Submitting Design Changes

1. Create mockups or prototypes
2. Discuss with maintainers before implementation
3. Consider user experience impact
4. Test accessibility compliance

## 🚦 Code Review Process

### For Contributors

1. **Self-Review**: Review your own code before submitting
2. **Address Feedback**: Respond to review comments promptly
3. **Keep PRs Small**: Submit focused, single-purpose pull requests
4. **Update Documentation**: Include relevant documentation updates

### For Reviewers

1. **Be Constructive**: Provide helpful, specific feedback
2. **Check Functionality**: Test the changes locally when possible
3. **Review Tests**: Ensure adequate test coverage
4. **Consider Impact**: Evaluate potential breaking changes

## 🏷️ Issue Labels

We use the following labels to organize issues:

- `bug`: Something isn't working
- `enhancement`: New feature or request
- `documentation`: Improvements or additions to documentation
- `good first issue`: Good for newcomers
- `help wanted`: Extra attention is needed
- `question`: Further information is requested
- `wontfix`: This will not be worked on

## 🎯 Development Priorities

### High Priority
- Bug fixes affecting core functionality
- Security vulnerabilities
- Performance improvements
- Accessibility enhancements

### Medium Priority
- New features that enhance user experience
- Code refactoring and optimization
- Documentation improvements
- Test coverage expansion

### Low Priority
- Nice-to-have features
- Code style improvements
- Minor UI enhancements

## 📞 Getting Help

### Communication Channels

- **GitHub Issues**: For bug reports and feature requests
- **GitHub Discussions**: For general questions and community discussions
- **Email**: For security-related issues or private matters

### Response Times

- **Bug Reports**: Within 48 hours
- **Feature Requests**: Within 1 week
- **Pull Requests**: Within 3-5 business days
- **Questions**: Within 24-48 hours

## 🏆 Recognition

### Contributors

We recognize contributors in several ways:

- **README Credits**: All contributors listed in the main README
- **Release Notes**: Significant contributions mentioned in release notes
- **GitHub Recognition**: Using GitHub's contributor features
- **Community Highlights**: Featuring outstanding contributions

### Becoming a Maintainer

Active contributors may be invited to become maintainers based on:

- Consistent, quality contributions
- Understanding of the codebase
- Positive community interaction
- Commitment to the project's goals

## 📜 Code of Conduct

### Our Pledge

We are committed to making participation in our project a harassment-free experience for everyone, regardless of age, body size, disability, ethnicity, gender identity and expression, level of experience, nationality, personal appearance, race, religion, or sexual identity and orientation.

### Our Standards

**Positive Behavior:**
- Using welcoming and inclusive language
- Being respectful of differing viewpoints
- Gracefully accepting constructive criticism
- Focusing on what is best for the community
- Showing empathy towards other community members

**Unacceptable Behavior:**
- Trolling, insulting/derogatory comments, and personal attacks
- Public or private harassment
- Publishing others' private information without permission
- Other conduct which could reasonably be considered inappropriate

### Enforcement

Project maintainers are responsible for clarifying standards and will take appropriate action in response to unacceptable behavior.

## 🔄 Release Process

### Version Numbering

We follow Semantic Versioning (SemVer):
- **Major** (X.0.0): Breaking changes
- **Minor** (0.X.0): New features, backwards compatible
- **Patch** (0.0.X): Bug fixes, backwards compatible

### Release Schedule

- **Major Releases**: Quarterly
- **Minor Releases**: Monthly
- **Patch Releases**: As needed for critical fixes

## 📋 Checklist for New Contributors

- [ ] Read this contributing guide
- [ ] Set up development environment
- [ ] Join community discussions
- [ ] Look for "good first issue" labels
- [ ] Introduce yourself in discussions
- [ ] Make your first contribution

## 🙏 Thank You

Thank you for contributing to PortFolium! Your contributions help make this project better for everyone. We appreciate your time, effort, and dedication to improving the platform.

---

**Questions?** Don't hesitate to ask! We're here to help you contribute successfully.