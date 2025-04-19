# Administrative Portal

A comprehensive portal for government administrative offices to manage work assignments, track progress, and coordinate between departments.

## Overview

This web application serves as a centralized administrative platform for government offices, allowing different types of users to manage and track work assignments based on their roles. The system implements role-based access control and provides tailored interfaces for administrators and workers.

## Features

### Authentication System

- **Role-based login**: Support for three user roles:
  - Collector
  - Department Head
  - End Office Worker
- **Secure access control**: Users are redirected to appropriate interfaces based on their roles
- **Session management**: Maintains user sessions and allows logout

### Dashboard (for Collectors and Department Heads)

- **Work Overview Statistics**:
  - Total work items count
  - In-progress items count
  - Pending items count
  
- **Work Items Management**:
  - Comprehensive list of all ongoing works
  - Advanced filtering capabilities:
    - Search by ID, title, department, or officer
    - Filter by department
    - Filter by region
    - Filter by status
  - Visual progress indicators for each work item
  
- **Work Details View**:
  - Tabbed interface showing:
    - Basic details (ID, department, region, dates, etc.)
    - Notes section with history and ability to add new notes
    - Documents section with file viewer and upload functionality
  
- **Quick Action Buttons**:
  - Create New Work
  - View Reports
  - Manage Users

### Assignments Interface (for End Office Workers)

- **Personal Assignment View**:
  - List of tasks assigned specifically to the logged-in user
  - Details including title, description, priority, and deadlines
  - Status indicators with color coding (pending, in-progress, completed)
  - Ability to update assignment status directly from the interface

### Design and UI

- **Responsive Design**: Works across desktop and mobile devices
- **Modern Interface**: Clean layout with clear visual hierarchy
- **Interactive Elements**:
  - Modal dialogs for detailed information
  - Progress bars
  - Status badges with color coding
  - Tabbed interfaces for organizing content

## Technical Implementation

- **Frontend Framework**: Next.js (React)
- **Styling**: Tailwind CSS with custom modules
- **State Management**: React Context API for authentication
- **Responsive Design**: Mobile-friendly interfaces
- **Component Structure**:
  - Client-side components for interactive elements
  - Server components for static content
  - Modal components for detailed views

## User Workflows

### Administrator Flow (Collectors/Department Heads):
1. Log in with admin credentials
2. View dashboard with work statistics
3. Filter and search through work items
4. View detailed information on any work item
5. Create new work assignments, access reports, or manage users

### Worker Flow (End Office Workers):
1. Log in with worker credentials
2. View personalized list of assignments
3. Update status of assignments as they progress
4. Log out when finished

## Data Structure

### Work Items:
- ID
- Title
- Department
- Region
- Assigned Officer
- Status (pending, in-progress, completed)
- Priority (high, medium, low)
- Start Date
- Due Date
- Progress (percentage)
- Description
- Notes (with author and date)
- Documents (with file type and upload date)

### User Information:
- Username
- Full Name
- Role
- Department
- Password (for authentication)

## Security Features

- Protected routes based on user roles
- Authentication required for all application areas
- Centralized auth context for consistent permission checks

## Getting Started

1. Clone the repository
2. Install dependencies: `npm install`
3. Run the development server: `npm run dev`
4. Access the application at: `http://localhost:3000`

## Demo Credentials

For testing purposes, you can use:

- **Collector**:
  - Username: collector1
  - Password: password
  - Role: collector

- **Department Head**:
  - Username: depthead1
  - Password: password
  - Role: deptHead

- **End Office Worker**:
  - Username: worker1
  - Password: password
  - Role: endOfficeWorker
