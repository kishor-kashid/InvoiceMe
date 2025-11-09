# InvoiceMe Documentation

This directory contains comprehensive documentation for the InvoiceMe project.

## 📚 Documentation Index

### Core Technical Documentation

1. **[TECHNICAL_WRITEUP.md](TECHNICAL_WRITEUP.md)** - Architecture Deep Dive
   - Domain-Driven Design (DDD) implementation
   - Command Query Responsibility Segregation (CQRS)
   - Vertical Slice Architecture (VSA)
   - Performance optimizations
   - Testing strategy
   - ~2 pages, comprehensive overview

2. **[DATABASE_SCHEMA.md](DATABASE_SCHEMA.md)** - Database Design
   - Entity Relationship (ER) diagram
   - Complete table definitions
   - Index strategy
   - Relationships and constraints
   - Performance considerations
   - Sample queries

3. **[DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)** - Architectural Choices
   - Key technical decisions and rationale
   - Architecture patterns (DDD, CQRS, VSA)
   - Technology stack choices
   - Trade-offs and alternatives considered
   - Lessons learned
   - ~8 pages

4. **[AI_TOOL_USAGE.md](AI_TOOL_USAGE.md)** - AI-Assisted Development
   - How AI tools were used throughout development
   - Time savings and productivity impact (65% faster)
   - AI strengths and limitations
   - Best practices for AI-assisted development
   - Human + AI collaboration model

### API Documentation

5. **[SWAGGER_SETUP.md](SWAGGER_SETUP.md)** - Interactive API Documentation
   - Guide for implementing Swagger/OpenAPI
   - Configuration examples
   - Controller annotation patterns
   - Swagger UI setup
   - Complete implementation plan

> **Note**: Also see [../API.md](../API.md) for complete REST API reference with request/response examples.

## 🎯 Where to Start

### For Developers
Start with:
1. [TECHNICAL_WRITEUP.md](TECHNICAL_WRITEUP.md) - Understand the architecture
2. [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Learn the data model
3. [../README.md](../README.md) - Setup instructions

### For Architects
Read:
1. [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) - Architectural rationale
2. [TECHNICAL_WRITEUP.md](TECHNICAL_WRITEUP.md) - Implementation details
3. [DATABASE_SCHEMA.md](DATABASE_SCHEMA.md) - Data architecture

### For Project Managers
Review:
1. [AI_TOOL_USAGE.md](AI_TOOL_USAGE.md) - Development process and timeline
2. [../InvoiceMe_Task_List.md](../InvoiceMe_Task_List.md) - Project roadmap
3. [../README.md](../README.md) - Project overview

## 📁 Related Documentation

- **[../README.md](../README.md)** - Main project README with setup instructions
- **[../API.md](../API.md)** - Complete REST API reference
- **[../InvoiceMe-PRD.md](../InvoiceMe-PRD.md)** - Product Requirements Document
- **[../InvoiceMe_Task_List.md](../InvoiceMe_Task_List.md)** - Development roadmap (PRs 1-34)
- **[../backend/PRODUCTION_SETUP.md](../backend/PRODUCTION_SETUP.md)** - Production deployment guide
- **[../backend/ENVIRONMENT_VARIABLES.md](../backend/ENVIRONMENT_VARIABLES.md)** - Configuration reference

## 🔍 Quick Reference

### Architecture Patterns
- **DDD**: 3 aggregates (Customer, Invoice, Payment) with value objects
- **CQRS**: Strict separation of commands (write) and queries (read)
- **VSA**: 19 vertical slices organized by feature

### Technology Stack
- **Backend**: Spring Boot 3.2.0, PostgreSQL, JWT auth
- **Frontend**: Next.js 14, TypeScript, Tailwind CSS
- **Testing**: 52 tests (100% passing)

### Performance
- **Database**: 11 strategic indexes
- **Pagination**: 20 items per page (optional)
- **Connection Pool**: HikariCP with 20 connections
- **Target**: < 200ms API response time ✅

## 📝 Documentation Standards

All documentation follows these principles:
1. **Clear Structure**: Logical organization with table of contents
2. **Code Examples**: Real code snippets from the project
3. **Diagrams**: Visual representations where helpful
4. **Rationale**: Explain "why" not just "what"
5. **Complete**: Cover setup, usage, and troubleshooting

## 🤝 Contributing

To update documentation:
1. Edit the relevant markdown file
2. Maintain consistent formatting
3. Update this README if adding new docs
4. Ensure code examples are accurate
5. Keep language clear and concise

---

**Last Updated**: PR31 - Documentation & Technical Writeup  
**Status**: Complete ✅

