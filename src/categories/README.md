# Categories Module

The Categories module provides functionality to classify courses into topics, allowing for better organization and discovery of learning content.

## Features

- **Course Classification**: Organize courses into logical categories
- **Reusable Categories**: Categories can be used across multiple courses
- **Visual Identification**: Support for color coding categories
- **Active/Inactive Status**: Manage category availability
- **Course Count Tracking**: Monitor how many courses use each category

## Entity Structure

```typescript
@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ type: 'varchar', length: 100, unique: true })
  name: string;

  @Column({ type: 'text', nullable: true })
  description: string;

  @Column({ type: 'varchar', length: 7, nullable: true })
  color: string; // Hex color for UI display

  @Column({ type: 'boolean', default: true })
  isActive: boolean;

  @OneToMany(() => Course, (course) => course.category)
  courses: Course[];
}
```

## API Endpoints

### Categories

- `POST /categories` - Create a new category
- `GET /categories` - Get all active categories
- `GET /categories/active` - Get only active categories
- `GET /categories/:id` - Get category by ID
- `PUT /categories/:id` - Update category
- `DELETE /categories/:id` - Delete category
- `GET /categories/:id/courses-count` - Get count of courses in category

### Courses by Category

- `GET /courses/category/:categoryId` - Get all courses in a specific category

## Usage Examples

### Creating a Category

```json
POST /categories
{
  "name": "Web Development",
  "description": "Courses related to web technologies",
  "color": "#FF6B6B",
  "isActive": true
}
```

### Assigning Category to Course

```json
POST /courses
{
  "title": "React Fundamentals",
  "description": "Learn React basics",
  "professorId": "uuid-here",
  "categoryId": "category-uuid-here"
}
```

## Business Rules

1. **Unique Names**: Category names must be unique (case-insensitive)
2. **Course Protection**: Categories with associated courses cannot be deleted
3. **Validation**: All category IDs in course operations are validated
4. **Active Status**: Only active categories are returned by default

## Relationships

- **Category → Course**: One-to-Many relationship
- Categories can be reused across multiple courses
- Courses can optionally belong to a category
- Deleting a category requires it to have no associated courses

## Validation

- Category names are validated for uniqueness
- Color codes must be valid hex colors
- All IDs are validated as UUIDs
- Required fields are enforced at the DTO level
