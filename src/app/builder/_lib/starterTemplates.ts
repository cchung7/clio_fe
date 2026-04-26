import type { DocumentationProject } from "./builderTypes";
import { CURRENT_SCHEMA_VERSION, SYSTEM_OVERVIEW_ID } from "./builderUtils";

const starterCreatedAt = "2026-01-01T00:00:00.000Z";

export const starterProject: DocumentationProject = {
  schemaVersion: CURRENT_SCHEMA_VERSION,
  id: "project-clio-starter",
  name: "Clio v0.1",
  description:
    "A lightweight full-stack software system template. Edit this structure to match your project.",
  currentVersion: "v0.1",
  status: "draft",
  updatedAt: starterCreatedAt,

  nodes: [
    {
      id: "system-clio-starter",
      parentId: SYSTEM_OVERVIEW_ID,
      viewType: "system",
      kind: "system",
      name: "Clio v0.1",
      lifecycle: "active",
      description:
        "A starter system that demonstrates how Clio decomposes software architecture from system overview into layers, components, APIs, databases, and external integrations.",
      position: { x: 160, y: 160 },
    },
    {
      id: "actor-user",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "actor",
      name: "User",
      lifecycle: "active",
      description: "Primary person who interacts with the system.",
      position: { x: 40, y: 180 },
    },
    {
      id: "frontend",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "layer",
      name: "Frontend Web App",
      lifecycle: "active",
      description: "Client-facing interface for user interactions.",
      position: { x: 280, y: 180 },
    },
    {
      id: "backend",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "layer",
      name: "Backend API",
      lifecycle: "active",
      description:
        "Application layer responsible for business logic and API behavior.",
      position: { x: 560, y: 180 },
    },
    {
      id: "database",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "database",
      name: "Database",
      lifecycle: "active",
      description: "Persistent storage for system data.",
      position: { x: 840, y: 180 },
    },
    {
      id: "external-service",
      parentId: "system-clio-starter",
      viewType: "system",
      kind: "external",
      name: "External Service",
      lifecycle: "planned",
      description:
        "Third-party or external integration used by the system, such as email, payments, analytics, identity, or interoperability.",
      position: { x: 560, y: 380 },
    },
    {
      id: "frontend-login",
      parentId: "frontend",
      viewType: "system",
      kind: "component",
      name: "Login Page",
      lifecycle: "planned",
      description: "Entry point for user authentication.",
      position: { x: 120, y: 140 },
    },
    {
      id: "frontend-dashboard",
      parentId: "frontend",
      viewType: "system",
      kind: "component",
      name: "Dashboard",
      lifecycle: "planned",
      description: "Primary authenticated user workspace.",
      position: { x: 420, y: 140 },
    },
    {
      id: "backend-auth-api",
      parentId: "backend",
      viewType: "system",
      kind: "api",
      name: "Auth API",
      lifecycle: "planned",
      description: "Handles authentication-related requests.",
      position: { x: 120, y: 140 },
    },
    {
      id: "backend-user-api",
      parentId: "backend",
      viewType: "system",
      kind: "api",
      name: "User API",
      lifecycle: "planned",
      description: "Handles user profile and account data.",
      position: { x: 420, y: 140 },
    },
  ],

  edges: [
    {
      id: "edge-user-frontend",
      source: "actor-user",
      target: "frontend",
      label: "uses",
      relationshipType: "uses",
    },
    {
      id: "edge-frontend-backend",
      source: "frontend",
      target: "backend",
      label: "calls",
      relationshipType: "calls",
    },
    {
      id: "edge-backend-database",
      source: "backend",
      target: "database",
      label: "reads/writes",
      relationshipType: "writes",
    },
    {
      id: "edge-backend-external",
      source: "backend",
      target: "external-service",
      label: "integrates",
      relationshipType: "calls",
    },
    {
      id: "edge-login-dashboard",
      source: "frontend-login",
      target: "frontend-dashboard",
      label: "redirects",
      relationshipType: "uses",
    },
    {
      id: "edge-auth-user-api",
      source: "backend-auth-api",
      target: "backend-user-api",
      label: "reads user",
      relationshipType: "calls",
    },
  ],

  requirements: [
    {
      id: "req-001",
      code: "REQ-001",
      title: "User Interaction",
      statement:
        "The system shall allow users to interact with the application through a frontend interface.",
      type: "functional",
      priority: "high",
      relatedNodeIds: ["actor-user", "frontend"],
    },
    {
      id: "req-002",
      code: "REQ-002",
      title: "Backend Request Processing",
      statement:
        "The system shall process application requests through a backend API layer.",
      type: "functional",
      priority: "high",
      relatedNodeIds: ["frontend", "backend"],
    },
    {
      id: "req-003",
      code: "REQ-003",
      title: "Data Persistence",
      statement:
        "The system shall persist required application data in a database.",
      type: "functional",
      priority: "high",
      relatedNodeIds: ["backend", "database"],
    },
  ],

  notes: [
    {
      id: "note-001",
      title: "Starter template note",
      type: "note",
      content:
        "This starter template demonstrates a system overview that opens into a decomposed software architecture.",
      targetNodeId: "system-clio-starter",
      includeInExport: true,
    },
  ],

  changes: [
    {
      id: "change-001",
      title: "Initial architecture created",
      summary:
        "Created the initial hierarchical system structure with a system overview and decomposable architecture elements.",
      reason:
        "The project needs a lightweight starting point for documenting architecture and design evolution.",
      impact:
        "Provides a baseline system view that can evolve through future snapshots.",
      relatedNodeIds: ["system-clio-starter"],
      createdAt: starterCreatedAt,
    },
  ],

  snapshots: [],
};